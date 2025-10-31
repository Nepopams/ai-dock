const { app } = require("electron");
const { promises: fs } = require("fs");
const path = require("path");
const { isPromptTemplate, isPromptHistoryEntry } = require("../../shared/types/templates");

const TEMPLATE_FILE = "templates.json";
const HISTORY_FILE = "prompt-history.json";

const ensureDirectory = async (targetPath) => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
};

const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const writeJsonFile = async (filePath, value) => {
  await ensureDirectory(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const getTemplatesPath = () => path.join(app.getPath("userData"), TEMPLATE_FILE);
const getHistoryPath = () => path.join(app.getPath("userData"), HISTORY_FILE);

const filterValidTemplates = (items) => items.filter((item) => isPromptTemplate(item));
const filterValidHistory = (items) => items.filter((item) => isPromptHistoryEntry(item));

const loadTemplates = async () => {
  const filePath = getTemplatesPath();
  const raw = await readJsonFile(filePath);
  if (!raw) {
    await writeJsonFile(filePath, []);
    return [];
  }
  return filterValidTemplates(raw);
};

const saveTemplates = async (updater) => {
  const current = await loadTemplates();
  const next = updater([...current]);
  next.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  await writeJsonFile(getTemplatesPath(), next);
  return next;
};

const loadHistory = async () => {
  const filePath = getHistoryPath();
  const raw = await readJsonFile(filePath);
  if (!raw) {
    await writeJsonFile(filePath, []);
    return [];
  }
  return filterValidHistory(raw);
};

const appendHistory = async (entry, maxEntries = 100) => {
  const current = await loadHistory();
  const next = [entry, ...current].slice(0, maxEntries);
  await writeJsonFile(getHistoryPath(), next);
  return next;
};

const trimHistory = async (maxEntries = 100) => {
  const current = await loadHistory();
  const trimmed = current.slice(0, maxEntries);
  if (trimmed.length !== current.length) {
    await writeJsonFile(getHistoryPath(), trimmed);
  }
  return trimmed;
};

module.exports = {
  loadTemplates,
  saveTemplates,
  loadHistory,
  appendHistory,
  trimHistory
};
