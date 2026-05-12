const {
  isEvaluationRunExport,
  isEvaluationRunRecord,
  sanitizeEvaluationRunRecordId
} = require("../../shared/types/evaluationRun.js");

module.exports = function registerEvaluationRun({
  contextBridge,
  safeInvoke,
  IPC
}) {
  const sanitizeSavePayload = (payload) => {
    if (!isEvaluationRunExport(payload) && !isEvaluationRunRecord(payload)) {
      throw new Error("EvaluationRun payload is invalid");
    }
    return payload;
  };

  const sanitizeId = (value) => {
    const id = sanitizeEvaluationRunRecordId(value || "");
    if (!id) {
      throw new Error("EvaluationRun id must be a non-empty string");
    }
    return id;
  };

  const sanitizePaging = (paging = {}) => {
    const payload = {};
    if (Number.isFinite(paging?.limit)) {
      payload.limit = Math.min(500, Math.max(1, Math.floor(Number(paging.limit))));
    }
    if (Number.isFinite(paging?.offset)) {
      payload.offset = Math.max(0, Math.floor(Number(paging.offset)));
    }
    return payload;
  };

  contextBridge.exposeInMainWorld("evaluationRuns", {
    save: (runOrRecord) => safeInvoke(IPC.SAVE, sanitizeSavePayload(runOrRecord)),
    list: (paging) => safeInvoke(IPC.LIST, sanitizePaging(paging || {})),
    read: (id) => safeInvoke(IPC.READ, { id: sanitizeId(id) }),
    delete: (id) => safeInvoke(IPC.DELETE, { id: sanitizeId(id) })
  });
};
