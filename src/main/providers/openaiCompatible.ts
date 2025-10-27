import type { CompletionsProfile } from "../services/settings";

export interface OpenAIRequestOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: Record<string, unknown>;
  stream?: boolean;
  extraHeaders?: Record<string, string>;
}

export interface OpenAIChunk {
  delta?: string;
  usage?: Record<string, unknown>;
  finishReason?: string;
}

type RuntimeProfile = CompletionsProfile & { auth: CompletionsProfile["auth"] & { token?: string } };

const runtime = require("./openaiCompatible.js") as {
  send: (
    messages: Array<{ role: string; content: string }>,
    options: OpenAIRequestOptions,
    profile: RuntimeProfile,
    abortSignal: AbortSignal
  ) => AsyncGenerator<OpenAIChunk, { usage?: Record<string, unknown>; finishReason?: string }, void>;
};

export const send = runtime.send;
