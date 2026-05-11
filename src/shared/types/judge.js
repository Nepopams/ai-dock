const isObject = (value) => typeof value === "object" && value !== null;

const isString = (value) => typeof value === "string";

const isJudgeCriterion = (value) =>
  value === "coherence" || value === "factuality" || value === "helpfulness";

const isOptionalString = (value) => value === undefined || isString(value);

const isOptionalNumber = (value) =>
  value === undefined || (typeof value === "number" && !Number.isNaN(value));

const isJudgeScore = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isJudgeCriterion(value.criterion)) {
    return false;
  }
  if (typeof value.score !== "number" || Number.isNaN(value.score)) {
    return false;
  }
  if (value.rationale !== undefined && !isString(value.rationale)) {
    return false;
  }
  return true;
};

const isJudgeResultMetadata = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (
    !isOptionalString(value.schemaVersion) ||
    !isOptionalString(value.contractVersion) ||
    !isOptionalString(value.judgeProfileId) ||
    !isOptionalString(value.driver) ||
    !isOptionalString(value.model) ||
    !isOptionalNumber(value.durationMs) ||
    !isOptionalString(value.finishReason) ||
    !isOptionalString(value.responseFormat) ||
    !isOptionalString(value.parseState) ||
    !isOptionalString(value.partialReason)
  ) {
    return false;
  }
  return true;
};

const isJudgeInput = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.requestId) || !isString(value.judgeProfileId)) {
    return false;
  }
  if (!isString(value.question)) {
    return false;
  }
  if (!Array.isArray(value.answers) || value.answers.length < 2) {
    return false;
  }
  const answersValid = value.answers.every(
    (answer) => isObject(answer) && isString(answer.agentId) && isString(answer.text)
  );
  if (!answersValid) {
    return false;
  }
  if (value.rubric !== undefined && !isString(value.rubric)) {
    return false;
  }
  return true;
};

const isJudgeResult = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.requestId) || !isString(value.verdict) || !isString(value.summary)) {
    return false;
  }
  if (!isObject(value.scores)) {
    return false;
  }
  const allScoresValid = Object.values(value.scores).every((scores) => {
    return Array.isArray(scores) && scores.every(isJudgeScore);
  });
  if (!allScoresValid) {
    return false;
  }
  if (value.notes !== undefined && !isString(value.notes)) {
    return false;
  }
  if (value.metadata !== undefined && !isJudgeResultMetadata(value.metadata)) {
    return false;
  }
  return true;
};

const isJudgeExportPayload = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.question)) {
    return false;
  }
  if (
    !Array.isArray(value.answers) ||
    value.answers.some(
      (answer) => !isObject(answer) || !isString(answer.agentId) || !isString(answer.text)
    )
  ) {
    return false;
  }
  if (!isJudgeResult(value.result)) {
    return false;
  }
  if (!isString(value.generatedAt)) {
    return false;
  }
  return true;
};

module.exports = {
  isJudgeInput,
  isJudgeResult,
  isJudgeResultMetadata,
  isJudgeScore,
  isJudgeExportPayload
};
