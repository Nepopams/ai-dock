const { registerChatIpc } = require("./chat");
const { registerCompletionsIpc } = require("./completions");
const { registerRegistryIpc } = require("./registry.ipc");
const { registerJudgeIpc } = require("./judge.ipc");
const { registerExportIpc } = require("./export.ipc");
const { registerHistoryIpc } = require("./history.ipc");
const { registerTemplatesIpc } = require("./templates.ipc");
const { registerMediaPresetsIpc } = require("./mediaPresets.ipc");
const { registerFormProfilesIpc } = require("./formProfiles.ipc");
const { registerFormRunnerIpc } = require("./formRunner.ipc");
const { registerAdapterBridgeIpc } = require("../browserViews/adapterBridge");
const { registerShellIpc } = require("./shell");

let registered = false;

const registerMainIpc = ({ getMainWindow, getTabManager }) => {
  if (registered) {
    return;
  }
  registered = true;

  registerChatIpc();
  registerCompletionsIpc();
  registerRegistryIpc();
  registerJudgeIpc();
  registerExportIpc();
  registerHistoryIpc();
  registerTemplatesIpc();
  registerMediaPresetsIpc();
  registerFormProfilesIpc();
  registerFormRunnerIpc();

  registerAdapterBridgeIpc({ getTabManager });

  registerShellIpc({
    getMainWindow,
    getTabManager
  });
};

module.exports = {
  registerMainIpc
};
