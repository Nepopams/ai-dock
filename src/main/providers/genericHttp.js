const { TextDecoder } = require("util");

const decoder = new TextDecoder();

const toArrayPath = (path) =>
  typeof path === "string"
    ? path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .map((segment) => segment.trim())
        .filter(Boolean)
    : [];

const getByPath = (target, path) => {
  if (!target || !path) {
    return undefined;
  }
  const segments = toArrayPath(path);
  let current = target;
  for (const segment of segments) {
    if (current == null) {
      return undefined;
    }
    current = current[segment];
  }
  return current;
};

const buildUsageObject = (payload, usagePaths) => {
  if (!usagePaths) {
    return undefined;
  }
  const usage = {};
  for (const key of ["prompt_tokens", "completion_tokens", "total_tokens"]) {
    if (usagePaths[key]) {
      const value = getByPath(payload, usagePaths[key]);
      if (typeof value === "number") {
        usage[key] = value;
      }
    }
  }
  return Object.keys(usage).length ? usage : undefined;
};

const renderTemplateValue = (value, context) => {
  if (typeof value === "string") {
    if (value === "{{messages[]}}") {
      return context.messagesArray;
    }
    if (value === "{{messages:role}}") {
      return context.messagesArray.map((msg) => msg.role);
    }
    if (value === "{{messages:content}}") {
      return context.messagesArray.map((msg) => msg.content);
    }
    if (value === "{{model}}") {
      return context.model;
    }
    if (value === "{{temperature}}") {
      return context.temperature;
    }
    if (value === "{{max_tokens}}") {
      return context.maxTokens;
    }
    if (value === "{{stream}}") {
      return context.stream;
    }
    let rendered = value;
    const replacements = {
      "{{model}}": context.model,
      "{{temperature}}":
        context.temperature === undefined || context.temperature === null
          ? ""
          : String(context.temperature),
      "{{max_tokens}}":
        context.maxTokens === undefined || context.maxTokens === null
          ? ""
          : String(context.maxTokens),
      "{{stream}}": String(Boolean(context.stream)),
      "{{messages:role}}": context.messagesArray.map((msg) => msg.role).join("\n"),
      "{{messages:content}}": context.messagesArray.map((msg) => msg.content).join("\n")
    };
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      if (rendered.includes(placeholder)) {
        rendered = rendered.replace(
          new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          replacement
        );
      }
    }
    if (rendered === "true") {
      return true;
    }
    if (rendered === "false") {
      return false;
    }
    return rendered;
  }
  if (Array.isArray(value)) {
    return value.map((item) => renderTemplateValue(item, context));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, renderTemplateValue(child, context)])
    );
  }
  return value;
};

const renderTemplateBody = (template, context) => {
  if (template === undefined) {
    return undefined;
  }
  return renderTemplateValue(template, context);
};

const buildRequestInit = (profile, options, context, combinedSignal) => {
  const headers = {
    ...(profile.headers || {}),
    ...(profile.generic?.requestTemplate?.headers || {}),
    ...(options?.extraHeaders || {})
  };
  if (context.token) {
    headers.Authorization = `${context.scheme || "Bearer"} ${context.token}`;
  }
  const body = renderTemplateBody(profile.generic?.requestTemplate?.body, context);
  const method = profile.generic?.method || "POST";
  const init = {
    method,
    headers,
    signal: combinedSignal
  };
  if (method === "GET") {
    return { init, body, method };
  }
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }
  return { init, body, method };
};

const createSegmentExtractor = (framing) => {
  if (framing === "lines" || framing === "ndjson") {
    return (buffer, flush = false) => {
      const parts = buffer.split(/\r?\n/);
      if (!flush) {
        const remainder = parts.pop() ?? "";
        return { segments: parts.filter(Boolean), remainder };
      }
      return { segments: parts.filter(Boolean), remainder: "" };
    };
  }
  // SSE
  return (buffer, flush = false) => {
    const segments = buffer.split(/\r?\n\r?\n/);
    if (!flush) {
      const remainder = segments.pop() ?? "";
      return { segments, remainder };
    }
    return { segments, remainder: "" };
  };
};

const parseSseSegment = (segment) => {
  const lines = segment.split(/\r?\n/);
  const dataLines = [];
  for (const line of lines) {
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (!dataLines.length) {
    return null;
  }
  const data = dataLines.join("\n");
  if (!data || data === "[DONE]") {
    return null;
  }
  return data;
};

const parseStreamPayload = (raw, framing) => {
  if (framing === "lines") {
    return { type: "text", value: raw };
  }
  const source = framing === "sse" ? parseSseSegment(raw) : raw;
  if (!source) {
    return null;
  }
  try {
    return { type: "json", value: JSON.parse(source) };
  } catch {
    return framing === "lines" ? { type: "text", value: source } : null;
  }
};

const extractStreamResult = (payload, schema) => {
  if (!payload) {
    return {};
  }
  const result = {};
  if (payload.type === "json") {
    const json = payload.value;
    const delta = schema.pathDelta ? getByPath(json, schema.pathDelta) : undefined;
    if (delta !== undefined) {
      result.delta = typeof delta === "string" ? delta : JSON.stringify(delta);
    }
    const finish = schema.pathFinish ? getByPath(json, schema.pathFinish) : undefined;
    if (finish !== undefined) {
      result.finishReason = finish;
    }
    const usage = buildUsageObject(json, schema.pathUsage);
    if (usage) {
      result.usage = usage;
    }
  } else if (payload.type === "text") {
    result.delta = payload.value;
  }
  return result;
};

const buildBufferResult = (json, schema) => {
  const text = getByPath(json, schema.pathText);
  const finish = schema.pathFinish ? getByPath(json, schema.pathFinish) : undefined;
  const usage = buildUsageObject(json, schema.pathUsage);
  return {
    content:
      typeof text === "string"
        ? text
        : text === undefined || text === null
          ? ""
          : JSON.stringify(text),
    finishReason: finish,
    usage
  };
};

const toBoolean = (value, fallback) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return fallback;
};

