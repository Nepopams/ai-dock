const { randomUUID } = require("node:crypto");
const { headersToObject, isJsonContent, redactHeaders } = require("../utils/httpHelpers.js");
const { readLines, parseSSELine, isDoneToken } = require("../utils/streamParsers.js");
const { renderTemplate, sanitizePreview } = require("../../shared/utils/formRender.js");
const { loadFormProfiles } = require("./formProfiles.js");
const { secureRetrieveToken } = require("./settings.js");

const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;
const DEFAULT_IDLE_TIMEOUT_MS = 30_000;
const DEFAULT_TOTAL_TIMEOUT_MS = 120_000;

const normalizeMethod = (method) => {
  if (typeof method !== "string") {
    return "GET";
  }
  const upper = method.toUpperCase();
  return ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(upper) ? upper : "GET";
};

const hasAuthHeader = (headers) =>
  Object.keys(headers).some((key) => key.toLowerCase() === "authorization");

const validateProfile = (profile) => {
  if (!profile || typeof profile !== "object") {
    return "Profile is missing";
  }
  if (!profile.baseUrl || typeof profile.baseUrl !== "string" || !profile.baseUrl.trim()) {
    return "Profile baseUrl is required";
  }
  if (!profile.template || typeof profile.template !== "object") {
    return "Profile template is required";
  }
  if (!profile.template.path || typeof profile.template.path !== "string") {
    return "Template path is required";
  }
  if (!profile.schema || !Array.isArray(profile.schema.fields) || !profile.schema.fields.length) {
    return "Profile schema must contain at least one field";
  }
  if (profile.template.bodyKind === "multipart") {
    return "Multipart requests will be implemented in FC-06";
  }
  return null;
};

const buildPreview = (url, method, headers, body) => ({
  url,
  method,
  headers: redactHeaders(headers),
  bodyPreview: sanitizePreview(body)
});

const buildFormBody = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) {
      continue;
    }
    params.append(key, String(value));
  }
  return params.toString();
};

const prepareHttpRequest = async (profile, req, rendered) => {
  const method = normalizeMethod(profile.template.method);
  const requestUrl = rendered.url;

  try {
    // eslint-disable-next-line no-new
    new URL(requestUrl);
  } catch {
    return {
      ok: false,
      error: {
        ok: false,
        code: "VALIDATION",
        message: `Invalid base URL or path: ${requestUrl}`
      }
    };
  }

  const requestHeaders = { ...rendered.result.headers };
  Object.keys(requestHeaders).forEach((key) => {
    if (requestHeaders[key] == null || String(requestHeaders[key]).trim() === "") {
      delete requestHeaders[key];
    }
  });

  let bodyPayload;
  switch (rendered.result.bodyKind) {
    case "json": {
      const payload =
        rendered.result.body === undefined || rendered.result.body === null
          ? {}
          : rendered.result.body;
      bodyPayload = JSON.stringify(payload);
      if (!Object.keys(requestHeaders).some((key) => key.toLowerCase() === "content-type")) {
        requestHeaders["Content-Type"] = "application/json";
      }
      break;
    }
    case "form": {
      const encoded = buildFormBody(rendered.result.body);
      if (encoded === null) {
        return {
          ok: false,
          error: {
            ok: false,
            code: "VALIDATION",
            message: "Form body must be a flat object.",
            preview: buildPreview(requestUrl, method, requestHeaders, rendered.result.body)
          }
        };
      }
      bodyPayload = encoded;
      if (!Object.keys(requestHeaders).some((key) => key.toLowerCase() === "content-type")) {
        requestHeaders["Content-Type"] = "application/x-www-form-urlencoded";
      }
      break;
    }
    case "none":
      bodyPayload = undefined;
      break;
    case "multipart":
      return {
        ok: false,
        error: {
          ok: false,
          code: "VALIDATION",
          message: "Multipart requests will be implemented in FC-06.",
          preview: buildPreview(requestUrl, method, requestHeaders, rendered.result.body)
        }
      };
    default:
      bodyPayload = undefined;
  }

  if (profile.auth?.apiKeyRef && profile.auth.apiKeyRef.trim() && !hasAuthHeader(requestHeaders)) {
    try {
      const token = await secureRetrieveToken(profile.auth.apiKeyRef.trim());
      requestHeaders.Authorization = `Bearer ${token}`;
    } catch (error) {
      return {
        ok: false,
        error: {
          ok: false,
          code: "UNAUTHORIZED",
          message: "Credential not found for the specified apiKeyRef.",
          details: error instanceof Error ? error.message : undefined,
          preview: buildPreview(requestUrl, method, requestHeaders, rendered.result.body)
        }
      };
    }
  }

  const preview = buildPreview(requestUrl, method, requestHeaders, rendered.result.body);

  return {
    ok: true,
    value: {
      method,
      requestUrl,
      requestHeaders,
      bodyPayload,
      preview,
      bodySource: rendered.result.body
    }
  };
};

