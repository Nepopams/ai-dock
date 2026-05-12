const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const { randomUUID } = require("crypto");
const {
  EVALUATION_RUN_RECORD_SCHEMA_VERSION,
  isEvaluationRunExport,
  isEvaluationRunRecord,
  isEvaluationRunSummary,
  createEvaluationRunRecord,
  createEvaluationRunSummary,
  sanitizeEvaluationRunRecordId
} = require("../../shared/types/evaluationRun.js");

const INDEX_SCHEMA_VERSION = "evaluation-run.index.v1";
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;

const evaluationsDir = () => path.join(app.getPath("userData"), "ai-dock", "evaluations");
const runsDir = () => path.join(evaluationsDir(), "runs");
const indexFile = () => path.join(evaluationsDir(), "index.json");

const createStoreError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const ensureDirs = async () => {
  await fsp.mkdir(runsDir(), { recursive: true });
};

const atomicWriteJson = async (filePath, value) => {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random()
    .toString(36)
    .slice(2)}.tmp`;
  await fsp.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fsp.rename(tempPath, filePath);
};

const readJsonFile = async (filePath) => {
  try {
    const raw = await fsp.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const sanitizeRequiredId = (value) => {
  const id = sanitizeEvaluationRunRecordId(value);
  if (!id) {
    throw createStoreError("invalid_payload", "EvaluationRun id is invalid");
  }
  return id;
};

const runFileForId = (id) => {
  const safeId = sanitizeRequiredId(id);
  const filePath = path.resolve(runsDir(), `${safeId}.json`);
  const baseDir = path.resolve(runsDir()) + path.sep;
  if (!filePath.startsWith(baseDir)) {
    throw createStoreError("invalid_payload", "EvaluationRun id is invalid");
  }
  return filePath;
};

const sortSummaries = (summaries) =>
  [...summaries].sort((a, b) => {
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    return bTime - aTime;
  });

const normalizePaging = (paging = {}) => {
  const limit = Number.isFinite(paging.limit)
    ? Math.floor(Number(paging.limit))
    : DEFAULT_LIMIT;
  const offset = Number.isFinite(paging.offset) ? Math.floor(Number(paging.offset)) : 0;
  return {
    limit: Math.min(MAX_LIMIT, Math.max(1, limit)),
    offset: Math.max(0, offset)
  };
};

const persistIndex = async (summaries) => {
  const safeSummaries = sortSummaries(summaries.filter(isEvaluationRunSummary));
  await atomicWriteJson(indexFile(), {
    schemaVersion: INDEX_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    runs: safeSummaries
  });
  return safeSummaries;
};

const readIndex = async () => {
  await ensureDirs();
  const parsed = await readJsonFile(indexFile());
  if (!parsed) {
    return rebuildEvaluationRunIndex();
  }
  const runs = Array.isArray(parsed) ? parsed : parsed.runs;
  if (!Array.isArray(runs) || !runs.every(isEvaluationRunSummary)) {
    return rebuildEvaluationRunIndex();
  }
  return sortSummaries(runs);
};

const rebuildEvaluationRunIndex = async () => {
  await ensureDirs();
  let entries = [];
  try {
    entries = await fsp.readdir(runsDir(), { withFileTypes: true });
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  const summaries = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }
    const parsed = await readJsonFile(path.join(runsDir(), entry.name));
    if (isEvaluationRunRecord(parsed)) {
      summaries.push(createEvaluationRunSummary(parsed));
    }
  }
  return persistIndex(summaries);
};

const normalizeRecordInput = (runOrRecord, existingRecord) => {
  const inputRecord = isEvaluationRunRecord(runOrRecord) ? runOrRecord : null;
  const run = inputRecord ? inputRecord.run : runOrRecord;
  if (!isEvaluationRunExport(run)) {
    throw createStoreError("invalid_payload", "Invalid EvaluationRun payload");
  }
  const id =
    sanitizeEvaluationRunRecordId(inputRecord?.id || run.runId) ||
    sanitizeEvaluationRunRecordId(randomUUID());
  const createdAt = existingRecord?.createdAt || inputRecord?.createdAt || run.createdAt;
  return createEvaluationRunRecord(run, {
    id,
    title: inputRecord?.title,
    createdAt,
    updatedAt: new Date().toISOString()
  });
};

const saveEvaluationRun = async (runOrRecord) => {
  await ensureDirs();
  const rawTentativeId = isEvaluationRunRecord(runOrRecord) ? runOrRecord.id : runOrRecord?.runId;
  const tentativeId = sanitizeEvaluationRunRecordId(rawTentativeId || "");
  const existingRecord = tentativeId ? await readEvaluationRun(tentativeId) : null;
  const record = normalizeRecordInput(runOrRecord, existingRecord);
  const summary = createEvaluationRunSummary(record);
  await atomicWriteJson(runFileForId(record.id), record);
  const index = await readIndex();
  const nextIndex = [summary, ...index.filter((item) => item.id !== record.id)];
  await persistIndex(nextIndex);
  return { record, summary };
};

const listEvaluationRuns = async (paging = {}) => {
  const { limit, offset } = normalizePaging(paging);
  const index = await readIndex();
  return {
    runs: index.slice(offset, offset + limit),
    total: index.length
  };
};

const readEvaluationRun = async (id) => {
  await ensureDirs();
  const parsed = await readJsonFile(runFileForId(id));
  if (!parsed) {
    return null;
  }
  if (!isEvaluationRunRecord(parsed)) {
    throw createStoreError("storage_failed", "Stored EvaluationRun record is invalid");
  }
  return parsed;
};

const deleteEvaluationRun = async (id) => {
  await ensureDirs();
  const filePath = runFileForId(id);
  try {
    await fsp.unlink(filePath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
  const safeId = sanitizeRequiredId(id);
  const index = await readIndex();
  await persistIndex(index.filter((item) => item.id !== safeId));
  return true;
};

module.exports = {
  saveEvaluationRun,
  listEvaluationRuns,
  readEvaluationRun,
  deleteEvaluationRun,
  rebuildEvaluationRunIndex,
  _private: {
    INDEX_SCHEMA_VERSION,
    EVALUATION_RUN_RECORD_SCHEMA_VERSION,
    evaluationsDir,
    runsDir,
    indexFile,
    normalizePaging,
    runFileForId
  }
};
