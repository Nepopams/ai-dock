const { TextDecoder } = require("util");

const decoder = new TextDecoder();

/**
 * Normalizes message payload to OpenAI chat format.
 * @param {Array} messages
 */
const normalizeMessages = (messages) =>
  (Array.isArray(messages) ? messages : []).map((message) => ({
    role: typeof message.role === "string" ? message.role : "user",
    content: typeof message.content === "string" ? message.content : ""
  }));

const buildBody = (messages, options, profile) => {
  const payload = {
    model: options?.model || profile.defaultModel,
    messages: normalizeMessages(messages),
    stream: options?.stream ?? profile.request?.stream ?? true
  };
  if (typeof options?.temperature === "number") {
    payload.temperature = options.temperature;
  }
  if (typeof options?.max_tokens === "number") {
    payload.max_tokens = options.max_tokens;
  }
  if (options?.response_format && typeof options.response_format === "object") {
    payload.response_format = options.response_format;
  }
  return payload;
};

const buildHeaders = (profile, token, extraHeaders) => {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers.Authorization = `${profile.auth.scheme} ${token}`;
  }
  if (profile.headers && typeof profile.headers === "object") {
    for (const [key, value] of Object.entries(profile.headers)) {
      if (typeof key === "string" && typeof value === "string") {
        headers[key] = value;
      }
    }
  }
  if (extraHeaders && typeof extraHeaders === "object") {
    for (const [key, value] of Object.entries(extraHeaders)) {
      if (typeof key === "string" && typeof value === "string") {
        headers[key] = value;
      }
    }
  }
  return headers;
};

const buildUrl = (baseUrl) => {
  const trimmed = typeof baseUrl === "string" ? baseUrl.replace(/\/+$/g, "") : "";
  return `${trimmed || "https://api.openai.com/v1"}/chat/completions`;
};

/**
 * @param {string} buffer
 */
const parseSseChunk = (buffer) => {
  const lines = buffer.split(/\r?\n/);
  const events = [];
  let dataLines = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (dataLines.length) {
        events.push(dataLines.join("\n"));
        dataLines = [];
      }
      continue;
    }
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (dataLines.length) {
    events.push(dataLines.join("\n"));
  }
  return events;
};

/**
 * @param {any} payload
 */
const extractPieces = (payload) => {
  const pieces = [];
  if (!payload || typeof payload !== "object") {
    return pieces;
  }
  const choices = Array.isArray(payload.choices) ? payload.choices : [];
  for (const choice of choices) {
    const delta = choice?.delta?.content;
    const finishReason = choice?.finish_reason || choice?.finishReason;
    pieces.push({
      delta: typeof delta === "string" ? delta : undefined,
      finishReason: finishReason || undefined
    });
  }
  return pieces;
};

/**
 * Sends chat completion request to an OpenAI-compatible endpoint.
 * @param {Array} messages
 * @param {Record<string, any>} options
 * @param {import("../services/settings").CompletionsProfile & { auth: { tokenRef: string, scheme: "Bearer" | "Basic", token?: string }}} profile
 * @param {AbortSignal} abortSignal
 */
async function* send(messages, options, profile, abortSignal) {
  const token = profile.auth?.token;
  const url = buildUrl(profile.baseUrl);
  const timeoutMs =
    Number.isFinite(profile.request?.timeoutMs) && profile.request.timeoutMs > 0
      ? Number(profile.request.timeoutMs)
      : undefined;

  const timeoutController =
    timeoutMs && !abortSignal?.aborted ? new AbortController() : null;
  let timeoutId;
  if (timeoutController) {
    timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  }

  const signals = [];
  if (abortSignal) {
    signals.push(abortSignal);
  }
  if (timeoutController) {
    signals.push(timeoutController.signal);
  }
  const combinedSignal =
    signals.length === 0 ? undefined : signals.length === 1 ? signals[0] : AbortSignal.any(signals);

  const requestOptions = {
    method: "POST",
    headers: buildHeaders(profile, token, options?.extraHeaders),
    body: JSON.stringify(buildBody(messages, options, profile)),
    signal: combinedSignal
  };
  let response;
  try {
    response = await fetch(url, requestOptions);
  } catch (error) {
    if (timeoutController && timeoutController.signal.aborted) {
      const err = new Error("Completion request timed out");
      err.code = "timeout";
      throw err;
    }
    if (abortSignal?.aborted) {
      const err = new Error("Request aborted");
      err.code = "aborted";
      throw err;
    }
    const message =
      error && typeof error.message === "string"
        ? error.message
        : "Failed to reach completions endpoint";
    const err = new Error(message);
    err.code = "network_error";
    throw err;
  } finally {
    // intentionally keep timeout active during streaming phase
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    const err = new Error(
      `Upstream error ${response.status}: ${errorText || response.statusText}`
    );
    err.status = response.status;
    err.code = response.status >= 500 ? "upstream_error" : "bad_request";
    throw err;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Upstream response does not support streaming");
  };

  let lastUsage;
  let lastFinishReason;
  let buffer = "";
  let doneStreaming = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const segments = buffer.split(/\r?\n\r?\n/);
      buffer = segments.pop() || "";
      for (const segment of segments) {
        const events = parseSseChunk(segment);
        for (const event of events) {
          if (!event) {
            continue;
          }
          if (event === "[DONE]") {
            doneStreaming = true;
            break;
          }
          let payload;
          try {
            payload = JSON.parse(event);
          } catch (error) {
            continue;
          }
          if (payload.usage) {
            lastUsage = payload.usage;
            yield { usage: payload.usage };
          }
          const pieces = extractPieces(payload);
          for (const piece of pieces) {
            if (piece.delta) {
              yield { delta: piece.delta };
            }
            if (piece.finishReason) {
              lastFinishReason = piece.finishReason;
            }
          }
        }
        if (doneStreaming) {
          break;
        }
      }
      if (doneStreaming) {
        break;
      }
    }
    if (buffer.trim()) {
      const events = parseSseChunk(buffer);
      for (const event of events) {
        if (!event || event === "[DONE]") {
          continue;
        }
        let payload;
        try {
          payload = JSON.parse(event);
        } catch {
          continue;
        }
        if (payload.usage) {
          lastUsage = payload.usage;
          yield { usage: payload.usage };
        }
        const pieces = extractPieces(payload);
        for (const piece of pieces) {
          if (piece.delta) {
            yield { delta: piece.delta };
          }
          if (piece.finishReason) {
            lastFinishReason = piece.finishReason;
          }
        }
      }
    }
  } catch (error) {
    if (abortSignal?.aborted || error?.name === "AbortError") {
      const abortErr = new Error("Request aborted");
      abortErr.code = "aborted";
      throw abortErr;
    }
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    try {
      await reader.cancel();
    } catch {
      // ignore cancel errors
    }
  }

  return {
    usage: lastUsage,
    finishReason: lastFinishReason
  };
}

module.exports = {
  send
};
