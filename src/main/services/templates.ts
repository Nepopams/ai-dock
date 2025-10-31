import { app } from "electron";
import { promises as fs } from "fs";
import path from "path";
import {
  PromptHistoryEntry,
  PromptTemplate,
  isPromptHistoryEntry,
  isPromptTemplate
} from "../../shared/types/templates";

const TEMPLATE_FILE = "templates.json";
const HISTORY_FILE = "prompt-history.json";

const ensureDirectory = async (targetPath: string): Promise<void> => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
};

const readJsonFile = async <T>(filePath: string): Promise<T | null> => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch (error) {
    return null;
  }
};

const writeJsonFile = async (filePath: string, value: unknown): Promise<void> => {
  await ensureDirectory(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const getTemplatesPath = (): string => {
  return path.join(app.getPath("userData"), TEMPLATE_FILE);
};

const getHistoryPath = (): string => {
  return path.join(app.getPath("userData"), HISTORY_FILE);
};

const filterValidTemplates = (items: unknown[]): PromptTemplate[] => {
  return items.filter((item): item is PromptTemplate => isPromptTemplate(item));
};

const filterValidHistory = (items: unknown[]): PromptHistoryEntry[] => {
  return items.filter((item): item is PromptHistoryEntry => isPromptHistoryEntry(item));
};

export const loadTemplates = async (): Promise<PromptTemplate[]> => {
  const filePath = getTemplatesPath();
  const raw = await readJsonFile<unknown[]>(filePath);
  if (!raw) {
    await writeJsonFile(filePath, []);
    return [];
  }
  return filterValidTemplates(raw);
};

export const saveTemplates = async (
  updater: (current: PromptTemplate[]) => PromptTemplate[]
): Promise<PromptTemplate[]> => {
  const current = await loadTemplates();
  const next = updater([...current]);
  next.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  await writeJsonFile(getTemplatesPath(), next);
  return next;
};

export const loadHistory = async (): Promise<PromptHistoryEntry[]> => {
  const filePath = getHistoryPath();
  const raw = await readJsonFile<unknown[]>(filePath);
  if (!raw) {
    await writeJsonFile(filePath, []);
    return [];
  }
  return filterValidHistory(raw);
};

export const appendHistory = async (entry: PromptHistoryEntry, maxEntries = 100): Promise<PromptHistoryEntry[]> => {
  const current = await loadHistory();
  const next = [entry, ...current].slice(0, maxEntries);
  await writeJsonFile(getHistoryPath(), next);
  return next;
};

export const trimHistory = async (maxEntries = 100): Promise<PromptHistoryEntry[]> => {
  const current = await loadHistory();
  const trimmed = current.slice(0, maxEntries);
  if (trimmed.length !== current.length) {
    await writeJsonFile(getHistoryPath(), trimmed);
  }
  return trimmed;
};
