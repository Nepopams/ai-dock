const IPC_REGISTRY_LIST = "registry:list";
const IPC_REGISTRY_SAVE = "registry:save";
const IPC_REGISTRY_WATCH_START = "registry:watch-start";
const IPC_REGISTRY_WATCH_STOP = "registry:watch-stop";
const IPC_REGISTRY_CHANGED = "registry:changed";

const ok = (data = true) => ({ ok: true, data });
const error = (message) => ({ ok: false, error: message });

module.exports = {
  IPC_REGISTRY_LIST,
  IPC_REGISTRY_SAVE,
  IPC_REGISTRY_WATCH_START,
  IPC_REGISTRY_WATCH_STOP,
  IPC_REGISTRY_CHANGED,
  ok,
  error
};
