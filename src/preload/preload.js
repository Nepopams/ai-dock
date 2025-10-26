const { contextBridge, ipcRenderer } = require("electron");

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
    list: () => safeInvoke("tabs:list")
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
