const { app } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const { randomUUID } = require("crypto");
const { isMessage, isThread } = require("../../shared/types/history.js");

const MEMORY_LIMIT = 50000;

const threadsFile = () => path.join(app.getPath("userData"), "history", "threads.json");
const messagesFile = () => path.join(app.getPath("userData"), "history", "conversations.jsonl");
const historyDir = () => path.join(app.getPath("userData"), "history");

let loaded = false;
let threads = [];
const threadMap = new Map();
const threadTags = new Map();
const threadCounts = new Map();

const messageQueue = [];
const byThread = new Map();
const byAgent = new Map();
const byClient = new Map();

const addToMapArray = (map, key, value) => {
  if (!key) {
    return;
  }
  const bucket = map.get(key);
  if (bucket) {
    bucket.push(value);
  } else {
    map.set(key, [value]);
  }
};

const removeFromMapArray = (map, key, value) => {
  if (!key) {
    return;
  }
  const bucket = map.get(key);
  if (!bucket) {
    return;
  }
  const index = bucket.indexOf(value);
  if (index !== -1) {
    bucket.splice(index, 1);
  }
  if (bucket.length === 0) {
    map.delete(key);
  }
};

const ensureDir = () => {
  const dir = historyDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const loadThreads = () => {
  const filePath = threadsFile();
  if (!fs.existsSync(filePath)) {
    threads = [];
    threadMap.clear();
    threadTags.clear();
    return;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("threads file is not an array");
    }
    threads = parsed.filter((item) => isThread(item));
    threadMap.clear();
    threadTags.clear();
    threads.forEach((thread) => {
      threadMap.set(thread.id, thread);
      threadTags.set(thread.id, Array.isArray(thread.tags) ? thread.tags : []);
    });
  } catch (error) {
    console.error("[historyStore] failed to load threads:", error);
    threads = [];
    threadMap.clear();
    threadTags.clear();
  }
};

const trimIndexes = () => {
  while (messageQueue.length > MEMORY_LIMIT) {
    const removed = messageQueue.shift();
    if (!removed) {
      continue;
    }
    removeFromMapArray(byThread, removed.threadId, removed);
    removeFromMapArray(byAgent, removed.agentId, removed);
    if (removed.source?.clientId) {
      removeFromMapArray(byClient, removed.source.clientId, removed);
    }
  }
};

const indexMessage = (message) => {
  messageQueue.push(message);
  addToMapArray(byThread, message.threadId, message);
  addToMapArray(byAgent, message.agentId, message);
  if (message.source?.clientId) {
    addToMapArray(byClient, message.source.clientId, message);
  }
  trimIndexes();
};

const loadMessages = () => {
  const filePath = messagesFile();
  if (!fs.existsSync(filePath)) {
    messageQueue.length = 0;
    byThread.clear();
    byAgent.clear();
    byClient.clear();
    threadCounts.clear();
    return;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  messageQueue.length = 0;
  byThread.clear();
  byAgent.clear();
  byClient.clear();
  threadCounts.clear();
  let threadsDirty = false;
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    try {
      const parsed = JSON.parse(line);
      if (isMessage(parsed)) {
        indexMessage(parsed);
        threadCounts.set(parsed.threadId, (threadCounts.get(parsed.threadId) || 0) + 1);
        if (!threadMap.has(parsed.threadId)) {
          // create placeholder thread if missing
          const thread = {
            id: parsed.threadId,
            createdAt: parsed.ts
          };
          threads.push(thread);
          threadMap.set(thread.id, thread);
          threadsDirty = true;
        }
      } else {
        console.warn("[historyStore] invalid message entry skipped");
      }
    } catch (error) {
      console.warn("[historyStore] failed to parse message line:", error?.message || error);
    }
  }
  if (threadsDirty) {
    persistThreadsSync();
  }
};

const ensureLoaded = () => {
  if (loaded) {
    return;
  }
  ensureDir();
  loadThreads();
  loadMessages();
  loaded = true;
};

const persistThreads = async () => {
  ensureDir();
  const filePath = threadsFile();
  await fsp.writeFile(filePath, JSON.stringify(threads, null, 2), "utf8");
};

const persistThreadsSync = () => {
  try {
    ensureDir();
    const filePath = threadsFile();
    fs.writeFileSync(filePath, JSON.stringify(threads, null, 2), "utf8");
  } catch (error) {
    console.error("[historyStore] failed to persist threads:", error);
  }
};

