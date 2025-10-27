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
  }
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

const sanitizeProfile = (name, profile) => {
  if (!profile || typeof profile !== "object") {
    return null;
  }
  const scheme = profile.auth?.scheme === "Basic" ? "Basic" : "Bearer";
  const tokenRef = typeof profile.auth?.tokenRef === "string" ? profile.auth.tokenRef : "";
  const headers = profile.headers && typeof profile.headers === "object"
    ? Object.fromEntries(
        Object.entries(profile.headers).filter(
          ([key, value]) => typeof key === "string" && typeof value === "string"
        )
      )
    : undefined;
  const request = profile.request && typeof profile.request === "object"
    ? {
        stream: typeof profile.request.stream === "boolean" ? profile.request.stream : undefined,
        timeoutMs:
          Number.isFinite(profile.request.timeoutMs) && profile.request.timeoutMs > 0
            ? Number(profile.request.timeoutMs)
            : undefined
      }
    : undefined;

  return {
    name: profile.name || name,
    driver: "openai-compatible",
    baseUrl: typeof profile.baseUrl === "string" && profile.baseUrl.trim()
      ? profile.baseUrl.trim()
      : DEFAULT_PROFILE.baseUrl,
    defaultModel: typeof profile.defaultModel === "string" && profile.defaultModel.trim()
      ? profile.defaultModel.trim()
      : DEFAULT_PROFILE.defaultModel,
    auth: {
      scheme,
      tokenRef
    },
    headers,
    request
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
