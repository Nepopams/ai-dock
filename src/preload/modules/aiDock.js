module.exports = function registerAiDock({ contextBridge, safeInvoke }) {
  contextBridge.exposeInMainWorld("aiDock", {
    saveChatMarkdown: () => safeInvoke("save-chat-md")
  });
};
