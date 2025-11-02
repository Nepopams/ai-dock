module.exports = function registerRegistry({ contextBridge, ipcRenderer, safeInvoke, IPC }) {
  let watchers = 0;

  const startRegistryWatch = () => {
    watchers += 1;
    if (watchers === 1) {
      safeInvoke(IPC.WATCH_START).catch((error) => {
        console.error("[registry] failed to start watcher", error);
      });
    }
  };

  const stopRegistryWatch = () => {
    watchers = Math.max(0, watchers - 1);
    if (watchers === 0) {
      safeInvoke(IPC.WATCH_STOP).catch((error) => {
        console.error("[registry] failed to stop watcher", error);
      });
    }
  };

  contextBridge.exposeInMainWorld("registry", {
    list: () => safeInvoke(IPC.LIST),
    save: (registry) => {
      if (!registry || typeof registry !== "object") {
        throw new Error("registry payload must be an object");
      }
      return safeInvoke(IPC.SAVE, registry);
    },
    watch: (cb) => {
      if (typeof cb !== "function") {
        throw new Error("callback must be a function");
      }
      startRegistryWatch();
      const handler = () => cb();
      ipcRenderer.on(IPC.CHANGED, handler);
      return () => {
        ipcRenderer.removeListener(IPC.CHANGED, handler);
        stopRegistryWatch();
      };
    }
  });
};
