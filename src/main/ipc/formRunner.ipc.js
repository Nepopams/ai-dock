const { ipcMain } = require("electron");
const {
  FORM_RUN_SYNC,
  FORM_RUN_STREAM_START,
  FORM_RUN_STREAM_ABORT,
  FORM_RUN_STREAM_DELTA,
  FORM_RUN_STREAM_DONE,
  FORM_RUN_STREAM_ERROR,
  FORM_RUN_STREAM_STATUS
} = require("../../shared/ipc/formRunner.contracts.js");
const { runSync, runStream, abortStream } = require("../services/formRunner.js");

let registered = false;

const registerFormRunnerIpc = () => {
  if (registered) {
    return;
  }
  registered = true;

  ipcMain.handle(FORM_RUN_SYNC, async (_event, payload) => {
    try {
      return await runSync(payload || {});
    } catch (error) {
      return {
        ok: false,
        code: "UNKNOWN",
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  });

  ipcMain.handle(FORM_RUN_STREAM_START, async (event, payload) => {
    const webContents = event.sender;
    const safeSend = (channel, data) => {
      if (!webContents.isDestroyed() && !webContents.isCrashed()) {
        webContents.send(channel, data);
      }
    };
    try {
      const result = await runStream(payload || {}, {
        onDelta: (delta) => safeSend(FORM_RUN_STREAM_DELTA, delta),
        onDone: (done) => safeSend(FORM_RUN_STREAM_DONE, done),
        onError: (error) => safeSend(FORM_RUN_STREAM_ERROR, error),
        onStatus: (status) => safeSend(FORM_RUN_STREAM_STATUS, status)
      });
      return result;
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        code: "UNKNOWN"
      };
    }
  });

  ipcMain.handle(FORM_RUN_STREAM_ABORT, async (_event, payload) => {
    if (payload && typeof payload.requestId === "string") {
      abortStream(payload.requestId);
    }
    return { ok: true };
  });
};

module.exports = {
  registerFormRunnerIpc
};
