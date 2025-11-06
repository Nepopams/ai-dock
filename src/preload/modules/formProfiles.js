module.exports = function registerFormProfiles({
  contextBridge,
  safeInvoke,
  validateString,
  IPC
}) {
  contextBridge.exposeInMainWorld("formProfiles", {
    list: () => safeInvoke(IPC.LIST),
    save: (payload) => safeInvoke(IPC.SAVE, payload || {}),
    delete: (payload) =>
      safeInvoke(IPC.DELETE, {
        id: validateString(payload?.id, "profile id")
      }),
    duplicate: (payload) =>
      safeInvoke(IPC.DUPLICATE, {
        id: validateString(payload?.id, "profile id")
      }),
    test: (payload) => safeInvoke(IPC.TEST, payload || {})
  });
};
