import type { MediaPreset } from "../types/mediaPresets";

export const IPC_MEDIA_PRESETS_LIST = "mediaPresets:list";
export const IPC_MEDIA_PRESETS_SAVE = "mediaPresets:save";
export const IPC_MEDIA_PRESETS_EXPORT = "mediaPresets:export";
export const IPC_MEDIA_PRESETS_IMPORT = "mediaPresets:import";

export interface MediaPresetsListResponse {
  ok: true;
  presets: MediaPreset[];
}

export interface MediaPresetsSaveResponse {
  ok: true;
  presets: MediaPreset[];
}

export interface MediaPresetsExportResponse {
  ok: true;
  count: number;
  filePath?: string;
}

export interface MediaPresetsImportResponse {
  ok: true;
  added: number;
  replaced: number;
  total: number;
}

export interface MediaPresetsErrorResponse {
  ok: false;
  error: string;
  details?: string;
}

export type MediaPresetsResponse =
  | MediaPresetsListResponse
  | MediaPresetsSaveResponse
  | MediaPresetsExportResponse
  | MediaPresetsImportResponse
  | MediaPresetsErrorResponse;
