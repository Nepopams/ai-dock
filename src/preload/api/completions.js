module.exports = (contextBridge, ipcRenderer) => {
  const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

  contextBridge.exposeInMainWorld("completions", {
    getProfiles: () => invoke("completions:getProfiles"),
    saveProfiles: (state) => invoke("completions:saveProfiles", state),
    setActive: (name) => invoke("completions:setActive", name),
    testProfile: (name) => invoke("completions:testProfile", name)
  });
};
