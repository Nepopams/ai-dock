import { StateCreator } from "zustand";
import {
  HistoryListResponse,
  HistoryMutateResponse
} from "../../shared/ipc/templates.ipc";
import { PromptHistoryEntry } from "../../shared/types/templates";

export interface PromptHistorySlice {
  promptHistoryEntries: PromptHistoryEntry[];
  promptHistoryLoading: boolean;
  promptHistoryError: string | null;
}

export interface PromptHistoryActions {
  fetchPromptHistory: () => Promise<void>;
  appendPromptHistory: (entry: PromptHistoryEntry) => Promise<boolean>;
  clearPromptHistory: () => Promise<boolean>;
  getRecentPromptHistory: (limit?: number) => PromptHistoryEntry[];
}

const getTemplatesApi = () => window.templates;

export const createPromptHistorySlice = <
  T extends PromptHistorySlice & { actions: PromptHistoryActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setState = (partial: Partial<PromptHistorySlice>) => {
    set(partial as Partial<T>);
  };

  const getState = (): PromptHistorySlice & { actions: PromptHistoryActions } => {
    return get() as unknown as PromptHistorySlice & { actions: PromptHistoryActions };
  };

  const fetchPromptHistory = async () => {
    const api = getTemplatesApi();
    if (!api?.history?.list) {
      setState({
        promptHistoryLoading: false,
        promptHistoryError: "History API unavailable"
      });
      return;
    }
    setState({ promptHistoryLoading: true, promptHistoryError: null });
    try {
      const response: HistoryListResponse = await api.history.list();
      if (!response || response.ok === false || !Array.isArray(response.data)) {
        setState({
          promptHistoryLoading: false,
          promptHistoryError: response?.error || "Failed to load prompt history"
        });
        return;
      }
      const entries = response.data;
      set((state) => ({
        promptHistoryEntries: entries,
        promptHistoryLoading: false,
        promptHistoryError: null,
        promptHistory: entries.map((entry) => entry.renderedPreview)
      }) as Partial<T>);
    } catch (error) {
      setState({
        promptHistoryLoading: false,
        promptHistoryError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const appendPromptHistory = async (entry: PromptHistoryEntry): Promise<boolean> => {
    const api = getTemplatesApi();
    if (!api?.history?.append) {
      setState({ promptHistoryError: "History API unavailable" });
      return false;
    }
    try {
      const response: HistoryMutateResponse = await api.history.append(entry);
      if (!response || response.ok === false) {
        setState({ promptHistoryError: response?.error || "Failed to append history entry" });
        return false;
      }
      set((state) => {
        const nextEntries = [entry, ...state.promptHistoryEntries].slice(0, 100);
        return {
          promptHistoryEntries: nextEntries,
          promptHistoryError: null,
          promptHistory: nextEntries.map((item) => item.renderedPreview)
        };
      });
      return true;
    } catch (error) {
      setState({ promptHistoryError: error instanceof Error ? error.message : String(error) });
      return false;
    }
  };

  const clearPromptHistory = async (): Promise<boolean> => {
    const api = getTemplatesApi();
    if (!api?.history?.clear) {
      setState({ promptHistoryError: "History API unavailable" });
      return false;
    }
    try {
      const response: HistoryMutateResponse = await api.history.clear();
      if (!response || response.ok === false) {
        setState({ promptHistoryError: response?.error || "Failed to clear history" });
        return false;
      }
      set((state) => ({
        promptHistoryEntries: [],
        promptHistoryError: null,
        promptHistory: []
      }));
      return true;
    } catch (error) {
      setState({ promptHistoryError: error instanceof Error ? error.message : String(error) });
      return false;
    }
  };

  const getRecentPromptHistory = (limit = 10): PromptHistoryEntry[] => {
    const normalized = Number.isFinite(limit) ? Math.max(0, Number(limit)) : 10;
    return getState().promptHistoryEntries.slice(0, normalized || 10);
  };

  return {
    state: {
      promptHistoryEntries: [],
      promptHistoryLoading: false,
      promptHistoryError: null
    } as PromptHistorySlice,
    actions: {
      fetchPromptHistory,
      appendPromptHistory,
      clearPromptHistory,
      getRecentPromptHistory
    } as PromptHistoryActions
  };
};