const appendMessageToDisk = async (message) => {
  ensureDir();
  const filePath = messagesFile();
  const payload = `${JSON.stringify(message)}\n`;
  await fsp.appendFile(filePath, payload, "utf8");
};

const getThread = (threadId) => {
  return threadMap.get(threadId) || null;
};

const createThread = async (title) => {
  ensureLoaded();
  const now = new Date().toISOString();
  const thread = {
    id: randomUUID(),
    title: title && title.trim() ? title.trim() : undefined,
    createdAt: now
  };
  threads.push(thread);
  threadMap.set(thread.id, thread);
  threadTags.set(thread.id, []);
  if (!threadCounts.has(thread.id)) {
    threadCounts.set(thread.id, 0);
  }
  await persistThreads();
  return thread;
};

const addMessage = async (message) => {
  ensureLoaded();
  if (!isMessage(message)) {
    throw new Error("Invalid message payload");
  }
  if (!getThread(message.threadId)) {
    const placeholder = {
      id: message.threadId,
      title: undefined,
      createdAt: message.ts
    };
    threads.push(placeholder);
    threadMap.set(placeholder.id, placeholder);
    threadTags.set(placeholder.id, []);
    await persistThreads();
  }
  await appendMessageToDisk(message);
  indexMessage(message);
  threadCounts.set(message.threadId, (threadCounts.get(message.threadId) || 0) + 1);
};

const listThreads = () => {
  ensureLoaded();
  return [...threads].sort((a, b) => {
    const aDate = new Date(a.createdAt || 0).getTime();
    const bDate = new Date(b.createdAt || 0).getTime();
    return bDate - aDate;
  });
};

const loadThreadMessagesFromDisk = (threadId) => {
  const filePath = messagesFile();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const results = [];
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    try {
      const parsed = JSON.parse(line);
      if (isMessage(parsed) && parsed.threadId === threadId) {
        results.push(parsed);
      }
    } catch (error) {
      // ignore parse errors here
    }
  }
  results.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
  return results;
};

const getThreadMessages = (threadId, limit = 50, offset = 0) => {
  ensureLoaded();
  const total = threadCounts.get(threadId) || 0;
  if (total === 0) {
    return [];
  }
  const inMemory = byThread.get(threadId) || [];
  const sortedMemory = [...inMemory].sort(
    (a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()
  );
  const start = offset;
  const end = Math.min(offset + limit, total);

  if (sortedMemory.length >= total && end <= sortedMemory.length) {
    return sortedMemory.slice(start, end);
  }

  const diskMessages = loadThreadMessagesFromDisk(threadId);
  const sorted = diskMessages
    .filter((msg) => true)
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  return sorted.slice(start, end);
};

const tokenize = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

const matchesQuery = (message, queryTokens) => {
  if (!queryTokens.length) {
    return true;
  }
  const text = (message.text || "").toLowerCase();
  return queryTokens.every((token) => text.includes(token));
};

const matchesFilters = (message, query) => {
  if (query.agentId && message.agentId !== query.agentId) {
    return false;
  }
  if (query.clientId) {
    if (!message.source || message.source.clientId !== query.clientId) {
      return false;
    }
  }
  if (query.role && message.role !== query.role) {
    return false;
  }
  if (query.dateFrom) {
    if (new Date(message.ts).getTime() < new Date(query.dateFrom).getTime()) {
      return false;
    }
  }
  if (query.dateTo) {
    if (new Date(message.ts).getTime() > new Date(query.dateTo).getTime()) {
      return false;
    }
  }
  if (query.tag) {
    const tags = threadTags.get(message.threadId) || [];
    if (!tags.includes(query.tag)) {
      return false;
    }
  }
  return true;
};

const search = (query, paging = {}) => {
  ensureLoaded();
  const tokens = tokenize(query?.q || "");
  const limit = Number.isFinite(paging.limit) ? Math.max(1, Number(paging.limit)) : 50;
  const offset = Number.isFinite(paging.offset) ? Math.max(0, Number(paging.offset)) : 0;
  const filtered = [];
  for (let index = messageQueue.length - 1; index >= 0; index -= 1) {
    const message = messageQueue[index];
    if (!matchesFilters(message, query)) {
      continue;
    }
    if (!matchesQuery(message, tokens)) {
      continue;
    }
    filtered.push(message);
  }
  const total = filtered.length;
  const slice = filtered.slice(offset, offset + limit);
  return {
    messages: slice,
    total
  };
};

module.exports = {
  createThread,
  addMessage,
  listThreads,
  getThreadMessages,
  search
};
