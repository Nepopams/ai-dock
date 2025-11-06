export {};

import type { ServiceClient, ServiceRegistryFile } from "../shared/types/registry";
import type { RegistryListResponse, RegistrySaveResponse } from "../shared/ipc/contracts";
import type { PromptTemplate, PromptHistoryEntry } from "../shared/types/templates";
import type { MediaPreset } from "../shared/types/mediaPresets";
import type { Thread as HistoryThread, Message as HistoryMessage, SearchQuery as HistorySearchQuery, SearchResult as HistorySearchResult } from "../shared/types/history";
import type {
  TemplatesListResponse,
  TemplatesSaveResponse,
  TemplatesExportResponse,
  TemplatesImportResponse,
  HistoryListResponse,
  HistoryMutateResponse
} from "../shared/ipc/templates.ipc";
import type { JudgeInput, JudgeResult, JudgeExportPayload } from "../shared/types/judge";
import type { JudgeRunResponse, JudgeProgressEvent } from "../shared/ipc/judge.ipc";
import type { ExportResponse } from "../shared/ipc/export.ipc";
import type {
  MediaPresetsListResponse,
  MediaPresetsSaveResponse,
  MediaPresetsExportResponse,
  MediaPresetsImportResponse
} from "../shared/ipc/mediaPresets.ipc";
import type {
  FormProfilesListRes,
  FormProfilesSaveReq,
  FormProfilesSaveRes,
  FormProfilesDeleteReq,
  FormProfilesDeleteRes,
  FormProfilesDuplicateReq,
  FormProfilesDuplicateRes,
  FormProfilesTestReq,
  FormProfilesTestRes
} from "../shared/ipc/formProfiles.contracts";
import type {
  RunRes,
  RunSource,
  StreamReq,
  StreamStarted,
  StreamAbortReq,
  StreamDelta,
  StreamDone,
  StreamError,
  StreamStatus
} from "../shared/ipc/formRunner.contracts";

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

type UsagePathMap = {
  prompt_tokens?: string;
  completion_tokens?: string;
  total_tokens?: string;
};

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
  deleteMessage: (conversationId: string, messageId: string) => Promise<boolean>;
  truncateAfter: (conversationId: string, messageId: string) => Promise<boolean>;
  exportMarkdown: (
    conversationId: string
  ) => Promise<{ canceled: boolean; filePath?: string }>;
  onChunk?: (cb: (event: ChatChunkEvent) => void) => UnsubscribeFn;
  onDone?: (cb: (event: ChatDoneEvent) => void) => UnsubscribeFn;
  onError?: (cb: (event: ChatErrorEvent) => void) => UnsubscribeFn;
  onRetry?: (cb: (event: ChatRetryEvent) => void) => UnsubscribeFn;
}

interface GenericHttpResponseSchema {
  mode: "stream" | "buffer";
  stream?: {
    framing: "sse" | "ndjson" | "lines";
    pathDelta?: string;
    pathFinish?: string;
    pathUsage?: UsagePathMap;
  };
  buffer?: {
    pathText: string;
    pathFinish?: string;
    pathUsage?: UsagePathMap;
  };
}

interface GenericHttpConfigPayload {
  endpoint: string;
  method: "POST" | "GET";
  requestTemplate?: {
    headers?: Record<string, string>;
    body?: any;
  };
  responseSchema: GenericHttpResponseSchema;
}

