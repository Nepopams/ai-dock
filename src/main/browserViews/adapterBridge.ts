import { BrowserView, ipcMain } from "electron";
import {
  AdapterExecRequest,
  AdapterExecResult,
  IPC_ADAPTER_EXEC,
  IPC_ADAPTER_PING
} from "../../shared/ipc/adapterBridge.ipc";
import TabManager = require("../tabManager");

const isFunctionSourceSafe = (source: unknown): source is string => {
  if (typeof source !== "string") {
    return false;
  }
  const trimmed = source.trim();
  return trimmed.startsWith("function") || trimmed.startsWith("(");
};

const buildExecutionScript = (fnSource: string, args: unknown[]): string => {
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

export const execInView = async (
  tabManager: InstanceType<typeof TabManager>,
  tabId: string,
  fnSource: string,
  args: unknown[] = []
): Promise<unknown> => {
  if (!isFunctionSourceSafe(fnSource)) {
    throw new Error("INVALID_FUNCTION_SOURCE");
  }

  const view: BrowserView | null = tabManager.getView(tabId);
  if (!view || view.webContents.isDestroyed()) {
    throw new Error("TAB_NOT_FOUND");
  }

  const script = buildExecutionScript(fnSource, args);
  const result = await view.webContents.executeJavaScript(script, true);
  if (result && typeof result === "object" && (result as { __adapterError?: boolean }).__adapterError) {
    const message = (result as { message?: string }).message || "Execution returned an adapter error";
    throw new Error(message);
  }
  return result;
};

export const registerAdapterBridgeIpc = (tabManager: InstanceType<typeof TabManager>): void => {
  ipcMain.handle(IPC_ADAPTER_EXEC, async (_event, payload: AdapterExecRequest): Promise<AdapterExecResult> => {
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

  ipcMain.handle(IPC_ADAPTER_PING, async (): Promise<AdapterExecResult> => {
    return { ok: true, data: true };
  });
};
