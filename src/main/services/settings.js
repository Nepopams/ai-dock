const { app, safeStorage } = require("electron");
const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs/promises");

const COMPLETIONS_FILE = () => path.join(app.getPath("userData"), "completions.json");
const TOKEN_DIR = () => path.join(app.getPath("userData"), "completions-tokens");

const DEFAULT_PROFILE = {
  name: "default",
  driver: "openai-compatible",
  baseUrl: "https://api.openai.com/v1",
  defaultModel: "gpt-4o-mini",
  auth: {
    scheme: "Bearer",
    tokenRef: ""
  },
  headers: {},
  request: {
    stream: true,
    timeoutMs: 60000
  },
  generic: undefined
};

const DEFAULT_STATE = {
  active: DEFAULT_PROFILE.name,
  profiles: {
    [DEFAULT_PROFILE.name]: { ...DEFAULT_PROFILE }
  }
};

const readJson = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const writeJson = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
};

const cloneDefaultState = () => JSON.parse(JSON.stringify(DEFAULT_STATE));

const sanitizeHeaders = (input) => {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => typeof key === "string" && typeof value === "string"
    )
  );
};

const sanitizeRequest = (input) => {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const next = {};
  if (typeof input.stream === "boolean") {
    next.stream = input.stream;
  }
  if (Number.isFinite(input.timeoutMs) && input.timeoutMs > 0) {
    next.timeoutMs = Number(input.timeoutMs);
  }
  return Object.keys(next).length ? next : undefined;
};

const sanitizeAuth = (input, options = {}) => {
  const { defaultScheme = "Bearer", allowEmpty = false } = options || {};
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const scheme = input.scheme === "Basic" ? "Basic" : defaultScheme;
  const tokenRef = typeof input.tokenRef === "string" ? input.tokenRef : "";
  if (!tokenRef && !allowEmpty) {
    return undefined;
  }
  return {
    scheme,
    tokenRef
  };
};

const sanitizeUsagePaths = (input) => {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const next = {};
  for (const key of ["prompt_tokens", "completion_tokens", "total_tokens"]) {
    if (typeof input[key] === "string" && input[key].trim()) {
      next[key] = input[key].trim();
    }
  }
  return Object.keys(next).length ? next : undefined;
};

const sanitizeGenericResponse = (schema) => {
  if (!schema || typeof schema !== "object") {
    return {
      mode: "buffer",
      buffer: {
        pathText: "choices[0].message.content"
      }
    };
  }
  const mode = schema.mode === "stream" ? "stream" : "buffer";
  const result = { mode };
  if (schema.stream && typeof schema.stream === "object") {
    const framing = ["sse", "ndjson", "lines"].includes(schema.stream.framing)
      ? schema.stream.framing
      : "sse";
    result.stream = {
      framing,
      pathDelta:
        typeof schema.stream.pathDelta === "string" && schema.stream.pathDelta.trim()
          ? schema.stream.pathDelta.trim()
          : undefined,
      pathFinish:
        typeof schema.stream.pathFinish === "string" && schema.stream.pathFinish.trim()
          ? schema.stream.pathFinish.trim()
          : undefined,
      pathUsage: sanitizeUsagePaths(schema.stream.pathUsage)
    };
  }
  if (schema.buffer && typeof schema.buffer === "object") {
    result.buffer = {
      pathText:
        typeof schema.buffer.pathText === "string" && schema.buffer.pathText.trim()
          ? schema.buffer.pathText.trim()
          : "choices[0].message.content",
      pathFinish:
        typeof schema.buffer.pathFinish === "string" && schema.buffer.pathFinish.trim()
          ? schema.buffer.pathFinish.trim()
          : undefined,
      pathUsage: sanitizeUsagePaths(schema.buffer.pathUsage)
    };
  }
  return result;
};

const sanitizeGenericConfig = (input) => {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const method = input.method === "GET" ? "GET" : "POST";
  const endpoint =
    typeof input.endpoint === "string" && input.endpoint.trim()
      ? input.endpoint.trim()
      : "/v1/chat";
  const requestTemplate = {
    headers: sanitizeHeaders(input.requestTemplate?.headers),
    body: input.requestTemplate && "body" in input.requestTemplate
      ? input.requestTemplate.body
      : undefined
  };
  const responseSchema = sanitizeGenericResponse(input.responseSchema);
  return {
    endpoint,
    method,
    requestTemplate,
    responseSchema
  };
};