/**
 * @param {Array} messages
 * @param {Record<string, any>} options
 * @param {import("../services/settings").CompletionsProfile & { auth?: { tokenRef?: string, scheme?: "Bearer" | "Basic", token?: string }}} profile
 * @param {AbortSignal} abortSignal
 */
async function* send(messages, options, profile, abortSignal) {
  if (!profile.generic) {
    throw new Error("Profile does not include generic-http configuration");
  }

  const streamPreference =
    typeof options?.stream === "boolean"
      ? options.stream
      : profile.request?.stream ?? true;
  const context = {
    model: options?.model || profile.defaultModel,
    temperature: options?.temperature,
    maxTokens: options?.max_tokens,
    stream: streamPreference,
    messagesArray: (Array.isArray(messages) ? messages : []).map((message) => ({
      role: message.role,
      content: message.content
    })),
    token: profile.auth?.token,
    scheme: profile.auth?.scheme
  };

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

  const baseUrl = (profile.baseUrl || "").replace(/\/+$/g, "");
  const endpoint = profile.generic.endpoint || "/v1/chat";
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const { init, body, method } = buildRequestInit(profile, options, context, combinedSignal);

  let requestUrl = url;
  if (method === "GET" && body && typeof body === "object") {
    const urlObj = new URL(url, "http://localhost");
    for (const [key, value] of Object.entries(body)) {
      if (value === undefined || value === null) {
        continue;
      }
      urlObj.searchParams.set(key, typeof value === "string" ? value : JSON.stringify(value));
    }
    requestUrl = urlObj.toString().replace("http://localhost", baseUrl || urlObj.origin);
  }

  let response;
  try {
    response = await fetch(requestUrl, init);
  } catch (error) {
    if (timeoutController?.signal.aborted) {
      const err = new Error("Completion request timed out");
      err.code = "timeout";
      throw err;
    }
    if (abortSignal?.aborted) {
      const err = new Error("Request aborted");
      err.code = "aborted";
      throw err;
    }
    const err = new Error(
      typeof error?.message === "string" ? error.message : "Failed to reach completions endpoint"
    );
    err.code = "network_error";
    throw err;
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    const err = new Error(errorText || response.statusText || "Upstream error");
    err.status = response.status;
    err.code = `http_${response.status}`;
    throw err;
  }

  const schema = profile.generic.responseSchema || { mode: "buffer" };

  if (schema.mode === "buffer") {
    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (error) {
      const err = new Error("Failed to parse buffer response as JSON");
      err.code = "invalid_json";
      throw err;
    }
    const result = buildBufferResult(json, schema.buffer || { pathText: "" });
    if (result.content) {
      yield { delta: result.content };
    }
    return {
      usage: result.usage,
      finishReason: result.finishReason
    };
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Upstream response does not support streaming");
  }

  const framing = schema.stream?.framing || "sse";
  const extractSegments = createSegmentExtractor(framing);
  let remainder = "";
  let lastUsage;
  let lastFinish;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      remainder += decoder.decode(value, { stream: true });
      const { segments, remainder: nextRemainder } = extractSegments(remainder, false);
      remainder = nextRemainder;
      for (const segment of segments) {
        const payload = parseStreamPayload(segment, framing);
        if (!payload) {
          continue;
        }
        const extracted = extractStreamResult(payload, schema.stream || {});
        if (extracted.delta !== undefined) {
          yield { delta: extracted.delta };
        }
        if (extracted.finishReason !== undefined) {
          lastFinish = extracted.finishReason;
        }
        if (extracted.usage) {
          lastUsage = extracted.usage;
        }
      }
    }
    if (remainder) {
      const { segments } = extractSegments(remainder, true);
      for (const segment of segments) {
        const payload = parseStreamPayload(segment, framing);
        if (!payload) {
          continue;
        }
        const extracted = extractStreamResult(payload, schema.stream || {});
        if (extracted.delta !== undefined) {
          yield { delta: extracted.delta };
        }
        if (extracted.finishReason !== undefined) {
          lastFinish = extracted.finishReason;
        }
        if (extracted.usage) {
          lastUsage = extracted.usage;
        }
      }
    }
  } catch (error) {
    if (abortSignal?.aborted || error?.name === "AbortError") {
      const abortErr = new Error("Request aborted");
      abortErr.code = "aborted";
      throw abortErr;
    }
    if (timeoutController?.signal.aborted) {
      const timeoutErr = new Error("Completion request timed out");
      timeoutErr.code = "timeout";
      throw timeoutErr;
    }
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
  }

  return {
    usage: lastUsage,
    finishReason: lastFinish
  };
}

module.exports = {
  send
};