const createRequestId = (requested) => {
  if (typeof requested === "string" && requested.trim().length) {
    return requested.trim();
  }
  try {
    if (typeof randomUUID === "function") {
      return randomUUID();
    }
  } catch {
    // ignore fall-back to random string
  }
  return `req_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
};

const getTimeout = (value, fallback) => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  return fallback;
};

const safeJsonParse = (input) => {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
};

const readPath = (target, path) => {
  let current = target;
  for (const key of path) {
    if (current == null) {
      return undefined;
    }
    if (typeof key === "number") {
      if (!Array.isArray(current) || current.length <= key) {
        return undefined;
      }
      current = current[key];
    } else {
      current = current[key];
    }
  }
  return current;
};

const extractChunk = (raw) => {
  if (typeof raw !== "string") {
    return "";
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  const parsed = safeJsonParse(trimmed);
  if (!parsed) {
    return trimmed;
  }

  const candidatePaths = [
    ["delta", "content"],
    ["delta", "text"],
    ["delta"],
    ["token"],
    ["content"],
    ["text"],
    ["message", "content"],
    ["message", "text"]
  ];

  const choicePaths = [
    ["choices", 0, "delta", "content"],
    ["choices", 0, "delta", "text"],
    ["choices", 0, "delta"],
    ["choices", 0, "message", "content"],
    ["choices", 0, "message", "text"],
    ["choices", 0, "text"]
  ];

  for (const path of [...candidatePaths, ...choicePaths]) {
    const value = readPath(parsed, path);
    if (typeof value === "string" && value.length) {
      return value;
    }
  }

  if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === "string") {
    return parsed[0];
  }

  return "";
};

const inflightControllers = new Map();

const mapStreamError = (error) => {
  if (error?.code === "UNAUTHORIZED") {
    return {
      code: "UNAUTHORIZED",
      message: error.message || "Authorization failed",
      details: error.details
    };
  }
  if (error?.name === "AbortError") {
    const reason = error?.cause || error?.reason;
    switch (reason) {
      case "connect-timeout":
        return { code: "TIMEOUT", message: "Connection timed out" };
      case "idle-timeout":
        return { code: "TIMEOUT", message: "Stream idle timeout exceeded" };
      case "total-timeout":
        return { code: "TIMEOUT", message: "Stream total duration exceeded" };
      case "user-abort":
        return { code: "UNKNOWN", message: "Stream aborted by user" };
      default:
        return { code: "TIMEOUT", message: "Stream aborted" };
    }
  }
  if (error?.code === "ETIMEDOUT") {
    return { code: "TIMEOUT", message: "Stream timed out" };
  }
  if (error?.name === "FetchError" || error instanceof TypeError) {
    return {
      code: "NETWORK",
      message: error.message || "Network error"
    };
  }
  return {
    code: "UNKNOWN",
    message: error?.message || "Unknown error",
    details: error?.stack
  };
};

const resolveProfile = async (source) => {
  if (source.profile) {
    return source.profile;
  }
  if (!source.profileId) {
    return null;
  }
  const state = await loadFormProfiles();
  return state.profiles.find((item) => item.id === source.profileId) || null;
};

const mapError = (error, preview) => {
  if (error?.code === "UNAUTHORIZED") {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: error.message || "Authorization failed",
      details: error.details,
      preview
    };
  }
  if (error?.name === "AbortError") {
    const reason = error?.cause || error?.reason;
    const message =
      reason === "connect-timeout"
        ? "Connection timed out"
        : reason === "total-timeout"
          ? "Request timed out"
          : "Request aborted";
    return {
      ok: false,
      code: "TIMEOUT",
      message,
      preview
    };
  }
  if (error?.code === "ETIMEDOUT") {
    return {
      ok: false,
      code: "TIMEOUT",
      message: "Request timed out",
      preview
    };
  }
  if (error?.name === "FetchError" || error instanceof TypeError) {
    return {
      ok: false,
      code: "NETWORK",
      message: error.message || "Network error",
      preview
    };
  }
  return {
    ok: false,
    code: "UNKNOWN",
    message: error?.message || "Unknown error",
    preview
  };
};

const runSync = async (req) => {
  try {
    const profile = await resolveProfile(req);
    const validationError = validateProfile(profile);
    if (validationError) {
      return {
        ok: false,
        code: "VALIDATION",
        message: validationError
      };
    }

    const rendered = renderTemplate(profile.baseUrl, profile.template, req.values ?? {});
    const preparation = await prepareHttpRequest(profile, req, rendered);
    if (!preparation.ok) {
      return preparation.error;
    }

    const { method, requestUrl, requestHeaders, bodyPayload, preview } = preparation.value;

    const connectTimeoutMs =
      typeof req.connectTimeoutMs === "number" && req.connectTimeoutMs > 0
        ? req.connectTimeoutMs
        : DEFAULT_CONNECT_TIMEOUT_MS;
    const totalTimeoutMs =
      typeof req.totalTimeoutMs === "number" && req.totalTimeoutMs > 0
        ? req.totalTimeoutMs
        : DEFAULT_TOTAL_TIMEOUT_MS;

    const controller = new AbortController();
    const signal = controller.signal;
    const connectTimer = setTimeout(() => {
      if (!signal.aborted) {
        controller.abort("connect-timeout");
      }
    }, connectTimeoutMs);
    const totalTimer = setTimeout(() => {
      if (!signal.aborted) {
        controller.abort("total-timeout");
      }
    }, totalTimeoutMs);

    const headers = new Headers();
    for (const [key, value] of Object.entries(requestHeaders)) {
      if (value !== undefined && value !== null) {
        headers.set(key, String(value));
      }
    }

    const requestInit = {
      method,
      headers,
      signal
    };
    if (bodyPayload !== undefined && method !== "GET" && method !== "HEAD") {
      requestInit.body = bodyPayload;
    }

    const startedAt = Date.now();
    let response;
    try {
      response = await fetch(requestUrl, requestInit);
    } finally {
      clearTimeout(connectTimer);
      clearTimeout(totalTimer);
    }
    const latencyMs = Date.now() - startedAt;

    const responseHeaders = headersToObject(response.headers);
    const contentType = response.headers.get("content-type");

    if (!response.body) {
      return {
        ok: true,
        status: response.status,
        statusText: response.statusText,
        latencyMs,
        responseType: "empty",
        headers: responseHeaders,
        preview
      };
    }

    if (response.status === 204 || response.status === 205) {
      return {
        ok: true,
        status: response.status,
        statusText: response.statusText,
        latencyMs,
        responseType: "empty",
        headers: responseHeaders,
        preview
      };
    }

    if (isJsonContent(contentType ?? undefined)) {
      try {
        const json = await response.json();
        return {
          ok: true,
          status: response.status,
          statusText: response.statusText,
          latencyMs,
          responseType: "json",
          headers: responseHeaders,
          bodyJson: json,
          preview
        };
      } catch (error) {
        return {
          ok: false,
          code: "PARSE",
          message: "Failed to parse JSON response",
          details: error instanceof Error ? error.message : undefined,
          preview
        };
      }
    }

    const text = await response.text();
    const responseType = text ? "text" : "empty";

    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      latencyMs,
      responseType,
      headers: responseHeaders,
      bodyText: text || undefined,
      preview
    };
  } catch (error) {
    return mapError(error, undefined);
  }
};

const runStream = async (req, handlers = {}) => {
  const profile = await resolveProfile(req);
  const validationError = validateProfile(profile);
  if (validationError) {
    return {
      ok: false,
      error: validationError,
      code: "VALIDATION"
    };
  }

  const streamMode = profile.stream ?? "none";
  if (streamMode === "none") {
    return {
      ok: false,
      error: "Profile is not configured for streaming.",
      code: "VALIDATION"
    };
  }

  const rendered = renderTemplate(profile.baseUrl, profile.template, req.values ?? {});
  const preparation = await prepareHttpRequest(profile, req, rendered);
  if (!preparation.ok) {
    const code =
      preparation.error.code === "UNAUTHORIZED"
        ? "UNAUTHORIZED"
        : preparation.error.code === "VALIDATION"
          ? "VALIDATION"
          : "UNKNOWN";
    return {
      ok: false,
      error: preparation.error.message,
      code
    };
  }

  const requestId = createRequestId(req.requestId);
  const controller = new AbortController();
  inflightControllers.set(requestId, controller);

  const connectTimeoutMs = getTimeout(req.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS);
  const idleTimeoutMs = getTimeout(req.idleTimeoutMs, DEFAULT_IDLE_TIMEOUT_MS);
  const totalTimeoutMs = getTimeout(req.totalTimeoutMs, DEFAULT_TOTAL_TIMEOUT_MS);

  const signal = controller.signal;
  const startedAt = Date.now();

  let connectTimer = null;
  let totalTimer = null;

  const cleanupTimers = () => {
    if (connectTimer) {
      clearTimeout(connectTimer);
      connectTimer = null;
    }
    if (totalTimer) {
      clearTimeout(totalTimer);
      totalTimer = null;
    }
  };

  const sendStatus = (kind) => {
    if (typeof handlers.onStatus === "function") {
      handlers.onStatus({
        requestId,
        kind,
        at: Date.now()
      });
    }
  };

  const run = async () => {
    const { method, requestUrl, requestHeaders, bodyPayload } = preparation.value;
    const headers = new Headers();
    for (const [key, value] of Object.entries(requestHeaders)) {
      if (value !== undefined && value !== null) {
        headers.set(key, String(value));
      }
    }

    connectTimer = setTimeout(() => {
      if (!signal.aborted) {
        controller.abort("connect-timeout");
      }
    }, connectTimeoutMs);
    totalTimer = setTimeout(() => {
      if (!signal.aborted) {
        controller.abort("total-timeout");
      }
    }, totalTimeoutMs);

    const requestInit = {
      method,
      headers,
      signal
    };
    if (bodyPayload !== undefined && method !== "GET" && method !== "HEAD") {
      requestInit.body = bodyPayload;
    }

    let response;
    try {
      response = await fetch(requestUrl, requestInit);
    } finally {
      clearTimeout(connectTimer);
      connectTimer = null;
    }

    const responseHeaders = headersToObject(response.headers);
    sendStatus("open");

    const reader = response.body?.getReader();
    if (!reader) {
      if (!signal.aborted) {
        handlers.onDone?.({
          requestId,
          status: response.status,
          statusText: response.statusText,
          latencyMs: Date.now() - startedAt,
          headers: responseHeaders,
          aggregatedText: ""
        });
      }
      return;
    }

    let aggregatedText = "";
    let doneReceived = false;

    await readLines(
      reader,
      (line) => {
        if (signal.aborted || doneReceived) {
          return;
        }
        let candidate = line;
        if (streamMode === "sse") {
          const data = parseSSELine(line);
          if (data === null) {
            return;
          }
          if (isDoneToken(data.trim())) {
            doneReceived = true;
            return;
          }
          candidate = data;
        }
        const chunk = extractChunk(candidate);
        if (chunk) {
          aggregatedText += chunk;
          handlers.onDelta?.({
            requestId,
            chunk
          });
          sendStatus("heartbeat");
        }
      },
      {
        idleTimeoutMs,
        onIdleTimeout: () => {
          if (!signal.aborted) {
            controller.abort("idle-timeout");
          }
        }
      }
    );

    if (!signal.aborted) {
      handlers.onDone?.({
        requestId,
        status: response.status,
        statusText: response.statusText,
        latencyMs: Date.now() - startedAt,
        headers: responseHeaders,
        aggregatedText
      });
    }
  };

  run()
    .catch((error) => {
      const mapped = mapStreamError(error);
      handlers.onError?.({
        requestId,
        code: mapped.code,
        message: mapped.message,
        details: mapped.details
      });
    })
    .finally(() => {
      cleanupTimers();
      inflightControllers.delete(requestId);
      sendStatus("closed");
    });

  return {
    ok: true,
    requestId
  };
};

const abortStream = (requestId) => {
  if (!requestId || typeof requestId !== "string") {
    return false;
  }
  const controller = inflightControllers.get(requestId);
  if (!controller) {
    return false;
  }
  inflightControllers.delete(requestId);
  try {
    controller.abort("user-abort");
  } catch {
    // ignore abort errors
  }
  return true;
};

module.exports = {
  runSync,
  runStream,
  abortStream
};
