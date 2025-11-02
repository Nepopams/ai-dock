module.exports = function registerCompletions({
  contextBridge,
  safeInvoke,
  validateString,
  IPC
}) {
  contextBridge.exposeInMainWorld("completions", {
    getProfiles: () => safeInvoke(IPC.GET_PROFILES),
    saveProfiles: (state) => safeInvoke(IPC.SAVE_PROFILES, state),
    setActive: (name) =>
      safeInvoke(IPC.SET_ACTIVE, validateString(name, "profile name")),
    testProfile: (name) =>
      safeInvoke(IPC.TEST_PROFILE, validateString(name, "profile name"))
  });
};
