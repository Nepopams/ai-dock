const test = require("node:test");
const assert = require("node:assert/strict");

const {
  isJudgeExportPayload,
  isJudgeInput,
  isJudgeResult,
  isJudgeValidationConfig,
  isJudgeValidatorResult,
  isJudgeScore
} = require("../src/shared/types/judge.js");

const validInput = {
  requestId: "judge-1",
  judgeProfileId: "default",
  question: "Which answer is better?",
  answers: [
    { agentId: "agent-a", text: "Answer A" },
    { agentId: "agent-b", text: "Answer B" }
  ]
};

const validScores = {
  answer_1: [
    { criterion: "coherence", score: 4, rationale: "Clear" },
    { criterion: "factuality", score: 4 },
    { criterion: "helpfulness", score: 5 }
  ],
  answer_2: [
    { criterion: "coherence", score: 3 },
    { criterion: "factuality", score: 3 },
    { criterion: "helpfulness", score: 3 }
  ]
};

test("isJudgeInput accepts the current answer comparison input shape", () => {
  assert.equal(isJudgeInput(validInput), true);
  assert.equal(
    isJudgeInput({
      ...validInput,
      customPrompt: "Prefer evidence-backed answers."
    }),
    true
  );
});

test("isJudgeInput rejects invalid answer lists", () => {
  assert.equal(
    isJudgeInput({
      ...validInput,
      answers: [{ agentId: "agent-a", text: "Only one answer" }]
    }),
    false
  );
  assert.equal(
    isJudgeInput({
      ...validInput,
      answers: [
        { agentId: "agent-a", text: "Answer A" },
        { agentId: "agent-b", text: 42 }
      ]
    }),
    false
  );
});

test("isJudgeInput rejects non-string custom prompt", () => {
  assert.equal(
    isJudgeInput({
      ...validInput,
      customPrompt: { instructions: "Prefer evidence-backed answers." }
    }),
    false
  );
});

test("isJudgeInput accepts JSON contract validation config", () => {
  const validation = {
    mode: "json_contract_check",
    enabled: true,
    allowMarkdownFence: true,
    requiredKeys: ["status", "items"],
    enumValues: {
      status: ["ok", "error"]
    }
  };

  assert.equal(isJudgeValidationConfig(validation), true);
  assert.equal(
    isJudgeInput({
      ...validInput,
      validation
    }),
    true
  );
});

test("isJudgeInput rejects invalid validation config", () => {
  assert.equal(
    isJudgeInput({
      ...validInput,
      validation: { mode: "json_validation" }
    }),
    false
  );
  assert.equal(
    isJudgeInput({
      ...validInput,
      validation: {
        mode: "json_contract_check",
        requiredKeys: ["status", 42]
      }
    }),
    false
  );
  assert.equal(
    isJudgeInput({
      ...validInput,
      validation: {
        mode: "json_contract_check",
        enumValues: { status: ["ok", false] }
      }
    }),
    false
  );
});

test("isJudgeScore rejects unknown criteria and invalid scores", () => {
  assert.equal(isJudgeScore({ criterion: "coherence", score: 4 }), true);
  assert.equal(isJudgeScore({ criterion: "novelty", score: 4 }), false);
  assert.equal(isJudgeScore({ criterion: "helpfulness", score: Number.NaN }), false);
});

test("isJudgeResult accepts optional compatibility metadata", () => {
  const result = {
    requestId: "judge-1",
    scores: validScores,
    verdict: "Answer 1 wins",
    summary: "Answer 1 is clearer.",
    partial: false,
    metadata: {
      schemaVersion: "judge.result.v1",
      contractVersion: "judge.compat.v1",
      judgeProfileId: "default",
      driver: "openai-compatible",
      model: "gpt-test",
      rubricSource: "custom",
      customPromptApplied: true,
      validationApplied: true,
      validationMode: "json_contract_check",
      durationMs: 12,
      finishReason: "stop",
      usage: { total_tokens: 10 },
      responseFormat: "json_object",
      parseState: "strict_json"
    },
    validatorResults: [
      {
        type: "json_parse",
        status: "pass",
        answerKey: "answer_1",
        message: "Answer parses as JSON."
      }
    ]
  };

  assert.equal(isJudgeResult(result), true);
  assert.equal(isJudgeValidatorResult(result.validatorResults[0]), true);
});

test("isJudgeResult rejects invalid metadata and score buckets", () => {
  assert.equal(
    isJudgeResult({
      requestId: "judge-1",
      scores: validScores,
      verdict: "Answer 1 wins",
      summary: "Answer 1 is clearer.",
      metadata: { durationMs: "slow" }
    }),
    false
  );
  assert.equal(
    isJudgeResult({
      requestId: "judge-1",
      scores: validScores,
      verdict: "Answer 1 wins",
      summary: "Answer 1 is clearer.",
      metadata: { rubricSource: "secret" }
    }),
    false
  );
  assert.equal(
    isJudgeResult({
      requestId: "judge-1",
      scores: { answer_1: [{ criterion: "novelty", score: 5 }] },
      verdict: "Answer 1 wins",
      summary: "Answer 1 is clearer."
    }),
    false
  );
  assert.equal(
    isJudgeResult({
      requestId: "judge-1",
      scores: validScores,
      verdict: "Answer 1 wins",
      summary: "Answer 1 is clearer.",
      validatorResults: [{ type: "json_schema", status: "pass", answerKey: "answer_1", message: "ok" }]
    }),
    false
  );
});

test("isJudgeExportPayload accepts the current object score result shape", () => {
  assert.equal(
    isJudgeExportPayload({
      question: validInput.question,
      answers: validInput.answers,
      result: {
        requestId: "judge-1",
        scores: validScores,
        verdict: "Answer 1 wins",
        summary: "Answer 1 is clearer.",
        metadata: {
          schemaVersion: "judge.result.v1",
          parseState: "strict_json"
        }
      },
      generatedAt: new Date().toISOString()
    }),
    true
  );
});
