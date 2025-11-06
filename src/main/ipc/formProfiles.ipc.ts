const runtime = require("./formProfiles.ipc.js") as {
  registerFormProfilesIpc: () => void;
};

export const registerFormProfilesIpc: () => void =
  runtime.registerFormProfilesIpc;
