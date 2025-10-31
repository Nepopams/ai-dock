const { ipcMain } = require("electron");
const {
  IPC_ADAPTER_EXEC,
  IPC_ADAPTER_PING
} = require("../../shared/ipc/adapterBridge.ipc");

const isFunctionSourceSafe = (source) => {
  if (typeof source !== "string") {
    return false;
  }
  const trimmed = source.trim();
  return trimmed.startsWith("function") || trimmed.startsWith("(");
};

const buildExecutionScript = (fnSource, args) => {
  const serializedArgs = JSON.stringify(args ?? []);
  return `
    (function() {
      try {
        const __fn = (${fnSource});
        const __result = __fn.apply(null, ${serializedArgs});
        if (__result && typeof __result.then === "function") {
          return Promise.resolve(__result);
        }
        return __result;
      } catch (error) {
        return { __adapterError: true, message: error && error.message ? String(error.message) : String(error) };
      }
    })();
  `;
};

const execInView = async (tabManager, tabId, fnSource, args = []) => {
  if (!isFunctionSourceSafe(fnSource)) {
    throw new Error("INVALID_FUNCTION_SOURCE");
  }

  const view = tabManager.getView(tabId);
  if (!view || view.webContents.isDestroyed()) {
    throw new Error("TAB_NOT_FOUND");
  }

  const script = buildExecutionScript(fnSource, args);
  const result = await view.webContents.executeJavaScript(script, true);
  if (result && typeof result === "object" && result.__adapterError) {
    const message = result.message || "Execution returned an adapter error";
    throw new Error(message);
  }
  return result;
};

const registerAdapterBridgeIpc = (tabManager) => {
  ipcMain.handle(IPC_ADAPTER_EXEC, async (_event, payload) => {
    try {
      const data = await execInView(tabManager, payload.tabId, payload.fnSource, payload.args ?? []);
      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        code: error instanceof Error ? error.name : undefined
      };
    }
  });

  ipcMain.handle(IPC_ADAPTER_PING, async () => {
    return { ok: true, data: true };
  });
};

module.exports = {
  execInView,
  registerAdapterBridgeIpc
};
