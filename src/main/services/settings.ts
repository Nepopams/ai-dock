export type UsagePathMap = {
  prompt_tokens?: string;
  completion_tokens?: string;
  total_tokens?: string;
};

export interface GenericHttpConfig {
  endpoint: string;
  method: "POST" | "GET";
  requestTemplate?: {
    headers?: Record<string, string>;
    body?: unknown;
  };
  responseSchema: {
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
  };
}

export interface CompletionsProfile {
  name: string;
  driver: "openai-compatible" | "generic-http";
  baseUrl: string;
  defaultModel: string;
  auth?: {
    scheme: "Bearer" | "Basic";
    tokenRef?: string;
  };
  headers?: Record<string, string>;
  request?: {
    stream?: boolean;
    timeoutMs?: number;
  };
  generic?: GenericHttpConfig;
}

export interface CompletionsState {
  active: string;
  profiles: Record<string, CompletionsProfile>;
}

const runtime = require("./settings.js") as {
  loadCompletions: () => Promise<CompletionsState>;
  saveCompletions: (state: CompletionsState) => Promise<void>;
  getActiveProfile: () => Promise<CompletionsProfile>;
  setActiveProfile: (name: string) => Promise<void>;
  secureStoreToken: (plain: string) => Promise<string>;
  secureRetrieveToken: (tokenRef: string) => Promise<string>;
};

export const loadCompletions = runtime.loadCompletions;
export const saveCompletions = runtime.saveCompletions;
export const getActiveProfile = runtime.getActiveProfile;
export const setActiveProfile = runtime.setActiveProfile;
export const secureStoreToken = runtime.secureStoreToken;
export const secureRetrieveToken = runtime.secureRetrieveToken;
