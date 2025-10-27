export interface CompletionsProfile {
  name: string;
  driver: "openai-compatible";
  baseUrl: string;
  defaultModel: string;
  auth: {
    scheme: "Bearer" | "Basic";
    tokenRef: string;
  };
  headers?: Record<string, string>;
  request?: {
    stream?: boolean;
    timeoutMs?: number;
  };
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
