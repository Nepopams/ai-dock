const { BrowserWindow, ipcMain } = require("electron");
const {
  IPC_MEDIA_PRESETS_LIST,
  IPC_MEDIA_PRESETS_SAVE,
  IPC_MEDIA_PRESETS_EXPORT,
  IPC_MEDIA_PRESETS_IMPORT
} = require("../../shared/ipc/mediaPresets.ipc.js");
const {
  loadPresets,
  savePresets,
  exportPresets,
  importPresets,
  pickExportPath,
  pickImportPath
} = require("../services/mediaPresets");
const { isMediaPreset } = require("../../shared/types/mediaPresets.js");

const ok = (data) => ({
  ok: true,
  ...(data || {})
});

const fail = (error, details) => ({
  ok: false,
  error: typeof error === "string" ? error : error?.message || "Media presets operation failed",
  ...(details ? { details } : {})
});

const sanitizeArray = (value) => (Array.isArray(value) ? value : []);

const registerMediaPresetsIpc = () => {
  ipcMain.handle(IPC_MEDIA_PRESETS_LIST, async () => {
    try {
      const presets = await loadPresets();
      return ok({ presets });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_MEDIA_PRESETS_SAVE, async (_event, payload) => {
    try {
      const presets = sanitizeArray(payload);
      const invalid = presets.filter((item) => !isMediaPreset(item));
      if (invalid.length) {
        throw new Error("Invalid preset payload");
      }
      const saved = await savePresets(() => presets);
      return ok({ presets: saved });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_MEDIA_PRESETS_EXPORT, async (event, payload) => {
    try {
      const manualPath =
        payload && typeof payload === "object" && typeof payload.filePath === "string"
          ? payload.filePath
          : null;
      const targetPath =
        manualPath ||
        (await pickExportPath(BrowserWindow.fromWebContents(event.sender) || null));
      if (!targetPath) {
        return fail("Export canceled by user");
      }
      const result = await exportPresets(targetPath);
      if (!result.ok) {
        return fail(result.error || "Failed to export media presets");
      }
      return ok({
        count: result.count || 0,
        filePath: targetPath
      });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });

  ipcMain.handle(IPC_MEDIA_PRESETS_IMPORT, async (event, payload) => {
    try {
      const manualPath =
        payload && typeof payload === "object" && typeof payload.filePath === "string"
          ? payload.filePath
          : null;
      const mergeById =
        payload && typeof payload === "object" && typeof payload.mergeById === "boolean"
          ? payload.mergeById
          : true;
      const sourcePath =
        manualPath ||
        (await pickImportPath(BrowserWindow.fromWebContents(event.sender) || null));
      if (!sourcePath) {
        return fail("Import canceled by user");
      }
      const result = await importPresets(sourcePath, { mergeById });
      if (!result.ok) {
        return fail(result.error || "Failed to import media presets");
      }
      return ok({
        added: result.added || 0,
        replaced: result.replaced || 0,
        total: result.total || 0
      });
    } catch (error) {
      return fail(error, error?.stack || null);
    }
  });
};

module.exports = {
  registerMediaPresetsIpc
};

