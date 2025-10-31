import { ServiceClient, ServiceRegistryFile } from "../types/registry";

export const IPC_REGISTRY_LIST = "registry:list";
export const IPC_REGISTRY_SAVE = "registry:save";
export const IPC_REGISTRY_WATCH_START = "registry:watch-start";
export const IPC_REGISTRY_WATCH_STOP = "registry:watch-stop";
export const IPC_REGISTRY_CHANGED = "registry:changed";

export interface IpcOk<T = true> {
  ok: true;
  data: T;
}

export interface IpcError {
  ok: false;
  error: string;
}

export type RegistryListResponse = IpcOk<ServiceClient[]> | IpcError;
export type RegistrySaveRequest = ServiceRegistryFile;
export type RegistrySaveResponse = IpcOk<{ updatedAt: string }> | IpcError;
export type RegistryWatchResponse = IpcOk | IpcError;
