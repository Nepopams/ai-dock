const isObject = (value) => typeof value === "object" && value !== null;

const isString = (value) => typeof value === "string";

const isJudgeCriterion = (value) =>
  value === "coherence" || value === "factuality" || value === "helpfulness";

const isOptionalString = (value) => value === undefined || isString(value);

const isOptionalNumber = (value) =>
  value === undefined || (typeof value === "number" && !Number.isNaN(value));

const isOptionalBoolean = (value) => value === undefined || typeof value === "boolean";

const isOptionalRubricSource = (value) =>
  value === undefined || value === "default" || value === "custom";

const isJudgeValidationMode = (value) => value === "json_contract_check";

const isJudgeValidatorType = (value) =>
  value === "json_parse" || value === "required_keys" || value === "enum_values";

const isJudgeValidationStatus = (value) =>
  value === "pass" || value === "fail" || value === "warning";

const isStringArray = (value) => Array.isArray(value) && value.every(isString);

const isEnumValuesConfig = (value) => {
  if (!isObject(value) || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every(isStringArray);
};

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
    !isOptionalRubricSource(value.rubricSource) ||
    !isOptionalBoolean(value.customPromptApplied) ||
    !isOptionalBoolean(value.validationApplied) ||
    !isOptionalString(value.validationMode) ||
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

const isJudgeValidationConfig = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isJudgeValidationMode(value.mode)) {
    return false;
  }
  if (!isOptionalBoolean(value.enabled) || !isOptionalBoolean(value.allowMarkdownFence)) {
    return false;
  }
  if (value.requiredKeys !== undefined && !isStringArray(value.requiredKeys)) {
    return false;
  }
  if (value.enumValues !== undefined && !isEnumValuesConfig(value.enumValues)) {
    return false;
  }
  return true;
};

const isJudgeValidatorResult = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isJudgeValidatorType(value.type) || !isJudgeValidationStatus(value.status)) {
    return false;
  }
  if (!isString(value.answerKey) || !isString(value.message)) {
    return false;
  }
  if (
    !isOptionalString(value.agentId) ||
    !isOptionalString(value.key) ||
    !isOptionalString(value.path) ||
    !isOptionalString(value.actual)
  ) {
    return false;
  }
  if (value.expected !== undefined && !isStringArray(value.expected)) {
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
  if (value.customPrompt !== undefined && !isString(value.customPrompt)) {
    return false;
  }
  if (value.validation !== undefined && !isJudgeValidationConfig(value.validation)) {
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
  if (
    value.validatorResults !== undefined &&
    (!Array.isArray(value.validatorResults) || !value.validatorResults.every(isJudgeValidatorResult))
  ) {
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
  isJudgeValidationConfig,
  isJudgeValidatorResult,
  isJudgeScore,
  isJudgeExportPayload
};
