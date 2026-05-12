const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const { isEvaluationRunExport } = require("../src/shared/types/evaluationRun.js");

const requireExportWithElectronMock = () => {
  const originalLoad = Module._load;
  Module._load = function loadMock(request, parent, isMain) {
    if (request === "electron") {
      return {
        BrowserWindow: { fromWebContents: () => undefined },
        dialog: { showSaveDialog: async () => ({ canceled: true }) },
        ipcMain: { handle: () => undefined }
      };
    }
    return originalLoad(request, parent, isMain);
  };
  try {
    const modulePath = require.resolve("../src/main/ipc/export.ipc.js");
    delete require.cache[modulePath];
    return require(modulePath);
  } finally {
    Module._load = originalLoad;
  }
};

const createPayload = () => ({
  question: "Judge these answers",
  answers: [
    { agentId: "agent-a", text: "Answer A" },
    { agentId: "agent-b", text: "Answer B" }
  ],
  result: {
    requestId: "judge-run-2",
    scores: {
      answer_1: [{ criterion: "clarity", score: 4.5, rationale: "Clear" }],
      answer_2: [
        { criterion: "clarity", score: 3 },
        { criterion: "depth", score: 5, rationale: "Deep" }
      ]
    },
    verdict: "Answer B wins",
    summary: "Answer B is deeper.",
    rawResponse: { debug: "raw-secret" },
    partial: true,
    metadata: {
      judgeProfileId: "profile-a",
      driver: "generic-http",
      model: "local-test",
      validationMode: "json_contract_check",
      parseState: "strict_json",
      durationMs: 15,
      customPromptApplied: false,
      rubricSource: "default",
      token: "secret-token"
    },
    validatorResults: [
      {
        type: "required_keys",
        status: "fail",
        answerKey: "answer_1",
        key: "status",
        expected: ["status"],
        actual: "[missing]",
        message: "Required key is missing."
      }
    ]
  },
  generatedAt: "2026-05-12T11:00:00.000Z"
});

test("Markdown export renders dynamic criteria, validator findings, safe metadata, and no raw response", () => {
  const { _private } = requireExportWithElectronMock();
  const markdown = _private.buildMarkdownReport(createPayload());

  assert.match(markdown, /## Scores/);
  assert.match(markdown, /\| clarity \| 4\.5 - Clear \| 3 \|/);
  assert.match(markdown, /\| depth \| - \| 5 - Deep \|/);
  assert.doesNotMatch(markdown, /\| coherence \|/);
  assert.match(markdown, /## Validator Findings/);
  assert.match(markdown, /required_keys/);
  assert.match(markdown, /Required key is missing\./);
  assert.match(markdown, /## Metadata/);
  assert.match(markdown, /Profile ID/);
  assert.match(markdown, /profile-a/);
  assert.match(markdown, /generic-http/);
  assert.match(markdown, /strict_json/);
  assert.match(markdown, /Parsed with warnings/);
  assert.doesNotMatch(markdown, /Raw Response|raw-secret|secret-token/);
});

test("JSON export keeps legacy fields and adds normalized evaluationRun", () => {
  const { _private } = requireExportWithElectronMock();
  const payload = createPayload();
  const json = _private.buildJsonExportObject(payload);

  assert.equal(json.question, payload.question);
  assert.equal(json.answers.length, 2);
  assert.equal(json.result.rawResponse.debug, "raw-secret");
  assert.equal(json.generatedAt, payload.generatedAt);
  assert.equal(isEvaluationRunExport(json.evaluationRun), true);
  assert.equal(json.evaluationRun.result.rawResponse, undefined);
  assert.equal(json.evaluationRun.metadata.judgeProfileId, "profile-a");
  assert.doesNotMatch(JSON.stringify(json.evaluationRun), /raw-secret|secret-token/);
});

test("export payload guard accepts dynamic criteria and rejects invalid payloads", () => {
  const { _private } = requireExportWithElectronMock();

  assert.doesNotThrow(() => _private.ensurePayload(createPayload()));
  assert.throws(
    () =>
      _private.ensurePayload({
        ...createPayload(),
        result: {
          ...createPayload().result,
          scores: { answer_1: [{ criterion: "", score: 1 }] }
        }
      }),
    /Invalid judge export payload/
  );
});
