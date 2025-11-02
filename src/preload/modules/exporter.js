const { createJudgeSanitizers } = require("../utils/judge.js");

module.exports = function registerExporter({
  contextBridge,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC
}) {
  const { sanitizeJudgeExportPayload } = createJudgeSanitizers({
    validateString,
    ensureRequestId
  });

  contextBridge.exposeInMainWorld("exporter", {
    judgeMarkdown: (payload) => safeInvoke(IPC.JUDGE_MD, sanitizeJudgeExportPayload(payload)),
    judgeJson: (payload) => safeInvoke(IPC.JUDGE_JSON, sanitizeJudgeExportPayload(payload))
  });
};
