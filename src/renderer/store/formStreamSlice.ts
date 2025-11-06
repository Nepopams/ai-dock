import { StateCreator } from "zustand";
import type {
  StreamReq,
  StreamDelta,
  StreamDone,
  StreamError,
  StreamStatus
} from "../../shared/ipc/formRunner.contracts";

export interface FormStreamEntry {
  startedAt: number;
  text: string;
  status?: string;
  running: boolean;
  error?: string;
  lastEventAt?: number;
}

export interface FormStreamSlice {
  formStreamById: Record<string, FormStreamEntry>;
}

export interface FormStreamActions {
  startFormStream: (source: StreamReq) => Promise<string>;
  abortFormStream: (requestId: string) => Promise<void>;
}

let listenersAttached = false;
let detachListeners: (() => void) | null = null;

const ensureListeners = (
  set: StateCreator<FormStreamSlice & { actions: FormStreamActions }>["setState"]
) => {
  if (listenersAttached || typeof window === "undefined") {
    return;
  }
  const api = window.formRunner?.stream;
  if (!api) {
    return;
  }
  const detach = [];
  const updateEntry = (
    requestId: string,
    updater: (entry: FormStreamEntry) => FormStreamEntry | null
  ) => {
    set((state: FormStreamSlice & { actions: FormStreamActions }) => {
      const current = state.formStreamById[requestId];
      if (!current) {
        return {} as Partial<FormStreamSlice>;
      }
      const next = updater(current);
      if (!next) {
        return {} as Partial<FormStreamSlice>;
      }
      return {
        formStreamById: {
          ...state.formStreamById,
          [requestId]: next
        }
      };
    });
  };

  const onDelta = (delta: StreamDelta) => {
    updateEntry(delta.requestId, (entry) => ({
      ...entry,
      text: entry.text + delta.chunk,
      status: "heartbeat",
      lastEventAt: Date.now()
    }));
  };

  const onDone = (done: StreamDone) => {
    updateEntry(done.requestId, (entry) => ({
      ...entry,
      running: false,
      status: `done:${done.status}`,
      lastEventAt: Date.now(),
      text: entry.text.length ? entry.text : done.aggregatedText
    }));
  };

  const onError = (error: StreamError) => {
    updateEntry(error.requestId, (entry) => ({
      ...entry,
      running: false,
      error: error.message,
      status: `error:${error.code}`,
      lastEventAt: Date.now()
    }));
  };

  const onStatus = (status: StreamStatus) => {
    updateEntry(status.requestId, (entry) => ({
      ...entry,
      status: status.kind,
      lastEventAt: Date.now()
    }));
  };

  detach.push(api.onDelta(onDelta));
  detach.push(api.onDone(onDone));
  detach.push(api.onError(onError));
  detach.push(api.onStatus(onStatus));

  detachListeners = () => {
    detach.forEach((unsubscribe) => {
      try {
        unsubscribe?.();
      } catch {
        // ignore
      }
    });
    detachListeners = null;
    listenersAttached = false;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      detachListeners?.();
    });
  }

  listenersAttached = true;
};

export const createFormStreamSlice = <
  T extends FormStreamSlice & { actions: FormStreamActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setState = (partial: Partial<FormStreamSlice>) => {
    set(partial as Partial<T>);
  };

  const startFormStream = async (source: StreamReq): Promise<string> => {
    ensureListeners(set as any);
    const api = window.formRunner?.stream;
    if (!api?.start) {
      throw new Error("Streaming API unavailable");
    }
    const result = await api.start(source);
    if (!result?.ok || !result.requestId) {
      throw new Error(result?.error || "Failed to start stream");
    }
    const requestId = result.requestId;
    const startedAt = Date.now();
    setState({
      formStreamById: {
        ...get().formStreamById,
        [requestId]: {
          startedAt,
          text: "",
          running: true,
          status: "open",
          error: undefined,
          lastEventAt: startedAt
        }
      }
    });
    return requestId;
  };

  const abortFormStream = async (requestId: string) => {
    if (!requestId) {
      return;
    }
    const api = window.formRunner?.stream;
    if (!api?.abort) {
      throw new Error("Streaming API unavailable");
    }
    await api.abort({ requestId });
    set((state: T) => {
      const current = state.formStreamById[requestId];
      if (!current) {
        return {} as Partial<T>;
      }
      return {
        formStreamById: {
          ...state.formStreamById,
          [requestId]: {
            ...current,
            running: false,
            status: "aborted",
            lastEventAt: Date.now()
          }
        }
      } as Partial<T>;
    });
  };

  ensureListeners(set as any);
  return {
    state: {
      formStreamById: {}
    } as FormStreamSlice,
    actions: {
      startFormStream,
      abortFormStream
    } as FormStreamActions
  };
};
