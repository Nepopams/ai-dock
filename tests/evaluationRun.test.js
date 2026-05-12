const test = require("node:test");
const assert = require("node:assert/strict");

const {
  EVALUATION_RUN_EXPORT_SCHEMA_VERSION,
  isEvaluationRunExport,
  isJudgeExportPayloadForEvaluationRun,
  mapJudgeExportPayloadToEvaluationRun
} = require("../src/shared/types/evaluationRun.js");

const createJudgeExportPayload = () => ({
  question: "Which answer is better?",
  answers: [
    { agentId: "agent-a", text: "Answer A" },
    { agentId: "agent-b", text: "Answer B" }
  ],
  result: {
    requestId: "judge-run-1",
    scores: {
      answer_1: [
        { criterion: "clarity", score: 4, rationale: "Easy to read" },
        { criterion: "factuality", score: 3 }
      ],
      answer_2: [{ criterion: "helpfulness", score: 5, rationale: "Actionable" }]
    },
    verdict: "Answer 2 wins",
    summary: "Answer 2 is more helpful.",
    notes: "No issues.",
    rawResponse: { internal: "raw model text" },
    partial: false,
    metadata: {
      judgeProfileId: "default",
      driver: "openai-compatible",
      model: "gpt-test",
      validationMode: "json_contract_check",
      parseState: "strict_json",
      durationMs: 42,
      customPromptApplied: true,
      rubricSource: "custom",
      apiKey: "secret-token",
      authorization: "Bearer secret-token",
      customPrompt: "Do not export this"
    },
    validatorResults: [
      {
        type: "required_keys",
        status: "fail",
        answerKey: "answer_1",
        agentId: "agent-a",
        key: "status",
        path: "$.status",
        expected: ["status"],
        actual: "[missing]",
        message: "Required top-level key \"status\" is missing."
      }
    ]
  },
  generatedAt: "2026-05-12T10:00:00.000Z"
});

test("EvaluationRun guard accepts mapped Judge export payload", () => {
  const payload = createJudgeExportPayload();
  const evaluationRun = mapJudgeExportPayloadToEvaluationRun(payload);

  assert.equal(isJudgeExportPayloadForEvaluationRun(payload), true);
  assert.equal(isEvaluationRunExport(evaluationRun), true);
  assert.equal(evaluationRun.schemaVersion, EVALUATION_RUN_EXPORT_SCHEMA_VERSION);
  assert.equal(evaluationRun.evaluationType, "answer_comparison");
});

test("mapper preserves question, subjects, result, validator results, and safe metadata", () => {
  const evaluationRun = mapJudgeExportPayloadToEvaluationRun(createJudgeExportPayload());

  assert.equal(evaluationRun.runId, "judge-run-1");
  assert.equal(evaluationRun.question, "Which answer is better?");
  assert.deepEqual(
    evaluationRun.subjects.map((subject) => ({
      id: subject.id,
      agentId: subject.agentId,
      content: subject.content
    })),
    [
      { id: "answer_1", agentId: "agent-a", content: "Answer A" },
      { id: "answer_2", agentId: "agent-b", content: "Answer B" }
    ]
  );
  assert.equal(evaluationRun.result.summary, "Answer 2 is more helpful.");
  assert.equal(evaluationRun.result.scores.answer_1[0].criterion, "clarity");
  assert.equal(evaluationRun.validatorResults[0].type, "required_keys");
  assert.equal(evaluationRun.metadata.judgeProfileId, "default");
  assert.equal(evaluationRun.metadata.driver, "openai-compatible");
  assert.equal(evaluationRun.metadata.model, "gpt-test");
  assert.equal(evaluationRun.metadata.customPromptApplied, true);
  assert.doesNotMatch(JSON.stringify(evaluationRun.metadata), /secret-token|authorization|"customPrompt"/i);
});

test("mapper rejects invalid Judge export payload", () => {
  assert.equal(isJudgeExportPayloadForEvaluationRun({ question: "Missing fields" }), false);
  assert.throws(
    () => mapJudgeExportPayloadToEvaluationRun({ question: "Missing fields" }),
    /Invalid judge export payload/
  );
});

test("mapper omits rawResponse by default and can include it explicitly", () => {
  const payload = createJudgeExportPayload();
  const defaultRun = mapJudgeExportPayloadToEvaluationRun(payload);
  const rawRun = mapJudgeExportPayloadToEvaluationRun(payload, { includeRawResponse: true });

  assert.equal(defaultRun.result.rawResponse, undefined);
  assert.equal(defaultRun.exportOptions.includeRawResponse, false);
  assert.deepEqual(rawRun.result.rawResponse, { internal: "raw model text" });
  assert.equal(rawRun.exportOptions.includeRawResponse, true);
});
