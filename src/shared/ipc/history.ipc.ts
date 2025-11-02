import type { Message, Thread, SearchQuery, SearchResult } from "../types/history";

export const IPC_HISTORY_THREAD_CREATE = "history:thread:create";
export const IPC_HISTORY_MESSAGE_ADD = "history:message:add";
export const IPC_HISTORY_THREAD_LIST = "history:thread:list";
export const IPC_HISTORY_THREAD_MESSAGES = "history:thread:messages";
export const IPC_HISTORY_SEARCH = "history:search";
export const IPC_HISTORY_INGEST_LAST = "history:ingest:last";

export interface HistoryErrorResponse {
  ok: false;
  error: string;
  details?: string;
}

export interface HistoryThreadCreateResponse {
  ok: true;
  thread: Thread;
}

export interface HistoryMessageAddResponse {
  ok: true;
}

export interface HistoryThreadListResponse {
  ok: true;
  threads: Thread[];
}

export interface HistoryThreadMessagesRequest {
  threadId: string;
  limit?: number;
  offset?: number;
}

export interface HistoryThreadMessagesResponse {
  ok: true;
  messages: Message[];
}

export interface HistorySearchRequest extends SearchQuery {
  limit?: number;
  offset?: number;
}

export interface HistorySearchResponse {
  ok: true;
  result: SearchResult;
}

export interface HistoryIngestLastRequest {
  tabId: string;
  adapterId: string;
  threadId?: string;
}

export interface HistoryIngestLastResponse {
  ok: true;
  added: number;
  threadId: string;
}

export type HistoryResponse =
  | HistoryThreadCreateResponse
  | HistoryMessageAddResponse
  | HistoryThreadListResponse
  | HistoryThreadMessagesResponse
  | HistorySearchResponse
  | HistoryIngestLastResponse
  | HistoryErrorResponse;
