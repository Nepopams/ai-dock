const runtime = require("./formRunner.ipc.js") as {
  registerFormRunnerIpc: () => void;
};

export const registerFormRunnerIpc: () => void = runtime.registerFormRunnerIpc;
