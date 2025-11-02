import type { BrowserWindow } from "electron";
import type { MediaPreset } from "../../shared/types/mediaPresets";

const runtime = require("./mediaPresets.js") as {
  loadPresets: () => Promise<MediaPreset[]>;
  savePresets: (
    updater:
      | MediaPreset[]
      | ((
          current: MediaPreset[]
        ) => MediaPreset[])
  ) => Promise<MediaPreset[]>;
  exportPresets: (destinationPath: string) => Promise<{ ok: boolean; count?: number; error?: string }>;
  importPresets: (
    sourcePath: string,
    options?: { mergeById?: boolean }
  ) => Promise<{ ok: boolean; added?: number; replaced?: number; total?: number; error?: string }>;
  pickExportPath: (window?: BrowserWindow | null) => Promise<string | null>;
  pickImportPath: (window?: BrowserWindow | null) => Promise<string | null>;
};

export const loadPresets: () => Promise<MediaPreset[]> = runtime.loadPresets;
export const savePresets: (
  updater:
    | MediaPreset[]
    | ((current: MediaPreset[]) => MediaPreset[])
) => Promise<MediaPreset[]> = runtime.savePresets;
export const exportPresets: (
  destinationPath: string
) => Promise<{ ok: boolean; count?: number; error?: string }> = runtime.exportPresets;
export const importPresets: (
  sourcePath: string,
  options?: { mergeById?: boolean; duplicateStrategy?: "overwrite" | "copy" }
) => Promise<{ ok: boolean; added?: number; replaced?: number; total?: number; error?: string }> =
  runtime.importPresets;
export const pickExportPath: (window?: BrowserWindow | null) => Promise<string | null> =
  runtime.pickExportPath;
export const pickImportPath: (window?: BrowserWindow | null) => Promise<string | null> =
  runtime.pickImportPath;
