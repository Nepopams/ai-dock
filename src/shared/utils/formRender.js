const EMPTY_RENDER_RESULT = {
  path: "",
  query: {},
  headers: {},
  body: undefined,
  bodyKind: "none"
};

const extractVariables = (tpl) => {
  const unique = new Set();
  parseTemplate(
    tpl,
    (token) => {
      const name = extractName(token);
      if (name) {
        unique.add(name);
      }
      return "";
    }
  );
  return Array.from(unique);
};

const renderString = (tpl, values) => {
  let output = "";
  parseTemplate(
    tpl,
    (token) => {
      const { name, fallback } = splitToken(token);
      if (!name) {
        return "";
      }
      const raw = values[name];
      if (raw === undefined || raw === null) {
        return fallback ?? "";
      }
      if (typeof raw === "string") {
        return raw;
      }
      if (typeof raw === "number" || typeof raw === "boolean") {
        return String(raw);
      }
      return fallback ?? "";
    },
    (literal) => {
      output += literal;
    },
    (rendered) => {
      output += rendered;
    }
  );
  return output;
};

const renderTemplate = (baseUrl, template, values) => {
  if (!template) {
    return {
      url: baseUrl,
      result: { ...EMPTY_RENDER_RESULT }
    };
  }
  const normalizedBase =
    baseUrl === "/" ? "" : baseUrl.replace(/\/+$/, "");

  const path = renderString(template.path, values);
  const renderedQuery = renderRecord(template.query, values);
  const renderedHeaders = renderRecord(template.headers, values);

  const bodyKind = resolveBodyKind(template);
  const body = renderBody(bodyKind, template.body, values);

  const queryString = buildQuery(renderedQuery);
  const url = `${normalizedBase}${path}${queryString ? `?${queryString}` : ""}`;

  return {
    url,
    result: {
      path,
      query: renderedQuery,
      headers: renderedHeaders,
      body,
      bodyKind
    }
  };
};

const sanitizePreview = (value) => {
  if (value === undefined) {
    return "";
  }
  if (value === null) {
    return "null";
  }
  if (typeof value === "string") {
    return truncate(value, 200);
  }
  let serialised;
  try {
    serialised = JSON.stringify(maskSecrets(value), null, 2);
  } catch {
    serialised = String(value);
  }
  return truncate(serialised, 200);
};

const parseTemplate = (tpl, onToken, onLiteral, onRendered) => {
  let index = 0;
  let buffer = "";

  const flushLiteral = () => {
    if (buffer && onLiteral) {
      onLiteral(buffer);
    }
    buffer = "";
  };

  const pushLiteral = (chunk) => {
    buffer += chunk;
  };

  while (index < tpl.length) {
    const char = tpl[index];
    if (char === "\\" && tpl[index + 1] === "{" && tpl[index + 2] === "{") {
      pushLiteral("{{");
      index += 3;
      continue;
    }

    if (char === "{" && tpl[index + 1] === "{") {
      const end = tpl.indexOf("}}", index + 2);
      if (end === -1) {
        pushLiteral(tpl.slice(index));
        break;
      }

      flushLiteral();
      const token = tpl.slice(index + 2, end).trim();
      const rendered = onToken(token);
      if (onRendered) {
        onRendered(rendered);
      }
      index = end + 2;
      continue;
    }

    pushLiteral(char);
    index += 1;
  }

  if (buffer) {
    flushLiteral();
  }
};

const extractName = (token) => {
  const { name } = splitToken(token);
  return name ?? null;
};

const splitToken = (token) => {
  if (!token) {
    return { name: null, fallback: undefined };
  }
  const separatorIndex = token.indexOf("|");
  if (separatorIndex === -1) {
    const trimmed = token.trim();
    return { name: trimmed || null, fallback: undefined };
  }
  const name = token.slice(0, separatorIndex).trim();
  const fallback = token.slice(separatorIndex + 1).trim();
  return {
    name: name || null,
    fallback: fallback || undefined
  };
};

const renderRecord = (record, values) => {
  if (!record) {
    return {};
  }
  return Object.entries(record).reduce((acc, [key, template]) => {
    const rendered = renderString(template, values);
    if (rendered) {
      acc[key] = rendered;
    }
    return acc;
  }, {});
};

const resolveBodyKind = (template) => {
  if (template.bodyKind) {
    return template.bodyKind;
  }
  if (template.body === undefined || template.body === null) {
    return "none";
  }
  return "json";
};

const renderBody = (kind, body, values) => {
  switch (kind) {
    case "none":
      return undefined;
    case "json":
      return renderJsonNode(body, values);
    case "form":
      return renderFormBody(body, values);
    case "multipart":
      return body;
    default:
      return body;
  }
};

const renderJsonNode = (node, values) => {
  if (typeof node === "string") {
    return renderString(node, values);
  }
  if (Array.isArray(node)) {
    return node
      .map((item) => renderJsonNode(item, values))
      .filter((item) => item !== undefined);
  }
  if (node && typeof node === "object") {
    return Object.entries(node).reduce((acc, [key, value]) => {
      const rendered = renderJsonNode(value, values);
      if (rendered !== undefined) {
        acc[key] = rendered;
      }
      return acc;
    }, {});
  }
  return node;
};

const renderFormBody = (body, values) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }
  return Object.entries(body).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      const rendered = renderString(value, values);
      if (rendered) {
        acc[key] = rendered;
      }
      return acc;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      acc[key] = String(value);
      return acc;
    }
    return acc;
  }, {});
};

const buildQuery = (query) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    params.append(key, value);
  });
  return params.toString();
};

const truncate = (input, max = 200) => {
  if (input.length <= max) {
    return input;
  }
  return `${input.slice(0, Math.max(0, max - 3))}...`;
};

const maskSecrets = (value) => {
  if (Array.isArray(value)) {
    return value.map(maskSecrets);
  }
  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, val]) => {
      if (isSecretKey(key)) {
        acc[key] =
          typeof val === "string" && val.length > 0 ? "***" : val;
      } else {
        acc[key] = maskSecrets(val);
      }
      return acc;
    }, {});
  }
  return value;
};

const isSecretKey = (key) =>
  /token|secret|key|authorization|password/i.test(key);

module.exports = {
  extractVariables,
  renderString,
  renderTemplate,
  sanitizePreview
};
