export interface ExtractedVariable {
  name: string;
  defaultValue?: string;
}

const VARIABLE_PATTERN = /{{\s*([^{|}\s]+)(?:\s*\|\s*([^{}]*?))?\s*}}/g;
const ESCAPE_CAPTURE_PATTERN = /{{\s*({{[^{}]+}})\s*}}/g;

export const extractVariables = (body: string): ExtractedVariable[] => {
  if (typeof body !== "string" || !body.length) {
    return [];
  }
  const escapedTokens: string[] = [];
  const maskedBody = body.replace(ESCAPE_CAPTURE_PATTERN, (_match, literal) => {
    const token = `__ESCAPED_${escapedTokens.length}__`;
    escapedTokens.push(literal as string);
    return token;
  });
  const results: ExtractedVariable[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = VARIABLE_PATTERN.exec(maskedBody)) !== null) {
    const name = match[1]?.trim();
    if (!name || name === "{{") {
      continue;
    }
    if (seen.has(name)) {
      continue;
    }
    seen.add(name);
    const defaultValue = match[2]?.trim();
    results.push({
      name,
      defaultValue: defaultValue || undefined
    });
  }

  return results;
};

const buildReplacer = (values: Record<string, string>): ((match: string, name: string, defaultValue?: string) => string) => {
  return (_match: string, name: string, defaultValue?: string) => {
    if (!name || name === "{{") {
      return _match;
    }
    const key = name.trim();
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return values[key] ?? "";
    }
    return defaultValue ? defaultValue.trim() : "";
  };
};

export const renderTemplate = (body: string, values: Record<string, string>): string => {
  if (typeof body !== "string" || !body.length) {
    return "";
  }
  const escapedTokens: string[] = [];
  const maskedBody = body.replace(ESCAPE_CAPTURE_PATTERN, (_match, literal) => {
    const token = `__ESCAPED_${escapedTokens.length}__`;
    escapedTokens.push(literal as string);
    return token;
  });
  const normalizedValues = values || {};
  const replacer = buildReplacer(normalizedValues);

  let rendered = maskedBody.replace(VARIABLE_PATTERN, replacer);
  escapedTokens.forEach((literal, index) => {
    const token = `__ESCAPED_${index}__`;
    rendered = rendered.replace(token, literal);
  });
  return rendered;
};
