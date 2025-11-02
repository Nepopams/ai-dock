import type { Message, Thread, SearchQuery, SearchResult } from "../../shared/types/history";

const runtime = require("./historyStore.js") as {
  createThread: (title?: string) => Promise<Thread>;
  addMessage: (message: Message) => Promise<void>;
  listThreads: () => Thread[];
  getThreadMessages: (threadId: string, limit?: number, offset?: number) => Message[];
  search: (query: SearchQuery, paging?: { limit?: number; offset?: number }) => SearchResult;
};

export const createThread: (title?: string) => Promise<Thread> = runtime.createThread;
export const addMessage: (message: Message) => Promise<void> = runtime.addMessage;
export const listThreads: () => Thread[] = runtime.listThreads;
export const getThreadMessages: (threadId: string, limit?: number, offset?: number) => Message[] =
  runtime.getThreadMessages;
export const search: (
  query: SearchQuery,
  paging?: { limit?: number; offset?: number }
) => SearchResult = runtime.search;
