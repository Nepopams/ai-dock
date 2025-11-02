const createBase = (ipcRenderer) => {
  const safeInvoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

  const validateString = (value, name) => {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${name} must be a non-empty string`);
    }
    return value.trim();
  };

  const ensureRequestId = (value) => {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (globalThis.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  };

  return {
    safeInvoke,
    validateString,
    ensureRequestId
  };
};

module.exports = {
  createBase
};