const sanitizeProfile = (name, profile) => {
  if (!profile || typeof profile !== "object") {
    return null;
  }
  const driver = profile.driver === "generic-http" ? "generic-http" : "openai-compatible";
  const baseUrl =
    typeof profile.baseUrl === "string" && profile.baseUrl.trim()
      ? profile.baseUrl.trim()
      : DEFAULT_PROFILE.baseUrl;
  const defaultModel =
    typeof profile.defaultModel === "string" && profile.defaultModel.trim()
      ? profile.defaultModel.trim()
      : DEFAULT_PROFILE.defaultModel;
  const headers = sanitizeHeaders(profile.headers);
  const request = sanitizeRequest(profile.request);
  const auth = sanitizeAuth(profile.auth, {
    defaultScheme: driver === "openai-compatible" ? "Bearer" : "Bearer",
    allowEmpty: driver === "openai-compatible"
  });
  const generic = driver === "generic-http" ? sanitizeGenericConfig(profile.generic) : undefined;

  return {
    name: profile.name || name,
    driver,
    baseUrl,
    defaultModel,
    auth: auth || (driver === "openai-compatible" ? { scheme: "Bearer", tokenRef: "" } : undefined),
    headers,
    request,
    generic
  };
};

const sanitizeState = (state) => {
  if (!state || typeof state !== "object" || !state.profiles) {
    return cloneDefaultState();
  }
  const profiles = {};
  for (const [name, profile] of Object.entries(state.profiles)) {
    const sanitized = sanitizeProfile(name, profile);
    if (sanitized) {
      profiles[name] = sanitized;
    }
  }
  if (!Object.keys(profiles).length) {
    profiles[DEFAULT_PROFILE.name] = { ...DEFAULT_PROFILE };
  }
  const active = profiles[state.active] ? state.active : Object.keys(profiles)[0];
  return {
    active,
    profiles
  };
};

const ensureTokenDir = async () => {
  await fs.mkdir(TOKEN_DIR(), { recursive: true });
};

const resolveTokenPath = (tokenRef) => path.join(TOKEN_DIR(), `${tokenRef}.bin`);

const loadCompletions = async () => {
  const filePath = COMPLETIONS_FILE();
  const loaded = await readJson(filePath);
  const sanitized = sanitizeState(loaded);
  if (!loaded) {
    await saveCompletions(sanitized);
  }
  return sanitized;
};

const saveCompletions = async (state) => {
  const sanitized = sanitizeState(state);
  await writeJson(COMPLETIONS_FILE(), sanitized);
};

const getActiveProfile = async () => {
  const state = await loadCompletions();
  if (state.profiles[state.active]) {
    return state.profiles[state.active];
  }
  const first = state.profiles[Object.keys(state.profiles)[0]];
  return first || { ...DEFAULT_PROFILE };
};

const setActiveProfile = async (name) => {
  const state = await loadCompletions();
  if (!state.profiles[name]) {
    throw new Error(`Profile "${name}" not found`);
  }
  const next = {
    ...state,
    active: name
  };
  await saveCompletions(next);
};

const secureStoreToken = async (plain) => {
  if (typeof plain !== "string" || !plain.trim()) {
    throw new Error("Token must be a non-empty string");
  }
  await ensureTokenDir();
  const tokenRef = `enc_${randomUUID()}`;
  const encrypted = safeStorage.isEncryptionAvailable()
    ? safeStorage.encryptString(plain)
    : Buffer.from(plain, "utf8");
  await fs.writeFile(resolveTokenPath(tokenRef), encrypted);
  return tokenRef;
};

const secureRetrieveToken = async (tokenRef) => {
  if (!tokenRef) {
    throw new Error("Token reference is empty");
  }
  const filePath = resolveTokenPath(tokenRef);
  const data = await fs.readFile(filePath);
  if (!data) {
    throw new Error("Token not found");
  }
  return safeStorage.isEncryptionAvailable()
    ? safeStorage.decryptString(data)
    : data.toString("utf8");
};

module.exports = {
  loadCompletions,
  saveCompletions,
  getActiveProfile,
  setActiveProfile,
  secureStoreToken,
  secureRetrieveToken
};
