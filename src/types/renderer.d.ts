export {};

type UnsubscribeFn = () => void;

interface ChatChunkEvent {
  requestId: string;
  delta: string;
  conversationId?: string;
}

interface ChatDoneEvent {
  requestId: string;
  usage?: Record<string, unknown>;
  finishReason?: "stop" | "length";
  conversationId?: string;
}

interface ChatErrorEvent {
  requestId: string;
  code: string;
  message?: string;
}

interface ChatRetryEvent {
  requestId: string;
  attempt: number;
  maxAttempts: number;
}

interface ChatMessagePayload {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  ts: number;
  meta?: Record<string, unknown>;
}

interface ChatRequestOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: Record<string, unknown>;
  extraHeaders?: Record<string, string>;
  stream?: boolean;
  assistantMessageId?: string;
  userMessageId?: string;
  isRetry?: boolean;
  maxRetries?: number;
  baseDelayMs?: number;
}

interface ChatConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model?: string | null;
  profile?: string | null;
  messageCount?: number;
}

interface ChatHistoryResult {
  conversation: ChatConversationSummary | null;
  messages: ChatMessagePayload[];
}

interface ChatApi {
  send: (
    conversationId: string,
    messages: ChatMessagePayload[],
    options?: ChatRequestOptions
  ) => Promise<{ requestId: string; conversationId: string }>;
  abort: (requestId: string) => void;
  getConversations: () => Promise<ChatConversationSummary[]>;
  getHistory: (
    conversationId: string,
    cursor?: string,
    limit?: number
  ) => Promise<ChatHistoryResult>;
  createConversation: (title?: string) => Promise<ChatConversationSummary>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  onChunk?: (cb: (event: ChatChunkEvent) => void) => UnsubscribeFn;
  onDone?: (cb: (event: ChatDoneEvent) => void) => UnsubscribeFn;
  onError?: (cb: (event: ChatErrorEvent) => void) => UnsubscribeFn;
  onRetry?: (cb: (event: ChatRetryEvent) => void) => UnsubscribeFn;
}

interface CompletionsProfilePayload {
  name: string;
  driver: "openai-compatible";
  baseUrl: string;
  defaultModel: string;
  headers?: Record<string, string>;
  request?: {
    stream?: boolean;
    timeoutMs?: number;
  };
  auth: {
    scheme: "Bearer" | "Basic";
    tokenRef: string;
    hasToken: boolean;
  };
}

interface CompletionsStatePayload {
  active: string;
  profiles: CompletionsProfilePayload[];
}

interface CompletionsTestResult {
  success: boolean;
  preview?: string;
  usage?: Record<string, unknown>;
  finishReason?: string;
  code?: string;
  message?: string;
}

interface CompletionsApi {
  getProfiles: () => Promise<CompletionsStatePayload>;
  saveProfiles: (state: CompletionsStatePayload) => Promise<CompletionsStatePayload>;
  setActive: (name: string) => Promise<CompletionsStatePayload>;
  testProfile: (name: string) => Promise<CompletionsTestResult>;
}

declare global {
  interface Window {
    api?: {
      tabs: {
        createOrFocus: (serviceId: string) => Promise<void>;
        switch: (tabId: string) => Promise<void>;
        close: (tabId: string) => Promise<void>;
        list: () => Promise<any>;
        focusLocal: () => Promise<void>;
      };
      prompts: {
        list: () => Promise<any>;
        add: (input: { title: string; body: string }) => Promise<any>;
        remove: (id: string) => Promise<any>;
      };
      clipboard: {
        copy: (text: string) => Promise<void>;
      };
      layout: {
        setDrawer: (width: number) => Promise<void>;
        setTopInset: (height: number) => Promise<void>;
      };
      promptRouter: {
        getAgents: () => Promise<any>;
        broadcast: (payload: { text: string; agents: string[] }) => Promise<void>;
        getHistory: () => Promise<string[]>;
        saveToHistory: (text: string) => Promise<void>;
      };
    };
    chat?: ChatApi;
    completions?: CompletionsApi;
    aiDock?: {
      saveChatMarkdown: () => Promise<void>;
    };
  }
}
