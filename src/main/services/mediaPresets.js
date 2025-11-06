const { app, dialog } = require("electron");
const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs/promises");
const { isMediaPreset } = require("../../shared/types/mediaPresets.js");

const FILE_NAME = "media-presets.json";

const resolveFilePath = () => path.join(app.getPath("userData"), FILE_NAME);

const ensureDirectory = async (targetPath) => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
};

const readJson = async (targetPath) => {
  try {
    const data = await fs.readFile(targetPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const filterPresets = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter((item) => isMediaPreset(item));
};

const loadPresets = async () => {
  const filePath = resolveFilePath();
  const data = await readJson(filePath);
  if (!data) {
    await ensureDirectory(filePath);
    await fs.writeFile(filePath, "[]\n", "utf8");
    return [];
  }
  return filterPresets(data);
};

const savePresets = async (updater) => {
  const filePath = resolveFilePath();
  const current = await loadPresets().catch(() => []);
  const next = typeof updater === "function" ? updater([...current]) : Array.isArray(updater) ? updater : current;
  const sanitized = filterPresets(next);
  await ensureDirectory(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");
  return sanitized;
};

const exportPresets = async (destinationPath) => {
  if (!destinationPath) {
    return { ok: false, error: "Destination path is required" };
  }
  const filePath = resolveFilePath();
  const presets = await loadPresets();
  try {
    await ensureDirectory(destinationPath);
  } catch {
    // directory ensure only if destination is a file path
  }
  await fs.writeFile(destinationPath, `${JSON.stringify(presets, null, 2)}\n`, "utf8");
  return { ok: true, count: presets.length };
};

const mergeById = (existingMap, preset) => {
  existingMap.set(preset.id, preset);
};

const importPresets = async (sourcePath, options = {}) => {
  if (!sourcePath) {
    return { ok: false, error: "Source path is required" };
  }
  const raw = await readJson(sourcePath);
  const importedPresets = filterPresets(raw);
  if (!importedPresets.length) {
    return { ok: false, error: "File does not contain valid media presets" };
  }
  const { mergeById: shouldMergeById = true, duplicateStrategy = "overwrite" } = options;
  const current = await loadPresets();
  const map = new Map(current.map((preset) => [preset.id, preset]));
  let added = 0;
  let replaced = 0;
  importedPresets.forEach((preset) => {
    if (map.has(preset.id)) {
      if (shouldMergeById) {
        mergeById(map, preset);
        replaced += 1;
        return;
      }
      if (duplicateStrategy === "copy") {
        const now = new Date().toISOString();
        const copyId = randomUUID();
        const copy = {
          ...preset,
          id: copyId,
          title: preset.title ? `${preset.title} (Copy)` : `Preset ${copyId.slice(0, 8)}`,
          createdAt: now,
          updatedAt: now
        };
        map.set(copy.id, copy);
        added += 1;
        return;
      }
      mergeById(map, preset);
      replaced += 1;
      return;
    }
    map.set(preset.id, preset);
    added += 1;
  });
  const merged = Array.from(map.values());
  await savePresets(() => merged);
  return {
    ok: true,
    added,
    replaced,
    total: merged.length
  };
};

const pickExportPath = async (browserWindow) => {
  const { canceled, filePath } = await dialog.showSaveDialog(browserWindow, {
    title: "Export Media Presets",
    defaultPath: "media-presets.json",
    filters: [{ name: "JSON", extensions: ["json"] }]
  });
  if (canceled || !filePath) {
    return null;
  }
  return filePath;
};

const pickImportPath = async (browserWindow) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
    title: "Import Media Presets",
    filters: [{ name: "JSON", extensions: ["json"] }],
    properties: ["openFile"]
  });
  if (canceled || !filePaths.length) {
    return null;
  }
  return filePaths[0];
};

module.exports = {
  loadPresets,
  savePresets,
  exportPresets,
  importPresets,
  pickExportPath,
  pickImportPath
};
