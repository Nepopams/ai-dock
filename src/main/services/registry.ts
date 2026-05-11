import type {
  ServiceCategory,
  ServiceClient,
  ServiceRegistryFile
} from "../../shared/types/registry";

type RegistryRuntime = {
  getRegistryPath: () => string;
  loadRegistry: () => Promise<ServiceRegistryFile>;
  saveRegistry: (
    updater: (current: ServiceRegistryFile) => ServiceRegistryFile
  ) => Promise<ServiceRegistryFile>;
  clearRegistryCache: () => void;
  watchRegistry: (onChange: () => void) => Promise<() => void>;
  stopRegistryWatcher: () => void;
  serviceCategories: ServiceCategory[];
  isServiceCategory: (value: unknown) => value is ServiceCategory;
  isServiceClient: (value: unknown) => value is ServiceClient;
};

declare const require: (path: string) => RegistryRuntime;

const runtime = require("./registry.js");

export const getRegistryPath = runtime.getRegistryPath;
export const loadRegistry = runtime.loadRegistry;
export const saveRegistry = runtime.saveRegistry;
export const clearRegistryCache = runtime.clearRegistryCache;
export const watchRegistry = runtime.watchRegistry;
export const stopRegistryWatcher = runtime.stopRegistryWatcher;
export const serviceCategories = runtime.serviceCategories;
export const isServiceCategory = runtime.isServiceCategory;
export const isServiceClient = runtime.isServiceClient;
