const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");
const Module = require("node:module");
const {
  IPC_EVALUATION_RUN_SAVE,
  IPC_EVALUATION_RUN_LIST,
  IPC_EVALUATION_RUN_READ,
  IPC_EVALUATION_RUN_DELETE
} = require("../src/shared/ipc/evaluationRun.ipc.js");

const originalLoad = Module._load;

const createRun = () => ({
  runId: "ipc-run-1",
  schemaVersion: "evaluation-run.export.v1",
  createdAt: "2026-05-12T10:00:00.000Z",
  source: {
    kind: "judge_export",
    app: "vr-ai-dock",
    surface: "compare_view",
    payload: "JudgeExportPayload"
  },
  evaluationType: "answer_comparison",
  question: "Question",
  subjects: [
    { id: "answer_1", kind: "answer", label: "Answer 1", content: "A", contentType: "text/plain" },
    { id: "answer_2", kind: "answer", label: "Answer 2", content: "B", contentType: "text/plain" }
  ],
  result: {
    requestId: "ipc-run-1",
    scores: {
      answer_1: [{ criterion: "clarity", score: 4 }],
      answer_2: [{ criterion: "clarity", score: 5 }]
    },
    verdict: "B",
    summary: "B wins",
    partial: false
  },
  validatorResults: [],
  metadata: {},
  exportOptions: {
    includeRawResponse: false,
    includeInputs: true,
    redactionMode: "safe_metadata"
  }
});

const loadIpc = (tempRoot) => {
  const handlers = new Map();
  Module._load = function loadStub(request, parent, isMain) {
    if (request === "electron") {
      return {
        ipcMain: {
          handle: (channel, handler) => handlers.set(channel, handler)
        },
        app: {
          getPath: () => tempRoot
        }
      };
    }
    return originalLoad(request, parent, isMain);
  };
  try {
    for (const modulePath of [
      "../src/main/storage/evaluationRunStore.js",
      "../src/main/ipc/evaluationRun.ipc.js"
    ]) {
      const resolved = require.resolve(modulePath);
      delete require.cache[resolved];
    }
    const ipc = require("../src/main/ipc/evaluationRun.ipc.js");
    ipc.registerEvaluationRunIpc();
    return { handlers, ipc };
  } finally {
    Module._load = originalLoad;
  }
};

test("EvaluationRun IPC registers only bounded handlers and returns ok shapes", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "evaluation-run-ipc-"));
  try {
    const { handlers } = loadIpc(tempRoot);
    assert.deepEqual(
      [...handlers.keys()].sort(),
      [
        IPC_EVALUATION_RUN_DELETE,
        IPC_EVALUATION_RUN_LIST,
        IPC_EVALUATION_RUN_READ,
        IPC_EVALUATION_RUN_SAVE
      ].sort()
    );

    const save = await handlers.get(IPC_EVALUATION_RUN_SAVE)(null, createRun());
    assert.equal(save.ok, true);
    assert.equal(save.record.id, "ipc-run-1");

    const list = await handlers.get(IPC_EVALUATION_RUN_LIST)(null, { limit: 1000, offset: -1 });
    assert.equal(list.ok, true);
    assert.equal(list.total, 1);

    const read = await handlers.get(IPC_EVALUATION_RUN_READ)(null, { id: "ipc-run-1" });
    assert.equal(read.ok, true);
    assert.equal(read.record.id, "ipc-run-1");

    const deleted = await handlers.get(IPC_EVALUATION_RUN_DELETE)(null, { id: "ipc-run-1" });
    assert.equal(deleted.ok, true);
    assert.equal(deleted.deleted, true);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("EvaluationRun IPC returns stable errors without stacks", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "evaluation-run-ipc-"));
  try {
    const { handlers } = loadIpc(tempRoot);
    const invalid = await handlers.get(IPC_EVALUATION_RUN_SAVE)(null, { nope: true });
    assert.deepEqual(invalid, {
      ok: false,
      code: "invalid_payload",
      error: "Invalid EvaluationRun payload"
    });

    const notFound = await handlers.get(IPC_EVALUATION_RUN_READ)(null, { id: "missing" });
    assert.deepEqual(notFound, {
      ok: false,
      code: "not_found",
      error: "EvaluationRun record not found"
    });

    const serialized = JSON.stringify({ invalid, notFound });
    assert.doesNotMatch(serialized, /at |\.js:\d|stack/i);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
