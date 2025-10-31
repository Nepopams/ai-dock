const { contextBridge, ipcRenderer } = require("electron");
const {
  IPC_REGISTRY_LIST,
  IPC_REGISTRY_SAVE,
  IPC_REGISTRY_WATCH_START,
  IPC_REGISTRY_WATCH_STOP,
  IPC_REGISTRY_CHANGED
} = require("../shared/ipc/contracts");

const safeInvoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

const validateString = (value, name) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} must be a non-empty string`);
  }
  return value.trim();
};

contextBridge.exposeInMainWorld("api", {
  tabs: {
    createOrFocus: (serviceId) => {
      return safeInvoke("tabs:createOrFocus", validateString(serviceId, "serviceId"));
    },
    switch: (tabId) => {
      return safeInvoke("tabs:switch", validateString(tabId, "tabId"));
    },
    close: (tabId) => {
      return safeInvoke("tabs:close", validateString(tabId, "tabId"));
    },
    list: () => safeInvoke("tabs:list"),
    focusLocal: () => safeInvoke("tabs:focusLocal")
  },
  prompts: {
    list: () => safeInvoke("prompts:list"),
    add: (prompt) => {
      if (!prompt || typeof prompt !== "object") {
        throw new Error("prompt must be an object");
      }
      const title = validateString(prompt.title, "title");
      const body = validateString(prompt.body, "body");
      return safeInvoke("prompts:add", { title, body });
    },
    remove: (id) => safeInvoke("prompts:remove", validateString(id, "id"))
  },
  clipboard: {
    copy: (text) => safeInvoke("clipboard:copy", validateString(text, "text"))
  },
  layout: {
    setDrawer: (width) => {
      const numeric = Number(width);
      if (!Number.isFinite(numeric) || numeric < 0) {
        throw new Error("width must be a positive number");
      }
      return safeInvoke("layout:setDrawer", Math.floor(numeric));
    },
    setTopInset: (height) => {
      const numeric = Number(height);
      if (!Number.isFinite(numeric) || numeric < 0) {
        throw new Error("height must be a positive number");
      }
      return safeInvoke("layout:setTopInset", Math.floor(numeric));
    }
  },
  promptRouter: {
    getAgents: () => safeInvoke("promptRouter:getAgents"),
    broadcast: ({ text, agents }) => {
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("text must be a non-empty string");
      }
      const payload = {
        text: text.trim(),
        agents: Array.isArray(agents) ? agents.filter((id) => typeof id === "string" && id.trim()) : []
      };
      return safeInvoke("promptRouter:broadcast", payload);
    },
    getHistory: () => safeInvoke("promptRouter:history:list"),
    saveToHistory: (text) => {
      return safeInvoke("promptRouter:history:add", validateString(text, "text"));
    }
  }
});

contextBridge.exposeInMainWorld("aiDock", {
  saveChatMarkdown: () => safeInvoke("save-chat-md")
});

const ALLOWED_ROLES = new Set(["user", "assistant", "system", "tool"]);

const sanitizeChatMessages = (messages) => {
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

const sanitizeChatOptions = (options) => {
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

const createChatListener = (channel) => (cb) => {
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

contextBridge.exposeInMainWorld("chat", {
  send: (conversationId, messages = [], options = {}) => {
    const payload = {
      conversationId:
        typeof conversationId === "string" && conversationId.trim() ? conversationId.trim() : "",
      messages: sanitizeChatMessages(messages),
      options: sanitizeChatOptions(options)
    };
    return safeInvoke("chat:send", payload);
  },
  abort: (requestId) => {
    if (typeof requestId !== "string" || !requestId.trim()) {
      return;
    }
    ipcRenderer.send("chat:abort", requestId.trim());
  },
  getConversations: () => safeInvoke("chat:getConversations"),
  getHistory: (conversationId, cursor, limit) =>
    safeInvoke("chat:getHistory", {
      conversationId:
        typeof conversationId === "string" && conversationId.trim() ? conversationId.trim() : "",
      cursor: typeof cursor === "string" ? cursor : undefined,
      limit: Number.isFinite(limit) ? Number(limit) : undefined
    }),
  deleteConversation: (conversationId) =>
    safeInvoke(
      "chat:deleteConversation",
      typeof conversationId === "string" && conversationId.trim() ? conversationId.trim() : ""
    ),
  createConversation: (title) =>
    safeInvoke("chat:createConversation", typeof title === "string" ? title : undefined),
  deleteMessage: (conversationId, messageId) =>
    safeInvoke("chat:deleteMessage", {
      conversationId:
        typeof conversationId === "string" && conversationId.trim() ? conversationId.trim() : "",
      messageId: typeof messageId === "string" ? messageId.trim() : ""
    }),
  truncateAfter: (conversationId, messageId) =>
    safeInvoke("chat:truncateAfter", {
      conversationId:
        typeof conversationId === "string" && conversationId.trim() ? conversationId.trim() : "",
      messageId: typeof messageId === "string" ? messageId.trim() : ""
    }),
  exportMarkdown: (conversationId) =>
    safeInvoke(
      "chat:exportMarkdown",
      typeof conversationId === "string" && conversationId.trim() ? conversationId.trim() : ""
    ),
  onChunk: createChatListener("chat:chunk"),
  onDone: createChatListener("chat:done"),
  onError: createChatListener("chat:error"),
  onRetry: createChatListener("chat:retry")
});

contextBridge.exposeInMainWorld("completions", {
  getProfiles: () => safeInvoke("completions:getProfiles"),
  saveProfiles: (state) => safeInvoke("completions:saveProfiles", state),
  setActive: (name) => safeInvoke("completions:setActive", name),
  testProfile: (name) => safeInvoke("completions:testProfile", name)
});

let registryWatchers = 0;

const startRegistryWatch = () => {
  registryWatchers += 1;
  if (registryWatchers === 1) {
    safeInvoke(IPC_REGISTRY_WATCH_START).catch((error) => {
      console.error("[registry] failed to start watcher", error);
    });
  }
};

const stopRegistryWatch = () => {
  registryWatchers = Math.max(0, registryWatchers - 1);
  if (registryWatchers === 0) {
    safeInvoke(IPC_REGISTRY_WATCH_STOP).catch((error) => {
      console.error("[registry] failed to stop watcher", error);
    });
  }
};

contextBridge.exposeInMainWorld("registry", {
  list: () => safeInvoke(IPC_REGISTRY_LIST),
  save: (registry) => safeInvoke(IPC_REGISTRY_SAVE, registry),
  watch: (cb) => {
    if (typeof cb !== "function") {
      throw new Error("callback must be a function");
    }
    startRegistryWatch();
    const handler = () => cb();
    ipcRenderer.on(IPC_REGISTRY_CHANGED, handler);
    return () => {
      ipcRenderer.removeListener(IPC_REGISTRY_CHANGED, handler);
      stopRegistryWatch();
    };
  }
});


