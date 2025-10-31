import { BrowserWindow, ipcMain, WebContents } from "electron";
import {
  IPC_REGISTRY_CHANGED,
  IPC_REGISTRY_LIST,
  IPC_REGISTRY_SAVE,
  IPC_REGISTRY_WATCH_START,
  IPC_REGISTRY_WATCH_STOP,
  IpcError,
  IpcOk,
  RegistryListResponse,
  RegistrySaveRequest,
  RegistrySaveResponse,
  RegistryWatchResponse
} from "../../shared/ipc/contracts";
import { isRegistryFile } from "../../shared/types/registry";
import {
  loadRegistry\n  saveRegistry,\n  watchRegistry\n} from "../services/registry";

let registered = false;
let unwatchService: (() => void) | null = null;
const subscribers = new Set<WebContents>();

const ok = <T = true>(data: T): IpcOk<T> => ({ ok: true, data });
const fail = (error: unknown): IpcError => ({
  ok: false,
  error: error instanceof Error ? error.message : String(error)
});

const notifySubscribers = () => {
  for (const contents of Array.from(subscribers)) {
    if (contents.isDestroyed()) {
      subscribers.delete(contents);
      continue;
    }
    contents.send(IPC_REGISTRY_CHANGED);
  }
};

const ensureServiceWatcher = async () => {
  if (unwatchService) {
    return;
  }
  unwatchService = await watchRegistry(() => {
    notifySubscribers();
  });
};

const removeSubscriber = (contents: WebContents) => {
  subscribers.delete(contents);
};

export const registerRegistryIpc = () => {
  if (registered) {
    return;
  }
  registered = true;\n\n  ensureServiceWatcher().catch((error) => {\n    console.error("[registry] failed to initialise watcher", error);\n  });\n
  ipcMain.handle(IPC_REGISTRY_LIST, async (): Promise<RegistryListResponse> => {
    try {
      const registry = await loadRegistry();
      return ok(registry.clients);
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(
    IPC_REGISTRY_SAVE,
    async (_event, payload: RegistrySaveRequest): Promise<RegistrySaveResponse> => {
      if (!isRegistryFile(payload)) {
        return fail("Invalid registry payload");
      }
      try {
        const snapshot = JSON.parse(JSON.stringify(payload)) as RegistrySaveRequest;
        const saved = await saveRegistry(() => snapshot);
        notifySubscribers();
        return ok({ updatedAt: saved.updatedAt });
      } catch (error) {
        return fail(error);
      }
    }
  );

  ipcMain.handle(
    IPC_REGISTRY_WATCH_START,
    async (event): Promise<RegistryWatchResponse> => {
      const { sender } = event;
      subscribers.add(sender);
      sender.once("destroyed", () => removeSubscriber(sender));
      try {
        await ensureServiceWatcher();
        return ok(true);
      } catch (error) {
        removeSubscriber(sender);
        return fail(error);
      }
    }
  );

  ipcMain.handle(
    IPC_REGISTRY_WATCH_STOP,
    async (event): Promise<RegistryWatchResponse> => {
      removeSubscriber(event.sender);
      return ok(true);
    }
  );
};


