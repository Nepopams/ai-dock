import { StateCreator } from "zustand";
import { RegistryListResponse, RegistrySaveRequest, RegistrySaveResponse } from "../../shared/ipc/contracts";
import { ServiceClient, ServiceRegistryFile } from "../../shared/types/registry";

export interface RegistrySlice {
  registryClients: ServiceClient[];
  registryLoading: boolean;
  registryError: string | null;
}

export interface RegistrySliceActions {
  fetchRegistry: () => Promise<void>;
  saveRegistry: (registry: ServiceRegistryFile) => Promise<boolean>;
  applyRegistryChange: () => Promise<void>;
}

export type RegistrySliceCreator<T> = StateCreator<T, [], [], RegistrySlice & { actions: RegistrySliceActions }>;

const getRegistryApi = () => window.registry;

export const createRegistrySlice = <T extends RegistrySlice & { actions: RegistrySliceActions }>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => {
  const setState = (partial: Partial<RegistrySlice>) => {
    set(partial as Partial<T>);
  };

  const fetchRegistry = async () => {
    const api = getRegistryApi();
    if (!api?.list) {
      setState({ registryLoading: false, registryError: "Registry API unavailable" });
      return;
    }
    setState({ registryLoading: true, registryError: null });
    try {
      const response: RegistryListResponse = await api.list();
      if (!response || response.ok === false) {
        setState({ registryLoading: false, registryError: response?.error || "Failed to load registry" });
        return;
      }
      setState({ registryClients: response.data, registryLoading: false, registryError: null });
    } catch (error) {
      setState({
        registryLoading: false,
        registryError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const saveRegistry = async (registry: ServiceRegistryFile): Promise<boolean> => {
    const api = getRegistryApi();
    if (!api?.save) {
      setState({ registryError: "Registry API unavailable" });
      return false;
    }
    try {
      const payload: RegistrySaveRequest = JSON.parse(JSON.stringify(registry));
      const response: RegistrySaveResponse = await api.save(payload);
      if (!response || response.ok === false) {
        setState({ registryError: response?.error || "Failed to save registry" });
        return false;
      }
      await fetchRegistry();
      return true;
    } catch (error) {
      setState({ registryError: error instanceof Error ? error.message : String(error) });
      return false;
    }
  };

  const applyRegistryChange = async () => {
    await fetchRegistry();
  };

  return {
    state: {
      registryClients: [],
      registryLoading: false,
      registryError: null
    } as RegistrySlice,
    actions: {
      fetchRegistry,
      saveRegistry,
      applyRegistryChange
    } as RegistrySliceActions
  };
};

