const { ipcMain } = require("electron");
const { IPC_JUDGE_RUN, IPC_JUDGE_PROGRESS } = require("../../shared/ipc/judge.ipc");
const { runJudge } = require("../services/judgePipeline.js");
const { isJudgeInput } = require("../../shared/types/judge.js");

const ok = (result) => ({
  ok: true,
  result
});

const fail = (error, details) => ({
  ok: false,
  error: typeof error === "string" ? error : error?.message || "Judge pipeline error",
  ...(details ? { details: String(details) } : {})
});

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
      return fail("Invalid judge input");
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
      return ok(result);
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });
};

module.exports = {
  registerJudgeIpc
};
