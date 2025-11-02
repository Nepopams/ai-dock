import { beforeEach, afterEach, test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import Module from "node:module";

const requireCjs = Module.createRequire(import.meta.url);
const originalLoad = Module._load;

const createTempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), "history-store-"));

const loadHistoryStore = (tempRoot) => {
  Module._load = function loadStub(request, parent, isMain) {
    if (request === "electron") {
      return {
        app: {
          getPath: () => tempRoot
        }
      };
    }
    return originalLoad(request, parent, isMain);
  };
  const modulePath = requireCjs.resolve("../src/main/services/historyStore.js");
  delete requireCjs.cache[modulePath];
  const historyStore = requireCjs(modulePath);
  Module._load = originalLoad;
  return historyStore;
};

let tempRoot = "";
let historyStore;

const resetTempRoot = () => {
  if (tempRoot && fs.existsSync(tempRoot)) {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
  tempRoot = createTempRoot();
  fs.mkdirSync(tempRoot, { recursive: true });
};

beforeEach(() => {
  resetTempRoot();
  historyStore = loadHistoryStore(tempRoot);
});

afterEach(() => {
  if (tempRoot && fs.existsSync(tempRoot)) {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
  tempRoot = "";
});

test("historyStore persists threads and messages", async () => {
  const thread = await historyStore.createThread("Test thread");
  assert.match(thread.id, /^[a-f0-9-]+$/);

  const message = {
    id: "msg-1",
    threadId: thread.id,
    agentId: "chatgpt",
    role: "user",
    text: "Hello world",
    ts: new Date().toISOString()
  };
  await historyStore.addMessage(message);

  const threads = historyStore.listThreads();
  assert.equal(threads.length, 1);
  assert.equal(threads[0].id, thread.id);

  const messages = historyStore.getThreadMessages(thread.id, 10, 0);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].text, "Hello world");

  const searchResult = historyStore.search({ q: "hello" }, { limit: 10, offset: 0 });
  assert.equal(searchResult.total, 1);
  assert.equal(searchResult.messages[0].threadId, thread.id);
});

test("historyStore skips invalid JSON lines when reading from disk", async () => {
  const thread = await historyStore.createThread("Broken feed");
  const validMessage = {
    id: "msg-valid",
    threadId: thread.id,
    agentId: "claude",
    role: "assistant",
    text: "All good",
    ts: new Date().toISOString()
  };
  await historyStore.addMessage(validMessage);

  const historyDir = path.join(tempRoot, "history");
  const messagesFile = path.join(historyDir, "conversations.jsonl");
  fs.appendFileSync(messagesFile, "{not-json}\n", "utf8");

  const messages = historyStore.getThreadMessages(thread.id, 10, 0);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].id, "msg-valid");

  const searchResult = historyStore.search({ q: "good" }, { limit: 10, offset: 0 });
  assert.equal(searchResult.total, 1);
  assert.equal(searchResult.messages[0].id, "msg-valid");
});
