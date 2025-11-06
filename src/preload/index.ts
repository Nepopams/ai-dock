import { contextBridge, ipcRenderer } from "electron";
import { createBase } from "./utils/base";
import registerCoreApi from "./modules/coreApi";
import registerAiDock from "./modules/aiDock";
import registerChat from "./modules/chat";
import registerHistoryHub from "./modules/historyHub";
import registerMediaPresets from "./modules/mediaPresets";
import registerTemplates from "./modules/templates";
import registerCompletions from "./modules/completions";
import registerJudge from "./modules/judge";
import registerExporter from "./modules/exporter";
import registerAdapterBridge from "./modules/adapterBridge";
import registerRegistry from "./modules/registry";
import registerFormProfiles from "./modules/formProfiles";
import registerFormRunner from "./modules/formRunner";
import {
  IPC_HISTORY_THREAD_CREATE,
  IPC_HISTORY_MESSAGE_ADD,
  IPC_HISTORY_THREAD_LIST,
  IPC_HISTORY_THREAD_MESSAGES,
  IPC_HISTORY_SEARCH,
  IPC_HISTORY_INGEST_LAST
} from "../shared/ipc/history.ipc";
import {
  IPC_MEDIA_PRESETS_LIST,
  IPC_MEDIA_PRESETS_SAVE,
  IPC_MEDIA_PRESETS_EXPORT,
  IPC_MEDIA_PRESETS_IMPORT
} from "../shared/ipc/mediaPresets.ipc";
import {
  IPC_TEMPLATES_LIST,
  IPC_TEMPLATES_SAVE,
  IPC_TEMPLATES_EXPORT,
  IPC_TEMPLATES_IMPORT,
  IPC_TEMPLATES_HISTORY_LIST,
  IPC_TEMPLATES_HISTORY_APPEND,
  IPC_TEMPLATES_HISTORY_CLEAR
} from "../shared/ipc/templates.ipc";
import {
  IPC_JUDGE_RUN,
  IPC_JUDGE_PROGRESS
} from "../shared/ipc/judge.ipc";
import {
  IPC_EXPORT_JUDGE_MD,
  IPC_EXPORT_JUDGE_JSON
} from "../shared/ipc/export.ipc";
import {
  FORM_PROFILES_LIST,
  FORM_PROFILES_SAVE,
  FORM_PROFILES_DELETE,
  FORM_PROFILES_DUPLICATE,
  FORM_PROFILES_TEST
} from "../shared/ipc/formProfiles.contracts";
import {
  FORM_RUN_SYNC,
  FORM_RUN_STREAM_START,
  FORM_RUN_STREAM_ABORT,
  FORM_RUN_STREAM_DELTA,
  FORM_RUN_STREAM_DONE,
  FORM_RUN_STREAM_ERROR,
  FORM_RUN_STREAM_STATUS
} from "../shared/ipc/formRunner.contracts";

const IPC_REGISTRY_LIST = "registry:list";
const IPC_REGISTRY_SAVE = "registry:save";
const IPC_REGISTRY_WATCH_START = "registry:watch-start";
const IPC_REGISTRY_WATCH_STOP = "registry:watch-stop";
const IPC_REGISTRY_CHANGED = "registry:changed";
const IPC_COMPLETIONS_GET_PROFILES = "completions:getProfiles";
const IPC_COMPLETIONS_SAVE_PROFILES = "completions:saveProfiles";
const IPC_COMPLETIONS_SET_ACTIVE = "completions:setActive";
const IPC_COMPLETIONS_TEST_PROFILE = "completions:testProfile";
const IPC_ADAPTER_EXEC = "adapter:exec";
const IPC_ADAPTER_PING = "adapter:ping";

const {
  safeInvoke,
  validateString,
  ensureRequestId
} = createBase(ipcRenderer);

