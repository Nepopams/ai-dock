const runtime = require("./history.ipc.js") as {
  registerHistoryIpc: () => void;
};

export const registerHistoryIpc: () => void = runtime.registerHistoryIpc;
