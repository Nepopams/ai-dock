const runtime = require("./mediaPresets.ipc.js") as {
  registerMediaPresetsIpc: () => void;
};

export const registerMediaPresetsIpc: () => void = runtime.registerMediaPresetsIpc;
