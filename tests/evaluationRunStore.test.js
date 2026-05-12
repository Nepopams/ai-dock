const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const os = require("node:os");
const fs = require("node:fs");
const Module = require("node:module");

const {
  isEvaluationRunRecord,
  isEvaluationRunSummary
} = require("../src/shared/types/evaluationRun.js");

const originalLoad = Module._load;

const createTempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), "evaluation-runs-"));

const loadStore = (tempRoot) => {
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
  try {
    const modulePath = require.resolve("../src/main/storage/evaluationRunStore.js");
    delete require.cache[modulePath];
    return require(modulePath);
  } finally {
    Module._load = originalLoad;
  }
};

const createRun = (overrides = {}) => ({
  runId: "run-1",
  schemaVersion: "evaluation-run.export.v1",
  createdAt: "2026-05-12T10:00:00.000Z",
  source: {
    kind: "judge_export",
    app: "vr-ai-dock",
    surface: "compare_view",
    payload: "JudgeExportPayload"
  },
  evaluationType: "answer_comparison",
  question: "Which sensitive answer is better?",
  subjects: [
    {
      id: "answer_1",
      kind: "answer",
      label: "Answer 1",
      agentId: "agent-a",
      content: "Sensitive full answer A",
      contentType: "text/plain"
    },
    {
      id: "answer_2",
      kind: "answer",
      label: "Answer 2",
      agentId: "agent-b",
      content: "Sensitive full answer B",
      contentType: "text/plain"
    }
  ],
  result: {
    requestId: "run-1",
    scores: {
      answer_1: [{ criterion: "clarity", score: 4 }],
      answer_2: [{ criterion: "clarity", score: 5 }]
    },
    verdict: "Answer 2 wins",
    summary: "Answer 2 is clearer.",
    rawResponse: { secretDebug: "raw-secret" },
    partial: false
  },
  validatorResults: [
    {
      type: "required_keys",
      status: "fail",
      answerKey: "answer_1",
      message: "Missing status key."
    }
  ],
  metadata: {
    judgeProfileId: "profile-a",
    driver: "generic-http",
    model: "local-model",
    validationMode: "json_contract_check",
    parseState: "strict_json",
    durationMs: 20,
    customPromptApplied: true,
    rubricSource: "custom"
  },
  exportOptions: {
    includeRawResponse: true,
    includeInputs: true,
    redactionMode: "safe_metadata"
  },
  ...overrides
});

test("evaluationRunStore saves, lists privacy-safe summaries, and reads full records", async () => {
  const tempRoot = createTempRoot();
  try {
    const store = loadStore(tempRoot);
    const { record, summary } = await store.saveEvaluationRun(createRun());

    assert.equal(isEvaluationRunRecord(record), true);
    assert.equal(isEvaluationRunSummary(summary), true);
    assert.equal(record.id, "run-1");
    assert.equal(summary.subjectCount, 2);
    assert.equal(summary.validatorSummary.fail, 1);
    assert.deepEqual(summary.scoreSummary.criteria, ["clarity"]);
    assert.equal(summary.scoreSummary.averageScore, 4.5);

    const list = await store.listEvaluationRuns({ limit: 10, offset: 0 });
    assert.equal(list.total, 1);
    assert.equal(list.runs.length, 1);
    const serializedSummary = JSON.stringify(list.runs[0]);
    assert.doesNotMatch(serializedSummary, /Sensitive full answer|raw-secret|"customPrompt":/i);

    const read = await store.readEvaluationRun("run-1");
    assert.equal(read.run.subjects[0].content, "Sensitive full answer A");
    assert.equal(read.run.result.rawResponse.secretDebug, "raw-secret");

    const runFile = path.join(tempRoot, "ai-dock", "evaluations", "runs", "run-1.json");
    assert.equal(fs.existsSync(runFile), true);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("evaluationRunStore deletes records and handles missing reads", async () => {
  const tempRoot = createTempRoot();
  try {
    const store = loadStore(tempRoot);
    await store.saveEvaluationRun(createRun());

    assert.equal(await store.readEvaluationRun("missing"), null);
    assert.equal(await store.deleteEvaluationRun("missing"), false);
    assert.equal(await store.deleteEvaluationRun("run-1"), true);
    assert.equal(await store.readEvaluationRun("run-1"), null);

    const list = await store.listEvaluationRuns();
    assert.equal(list.total, 0);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("evaluationRunStore rejects invalid runs and records", async () => {
  const tempRoot = createTempRoot();
  try {
    const store = loadStore(tempRoot);
    await assert.rejects(
      () => store.saveEvaluationRun({ runId: "missing-required-fields" }),
      /Invalid EvaluationRun payload/
    );
    await assert.rejects(
      () =>
        store.saveEvaluationRun({
          ...createRun(),
          result: { ...createRun().result, summary: 7 }
        }),
      /Invalid EvaluationRun payload/
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("evaluationRunStore rebuilds list index when index file is missing", async () => {
  const tempRoot = createTempRoot();
  try {
    const store = loadStore(tempRoot);
    await store.saveEvaluationRun(createRun());
    const indexFile = path.join(tempRoot, "ai-dock", "evaluations", "index.json");
    fs.rmSync(indexFile, { force: true });

    const list = await store.listEvaluationRuns();
    assert.equal(list.total, 1);
    assert.equal(list.runs[0].id, "run-1");
    assert.equal(fs.existsSync(indexFile), true);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
