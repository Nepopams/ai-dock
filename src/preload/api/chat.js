const ALLOWED_ROLES = new Set(["user", "assistant", "system", "tool"]);
module.exports = (contextBridge, ipcRenderer) => {
  const normalizeConversationId = (value) =>
    typeof value === "string" && value.trim() ? value.trim() : "";

  const sanitizeMessages = (messages) => {
    if (!Array.isArray(messages)) {
      throw new Error("messages must be an array");
    }
    return messages.map((message, index) => {
      if (!message || typeof message !== "object") {
        throw new Error(`message at index ${index} must be an object`);
      }
      const id = typeof message.id === "string" && message.id.trim();
      if (!id) {
        throw new Error(`message at index ${index} is missing a valid id`);
      }
      const role = typeof message.role === "string" ? message.role.trim() : "";
      if (!ALLOWED_ROLES.has(role)) {
        throw new Error(`message at index ${index} has invalid role`);
      }
      const content =
        typeof message.content === "string" ? message.content : String(message.content || "");
      if (!content && role === "user") {
        throw new Error(`message at index ${index} must include content`);
      }
      const ts = Number.isFinite(message.ts) ? Number(message.ts) : Date.now();
      const meta = message.meta && typeof message.meta === "object" ? message.meta : undefined;
      const sanitized = {
        id,
        role,
        content,
        ts
      };
      if (meta) {
        sanitized.meta = meta;
      }
      return sanitized;
    });
  };

  const sanitizeOptions = (options) => {
    if (!options || typeof options !== "object") {
      return {};
    }
    const sanitized = {};
    const internal = {};
    if (typeof options.model === "string" && options.model.trim()) {
      sanitized.model = options.model.trim();
    }
    if (typeof options.temperature === "number" && Number.isFinite(options.temperature)) {
      sanitized.temperature = options.temperature;
    }
    if (typeof options.max_tokens === "number" && Number.isInteger(options.max_tokens)) {
      sanitized.max_tokens = options.max_tokens;
    }
    if (options.response_format && typeof options.response_format === "object") {
      sanitized.response_format = options.response_format;
    }
    if (typeof options.stream === "boolean") {
      sanitized.stream = options.stream;
    }
    if (options.extraHeaders && typeof options.extraHeaders === "object") {
      sanitized.extraHeaders = Object.entries(options.extraHeaders).reduce((acc, [key, value]) => {
        if (typeof key === "string" && typeof value === "string") {
          acc[key] = value;
        }
        return acc;
      }, {});
    }
    if (typeof options.assistantMessageId === "string" && options.assistantMessageId.trim()) {
      internal.assistantMessageId = options.assistantMessageId.trim();
    }
    if (typeof options.userMessageId === "string" && options.userMessageId.trim()) {
      internal.userMessageId = options.userMessageId.trim();
    }
    if (typeof options.isRetry === "boolean") {
      internal.isRetry = options.isRetry;
    }
    if (Number.isFinite(options.maxRetries)) {
      internal.maxRetries = Math.max(1, Number(options.maxRetries));
    }
    if (Number.isFinite(options.baseDelayMs) && options.baseDelayMs > 0) {
      internal.baseDelayMs = Number(options.baseDelayMs);
    }
    if (Object.keys(internal).length) {
      sanitized.__internal = internal;
    }
    return sanitized;
  };

  const wrapListener = (channel, cb) => {
    if (typeof cb !== "function") {
      throw new Error("callback must be a function");
    }
    const handler = (_event, data) => {
      cb(data);
    };
    ipcRenderer.on(channel, handler);
    return () => {
      ipcRenderer.removeListener(channel, handler);
    };
  };

  const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

  contextBridge.exposeInMainWorld("chat", {
    send: (conversationId, messages = [], options = {}) => {
      const payload = {
        conversationId: normalizeConversationId(conversationId),
        messages: sanitizeMessages(messages),
        options: sanitizeOptions(options)
      };
      return invoke("chat:send", payload);
    },
    abort: (requestId) => {
      if (typeof requestId !== "string" || !requestId.trim()) {
        return;
      }
      ipcRenderer.send("chat:abort", requestId.trim());
    },
    getConversations: () => invoke("chat:getConversations"),
    getHistory: (conversationId, cursor, limit) =>
      invoke("chat:getHistory", {
        conversationId: normalizeConversationId(conversationId),
        cursor: typeof cursor === "string" ? cursor : undefined,
        limit: Number.isFinite(limit) ? Number(limit) : undefined
      }),
    deleteConversation: (conversationId) =>
      invoke("chat:deleteConversation", normalizeConversationId(conversationId)),
    createConversation: (title) =>
      invoke("chat:createConversation", typeof title === "string" ? title : undefined),
    onChunk: (cb) => wrapListener("chat:chunk", cb),
    onDone: (cb) => wrapListener("chat:done", cb),
    onError: (cb) => wrapListener("chat:error", cb),
    onRetry: (cb) => wrapListener("chat:retry", cb)
  });
};
