const { ipcMain } = require("electron");
const {
  FORM_PROFILES_LIST,
  FORM_PROFILES_SAVE,
  FORM_PROFILES_DELETE,
  FORM_PROFILES_DUPLICATE,
  FORM_PROFILES_TEST
} = require("../../shared/ipc/formProfiles.contracts.js");
const {
  loadFormProfiles,
  saveFormProfiles,
  upsertProfile,
  deleteProfile,
  duplicateProfile
} = require("../services/formProfiles.js");
const {
  renderTemplate,
  sanitizePreview
} = require("../../shared/utils/formRender.js");
const {
  isFormProfile
} = require("../../shared/types/form.js");

let registerCalled = false;

const registerFormProfilesIpc = () => {
  if (registerCalled) {
    return;
  }
  registerCalled = true;

  ipcMain.handle(FORM_PROFILES_LIST, async () => {
    const state = await loadFormProfiles();
    return {
      profiles: state.profiles,
      updatedAt: state.updatedAt
    };
  });

  ipcMain.handle(FORM_PROFILES_SAVE, async (_event, payload = {}) => {
    try {
      if (payload.upsert) {
        if (!isFormProfile(payload.upsert)) {
          return { ok: false, error: "Invalid profile payload" };
        }
        const profile = await upsertProfile(payload.upsert);
        return {
          ok: true,
          count: 1,
          updatedAt: profile.updatedAt
        };
      }

      if (Array.isArray(payload.profiles)) {
        const profiles = payload.profiles.filter(isFormProfile);
        if (!profiles.length) {
          return { ok: false, error: "No valid profiles provided" };
        }
        const result = await saveFormProfiles(() => profiles);
        return { ok: true, count: result.count, updatedAt: result.updatedAt };
      }

      return { ok: false, error: "Invalid request" };
    } catch (error) {
      return {
        ok: false,
        error: "Failed to save profiles",
        details: toErrorMessage(error)
      };
    }
  });

  ipcMain.handle(FORM_PROFILES_DELETE, async (_event, payload = {}) => {
    try {
      if (!payload.id || typeof payload.id !== "string") {
        return { ok: false, error: "Profile id is required" };
      }
      const removed = await deleteProfile(payload.id);
      if (!removed) {
        return { ok: false, error: "Profile not found" };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: toErrorMessage(error) };
    }
  });

  ipcMain.handle(FORM_PROFILES_DUPLICATE, async (_event, payload = {}) => {
    try {
      if (!payload.id || typeof payload.id !== "string") {
        return { ok: false, error: "Profile id is required" };
      }
      const profile = await duplicateProfile(payload.id);
      return { ok: true, profile };
    } catch (error) {
      return {
        ok: false,
        error: "Failed to duplicate profile",
        details: toErrorMessage(error)
      };
    }
  });

  ipcMain.handle(FORM_PROFILES_TEST, async (_event, payload = {}) => {
    try {
      if (!payload.profile || !isFormProfile(payload.profile)) {
        return { ok: false, error: "Invalid profile payload" };
      }

      const profile = payload.profile;
      const sampleValues =
        payload.sampleValues && typeof payload.sampleValues === "object"
          ? payload.sampleValues
          : {};

      if (profile.auth?.apiKeyRef) {
        const exists = await ensureTokenExists(profile.auth.apiKeyRef);
        if (!exists) {
          return {
            ok: false,
            error: "Missing credential",
            details: "apiKeyRef is not stored in safe storage"
          };
        }
      }

      const { url, result } = renderTemplate(
        profile.baseUrl,
        profile.template,
        sampleValues
      );

      const maskedHeaders = maskHeaders(result.headers);
      const notes = [];
      if (profile.stream && profile.stream !== "none") {
        notes.push(`Stream mode: ${profile.stream}`);
      }

      return {
        ok: true,
        url,
        method: profile.template.method,
        headers: maskedHeaders,
        bodyPreview: sanitizePreview(result.body),
        notes: notes.length ? notes.join("; ") : undefined
      };
    } catch (error) {
      return {
        ok: false,
        error: "Failed to test profile",
        details: toErrorMessage(error)
      };
    }
  });
};

const ensureTokenExists = async (tokenRef) => {
  if (!tokenRef) {
    return true;
  }
  try {
    const { secureRetrieveToken } = require("../services/settings.js");
    if (typeof secureRetrieveToken !== "function") {
      return true;
    }
    await secureRetrieveToken(tokenRef);
    return true;
  } catch (error) {
    if (error && (error.code === "ENOENT" || /not found/i.test(String(error.message || "")))) {
      return false;
    }
    throw error;
  }
};

const maskHeaders = (headers) => {
  if (!headers || typeof headers !== "object") {
    return {};
  }
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      isSecretKey(key) ? "***" : value
    ])
  );
};

const isSecretKey = (key) =>
  /authorization|token|secret|key|password/i.test(key);

const toErrorMessage = (error) =>
  error && typeof error.message === "string"
    ? error.message
    : String(error ?? "Unknown error");

module.exports = {
  registerFormProfilesIpc
};
