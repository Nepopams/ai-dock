const { ipcMain } = require("electron");
const {
  loadCompletions,
  saveCompletions,
  setActiveProfile,
  secureStoreToken,
  secureRetrieveToken
} = require("../services/settings");
const { send: sendOpenAI } = require("../providers/openaiCompatible");
const { send: sendGenericHttp } = require("../providers/genericHttp");

let registered = false;

const ensureHeaders = (input) => {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => typeof key === "string" && typeof value === "string"
    )
  );
};

const ensureRequest = (input) => {
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

const ensureUsagePaths = (input) => {
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

const ensureGenericConfig = (input) => {
  if (!input || typeof input !== "object") {
    return undefined;
  }
  const method = input.method === "GET" ? "GET" : "POST";
  const endpoint =
    typeof input.endpoint === "string" && input.endpoint.trim()
      ? input.endpoint.trim()
      : "/v1/chat";
  const requestTemplate = {
    headers: ensureHeaders(input.requestTemplate?.headers),
    body:
      input.requestTemplate && Object.prototype.hasOwnProperty.call(input.requestTemplate, "body")
        ? input.requestTemplate.body
        : undefined
  };
  const responseSchema = {
    mode: input.responseSchema?.mode === "stream" ? "stream" : "buffer",
    stream: input.responseSchema?.stream
      ? {
          framing: ["sse", "ndjson", "lines"].includes(input.responseSchema.stream.framing)
            ? input.responseSchema.stream.framing
            : "sse",
          pathDelta:
            typeof input.responseSchema.stream.pathDelta === "string"
              ? input.responseSchema.stream.pathDelta.trim()
              : undefined,
          pathFinish:
            typeof input.responseSchema.stream.pathFinish === "string"
              ? input.responseSchema.stream.pathFinish.trim()
              : undefined,
          pathUsage: ensureUsagePaths(input.responseSchema.stream.pathUsage)
        }
      : undefined,
    buffer: input.responseSchema?.buffer
      ? {
          pathText:
            typeof input.responseSchema.buffer.pathText === "string" &&
            input.responseSchema.buffer.pathText.trim()
              ? input.responseSchema.buffer.pathText.trim()
              : "choices[0].message.content",
          pathFinish:
            typeof input.responseSchema.buffer.pathFinish === "string"
              ? input.responseSchema.buffer.pathFinish.trim()
              : undefined,
          pathUsage: ensureUsagePaths(input.responseSchema.buffer.pathUsage)
        }
      : undefined
  };
  return {
    endpoint,
    method,
    requestTemplate,
    responseSchema
  };
};

const mapProfilesToRecord = (profilesArray) => {
  const record = {};
  if (!Array.isArray(profilesArray)) {
    return record;
  }
  for (const profile of profilesArray) {
    if (!profile || typeof profile !== "object") {
      continue;
    }
    const name = typeof profile.name === "string" && profile.name.trim();
    if (!name) {
      continue;
    }
    const driver = profile.driver === "generic-http" ? "generic-http" : "openai-compatible";
    const baseProfile = {
      name,
      driver,
      baseUrl:
        typeof profile.baseUrl === "string" && profile.baseUrl.trim()
          ? profile.baseUrl.trim()
          : "https://api.openai.com/v1",
      defaultModel:
        typeof profile.defaultModel === "string" && profile.defaultModel.trim()
          ? profile.defaultModel.trim()
          : "gpt-4o-mini",
      headers: ensureHeaders(profile.headers),
      request: ensureRequest(profile.request)
    };
    const scheme = profile.auth?.scheme === "Basic" ? "Basic" : "Bearer";
    if (profile.auth && (profile.auth.tokenRef || profile.auth.token || driver === "openai-compatible")) {
      baseProfile.auth = {
        scheme,
        tokenRef:
          typeof profile.auth?.tokenRef === "string" ? profile.auth.tokenRef : ""
      };
      if (typeof profile.auth?.token === "string" && profile.auth.token.trim()) {
        baseProfile.auth.token = profile.auth.token.trim();
      }
    }
    if (driver === "generic-http") {
      baseProfile.generic = ensureGenericConfig(profile.generic);
    }
    record[name] = baseProfile;
  }
  return record;
};

const sanitizeForRenderer = (state) => {
  return {
    active: state.active,
    profiles: Object.values(state.profiles).map((profile) => ({
      name: profile.name,
      driver: profile.driver,
      baseUrl: profile.baseUrl,
      defaultModel: profile.defaultModel,
      headers: profile.headers || {},
      request: profile.request || {},
      auth: profile.auth
        ? {
            scheme: profile.auth.scheme,
            tokenRef: profile.auth.tokenRef,
            hasToken: Boolean(profile.auth.tokenRef)
          }
        : undefined,
      generic: profile.generic
    }))
  };
};

const persistProfiles = async (payload) => {
  const current = await loadCompletions();
  const incomingProfiles = mapProfilesToRecord(payload?.profiles);
  const nextProfiles = {};

  for (const [name, profile] of Object.entries(incomingProfiles)) {
    const previous = current.profiles[name] || {};
    let auth;
    if (profile.auth) {
      const providedTokenRef =
        typeof profile.auth.tokenRef === "string" ? profile.auth.tokenRef : undefined;
      let tokenRef =
        providedTokenRef !== undefined ? providedTokenRef : previous.auth?.tokenRef || "";
      if (typeof profile.auth.token === "string") {
        const trimmed = profile.auth.token.trim();
        if (trimmed) {
          tokenRef = await secureStoreToken(trimmed);
        } else if (providedTokenRef === "") {
          tokenRef = "";
        }
      }
      auth = {
        scheme: profile.auth.scheme,
        tokenRef
      };
      delete profile.auth.token;
    }
    nextProfiles[name] = {
      ...profile,
      ...(auth ? { auth } : {})
    };
  }

  const nextState = {
    active:
      typeof payload?.active === "string" && nextProfiles[payload.active]
        ? payload.active
        : current.active,
    profiles: Object.keys(nextProfiles).length ? nextProfiles : current.profiles
  };

  // ensure active points to an existing profile
  if (!nextState.profiles[nextState.active]) {
    nextState.active = Object.keys(nextState.profiles)[0];
  }

  await saveCompletions(nextState);
  return sanitizeForRenderer(await loadCompletions());
};

const registerCompletionsIpc = () => {
  if (registered) {
    return;
  }
  registered = true;

  ipcMain.handle("completions:getProfiles", async () => {
    const state = await loadCompletions();
    return sanitizeForRenderer(state);
  });

  ipcMain.handle("completions:saveProfiles", async (_event, payload) => {
    return persistProfiles(payload);
  });

  ipcMain.handle("completions:setActive", async (_event, name) => {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("Profile name must be provided");
    }
    await setActiveProfile(name.trim());
    const state = await loadCompletions();
    return sanitizeForRenderer(state);
  });

  ipcMain.handle("completions:testProfile", async (_event, name) => {
    try {
      const state = await loadCompletions();
      const profileName =
        typeof name === "string" && name.trim() ? name.trim() : state.active;
      const profile = state.profiles[profileName];
      if (!profile) {
        throw new Error(`Profile "${profileName}" not found`);
      }
      let runtimeProfile = { ...profile };
      if (profile.auth?.tokenRef) {
        const token = await secureRetrieveToken(profile.auth.tokenRef);
        runtimeProfile = {
          ...runtimeProfile,
          auth: {
            ...runtimeProfile.auth,
            token
          }
        };
      } else if (profile.driver === "openai-compatible") {
        throw new Error("Profile has no stored token");
      }
      const controller = new AbortController();
      const timeoutMs =
        Number.isFinite(profile.request?.timeoutMs) && profile.request.timeoutMs > 0
          ? profile.request.timeoutMs
          : 15000;
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      let preview = "";
      let usage;
      let finishReason;
      try {
        const provider =
          profile.driver === "generic-http" ? sendGenericHttp : sendOpenAI;
        const iterator = provider(
          [{ role: "user", content: "ping" }],
          { model: profile.defaultModel },
          runtimeProfile,
          controller.signal
        )[Symbol.asyncIterator]();
        while (true) {
          const { done, value } = await iterator.next();
          if (done) {
            if (value?.usage) {
              usage = value.usage;
            }
            if (value?.finishReason) {
              finishReason = value.finishReason;
            }
            break;
          }
          if (value.delta && preview.length < 120) {
            preview += value.delta;
          }
          if (value.usage) {
            usage = value.usage;
          }
          if (value.finishReason) {
            finishReason = value.finishReason;
          }
        }
      } finally {
        clearTimeout(timeout);
      }

      return {
        success: true,
        preview: preview.trim(),
        usage,
        finishReason
      };
    } catch (error) {
      return {
        success: false,
        code: error?.code || "test_failed",
        message:
          typeof error?.message === "string"
            ? error.message
            : "Failed to verify profile"
      };
    }
  });
};

module.exports = {
  registerCompletionsIpc
};
