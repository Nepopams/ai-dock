export const VARIABLE_PATTERN = /{{\s*([^{|}\s]+)(?:\s*\|\s*([^{}]*?))?\s*}}/g;
const ESCAPE_CAPTURE_PATTERN = /{{\s*({{[^{}]+}})\s*}}/g;

export const extractVariables = (body = "") => {
  if (typeof body !== "string" || !body.length) {
    return [];
  }
  const escapedTokens = [];
  const maskedBody = body.replace(ESCAPE_CAPTURE_PATTERN, (_match, literal) => {
    const token = `__ESCAPED_${escapedTokens.length}__`;
    escapedTokens.push(literal);
    return token;
  });
  const results = [];
  const seen = new Set();

  let match;
  while ((match = VARIABLE_PATTERN.exec(maskedBody)) !== null) {
    const name = (match[1] || "").trim();
    if (!name || name === "{{") {
      continue;
    }
    if (seen.has(name)) {
      continue;
    }
    seen.add(name);
    const defaultValue = (match[2] || "").trim();
    results.push({
      name,
      defaultValue: defaultValue || undefined
    });
  }

  return results;
};

const buildReplacer = (values) => {
  const normalized = values || {};
  return (_match, name, defaultValue) => {
    if (!name || name === "{{") {
      return _match;
    }
    const key = name.trim();
    if (Object.prototype.hasOwnProperty.call(normalized, key)) {
      return normalized[key] ?? "";
    }
    return defaultValue ? defaultValue.trim() : "";
  };
};

export const renderTemplate = (body = "", values = {}) => {
  if (typeof body !== "string" || !body.length) {
    return "";
  }
  const escapedTokens = [];
  const maskedBody = body.replace(ESCAPE_CAPTURE_PATTERN, (_match, literal) => {
    const token = `__ESCAPED_${escapedTokens.length}__`;
    escapedTokens.push(literal);
    return token;
  });
  let rendered = maskedBody.replace(VARIABLE_PATTERN, buildReplacer(values));
  escapedTokens.forEach((literal, index) => {
    rendered = rendered.replace(`__ESCAPED_${index}__`, literal);
  });
  return rendered;
};

export default {
  extractVariables,
  renderTemplate
};
