const { ipcMain } = require("electron");
const { randomUUID } = require("crypto");
const {
  IPC_HISTORY_THREAD_CREATE,
  IPC_HISTORY_MESSAGE_ADD,
  IPC_HISTORY_THREAD_LIST,
  IPC_HISTORY_THREAD_MESSAGES,
  IPC_HISTORY_SEARCH,
  IPC_HISTORY_INGEST_LAST
} = require("../../shared/ipc/history.ipc.js");
const {
  createThread,
  addMessage,
  listThreads,
  getThreadMessages,
  search
} = require("../services/historyStore");
const { importLastFromAdapter } = require("../services/ingest");
const { isMessage } = require("../../shared/types/history.js");

const ok = (data) => ({
  ok: true,
  ...(data || {})
});

const fail = (error, details) => ({
  ok: false,
  error: typeof error === "string" ? error : error?.message || "History operation failed",
  ...(details ? { details } : {})
});

const sanitizeThreadId = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("threadId must be a non-empty string");
  }
  return value.trim();
};

const sanitizeLimit = (value, fallback = 50) => {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.min(500, Number(value)));
};

const sanitizeOffset = (value) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Number(value));
};

const sanitizeString = (value, name) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} must be a non-empty string`);
  }
  return value.trim();
};

const sanitizeOptionalThreadId = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const registerHistoryIpc = () => {
  ipcMain.handle(IPC_HISTORY_THREAD_CREATE, async (_event, title) => {
    try {
      const thread = await createThread(
        typeof title === "string" && title.trim() ? title.trim() : undefined
      );
      return ok({ thread });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_HISTORY_MESSAGE_ADD, async (_event, payload) => {
    try {
      if (!isMessage(payload)) {
        throw new Error("Invalid message payload");
      }
      await addMessage(payload);
      return ok();
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_HISTORY_THREAD_LIST, async () => {
    try {
      const threads = listThreads();
      return ok({ threads });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_HISTORY_THREAD_MESSAGES, async (_event, payload) => {
    try {
      const threadId = sanitizeThreadId(payload?.threadId);
      const limit = sanitizeLimit(payload?.limit);
      const offset = sanitizeOffset(payload?.offset);
      const messages = getThreadMessages(threadId, limit, offset);
      return ok({ messages });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_HISTORY_SEARCH, async (_event, payload) => {
    try {
      const limit = sanitizeLimit(payload?.limit);
      const offset = sanitizeOffset(payload?.offset);
      const result = search(payload || {}, { limit, offset });
      return ok({ result });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_HISTORY_INGEST_LAST, async (event, payload) => {
    try {
      if (!payload || typeof payload !== "object") {
        throw new Error("ingest payload must be an object");
      }
      const tabId = sanitizeString(payload.tabId, "tabId");
      const adapterId = sanitizeString(payload.adapterId, "adapterId");
      const requestedThreadId = sanitizeOptionalThreadId(payload.threadId);
      const limit = sanitizeLimit(payload.limit, 10);

      const ingestResult = await importLastFromAdapter(event.sender, {
        tabId,
        adapterId,
        limit
      });
      if (!ingestResult.ok || !ingestResult.result) {
        return fail(
          ingestResult.error || "Failed to import last answer",
          ingestResult.details
        );
      }
      const { result } = ingestResult;
      const messages = Array.isArray(result.messages) ? result.messages : [];
      if (!messages.length) {
        return fail("Adapter returned no messages to import");
      }

      let targetThreadId = requestedThreadId;
      if (targetThreadId) {
        const exists = listThreads().some((thread) => thread.id === targetThreadId);
        if (!exists) {
          targetThreadId = null;
        }
      }
      if (!targetThreadId) {
        const created = await createThread(
          result.title || `Imported ${result.adapterId || adapterId}`
        );
        targetThreadId = created.id;
      }

      let added = 0;
      for (const message of messages) {
        const normalizedRole = message.role === "assistant" ? "assistant" : "user";
        const historyMessage = {
          id: message.id || randomUUID(),
          threadId: targetThreadId,
          agentId: result.adapterId || adapterId,
          role: normalizedRole,
          text: String(message.text),
          ts:
            typeof message.ts === "string" && message.ts.trim()
              ? message.ts.trim()
              : new Date().toISOString(),
          source: {
            clientId: result.clientId || adapterId,
            ...(result.url ? { url: result.url } : {})
          },
          meta: {
            tabId,
            adapterId,
            importedAt: new Date().toISOString()
          }
        };
        await addMessage(historyMessage);
        added += 1;
      }

      return ok({
        added,
        threadId: targetThreadId
      });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });
};

module.exports = {
  registerHistoryIpc
};

