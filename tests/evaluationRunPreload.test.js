const test = require("node:test");
const assert = require("node:assert/strict");
const registerEvaluationRun = require("../src/preload/modules/evaluationRun.js");

const createRun = () => ({
  runId: "preload-run-1",
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
    requestId: "preload-run-1",
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

const createApi = () => {
  const calls = [];
  let exposedName = "";
  let exposedApi = null;
  const contextBridge = {
    exposeInMainWorld: (name, api) => {
      exposedName = name;
      exposedApi = api;
    }
  };
  const safeInvoke = (channel, payload) => {
    calls.push({ channel, payload });
    return Promise.resolve({ ok: true });
  };
  registerEvaluationRun({
    contextBridge,
    safeInvoke,
    IPC: {
      SAVE: "evaluationRun:save",
      LIST: "evaluationRun:list",
      READ: "evaluationRun:read",
      DELETE: "evaluationRun:delete"
    }
  });
  return { calls, exposedName, api: exposedApi };
};

test("EvaluationRun preload exposes a bounded API", async () => {
  const { calls, exposedName, api } = createApi();
  assert.equal(exposedName, "evaluationRuns");
  assert.deepEqual(Object.keys(api).sort(), ["delete", "list", "read", "save"]);
  assert.equal(api.invoke, undefined);

  await api.save(createRun());
  await api.list({ limit: 1000, offset: -5 });
  await api.read(" run/one ");
  await api.delete(" run/one ");

  assert.deepEqual(calls.map((call) => call.channel), [
    "evaluationRun:save",
    "evaluationRun:list",
    "evaluationRun:read",
    "evaluationRun:delete"
  ]);
  assert.equal(calls[1].payload.limit, 500);
  assert.equal(calls[1].payload.offset, 0);
  assert.deepEqual(calls[2].payload, { id: "run-one" });
  assert.deepEqual(calls[3].payload, { id: "run-one" });
});

test("EvaluationRun preload rejects invalid save payloads and ids", () => {
  const { api } = createApi();
  assert.throws(() => api.save({ nope: true }), /EvaluationRun payload is invalid/);
  assert.throws(() => api.read("   "), /EvaluationRun id must be a non-empty string/);
  assert.throws(() => api.delete(null), /EvaluationRun id must be a non-empty string/);
});