registerCoreApi({ contextBridge, safeInvoke, validateString });
registerAiDock({ contextBridge, safeInvoke });
registerChat({ contextBridge, ipcRenderer, safeInvoke, validateString, ensureRequestId });
registerHistoryHub({
  contextBridge,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC: {
    CREATE: IPC_HISTORY_THREAD_CREATE,
    ADD_MESSAGE: IPC_HISTORY_MESSAGE_ADD,
    LIST: IPC_HISTORY_THREAD_LIST,
    LIST_MESSAGES: IPC_HISTORY_THREAD_MESSAGES,
    SEARCH: IPC_HISTORY_SEARCH,
    INGEST_LAST: IPC_HISTORY_INGEST_LAST
  }
});
registerMediaPresets({
  contextBridge,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC: {
    LIST: IPC_MEDIA_PRESETS_LIST,
    SAVE: IPC_MEDIA_PRESETS_SAVE,
    EXPORT: IPC_MEDIA_PRESETS_EXPORT,
    IMPORT: IPC_MEDIA_PRESETS_IMPORT
  }
});
registerTemplates({
  contextBridge,
  safeInvoke,
  validateString,
  IPC: {
    LIST: IPC_TEMPLATES_LIST,
    SAVE: IPC_TEMPLATES_SAVE,
    EXPORT: IPC_TEMPLATES_EXPORT,
    IMPORT: IPC_TEMPLATES_IMPORT,
    HISTORY_LIST: IPC_TEMPLATES_HISTORY_LIST,
    HISTORY_APPEND: IPC_TEMPLATES_HISTORY_APPEND,
    HISTORY_CLEAR: IPC_TEMPLATES_HISTORY_CLEAR
  }
});
registerCompletions({
  contextBridge,
  safeInvoke,
  validateString,
  IPC: {
    GET_PROFILES: IPC_COMPLETIONS_GET_PROFILES,
    SAVE_PROFILES: IPC_COMPLETIONS_SAVE_PROFILES,
    SET_ACTIVE: IPC_COMPLETIONS_SET_ACTIVE,
    TEST_PROFILE: IPC_COMPLETIONS_TEST_PROFILE
  }
});
registerJudge({
  contextBridge,
  ipcRenderer,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC: {
    RUN: IPC_JUDGE_RUN,
    PROGRESS: IPC_JUDGE_PROGRESS
  }
});
registerExporter({
  contextBridge,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC: {
    JUDGE_MD: IPC_EXPORT_JUDGE_MD,
    JUDGE_JSON: IPC_EXPORT_JUDGE_JSON
  }
});
registerAdapterBridge({
  contextBridge,
  safeInvoke,
  validateString,
  IPC: {
    EXEC: IPC_ADAPTER_EXEC,
    PING: IPC_ADAPTER_PING
  }
});
registerRegistry({
  contextBridge,
  ipcRenderer,
  safeInvoke,
  IPC: {
    LIST: IPC_REGISTRY_LIST,
    SAVE: IPC_REGISTRY_SAVE,
    WATCH_START: IPC_REGISTRY_WATCH_START,
    WATCH_STOP: IPC_REGISTRY_WATCH_STOP,
    CHANGED: IPC_REGISTRY_CHANGED
  }
});
registerFormProfiles({
  contextBridge,
  safeInvoke,
  validateString,
  IPC: {
    LIST: FORM_PROFILES_LIST,
    SAVE: FORM_PROFILES_SAVE,
    DELETE: FORM_PROFILES_DELETE,
    DUPLICATE: FORM_PROFILES_DUPLICATE,
    TEST: FORM_PROFILES_TEST
  }
});
registerFormRunner({
  contextBridge,
  safeInvoke,
  ipcRenderer,
  IPC: {
    RUN_SYNC: FORM_RUN_SYNC,
    STREAM_START: FORM_RUN_STREAM_START,
    STREAM_ABORT: FORM_RUN_STREAM_ABORT,
    STREAM_DELTA: FORM_RUN_STREAM_DELTA,
    STREAM_DONE: FORM_RUN_STREAM_DONE,
    STREAM_ERROR: FORM_RUN_STREAM_ERROR,
    STREAM_STATUS: FORM_RUN_STREAM_STATUS
  }
});
