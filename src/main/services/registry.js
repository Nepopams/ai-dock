const { app } = require("electron");
const { existsSync, watch } = require("fs");
const { promises: fs } = require("fs");
const path = require("path");
const {
  serviceCategories,
  isServiceCategory,
  isServiceClient,
  isRegistryFile
} = require("../../shared/types/registry");
const { debounce } = require("../../shared/utils/debounce");

const REGISTRY_FILE_NAME = "registry.json";

let registryCache = null;

const cloneRegistry = (registry) => JSON.parse(JSON.stringify(registry));

const createDefaultClients = () => [
  {
    id: "chatgpt",
    title: "ChatGPT",
    category: "chat",
    urlPatterns: ["https://chat.openai.com/*"],
    adapterId: "openai.chatgpt",
    icon: "builtin:chatgpt",
    enabled: true
  },
  {
    id: "claude",
    title: "Claude",
    category: "chat",
    urlPatterns: ["https://claude.ai/*"],
    adapterId: "anthropic.claude",
    icon: "builtin:claude",
    enabled: true
  },
  {
    id: "deepseek",
    title: "DeepSeek",
    category: "chat",
    urlPatterns: ["https://www.deepseek.com/*"],
    adapterId: "deepseek.chat",
    icon: "builtin:deepseek",
    enabled: true
  }
];

const buildDefaultRegistry = () => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  clients: createDefaultClients()
});

const getRegistryPath = () => path.join(app.getPath("userData"), REGISTRY_FILE_NAME);

const readRegistryFromDisk = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (isRegistryFile(parsed)) {
      return parsed;
    }
    console.warn("[registry] Invalid registry format detected, rebuilding default file");
    return null;
  } catch (error) {
    console.warn("[registry] Failed to read registry file", error);
    return null;
  }
};

const writeRegistryToDisk = async (filePath, registry) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
};

const ensureRegistryFile = async () => {
  const filePath = getRegistryPath();
  if (!existsSync(filePath)) {
    const defaults = buildDefaultRegistry();
    await writeRegistryToDisk(filePath, defaults);
    return defaults;
  }
  const loaded = await readRegistryFromDisk(filePath);
  if (loaded) {
    return loaded;
  }
  const fallback = buildDefaultRegistry();
  await writeRegistryToDisk(filePath, fallback);
  return fallback;
};

const loadRegistry = async () => {
  if (!registryCache) {
    registryCache = await ensureRegistryFile();
  }
  return cloneRegistry(registryCache);
};

const saveRegistry = async (updater) => {
  const current = await loadRegistry();
  const next = updater(cloneRegistry(current));
  if (!next || typeof next !== "object") {
    throw new Error("Registry updater must return an object");
  }
  if (next.version !== 1) {
    throw new Error("Unsupported registry version");
  }
  if (!Array.isArray(next.clients) || next.clients.some((client) => !isServiceClient(client))) {
    throw new Error("Registry contains invalid clients");
  }
  const stamped = {
    ...next,
    version: 1,
    updatedAt: new Date().toISOString()
  };
  const filePath = getRegistryPath();
  await writeRegistryToDisk(filePath, stamped);
  registryCache = stamped;
  return cloneRegistry(stamped);
};

const clearRegistryCache = () => {
  registryCache = null;
};

let fsWatcher = null;
const watcherListeners = new Set();

const notifyListeners = () => {
  watcherListeners.forEach((listener) => {
    try {
      listener();
    } catch (listenerError) {
      console.error("[registry] watcher listener error", listenerError);
    }
  });
};

const emitRegistryChange = debounce(() => {
  clearRegistryCache();
  loadRegistry()
    .catch((error) => {
      console.warn("[registry] reload failed after change", error);
    })
    .finally(() => {
      notifyListeners();
    });
}, 250);

const ensureFsWatcher = async () => {
  if (fsWatcher) {
    return;
  }
  try {
    await ensureRegistryFile();
  } catch (error) {
    console.error("[registry] failed to ensure registry file", error);
    throw error;
  }
  try {
    fsWatcher = watch(getRegistryPath(), { persistent: false }, () => emitRegistryChange());
    fsWatcher.on("error", (error) => {
      console.error("[registry] watcher error", error);
      emitRegistryChange();
    });
  } catch (error) {
    console.error("[registry] failed to start watcher", error);
    throw error;
  }
};

const watchRegistry = async (onChange) => {
  watcherListeners.add(onChange);
  await ensureFsWatcher();
  return () => {
    watcherListeners.delete(onChange);
    if (watcherListeners.size === 0) {
      stopRegistryWatcher();
    }
  };
};

const stopRegistryWatcher = () => {
  if (fsWatcher) {
    fsWatcher.close();
    fsWatcher = null;
  }
  watcherListeners.clear();
};

module.exports = {
  getRegistryPath,
  loadRegistry,
  saveRegistry,
  clearRegistryCache,
  watchRegistry,
  stopRegistryWatcher,
  serviceCategories,
  isServiceCategory,
  isServiceClient
};
