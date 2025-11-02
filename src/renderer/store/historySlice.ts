import { StateCreator } from "zustand";
import type { Thread, Message, SearchQuery, SearchResult } from "../../shared/types/history";

export interface HistorySlice {
  historyThreads: Thread[];
  historySelectedThreadId: string | null;
  historyThreadMessages: Message[];
  historyThreadTotal: number;
  historyLoading: boolean;
  historyError: string | null;
  historySearchResult: SearchResult | null;
  historyIngesting: boolean;
  historyIngestError: string | null;
  historyLastIngest: {
    added: number;
    at: string;
    threadId: string;
    source: { tabId: string; adapterId: string };
  } | null;
}

export interface HistoryActions {
  refreshHistoryThreads: () => Promise<void>;
  openHistoryThread: (threadId: string, options?: { limit?: number; offset?: number }) => Promise<void>;
  searchHistory: (query: SearchQuery, paging?: { limit?: number; offset?: number }) => Promise<void>;
  clearHistoryError: () => void;
  addHistoryMessage: (message: Message) => void;
  ingestFromTab: (payload: {
    tabId: string;
    adapterId: string;
    threadId?: string;
    limit?: number;
  }) => Promise<{ added: number; threadId: string } | null>;
}

const getHistoryApi = () => window.historyHub;

export const createHistorySlice = <
  T extends HistorySlice & { actions: HistoryActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setState = (partial: Partial<HistorySlice>) => {
    set(partial as Partial<T>);
  };

  const refreshHistoryThreads = async () => {
    const api = getHistoryApi();
    if (!api?.listThreads) {
      setState({
        historyError: "History API unavailable"
      });
      return;
    }
    setState({
      historyLoading: true,
      historyError: null
    });
    try {
      const response = await api.listThreads();
      if (!response || response.ok === false) {
        setState({
          historyLoading: false,
          historyError: response?.error || "Failed to load history threads"
        });
        return;
      }
      setState({
        historyLoading: false,
        historyThreads: response.threads || []
      });
    } catch (error) {
      setState({
        historyLoading: false,
        historyError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const openHistoryThread: HistoryActions["openHistoryThread"] = async (threadId, options) => {
    const api = getHistoryApi();
    if (!api?.getThreadMessages) {
      setState({
        historyError: "History API unavailable"
      });
      return;
    }
    try {
      const response = await api.getThreadMessages({
        threadId,
        limit: options?.limit,
        offset: options?.offset
      });
      if (!response || response.ok === false) {
        setState({
          historyError: response?.error || "Failed to load thread messages"
        });
        return;
      }
      setState({
        historySelectedThreadId: threadId,
        historyThreadMessages: response.messages || [],
        historyThreadTotal: Array.isArray(response.messages) ? response.messages.length : 0
      });
    } catch (error) {
      setState({
        historyError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const searchHistory: HistoryActions["searchHistory"] = async (query, paging) => {
    const api = getHistoryApi();
    if (!api?.search) {
      setState({
        historyError: "History API unavailable"
      });
      return;
    }
    setState({
      historyLoading: true,
      historyError: null
    });
    try {
      const response = await api.search(query || {}, paging);
      if (!response || response.ok === false) {
        setState({
          historyLoading: false,
          historyError: response?.error || "Search failed"
        });
        return;
      }
      setState({
        historyLoading: false,
        historySearchResult: response.result || { messages: [], total: 0 }
      });
    } catch (error) {
      setState({
        historyLoading: false,
        historyError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const clearHistoryError = () => {
    setState({
      historyError: null
    });
  };

  const addHistoryMessage: HistoryActions["addHistoryMessage"] = (message) => {
    set((state) => {
      if (!message || typeof message !== "object") {
        return {} as Partial<T>;
      }
      const updates: Partial<HistorySlice> = {};
      if (state.historySelectedThreadId === message.threadId) {
        updates.historyThreadMessages = [
          ...state.historyThreadMessages,
          message
        ];
        updates.historyThreadTotal = state.historyThreadTotal + 1;
      }
      return updates as Partial<T>;
    });
  };

  const ingestFromTab: HistoryActions["ingestFromTab"] = async (payload) => {
    const api = getHistoryApi();
    if (!api?.ingestLast) {
      setState({
        historyIngestError: "History ingest API unavailable"
      });
      return null;
    }
    if (!payload || typeof payload !== "object") {
      setState({
        historyIngestError: "Ingest payload is invalid"
      });
      return null;
    }
    const params = {
      tabId: payload.tabId,
      adapterId: payload.adapterId,
      threadId: payload.threadId,
      limit: payload.limit
    };
    setState({
      historyIngesting: true,
      historyIngestError: null
    });
    try {
      const response = await api.ingestLast(params);
      if (!response || response.ok === false || !response.threadId) {
        setState({
          historyIngesting: false,
          historyIngestError: response?.error || "Failed to ingest history"
        });
        return null;
      }
      const added = response.added ?? 0;
      const threadId = response.threadId;
      setState({
        historyIngesting: false,
        historyLastIngest: {
          added,
          at: new Date().toISOString(),
          threadId,
          source: {
            tabId: params.tabId,
            adapterId: params.adapterId
          }
        }
      });
      await refreshHistoryThreads();
      await openHistoryThread(threadId, { limit: params.limit });
      return { added, threadId };
    } catch (error) {
      setState({
        historyIngesting: false,
        historyIngestError: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  };

  return {
    state: {
      historyThreads: [],
      historySelectedThreadId: null,
      historyThreadMessages: [],
      historyThreadTotal: 0,
      historyLoading: false,
      historyError: null,
      historySearchResult: null,
      historyIngesting: false,
      historyIngestError: null,
      historyLastIngest: null
    } as HistorySlice,
    actions: {
      refreshHistoryThreads,
      openHistoryThread,
      searchHistory,
      clearHistoryError,
      addHistoryMessage,
      ingestFromTab
    } as HistoryActions
  };
};
