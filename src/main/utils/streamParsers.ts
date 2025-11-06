const runtime = require("./streamParsers.js") as {
  readLines: (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onLine: (line: string) => void,
    options?: { idleTimeoutMs?: number; emitEmptyLines?: boolean; onIdleTimeout?: () => void }
  ) => Promise<void>;
  parseSSELine: (line: string) => string | null;
  isDoneToken: (value: string) => boolean;
};

export const readLines = runtime.readLines;
export const parseSSELine = runtime.parseSSELine;
export const isDoneToken = runtime.isDoneToken;
