const trimString = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeDriver = (driver) => {
  if (driver === "openai-compatible" || driver === "generic-http") {
    return driver;
  }
  return "unknown";
};

const getDriverLabel = (driver) => {
  if (driver === "generic-http") {
    return "Generic HTTP";
  }
  if (driver === "openai-compatible") {
    return "OpenAI-compatible";
  }
  return "Unknown driver";
};

const stripIpv6Brackets = (host) =>
  host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;

const parseUrl = (baseUrl) => {
  if (!baseUrl) {
    return null;
  }
  try {
    return new URL(baseUrl);
  } catch {
    try {
      return new URL(`http://${baseUrl}`);
    } catch {
      return null;
    }
  }
};

const isPrivateIpv4 = (host) => {
  const parts = host.split(".");
  if (parts.length !== 4) {
    return false;
  }
  const octets = parts.map((part) => Number(part));
  if (octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false;
  }
  const [first, second] = octets;
  return (
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
};

const inferEndpointKind = (baseUrl) => {
  const rawUrl = trimString(baseUrl);
  const parsed = parseUrl(rawUrl);
  if (!parsed) {
    return "unknown";
  }
  const host = stripIpv6Brackets(parsed.hostname.toLowerCase());
  if (!host) {
    return "unknown";
  }
  if (host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" || host === "::1") {
    return "local";
  }
  if (host.endsWith(".local") || isPrivateIpv4(host)) {
    return "private-network";
  }
  return "cloud-api";
};

const getEndpointLabel = (kind) => {
  if (kind === "local") {
    return "Local endpoint";
  }
  if (kind === "private-network") {
    return "Private network endpoint";
  }
  if (kind === "cloud-api") {
    return "Cloud/API endpoint";
  }
  return "Unknown endpoint";
};

const getPrivacyHint = (kind) => {
  if (kind === "local" || kind === "private-network") {
    return "Local/private labels are inferred from the endpoint URL and are not a privacy guarantee. Verify the endpoint before sending sensitive data.";
  }
  if (kind === "cloud-api") {
    return "Cloud/API label is inferred from the endpoint URL. Verify the provider before sending sensitive data.";
  }
  return "Endpoint label could not be inferred. Verify the endpoint before sending sensitive data.";
};

export const inferCompletionsProfileLabels = (profile = {}) => {
  const driver = normalizeDriver(profile?.driver);
  const endpointKind = inferEndpointKind(profile?.baseUrl);
  const driverLabel = getDriverLabel(driver);
  const endpointLabel = getEndpointLabel(endpointKind);
  const model = trimString(profile?.defaultModel);
  const modelLabel = model ? `Model: ${model}` : "Model not set";

  return {
    driverLabel,
    endpointLabel,
    backendKind: endpointKind,
    endpointKind,
    privacyHint: getPrivacyHint(endpointKind),
    modelLabel,
    summaryLabel: `${driverLabel} - ${endpointLabel} - ${modelLabel}`
  };
};

export default {
  inferCompletionsProfileLabels
};
