const { randomUUID } = require("crypto");

const ensureWebContents = (webContents) => {
  if (!webContents || webContents.isDestroyed()) {
    throw new Error("Renderer context is not available");
  }
  return webContents;
};

const buildInvokeScript = (payload) => {
  const serialized = JSON.stringify({
    tabId: payload.tabId,
    adapterId: payload.adapterId,
    limit: payload.limit || 10
  });
  return `
    (async () => {
      try {
        const bridge = window.__AI_DOCK_HISTORY__;
        if (!bridge || typeof bridge.importLastFromAdapter !== "function") {
          return { ok: false, error: "INGEST_BRIDGE_MISSING" };
        }
        const result = await bridge.importLastFromAdapter(${serialized});
        if (!result || result.ok === false) {
          return {
            ok: false,
            error: result?.error || "INGEST_FAILED",
            details: result?.details
          };
        }
        return { ok: true, result };
      } catch (error) {
        return {
          ok: false,
          error: error && error.message ? String(error.message) : String(error)
        };
      }
    })();
  `;
};

/**
 * @param {import("electron").WebContents} webContents
 * @param {{ tabId: string; adapterId: string; limit?: number }} payload
 * @returns {Promise<{ ok: boolean; result?: { adapterId?: string; clientId?: string; messages?: Array<{ role: "user" | "assistant"; text: string; ts?: string }>; title?: string; url?: string }; error?: string; details?: string }>}
 */
const importLastFromAdapter = async (webContents, payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("ingest payload must be an object");
  }
  const tabId = typeof payload.tabId === "string" ? payload.tabId.trim() : "";
  const adapterId = typeof payload.adapterId === "string" ? payload.adapterId.trim() : "";
  if (!tabId) {
    throw new Error("tabId is required");
  }
  if (!adapterId) {
    throw new Error("adapterId is required");
  }
  const limit = Number.isFinite(payload.limit) ? Math.max(1, Math.min(50, Number(payload.limit))) : 10;
  const target = ensureWebContents(webContents);
  const script = buildInvokeScript({ tabId, adapterId, limit });
  const response = await target.executeJavaScript(script, true);
  if (!response || response.ok !== true || !response.result) {
    const error =
      response && typeof response.error === "string" ? response.error : "Failed to ingest history";
    const details =
      response && typeof response.details === "string" ? response.details : undefined;
    return { ok: false, error, details };
  }
  const result = response.result;
  const messages = Array.isArray(result.messages) ? result.messages : [];
  const normalizedMessages = messages
    .filter(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        (entry.role === "assistant" || entry.role === "user") &&
        typeof entry.text === "string" &&
        entry.text.trim()
    )
    .map((entry) => ({
      id: randomUUID(),
      role: entry.role === "assistant" ? "assistant" : "user",
      text: String(entry.text),
      ts:
        typeof entry.ts === "string" && entry.ts.trim()
          ? entry.ts.trim()
          : new Date().toISOString()
    }));

  return {
    ok: true,
    result: {
      adapterId: typeof result.adapterId === "string" ? result.adapterId : adapterId,
      clientId: typeof result.clientId === "string" ? result.clientId : adapterId,
      title: typeof result.title === "string" ? result.title : undefined,
      url: typeof result.url === "string" ? result.url : undefined,
      messages: normalizedMessages
    }
  };
};

module.exports = {
  importLastFromAdapter
};