interface CompletionsProfilePayload {
  name: string;
  driver: "openai-compatible" | "generic-http";
  baseUrl: string;
  defaultModel: string;
  headers?: Record<string, string>;
  request?: {
    stream?: boolean;
    timeoutMs?: number;
  };
  auth?: {
    scheme: "Bearer" | "Basic";
    tokenRef?: string;
    hasToken?: boolean;
  };
  generic?: GenericHttpConfigPayload;
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

interface FormProfilesApi {
  list: () => Promise<FormProfilesListRes>;
  save: (req: FormProfilesSaveReq) => Promise<FormProfilesSaveRes>;
  delete: (req: FormProfilesDeleteReq) => Promise<FormProfilesDeleteRes>;
  duplicate: (req: FormProfilesDuplicateReq) => Promise<FormProfilesDuplicateRes>;
  test: (req: FormProfilesTestReq) => Promise<FormProfilesTestRes>;
}

interface FormRunnerApi {
  runSync: (
    source: RunSource,
    options?: {
      connectTimeoutMs?: number;
      totalTimeoutMs?: number;
    }
  ) => Promise<RunRes>;
  stream: {
    start: (req: StreamReq) => Promise<StreamStarted>;
    abort: (req: StreamAbortReq) => Promise<{ ok: true }>;
    onDelta: (cb: (ev: StreamDelta) => void) => UnsubscribeFn;
    onDone: (cb: (ev: StreamDone) => void) => UnsubscribeFn;
    onError: (cb: (ev: StreamError) => void) => UnsubscribeFn;
    onStatus: (cb: (ev: StreamStatus) => void) => UnsubscribeFn;
  };
}

interface MediaPresetsApi {
  list: () => Promise<MediaPresetsListResponse>;
  save: (presets: MediaPreset[]) => Promise<MediaPresetsSaveResponse>;
  export: (filePath?: string) => Promise<MediaPresetsExportResponse>;
  import: (
    options?: { filePath?: string; mergeById?: boolean; duplicateStrategy?: "overwrite" | "copy" }
  ) => Promise<MediaPresetsImportResponse>;
}

interface TemplatesApi {
  list: () => Promise<TemplatesListResponse>;
  save: (
    payload:
      | { templates: PromptTemplate[] }
      | PromptTemplate[]
  ) => Promise<TemplatesSaveResponse>;
  export: () => Promise<TemplatesExportResponse>;
  import: () => Promise<TemplatesImportResponse>;
  history: {
    list: () => Promise<HistoryListResponse>;
    append: (entry: PromptHistoryEntry) => Promise<HistoryMutateResponse>;
    clear: () => Promise<HistoryMutateResponse>;
  };
}

interface HistoryApi {
  createThread: (title?: string) => Promise<{ ok: boolean; thread?: HistoryThread; error?: string }>;
  addMessage: (message: HistoryMessage) => Promise<{ ok: boolean; error?: string }>;
  listThreads: () => Promise<{ ok: boolean; threads?: HistoryThread[]; error?: string }>;
  getThreadMessages: (
    payload: { threadId: string; limit?: number; offset?: number }
  ) => Promise<{ ok: boolean; messages?: HistoryMessage[]; error?: string }>;
  search: (
    query: HistorySearchQuery,
    paging?: { limit?: number; offset?: number }
  ) => Promise<{ ok: boolean; result?: HistorySearchResult; error?: string }>;
  ingestLast: (
    payload: { tabId: string; adapterId: string; threadId?: string; limit?: number }
  ) => Promise<{ ok: boolean; added?: number; threadId?: string; error?: string; details?: string }>;
}

interface JudgeApi {
  run: (input: JudgeInput) => Promise<JudgeRunResponse>;
  onProgress: (cb: (event: JudgeProgressEvent) => void) => UnsubscribeFn;
}

interface ExporterApi {
  judgeMarkdown: (payload: JudgeExportPayload) => Promise<ExportResponse>;
  judgeJson: (payload: JudgeExportPayload) => Promise<ExportResponse>;
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
      registry?: {
        list: () => Promise<RegistryListResponse>;
        save: (registry: ServiceRegistryFile) => Promise<RegistrySaveResponse>;
        watch: (callback: () => void) => UnsubscribeFn;
      };
      __registryWatchCleanup?: () => void;
      promptRouter: {
        getAgents: () => Promise<any>;
        broadcast: (payload: { text: string; agents: string[] }) => Promise<void>;
        getHistory: () => Promise<string[]>;
        saveToHistory: (text: string) => Promise<void>;
      };
    };
    chat?: ChatApi;
    completions?: CompletionsApi;
    formProfiles?: FormProfilesApi;
    formRunner?: FormRunnerApi;
    mediaPresets?: MediaPresetsApi;
    templates?: TemplatesApi;
    judge?: JudgeApi;
    historyHub?: HistoryApi;
    exporter?: ExporterApi;
    aiDock?: {
      saveChatMarkdown: () => Promise<void>;
    };
  }
}




