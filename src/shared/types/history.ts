export type MessageRole = "user" | "assistant";

export interface MessageSource {
  clientId: string;
  url?: string;
}

export interface Message {
  id: string;
  threadId: string;
  agentId: string;
  role: MessageRole;
  text: string;
  ts: string;
  source?: MessageSource;
  meta?: Record<string, unknown>;
}

export interface Thread {
  id: string;
  title?: string;
  createdAt: string;
  tags?: string[];
}

export interface SearchQuery {
  q?: string;
  agentId?: string;
  clientId?: string;
  role?: MessageRole;
  dateFrom?: string;
  dateTo?: string;
  tag?: string;
}

export interface SearchResult {
  messages: Message[];
  total: number;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isMessageRole = (value: unknown): value is MessageRole =>
  value === "user" || value === "assistant";

export const isMessage = (value: unknown): value is Message => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.id) || !isString(value.threadId) || !isString(value.agentId)) {
    return false;
  }
  if (!isMessageRole(value.role)) {
    return false;
  }
  if (!isString(value.text) || !isString(value.ts)) {
    return false;
  }
  if (value.source) {
    if (!isObject(value.source) || !isString(value.source.clientId)) {
      return false;
    }
    if (value.source.url !== undefined && !isString(value.source.url)) {
      return false;
    }
  }
  if (value.meta !== undefined && !isObject(value.meta)) {
    return false;
  }
  return true;
};

export const isThread = (value: unknown): value is Thread => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.id) || !isString(value.createdAt)) {
    return false;
  }
  if (value.title !== undefined && !isString(value.title)) {
    return false;
  }
  if (value.tags !== undefined) {
    if (!Array.isArray(value.tags) || value.tags.some((tag) => !isString(tag))) {
      return false;
    }
  }
  return true;
};
