const sanitizeValues = (values) => {
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return {};
  }
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (typeof key !== "string" || !key.trim()) {
      return acc;
    }
    if (
      value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      acc[key.trim()] = value;
    }
    return acc;
  }, {});
};

module.exports = function registerFormRunner({ contextBridge, safeInvoke, ipcRenderer, IPC }) {
  const runSync = (source, options = {}) => {
    const payload = {};
    if (source && typeof source === "object") {
      if (source.profile && typeof source.profile === "object") {
        payload.profile = source.profile;
      } else if (typeof source.profileId === "string" && source.profileId.trim()) {
        payload.profileId = source.profileId.trim();
      }
      payload.values = sanitizeValues(source.values);
    } else {
      payload.values = {};
    }
    if (Number.isFinite(options.connectTimeoutMs)) {
      payload.connectTimeoutMs = Math.max(0, Number(options.connectTimeoutMs));
    }
    if (Number.isFinite(options.totalTimeoutMs)) {
      payload.totalTimeoutMs = Math.max(0, Number(options.totalTimeoutMs));
    }
    return safeInvoke(IPC.RUN_SYNC, payload);
  };

  const buildStreamPayload = (source = {}) => {
    const payload = {};
    if (source && typeof source === "object") {
      if (typeof source.requestId === "string" && source.requestId.trim()) {
        payload.requestId = source.requestId.trim();
      }
      if (source.profile && typeof source.profile === "object") {
        payload.profile = source.profile;
      } else if (typeof source.profileId === "string" && source.profileId.trim()) {
        payload.profileId = source.profileId.trim();
      }
      payload.values = sanitizeValues(source.values);
      if (Number.isFinite(source.connectTimeoutMs)) {
        payload.connectTimeoutMs = Math.max(0, Number(source.connectTimeoutMs));
      }
      if (Number.isFinite(source.idleTimeoutMs)) {
        payload.idleTimeoutMs = Math.max(0, Number(source.idleTimeoutMs));
      }
      if (Number.isFinite(source.totalTimeoutMs)) {
        payload.totalTimeoutMs = Math.max(0, Number(source.totalTimeoutMs));
      }
    } else {
      payload.values = {};
    }
    return payload;
  };

  const startStream = (source) => {
    const payload = buildStreamPayload(source);
    return safeInvoke(IPC.STREAM_START, payload);
  };

  const abortStream = (request) => {
    const payload =
      request && typeof request === "object"
        ? request
        : { requestId: typeof request === "string" ? request : undefined };
    if (!payload.requestId || typeof payload.requestId !== "string") {
      return Promise.resolve({ ok: true });
    }
    return safeInvoke(IPC.STREAM_ABORT, { requestId: payload.requestId });
  };

  const subscribe = (channel, callback) => {
    if (!ipcRenderer || typeof ipcRenderer.on !== "function") {
      return () => undefined;
    }
    const listener = (_event, data) => {
      callback?.(data);
    };
    ipcRenderer.on(channel, listener);
    return () => {
      if (typeof ipcRenderer.removeListener === "function") {
        ipcRenderer.removeListener(channel, listener);
      }
    };
  };

  contextBridge.exposeInMainWorld("formRunner", {
    runSync,
    stream: {
      start: startStream,
      abort: abortStream,
      onDelta: (cb) => subscribe(IPC.STREAM_DELTA, cb),
      onDone: (cb) => subscribe(IPC.STREAM_DONE, cb),
      onError: (cb) => subscribe(IPC.STREAM_ERROR, cb),
      onStatus: (cb) => subscribe(IPC.STREAM_STATUS, cb)
    }
  });
};
