import { BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import fs from "fs/promises";
import {
  IPC_TEMPLATES_LIST,
  IPC_TEMPLATES_SAVE,
  IPC_TEMPLATES_EXPORT,
  IPC_TEMPLATES_IMPORT,
  IPC_TEMPLATES_HISTORY_LIST,
  IPC_TEMPLATES_HISTORY_APPEND,
  IPC_TEMPLATES_HISTORY_CLEAR,
  TemplatesListResponse,
  TemplatesSaveRequest,
  TemplatesSaveResponse,
  TemplatesExportResponse,
  TemplatesImportResponse,
  HistoryListResponse,
  HistoryAppendRequest,
  HistoryMutateResponse
} from "../../shared/ipc/templates.ipc";
import { loadTemplates, saveTemplates, loadHistory, appendHistory, trimHistory } from "../services/templates";
import { isPromptTemplate, isPromptHistoryEntry } from "../../shared/types/templates";

const ok = <T>(data?: T) => ({
  ok: true,
  ...(data !== undefined ? data : {})
});

const fail = (error: unknown) => ({
  ok: false,
  error: error instanceof Error ? error.message : String(error)
});

const mergeTemplates = (current: any[], incoming: any[]) => {
  const map = new Map<string, any>();
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

export const registerTemplatesIpc = (): void => {
  ipcMain.handle(IPC_TEMPLATES_LIST, async (): Promise<TemplatesListResponse> => {
    try {
      const templates = await loadTemplates();
      return ok({ data: templates });
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(
    IPC_TEMPLATES_SAVE,
    async (_event, payload: TemplatesSaveRequest): Promise<TemplatesSaveResponse> => {
      if (!payload || !Array.isArray(payload.templates) || payload.templates.some((tpl) => !isPromptTemplate(tpl))) {
        return fail("Invalid template payload");
      }
      try {
        await saveTemplates(() => payload.templates);
        return ok();
      } catch (error) {
        return fail(error);
      }
    }
  );

  ipcMain.handle(IPC_TEMPLATES_EXPORT, async (event): Promise<TemplatesExportResponse> => {
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

  ipcMain.handle(IPC_TEMPLATES_IMPORT, async (event): Promise<TemplatesImportResponse> => {
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

  ipcMain.handle(IPC_TEMPLATES_HISTORY_LIST, async (): Promise<HistoryListResponse> => {
    try {
      const entries = await loadHistory();
      return ok({ data: entries });
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(
    IPC_TEMPLATES_HISTORY_APPEND,
    async (_event, payload: HistoryAppendRequest): Promise<HistoryMutateResponse> => {
      if (!payload || !isPromptHistoryEntry(payload.entry)) {
        return fail("Invalid history entry");
      }
      try {
        await appendHistory(payload.entry, 100);
        return ok();
      } catch (error) {
        return fail(error);
      }
    }
  );

  ipcMain.handle(IPC_TEMPLATES_HISTORY_CLEAR, async (): Promise<HistoryMutateResponse> => {
    try {
      await trimHistory(0);
      return ok();
    } catch (error) {
      return fail(error);
    }
  });
};
