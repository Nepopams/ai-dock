import { AdapterError } from "./IAgentAdapter";

interface AdapterBridgeRPCResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: string;
}

interface AdapterBridgeAPI {
  exec: (tabId: string, fnSource: string, args?: unknown[]) => Promise<AdapterBridgeRPCResult>;
  ping: () => Promise<AdapterBridgeRPCResult>;
}

declare global {
  interface Window {
    adapterBridge?: AdapterBridgeAPI;
  }
}

const ensureBridge = (): AdapterBridgeAPI => {
  if (!window.adapterBridge) {
    throw new AdapterError("UNKNOWN", "Adapter bridge is not available");
  }
  return window.adapterBridge;
};

export const execDomScript = async <T>(
  tabId: string,
  fnSource: string,
  args: unknown[] = []
): Promise<T> => {
  const bridge = ensureBridge();
  const result = await bridge.exec(tabId, fnSource, args);
  if (!result || result.ok !== true) {
    throw new AdapterError("EXECUTION_FAILED", result?.error || "Failed to execute adapter script");
  }
  return result.data as T;
};

export const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  code: "TIMEOUT" | "NOT_READY" | "EXECUTION_FAILED",
  message?: string
): Promise<T> => {
  if (!timeoutMs || timeoutMs <= 0) {
    return promise;
  }
  let timeoutHandle: number | undefined;
  return new Promise<T>((resolve, reject) => {
    timeoutHandle = window.setTimeout(() => {
      reject(new AdapterError(code, message || "Adapter operation timed out"));
    }, timeoutMs);
    promise
      .then((value) => {
        if (typeof timeoutHandle === "number") {
          clearTimeout(timeoutHandle);
        }
        resolve(value);
      })
      .catch((error) => {
        if (typeof timeoutHandle === "number") {
          clearTimeout(timeoutHandle);
        }
        reject(error);
      });
  });
};
