export interface StoredMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  ts: number;
  meta?: Record<string, unknown>;
}

export interface ConversationRecord {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string | null;
  profile: string | null;
  messages: StoredMessage[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model: string | null;
  profile: string | null;
  messageCount: number;
}

export interface ConversationMessages {
  conversation: Omit<ConversationRecord, "messages"> | null;
  messages: StoredMessage[];
}

export interface HistoryFsModule {
  ensureStorageDir: () => Promise<string>;
  createConversation: (
    title?: string,
    model?: string | null,
    profile?: string | null,
    conversationId?: string
  ) => Promise<ConversationRecord>;
  appendMessage: (conversationId: string, message: StoredMessage) => Promise<StoredMessage>;
  finalizeAssistantMessage: (
    conversationId: string,
    messageId: string,
    content: string,
    metaPatch?: Record<string, unknown>
  ) => Promise<StoredMessage | null>;
  listConversations: () => Promise<ConversationSummary[]>;
  getMessages: (
    conversationId: string,
    cursor?: string,
    limit?: number
  ) => Promise<ConversationMessages>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  safeWrite: (filePath: string, data: unknown) => Promise<void>;
  updateConversationMeta: (
    conversationId: string,
    partial: Partial<ConversationRecord>
  ) => Promise<ConversationRecord>;
  readConversation: (conversationId: string) => Promise<ConversationRecord | null>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<boolean>;
  truncateAfterMessage: (conversationId: string, messageId: string) => Promise<boolean>;
}

const runtime = require("./historyFs.js") as {
  ensureStorageDir: () => Promise<string>;
  createConversation: (
    title?: string,
    model?: string | null,
    profile?: string | null,
    conversationId?: string
  ) => Promise<ConversationRecord>;
  appendMessage: (conversationId: string, message: StoredMessage) => Promise<StoredMessage>;
  finalizeAssistantMessage: (
    conversationId: string,
    messageId: string,
    content: string,
    metaPatch?: Record<string, unknown>
  ) => Promise<StoredMessage | null>;
  listConversations: () => Promise<ConversationSummary[]>;
  getMessages: (
    conversationId: string,
    cursor?: string,
    limit?: number
  ) => Promise<ConversationMessages>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  safeWrite: (filePath: string, data: unknown) => Promise<void>;
  updateConversationMeta: (
    conversationId: string,
    partial: Partial<ConversationRecord>
  ) => Promise<ConversationRecord>;
  readConversation: (conversationId: string) => Promise<ConversationRecord | null>;
  deleteMessage: (conversationId: string, messageId: string) => Promise<boolean>;
  truncateAfterMessage: (conversationId: string, messageId: string) => Promise<boolean>;
};

export const ensureStorageDir = runtime.ensureStorageDir;
export const createConversation = runtime.createConversation;
export const appendMessage = runtime.appendMessage;
export const finalizeAssistantMessage = runtime.finalizeAssistantMessage;
export const listConversations = runtime.listConversations;
export const getMessages = runtime.getMessages;
export const deleteConversation = runtime.deleteConversation;
export const safeWrite = runtime.safeWrite;
export const updateConversationMeta = runtime.updateConversationMeta;
export const readConversation = runtime.readConversation;
export const deleteMessage = runtime.deleteMessage;
export const truncateAfterMessage = runtime.truncateAfterMessage;
