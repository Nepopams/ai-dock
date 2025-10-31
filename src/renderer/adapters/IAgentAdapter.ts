export type AdapterId = "chatgpt" | "claude" | "deepseek";

export type AdapterErrorCode =
  | "NOT_READY"
  | "NO_INPUT"
  | "TIMEOUT"
  | "DOM_CHANGED"
  | "NOT_SUPPORTED"
  | "EXECUTION_FAILED"
  | "UNKNOWN";

export interface AdapterSelectors {
  input: string[];
  sendButton?: string[];
  messages?: string[];
  assistantMessage?: string[];
  userMessage?: string[];
}

export interface AdapterCapabilities {
  supportsEnterToSend?: boolean;
  canExportHistory?: boolean;
}

export interface AdapterTimeouts {
  ready?: number;
  insert?: number;
  send?: number;
  read?: number;
}

export interface AdapterConfig {
  selectors: AdapterSelectors;
  capabilities?: AdapterCapabilities;
  timeoutsMs?: AdapterTimeouts;
}

export interface WebAdapterContext {
  tabId: string;
}

export interface AdapterHealthResult {
  ok: boolean;
  details?: string;
}

export class AdapterError extends Error {
  public readonly code: AdapterErrorCode;

  constructor(code: AdapterErrorCode, message?: string) {
    super(message || code);
    this.code = code;
    this.name = "AdapterError";
  }
}

export interface AdapterHistoryEntry {
  role: "user" | "assistant";
  text: string;
  ts?: string;
}

export interface IAgentAdapter {
  readonly id: AdapterId;
  readonly config: AdapterConfig;
  ready(ctx: WebAdapterContext): Promise<boolean>;
  insert(ctx: WebAdapterContext, text: string): Promise<void>;
  send(ctx: WebAdapterContext): Promise<void>;
  readLastAnswer(ctx: WebAdapterContext): Promise<string>;
  exportHistory?(ctx: WebAdapterContext, limit: number): Promise<AdapterHistoryEntry[]>;
  healthCheck(ctx: WebAdapterContext): Promise<AdapterHealthResult>;
}

export type AdapterExecFunction = (...args: unknown[]) => unknown;
