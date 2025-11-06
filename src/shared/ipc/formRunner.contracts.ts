import { FormProfile, HttpMethod } from "../types/form";

export const FORM_RUN_SYNC = "formRunner:runSync";
export const FORM_RUN_STREAM_START = "formRunner:stream:start";
export const FORM_RUN_STREAM_ABORT = "formRunner:stream:abort";
export const FORM_RUN_STREAM_DELTA = "formRunner:stream:delta";
export const FORM_RUN_STREAM_DONE = "formRunner:stream:done";
export const FORM_RUN_STREAM_ERROR = "formRunner:stream:error";
export const FORM_RUN_STREAM_STATUS = "formRunner:stream:status";

export type RunValues = Record<string, string | number | boolean | null | undefined>;

export type RunSource = {
  profile?: FormProfile;
  profileId?: string;
  values: RunValues;
};

export type RunPreview = {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  bodyPreview?: string;
};

export type RunOk = {
  ok: true;
  status: number;
  statusText: string;
  latencyMs: number;
  responseType: "json" | "text" | "empty";
  headers: Record<string, string>;
  bodyText?: string;
  bodyJson?: unknown;
  preview: RunPreview;
};

export type RunErr = {
  ok: false;
  code:
    | "VALIDATION"
    | "NETWORK"
    | "TIMEOUT"
    | "UNAUTHORIZED"
    | "PARSE"
    | "PROVIDER"
    | "UNKNOWN";
  message: string;
  details?: string;
  preview?: RunPreview;
};

export type RunReq = RunSource & {
  connectTimeoutMs?: number;
  totalTimeoutMs?: number;
};

export type RunRes = RunOk | RunErr;

export type StreamReq = RunSource & {
  requestId?: string;
  connectTimeoutMs?: number;
  idleTimeoutMs?: number;
  totalTimeoutMs?: number;
};

export type StreamStarted =
  | { ok: true; requestId: string }
  | {
      ok: false;
      error: string;
      code?: "VALIDATION" | "UNAUTHORIZED" | "UNKNOWN";
    };

export type StreamDelta = {
  requestId: string;
  chunk: string;
};

export type StreamDone = {
  requestId: string;
  status: number;
  statusText: string;
  latencyMs: number;
  headers: Record<string, string>;
  aggregatedText: string;
};

export type StreamError = {
  requestId: string;
  code: "NETWORK" | "TIMEOUT" | "UNAUTHORIZED" | "PARSE" | "PROVIDER" | "UNKNOWN";
  message: string;
  details?: string;
};

export type StreamStatus = {
  requestId: string;
  kind: "heartbeat" | "open" | "closed";
  at: number;
};

export type StreamAbortReq = {
  requestId: string;
};
