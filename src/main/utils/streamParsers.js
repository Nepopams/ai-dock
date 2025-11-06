const { TextDecoder } = require("node:util");

const decoder = new TextDecoder();

const normalizeLine = (line) => {
  if (line.endsWith("\r")) {
    return line.slice(0, -1);
  }
  return line;
};

const createIdleTimer = (ms, onTimeout) => {
  if (!ms || ms <= 0) {
    return { clear() {}, restart() {} };
  }
  let timer = null;
  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  const restart = () => {
    clear();
    timer = setTimeout(() => {
      timer = null;
      onTimeout?.();
    }, ms);
  };
  return { clear, restart };
};

const readLines = async (reader, onLine, options = {}) => {
  if (!reader || typeof reader.read !== "function") {
    return;
  }
  const idleTimeoutMs = Number.isFinite(options.idleTimeoutMs)
    ? Math.max(0, Number(options.idleTimeoutMs))
    : 0;
  const idleTimer = createIdleTimer(idleTimeoutMs, () => {
    options.onIdleTimeout?.();
  });
  let buffer = "";
  let done = false;
  try {
    // schedule initial idle timer to guard long gaps before first chunk
    idleTimer.restart?.();
    while (!done) {
      const result = await reader.read();
      if (result.done) {
        done = true;
        break;
      }
      if (result.value) {
        idleTimer.restart?.();
        const chunk = decoder.decode(result.value, { stream: true });
        if (chunk) {
          buffer += chunk;
          let newlineIndex = buffer.indexOf("\n");
          while (newlineIndex !== -1) {
            const line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            const normalized = normalizeLine(line);
            if (normalized.length || options.emitEmptyLines) {
              onLine?.(normalized);
            } else if (normalized.length === 0) {
              onLine?.("");
            }
            newlineIndex = buffer.indexOf("\n");
          }
        }
      }
    }
    if (buffer.length) {
      const remaining = normalizeLine(buffer);
      if (remaining.length || options.emitEmptyLines) {
        onLine?.(remaining);
      } else if (remaining.length === 0) {
        onLine?.("");
      }
    }
  } finally {
    idleTimer.clear?.();
    if (typeof reader.releaseLock === "function") {
      try {
        reader.releaseLock();
      } catch {
        // ignore release errors
      }
    }
  }
};

const parseSSELine = (line) => {
  if (!line || typeof line !== "string") {
    return null;
  }
  if (line.startsWith("data:")) {
    return line.slice(5).trimStart();
  }
  return null;
};

const isDoneToken = (value) => value === "[DONE]";

module.exports = {
  readLines,
  parseSSELine,
  isDoneToken
};
