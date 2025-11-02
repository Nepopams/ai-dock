import { PromptHistoryEntry, PromptTemplate } from "../types/templates";

export const IPC_TEMPLATES_LIST = "templates:list";
export const IPC_TEMPLATES_SAVE = "templates:save";
export const IPC_TEMPLATES_EXPORT = "templates:export";
export const IPC_TEMPLATES_IMPORT = "templates:import";
export const IPC_TEMPLATES_HISTORY_LIST = "templates:history:list";
export const IPC_TEMPLATES_HISTORY_APPEND = "templates:history:append";
export const IPC_TEMPLATES_HISTORY_CLEAR = "templates:history:clear";

export interface TemplatesListResponse {
  ok: boolean;
  data?: PromptTemplate[];
  error?: string;
}

export interface TemplatesSaveRequest {
  templates: PromptTemplate[];
}

export interface TemplatesSaveResponse {
  ok: boolean;
  error?: string;
}

export interface TemplatesExportResponse {
  ok: boolean;
  path?: string;
  error?: string;
}

export interface TemplatesImportResponse {
  ok: boolean;
  count?: number;
  error?: string;
}

export interface HistoryListResponse {
  ok: boolean;
  data?: PromptHistoryEntry[];
  error?: string;
}

export interface HistoryAppendRequest {
  entry: PromptHistoryEntry;
}

export interface HistoryMutateResponse {
  ok: boolean;
  error?: string;
}
