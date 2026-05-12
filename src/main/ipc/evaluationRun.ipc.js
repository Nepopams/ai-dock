const { ipcMain } = require("electron");
const {
  IPC_EVALUATION_RUN_SAVE,
  IPC_EVALUATION_RUN_LIST,
  IPC_EVALUATION_RUN_READ,
  IPC_EVALUATION_RUN_DELETE
} = require("../../shared/ipc/evaluationRun.ipc.js");
const {
  isEvaluationRunExport,
  isEvaluationRunRecord,
  sanitizeEvaluationRunRecordId
} = require("../../shared/types/evaluationRun.js");
const {
  saveEvaluationRun,
  listEvaluationRuns,
  readEvaluationRun,
  deleteEvaluationRun
} = require("../storage/evaluationRunStore.js");

const ERROR_CODES = new Set(["invalid_payload", "not_found", "storage_failed", "unknown"]);

const ok = (data) => ({
  ok: true,
  ...(data || {})
});

const fail = (code, error) => ({
  ok: false,
  code: ERROR_CODES.has(code) ? code : "unknown",
  error: typeof error === "string" && error.trim() ? error.trim() : "EvaluationRun operation failed"
});

const normalizeErrorCode = (error) => {
  if (ERROR_CODES.has(error?.code)) {
    return error.code;
  }
  if (error instanceof SyntaxError || error?.code === "ENOENT" || error?.code === "EACCES") {
    return "storage_failed";
  }
  return "unknown";
};

const failFromError = (error) => {
  const code = normalizeErrorCode(error);
  const message =
    code === "invalid_payload"
      ? "Invalid EvaluationRun payload"
      : code === "not_found"
        ? "EvaluationRun record not found"
        : code === "storage_failed"
          ? "EvaluationRun storage operation failed"
          : "EvaluationRun operation failed";
  return fail(code, message);
};

const unwrapSavePayload = (payload) => {
  if (isEvaluationRunRecord(payload)) {
    return payload;
  }
  const runOrRecord = payload && typeof payload === "object" && payload.run ? payload.run : payload;
  if (!isEvaluationRunExport(runOrRecord) && !isEvaluationRunRecord(runOrRecord)) {
    const error = new Error("Invalid EvaluationRun payload");
    error.code = "invalid_payload";
    throw error;
  }
  return runOrRecord;
};

const sanitizeIdPayload = (payload) => {
  const rawId = typeof payload === "string" ? payload : payload?.id;
  const id = sanitizeEvaluationRunRecordId(rawId || "");
  if (!id) {
    const error = new Error("Invalid EvaluationRun id");
    error.code = "invalid_payload";
    throw error;
  }
  return id;
};

const sanitizePaging = (payload = {}) => {
  const limit = Number.isFinite(payload?.limit) ? Math.floor(Number(payload.limit)) : undefined;
  const offset = Number.isFinite(payload?.offset) ? Math.floor(Number(payload.offset)) : undefined;
  const paging = {};
  if (limit !== undefined) {
    paging.limit = Math.min(500, Math.max(1, limit));
  }
  if (offset !== undefined) {
    paging.offset = Math.max(0, offset);
  }
  return paging;
};

const registerEvaluationRunIpc = () => {
  ipcMain.handle(IPC_EVALUATION_RUN_SAVE, async (_event, payload) => {
    try {
      const runOrRecord = unwrapSavePayload(payload);
      const { record, summary } = await saveEvaluationRun(runOrRecord);
      return ok({ record, summary });
    } catch (error) {
      return failFromError(error);
    }
  });

  ipcMain.handle(IPC_EVALUATION_RUN_LIST, async (_event, payload) => {
    try {
      const { runs, total } = await listEvaluationRuns(sanitizePaging(payload));
      return ok({ runs, total });
    } catch (error) {
      return failFromError(error);
    }
  });

  ipcMain.handle(IPC_EVALUATION_RUN_READ, async (_event, payload) => {
    try {
      const id = sanitizeIdPayload(payload);
      const record = await readEvaluationRun(id);
      if (!record) {
        return fail("not_found", "EvaluationRun record not found");
      }
      return ok({ record });
    } catch (error) {
      return failFromError(error);
    }
  });

  ipcMain.handle(IPC_EVALUATION_RUN_DELETE, async (_event, payload) => {
    try {
      const id = sanitizeIdPayload(payload);
      const deleted = await deleteEvaluationRun(id);
      if (!deleted) {
        return fail("not_found", "EvaluationRun record not found");
      }
      return ok({ deleted: true });
    } catch (error) {
      return failFromError(error);
    }
  });
};

module.exports = {
  registerEvaluationRunIpc,
  _private: {
    ok,
    fail,
    failFromError,
    normalizeErrorCode,
    unwrapSavePayload,
    sanitizeIdPayload,
    sanitizePaging
  }
};
