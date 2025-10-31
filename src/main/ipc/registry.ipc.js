const { ipcMain } = require("electron");
const {
  IPC_REGISTRY_CHANGED,
  IPC_REGISTRY_LIST,
  IPC_REGISTRY_SAVE,
  IPC_REGISTRY_WATCH_START,
  IPC_REGISTRY_WATCH_STOP
} = require("../../shared/ipc/contracts");
const { isRegistryFile } = require("../../shared/types/registry");
const { loadRegistry, saveRegistry, watchRegistry } = require("../services/registry");

let registered = false;
let unwatchService = null;
const subscribers = new Set();

const ok = (data = true) => ({ ok: true, data });
const fail = (error) => ({ ok: false, error: error instanceof Error ? error.message : String(error) });

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

const removeSubscriber = (contents) => {\n  subscribers.delete(contents);\n};

const registerRegistryIpc = () => {
  if (registered) {
    return;
  }
  registered = true;\n\n  ensureServiceWatcher().catch((error) => {\n    console.error("[registry] failed to initialise watcher", error);\n  });\n
  ipcMain.handle(IPC_REGISTRY_LIST, async () => {
    try {
      const registry = await loadRegistry();
      return ok(registry.clients);
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_REGISTRY_SAVE, async (_event, payload) => {
    if (!isRegistryFile(payload)) {
      return fail("Invalid registry payload");
    }
    try {
      const snapshot = JSON.parse(JSON.stringify(payload));
      const saved = await saveRegistry(() => snapshot);
      notifySubscribers();
      return ok({ updatedAt: saved.updatedAt });
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_REGISTRY_WATCH_START, async (event) => {
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
  });

  ipcMain.handle(IPC_REGISTRY_WATCH_STOP, async (event) => {
    removeSubscriber(event.sender);
    return ok(true);
  });
};

module.exports = { registerRegistryIpc };


