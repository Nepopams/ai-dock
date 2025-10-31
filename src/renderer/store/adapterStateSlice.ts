import { StateCreator } from "zustand";
import {
  AdapterError,
  AdapterId,
  IAgentAdapter,
  AdapterSelectors
} from "../adapters/IAgentAdapter";
import { getAdapterById, updateAdapterOverrides } from "../adapters/adapters";

export interface AdapterTabState {
  adapterId: AdapterId | null;
  ready: boolean;
  checking: boolean;
  lastError?: string;
  lastCheckAt?: string;
}

export interface AdapterStateSlice {
  adapterStateByTab: Record<string, AdapterTabState>;
}

export interface AdapterStateActions {
  clearAdapterState(tabId?: string): void;
  setAdapterOverride(serviceId: string, adapterId: AdapterId, selectors?: Partial<AdapterSelectors>): void;
  checkAdapterReady(tabId: string, serviceId: string | null): Promise<boolean>;
  setAdapterError(tabId: string, error: string): void;
}

type BoundState<T> = T & { actions: AdapterStateActions };

const getInitialState = (): AdapterStateSlice => ({
  adapterStateByTab: {}
});

const touchState = (state: AdapterTabState | undefined, adapterId: AdapterId | null): AdapterTabState => {
  return (
    state || {
      adapterId,
      ready: false,
      checking: false,
      lastError: undefined,
      lastCheckAt: undefined
    }
  );
};

export const createAdapterStateSlice = <
  T extends AdapterStateSlice & { actions: AdapterStateActions }
>(
  set: (
    partial: Partial<T> | ((state: T) => Partial<T>),
    replace?: boolean,
    action?: string
  ) => void,
  get: () => T
): { state: AdapterStateSlice; actions: AdapterStateActions } => {
  const clearAdapterState = (tabId?: string) => {
    if (!tabId) {
      set((state) => ({
        adapterStateByTab: {}
      }));
      return;
    }
    set((state) => {
      const next = { ...state.adapterStateByTab };
      delete next[tabId];
      return { adapterStateByTab: next };
    });
  };

  const setAdapterOverride = (serviceId: string, adapterId: AdapterId, selectors?: Partial<AdapterSelectors>) => {
    if (!serviceId || !adapterId) {
      return;
    }
    updateAdapterOverrides(adapterId, selectors);
    set((state) => {
      const next = { ...state.adapterStateByTab };
      Object.entries(next).forEach(([tabId, entry]) => {
        if (entry.adapterId === adapterId) {
          next[tabId] = {
            ...entry,
            ready: false,
            lastError: undefined,
            lastCheckAt: undefined
          };
        }
      });
      return { adapterStateByTab: next };
    });
  };

  const setAdapterError = (tabId: string, error: string) => {
    if (!tabId) {
      return;
    }
    set((state) => {
      const current = touchState(state.adapterStateByTab[tabId], null);
      return {
        adapterStateByTab: {
          ...state.adapterStateByTab,
          [tabId]: {
            ...current,
            ready: false,
            checking: false,
            lastError: error,
            lastCheckAt: new Date().toISOString()
          }
        }
      };
    });
  };

  const checkAdapterReady = async (tabId: string, serviceId: string | null): Promise<boolean> => {
    if (!tabId || !serviceId) {
      setAdapterError(tabId, "Service is not attached to tab");
      return false;
    }

    const registryClients = (get() as BoundState<T>).registryClients || [];
    const client = registryClients.find((item: { id: string }) => item.id === serviceId);
    if (!client || !client.adapterId) {
      setAdapterError(tabId, "Adapter not configured");
      return false;
    }

    const adapterId = client.adapterId as AdapterId;
    let adapter: IAgentAdapter;
    try {
      adapter = getAdapterById(adapterId);
    } catch (error) {
      setAdapterError(tabId, error instanceof Error ? error.message : String(error));
      return false;
    }

    set((state) => ({
      adapterStateByTab: {
        ...state.adapterStateByTab,
        [tabId]: {
          ...touchState(state.adapterStateByTab[tabId], adapterId),
          checking: true,
          lastError: undefined
        }
      }
    }));

    try {
      const ready = await adapter.ready({ tabId });
      set((state) => ({
        adapterStateByTab: {
          ...state.adapterStateByTab,
          [tabId]: {
            adapterId,
            ready,
            checking: false,
            lastError: ready ? undefined : "Adapter not ready",
            lastCheckAt: new Date().toISOString()
          }
        }
      }));
      return ready;
    } catch (error) {
      const message =
        error instanceof AdapterError
          ? `${error.code}: ${error.message}`
          : error instanceof Error
            ? error.message
            : String(error);
      set((state) => ({
        adapterStateByTab: {
          ...state.adapterStateByTab,
          [tabId]: {
            adapterId,
            ready: false,
            checking: false,
            lastError: message,
            lastCheckAt: new Date().toISOString()
          }
        }
      }));
      return false;
    }
  };

  return {
    state: getInitialState(),
    actions: {
      clearAdapterState,
      setAdapterOverride,
      checkAdapterReady,
      setAdapterError
    }
  };
};
