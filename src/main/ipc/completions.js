const { ipcMain } = require("electron");
const {
  loadCompletions,
  saveCompletions,
  setActiveProfile,
  secureStoreToken,
  secureRetrieveToken
} = require("../services/settings");
const { send: sendOpenAI } = require("../providers/openaiCompatible");

let registered = false;

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
    const scheme = profile.auth?.scheme === "Basic" ? "Basic" : "Bearer";
    record[name] = {
      name,
      driver: "openai-compatible",
      baseUrl: typeof profile.baseUrl === "string" && profile.baseUrl.trim()
        ? profile.baseUrl.trim()
        : "https://api.openai.com/v1",
      defaultModel: typeof profile.defaultModel === "string" && profile.defaultModel.trim()
        ? profile.defaultModel.trim()
        : "gpt-4o-mini",
      auth: {
        scheme,
        tokenRef: typeof profile.auth?.tokenRef === "string" ? profile.auth.tokenRef : ""
      },
      headers:
        profile.headers && typeof profile.headers === "object"
          ? Object.fromEntries(
              Object.entries(profile.headers).filter(
                ([key, value]) => typeof key === "string" && typeof value === "string"
              )
            )
          : undefined,
      request:
        profile.request && typeof profile.request === "object"
          ? {
              stream:
                typeof profile.request.stream === "boolean"
                  ? profile.request.stream
                  : undefined,
              timeoutMs:
                Number.isFinite(profile.request.timeoutMs) && profile.request.timeoutMs > 0
                  ? Number(profile.request.timeoutMs)
                  : undefined
            }
          : undefined
    };
    if (profile.auth && typeof profile.auth.token === "string" && profile.auth.token.trim()) {
      record[name].auth.token = profile.auth.token.trim();
    }
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
      auth: {
        scheme: profile.auth.scheme,
        tokenRef: profile.auth.tokenRef,
        hasToken: Boolean(profile.auth.tokenRef)
      }
    }))
  };
};

const persistProfiles = async (payload) => {
  const current = await loadCompletions();
  const incomingProfiles = mapProfilesToRecord(payload?.profiles);
  const nextProfiles = {};

  for (const [name, profile] of Object.entries(incomingProfiles)) {
    const previous = current.profiles[name];
    const providedTokenRef =
      typeof profile.auth.tokenRef === "string" ? profile.auth.tokenRef : undefined;
    let tokenRef =
      providedTokenRef !== undefined ? providedTokenRef : previous?.auth.tokenRef || "";
    if (profile.auth && typeof profile.auth.token === "string") {
      const trimmed = profile.auth.token.trim();
      if (trimmed) {
        tokenRef = await secureStoreToken(trimmed);
      } else if (providedTokenRef === "") {
        tokenRef = "";
      }
    }
    delete profile.auth.token;
    nextProfiles[name] = {
      ...profile,
      auth: {
        scheme: profile.auth.scheme,
        tokenRef
      }
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
      if (!profile.auth?.tokenRef) {
        throw new Error("Profile has no stored token");
      }
      const token = await secureRetrieveToken(profile.auth.tokenRef);
      const runtimeProfile = {
        ...profile,
        auth: {
          ...profile.auth,
          token
        }
      };
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
        const iterator = sendOpenAI(
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
