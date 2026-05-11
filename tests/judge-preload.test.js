const test = require("node:test");
const assert = require("node:assert/strict");

const { createJudgeSanitizers } = require("../src/preload/utils/judge.js");

const validateString = (value, name) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} must be a non-empty string`);
  }
  return value.trim();
};

const createSanitizers = () =>
  createJudgeSanitizers({
    validateString,
    ensureRequestId: (value) => (typeof value === "string" && value.trim() ? value.trim() : "generated-id")
  });

test("sanitizeJudgeInput normalizes request id, answers, and rubric", () => {
  const { sanitizeJudgeInput } = createSanitizers();
  const input = sanitizeJudgeInput({
    judgeProfileId: " default ",
    question: " Which answer is better? ",
    answers: [
      { text: " Answer A " },
      { agentId: " model-b ", text: " Answer B " }
    ],
    rubric: " Custom rubric "
  });

  assert.deepEqual(input, {
    requestId: "generated-id",
    judgeProfileId: "default",
    question: "Which answer is better?",
    answers: [
      { agentId: "agent_1", text: "Answer A" },
      { agentId: "model-b", text: "Answer B" }
    ],
    rubric: "Custom rubric"
  });
});

test("sanitizeJudgeInput rejects fewer than two answers", () => {
  const { sanitizeJudgeInput } = createSanitizers();
  assert.throws(
    () =>
      sanitizeJudgeInput({
        judgeProfileId: "default",
        question: "Question",
        answers: [{ text: "Only one" }]
      }),
    /at least two/
  );
});

test("sanitizeJudgeExportPayload handles object score buckets without agent ids", () => {
  const { sanitizeJudgeExportPayload } = createSanitizers();
  const payload = sanitizeJudgeExportPayload({
    question: "Question",
    answers: [
      { agentId: "a", text: "Answer A" },
      { agentId: "b", text: "Answer B" }
    ],
    result: {
      requestId: "judge-1",
      scores: {
        answer_1: [
          { criterion: "coherence", score: 4, rationale: "Clear" },
          { criterion: "factuality", score: 3 }
        ],
        answer_2: [{ criterion: "helpfulness", score: 5 }]
      },
      verdict: "Answer 2 wins",
      summary: "Answer 2 is more helpful.",
      notes: "Parsed with warnings",
      partial: true,
      metadata: {
        schemaVersion: "judge.result.v1",
        contractVersion: "judge.compat.v1",
        judgeProfileId: "default",
        driver: "openai-compatible",
        model: "gpt-test",
        durationMs: 25,
        finishReason: "stop",
        usage: { total_tokens: 25 },
        responseFormat: "json_object",
        parseState: "strict_json",
        baseUrl: "https://example.invalid"
      }
    },
    generatedAt: "2026-05-11T00:00:00.000Z"
  });

  assert.equal(payload.result.scores.answer_1[0].criterion, "coherence");
  assert.equal(payload.result.scores.answer_1[0].rationale, "Clear");
  assert.equal(payload.result.scores.answer_1[0].agentId, undefined);
  assert.equal(payload.result.metadata.schemaVersion, "judge.result.v1");
  assert.equal(payload.result.metadata.baseUrl, undefined);
});

test("sanitizeJudgeExportPayload rejects invalid score criteria", () => {
  const { sanitizeJudgeExportPayload } = createSanitizers();
  assert.throws(
    () =>
      sanitizeJudgeExportPayload({
        question: "Question",
        answers: [
          { agentId: "a", text: "Answer A" },
          { agentId: "b", text: "Answer B" }
        ],
        result: {
          requestId: "judge-1",
          scores: {
            answer_1: [{ criterion: "novelty", score: 4 }]
          },
          verdict: "Answer 1 wins",
          summary: "Summary"
        },
        generatedAt: "2026-05-11T00:00:00.000Z"
      }),
    /Invalid criterion/
  );
});
