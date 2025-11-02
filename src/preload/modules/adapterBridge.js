module.exports = function registerAdapterBridge({
  contextBridge,
  safeInvoke,
  validateString,
  IPC
}) {
  const ensureTabId = (tabId) => validateString(tabId, "tabId");

  const toFunctionSource = (fn) => {
    if (typeof fn === "function") {
      const source = fn.toString();
      if (source.includes("[native code]")) {
        throw new Error("native functions are not allowed");
      }
      return source;
    }
    if (typeof fn === "string" && fn.trim()) {
      return fn.trim();
    }
    throw new Error("fn must be a function or non-empty string");
  };

  contextBridge.exposeInMainWorld("adapterBridge", {
    exec: (tabId, fn, args = []) => {
      const payload = {
        tabId: ensureTabId(tabId),
        fnSource: toFunctionSource(fn),
        args: Array.isArray(args) ? args : [args]
      };
      return safeInvoke(IPC.EXEC, payload);
    },
    ping: () => safeInvoke(IPC.PING)
  });
};
