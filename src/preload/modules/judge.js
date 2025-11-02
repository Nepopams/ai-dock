const { createJudgeSanitizers } = require("../utils/judge.js");

module.exports = function registerJudge({
  contextBridge,
  ipcRenderer,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC
}) {
  const { sanitizeJudgeInput } = createJudgeSanitizers({
    validateString,
    ensureRequestId
  });

  contextBridge.exposeInMainWorld("judge", {
    run: (input) => safeInvoke(IPC.RUN, { input: sanitizeJudgeInput(input) }),
    onProgress: (cb) => {
      if (typeof cb !== "function") {
        throw new Error("callback must be a function");
      }
      const handler = (_event, data) => {
        if (data && typeof data === "object") {
          cb(data);
        }
      };
      ipcRenderer.on(IPC.PROGRESS, handler);
      return () => {
        ipcRenderer.removeListener(IPC.PROGRESS, handler);
      };
    }
  });
};
