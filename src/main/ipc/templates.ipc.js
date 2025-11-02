const { BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const {
  IPC_TEMPLATES_LIST,
  IPC_TEMPLATES_SAVE,
  IPC_TEMPLATES_EXPORT,
  IPC_TEMPLATES_IMPORT,
  IPC_TEMPLATES_HISTORY_LIST,
  IPC_TEMPLATES_HISTORY_APPEND,
  IPC_TEMPLATES_HISTORY_CLEAR
} = require("../../shared/ipc/templates.ipc");
const {
  loadTemplates,
  saveTemplates,
  loadHistory,
  appendHistory,
  trimHistory
} = require("../services/templates");
const { isPromptTemplate, isPromptHistoryEntry } = require("../../shared/types/templates");

const ok = (data) => ({
  ok: true,
  ...(data || {})
});

const fail = (error) => ({
  ok: false,
  error: error instanceof Error ? error.message : String(error)
});

const mergeTemplates = (current, incoming) => {
  const map = new Map();
  current.forEach((tpl) => {
    if (isPromptTemplate(tpl)) {
      map.set(tpl.id, tpl);
    }
  });
  incoming.forEach((tpl) => {
    if (isPromptTemplate(tpl)) {
      map.set(tpl.id, tpl);
    }
  });
  return Array.from(map.values());
};

const registerTemplatesIpc = () => {
  ipcMain.handle(IPC_TEMPLATES_LIST, async () => {
    try {
      const templates = await loadTemplates();
      return ok({ data: templates });
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_TEMPLATES_SAVE, async (_event, payload) => {
    if (!payload || !Array.isArray(payload.templates) || payload.templates.some((tpl) => !isPromptTemplate(tpl))) {
      return fail("Invalid template payload");
    }
    try {
      await saveTemplates(() => payload.templates);
      return ok();
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_TEMPLATES_EXPORT, async (event) => {
    try {
      const templates = await loadTemplates();
      const window = BrowserWindow.fromWebContents(event.sender) || undefined;
      const { canceled, filePath } = await dialog.showSaveDialog(window, {
        title: "Export prompt templates",
        defaultPath: path.join(process.cwd(), "templates-export.json"),
        filters: [{ name: "JSON", extensions: ["json"] }]
      });
      if (canceled || !filePath) {
        return fail("Export cancelled");
      }
      await fs.writeFile(filePath, JSON.stringify(templates, null, 2), "utf8");
      return ok({ path: filePath });
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_TEMPLATES_IMPORT, async (event) => {
    try {
      const window = BrowserWindow.fromWebContents(event.sender) || undefined;
      const { canceled, filePaths } = await dialog.showOpenDialog(window, {
        title: "Import prompt templates",
        filters: [{ name: "JSON", extensions: ["json"] }],
        properties: ["openFile"]
      });
      if (canceled || !filePaths.length) {
        return fail("Import cancelled");
      }
      const raw = await fs.readFile(filePaths[0], "utf8");
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return fail("Import file must contain an array of templates");
      }
      const current = await loadTemplates();
      const merged = mergeTemplates(current, parsed);
      await saveTemplates(() => merged);
      return ok({ count: merged.length });
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_TEMPLATES_HISTORY_LIST, async () => {
    try {
      const entries = await loadHistory();
      return ok({ data: entries });
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_TEMPLATES_HISTORY_APPEND, async (_event, payload) => {
    if (!payload || !isPromptHistoryEntry(payload.entry)) {
      return fail("Invalid history entry");
    }
    try {
      await appendHistory(payload.entry, 100);
      return ok();
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_TEMPLATES_HISTORY_CLEAR, async () => {
    try {
      await trimHistory(0);
      return ok();
    } catch (error) {
      return fail(error);
    }
  });
};

module.exports = { registerTemplatesIpc };
