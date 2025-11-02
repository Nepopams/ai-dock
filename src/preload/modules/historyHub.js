module.exports = function registerHistoryHub({
  contextBridge,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC
}) {
  const sanitizeHistorySource = (source) => {
    if (source === undefined || source === null) {
      return undefined;
    }
    if (typeof source !== "object") {
      throw new Error("source must be an object");
    }
    const clientId = validateString(source.clientId, "message.source.clientId");
    const sanitized = { clientId };
    if (typeof source.url === "string" && source.url.trim()) {
      sanitized.url = source.url.trim();
    }
    return sanitized;
  };

  const sanitizeHistoryMessage = (message) => {
    if (!message || typeof message !== "object") {
      throw new Error("message must be an object");
    }
    const id = ensureRequestId(message.id);
    const threadId = validateString(message.threadId, "message.threadId");
    const agentId = validateString(message.agentId, "message.agentId");
    const role = message.role === "assistant" ? "assistant" : "user";
    const text = validateString(message.text, "message.text");
    const ts = validateString(message.ts || new Date().toISOString(), "message.ts");
    const payload = {
      id,
      threadId,
      agentId,
      role,
      text,
      ts
    };
    if (message.source !== undefined) {
      payload.source = sanitizeHistorySource(message.source);
    }
    if (message.meta && typeof message.meta === "object") {
      payload.meta = message.meta;
    }
    return payload;
  };

  const sanitizeSearchQuery = (query) => {
    if (!query || typeof query !== "object") {
      return {};
    }
    const payload = {};
    if (typeof query.q === "string") {
      payload.q = query.q;
    }
    if (typeof query.agentId === "string" && query.agentId.trim()) {
      payload.agentId = query.agentId.trim();
    }
    if (typeof query.clientId === "string" && query.clientId.trim()) {
      payload.clientId = query.clientId.trim();
    }
    if (query.role === "user" || query.role === "assistant") {
      payload.role = query.role;
    }
    if (typeof query.dateFrom === "string" && query.dateFrom.trim()) {
      payload.dateFrom = query.dateFrom.trim();
    }
    if (typeof query.dateTo === "string" && query.dateTo.trim()) {
      payload.dateTo = query.dateTo.trim();
    }
    if (typeof query.tag === "string" && query.tag.trim()) {
      payload.tag = query.tag.trim();
    }
    return payload;
  };

  const sanitizePaging = (paging = {}) => {
    const payload = {};
    if (Number.isFinite(paging.limit)) {
      const numeric = Math.floor(Number(paging.limit));
      if (numeric > 0) {
        payload.limit = Math.min(500, Math.max(1, numeric));
      }
    }
    if (Number.isFinite(paging.offset)) {
      const numeric = Math.floor(Number(paging.offset));
      if (numeric >= 0) {
        payload.offset = Math.max(0, numeric);
      }
    }
    return payload;
  };

  contextBridge.exposeInMainWorld("historyHub", {
    createThread: (title) =>
      safeInvoke(IPC.CREATE, typeof title === "string" ? title : undefined),
    addMessage: (message) => safeInvoke(IPC.ADD_MESSAGE, sanitizeHistoryMessage(message)),
    listThreads: () => safeInvoke(IPC.LIST),
    getThreadMessages: (payload) => {
      const sanitized = {
        threadId: validateString(payload?.threadId, "threadId"),
        ...sanitizePaging({ limit: payload?.limit, offset: payload?.offset })
      };
      return safeInvoke(IPC.LIST_MESSAGES, sanitized);
    },
    search: (query, paging) =>
      safeInvoke(IPC.SEARCH, {
        ...sanitizeSearchQuery(query || {}),
        ...sanitizePaging(paging || {})
      }),
    ingestLast: (payload) => {
      if (!payload || typeof payload !== "object") {
        throw new Error("ingest payload must be an object");
      }
      const sanitized = {
        tabId: validateString(payload.tabId, "tabId"),
        adapterId: validateString(payload.adapterId, "adapterId")
      };
      if (typeof payload.threadId === "string" && payload.threadId.trim()) {
        sanitized.threadId = payload.threadId.trim();
      }
      if (Number.isFinite(payload.limit)) {
        const numeric = Math.floor(Number(payload.limit));
        if (numeric > 0) {
          sanitized.limit = Math.min(50, Math.max(1, numeric));
        }
      }
      return safeInvoke(IPC.INGEST_LAST, sanitized);
    }
  });
};
