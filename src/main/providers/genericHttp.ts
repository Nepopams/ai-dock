import type { CompletionsProfile } from "../services/settings";

export interface GenericChunk {
  delta?: string;
  usage?: Record<string, unknown>;
  finishReason?: string;
}

const runtime = require("./genericHttp.js") as {
  send: (
    messages: Array<{ role: string; content: string }>,
    options: Record<string, unknown>,
    profile: CompletionsProfile & {
      auth?: { scheme?: "Bearer" | "Basic"; tokenRef?: string; token?: string };
    },
    abortSignal?: AbortSignal
  ) => AsyncGenerator<GenericChunk, { usage?: Record<string, unknown>; finishReason?: string } | void, void>;
};

export const send = runtime.send;
