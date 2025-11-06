import type {
  RunReq,
  RunRes,
  StreamReq,
  StreamStarted,
  StreamDelta,
  StreamDone,
  StreamError,
  StreamStatus
} from "../../shared/ipc/formRunner.contracts";

const runtime = require("./formRunner.js") as {
  runSync: (req: RunReq) => Promise<RunRes>;
  runStream: (
    req: StreamReq,
    handlers?: {
      onDelta?: (delta: StreamDelta) => void;
      onDone?: (done: StreamDone) => void;
      onError?: (error: StreamError) => void;
      onStatus?: (status: StreamStatus) => void;
    }
  ) => Promise<StreamStarted>;
  abortStream: (requestId: string) => boolean;
};

export const runSync = runtime.runSync as (req: RunReq) => Promise<RunRes>;
export const runStream = runtime.runStream as (
  req: StreamReq,
  handlers?: {
    onDelta?: (delta: StreamDelta) => void;
    onDone?: (done: StreamDone) => void;
    onError?: (error: StreamError) => void;
    onStatus?: (status: StreamStatus) => void;
  }
) => Promise<StreamStarted>;
export const abortStream = runtime.abortStream as (requestId: string) => boolean;
