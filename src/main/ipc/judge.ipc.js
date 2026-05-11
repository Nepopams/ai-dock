const { ipcMain } = require("electron");
const { IPC_JUDGE_RUN, IPC_JUDGE_PROGRESS } = require("../../shared/ipc/judge.ipc");
const { runJudge } = require("../services/judgePipeline.js");
const { isJudgeInput } = require("../../shared/types/judge.js");

const ok = (result) => ({
  ok: true,
  result
});

const KNOWN_ERROR_CODES = new Set([
  "invalid_input",
  "profile_not_found",
  "judge_failed",
  "provider_failed",
  "parse_failed",
  "unknown"
]);

const redactSensitiveText = (value) => {
  if (typeof value !== "string" || !value) {
    return undefined;
  }
  return value
    .replace(/(Authorization\s*:\s*(?:Bearer|Basic)\s+)[^\s\r\n]+/gi, "$1[redacted]")
    .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, "$1 [redacted]")
    .replace(/\b(token|api[_-]?key|password|secret)\b\s*[:=]\s*[^\s\r\n]+/gi, "$1=[redacted]")
    .split(/\r?\n/)
    .filter((line) => !/^\s*at\s+/.test(line))
    .join("\n")
    .trim();
};

const normalizeJudgeErrorCode = (error, fallback = "unknown") => {
  const raw = typeof error === "string" ? fallback : error?.code || fallback;
  if (KNOWN_ERROR_CODES.has(raw)) {
    return raw;
  }
  if (raw === "bad_request" || raw === "invalid_json") {
    return "judge_failed";
  }
  if (
    raw === "timeout" ||
    raw === "network_error" ||
    raw === "upstream_error" ||
    raw === "aborted" ||
    String(raw).startsWith("http_")
  ) {
    return "provider_failed";
  }
  return fallback;
};

const sanitizeErrorDetails = (error, details) => {
  const source =
    typeof details === "string" && details.trim()
      ? details
      : typeof error?.details === "string"
        ? error.details
        : undefined;
  return redactSensitiveText(source);
};

const fail = (error, options = {}) => {
  const code = normalizeJudgeErrorCode(error, options.code);
  const message = redactSensitiveText(
    typeof error === "string" ? error : error?.message || "Judge pipeline error"
  ) || "Judge pipeline error";
  const details = sanitizeErrorDetails(error, options.details);
  return {
    ok: false,
    error: message,
    code,
    ...(details ? { details } : {})
  };
};

const sendProgress = (event, payload) => {
  try {
    if (event?.sender && !event.sender.isDestroyed()) {
      event.sender.send(IPC_JUDGE_PROGRESS, payload);
    }
  } catch {
    // ignore progress send failures
  }
};

const registerJudgeIpc = () => {
  ipcMain.handle(IPC_JUDGE_RUN, async (event, payload) => {
    const input = payload?.input;
    if (!isJudgeInput(input)) {
      return fail("Invalid judge input", { code: "invalid_input" });
    }

    sendProgress(event, {
      requestId: input.requestId,
      stage: "queued"
    });

    try {
      sendProgress(event, {
        requestId: input.requestId,
        stage: "running"
      });
      const result = await runJudge(input);
      sendProgress(event, {
        requestId: input.requestId,
        stage: "parsing"
      });
      sendProgress(event, {
        requestId: input.requestId,
        stage: "done"
      });
      return ok(result);
    } catch (error) {
      const code = normalizeJudgeErrorCode(error, "judge_failed");
      sendProgress(event, {
        requestId: input.requestId,
        stage: "failed",
        code
      });
      return fail(error, { code, details: error?.details });
    }
  });
};

module.exports = {
  registerJudgeIpc,
  _private: {
    fail,
    normalizeJudgeErrorCode,
    redactSensitiveText,
    sanitizeErrorDetails
  }
};
