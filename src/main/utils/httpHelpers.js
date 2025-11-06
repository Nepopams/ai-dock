const SECRET_HEADER_PATTERN =
  /authorization|token|secret|key|signature|credential/i;

const joinURL = (baseUrl, path) => {
  const base = typeof baseUrl === "string" ? baseUrl.trim() : "";
  const target = typeof path === "string" ? path.trim() : "";
  if (!base) {
    return target || "";
  }
  if (!target) {
    return base;
  }
  const baseHasSlash = base.endsWith("/");
  const pathHasSlash = target.startsWith("/");
  if (baseHasSlash && pathHasSlash) {
    return `${base}${target.slice(1)}`;
  }
  if (!baseHasSlash && !pathHasSlash) {
    return `${base}/${target}`;
  }
  return `${base}${target}`;
};

const headersToObject = (headers) => {
  const result = {};
  if (!headers) {
    return result;
  }
  headers.forEach((value, key) => {
    if (typeof key === "string") {
      result[key] = value;
    }
  });
  return result;
};

const isJsonContent = (contentType) => {
  if (!contentType) {
    return false;
  }
  return /\bapplication\/json\b/i.test(contentType);
};

const redactHeaders = (headers) => {
  if (!headers || typeof headers !== "object") {
    return {};
  }
  const result = {};
  for (const [key, value] of Object.entries(headers)) {
    if (SECRET_HEADER_PATTERN.test(key)) {
      result[key] = "***";
    } else {
      result[key] = value;
    }
  }
  return result;
};

module.exports = {
  joinURL,
  headersToObject,
  isJsonContent,
  redactHeaders
};
