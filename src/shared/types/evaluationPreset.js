const VALID_EVALUATION_TYPES = new Set([
  "answer_comparison",
  "research_comparison",
  "json_contract_check",
  "prompt_adherence",
  "factuality_grounding",
  "code_review",
  "security_review",
  "ux_product_review",
  "summarization_quality",
  "custom_user_rubric",
  "single_answer_quality",
  "multi_agent_tournament"
]);

const VALID_PRESET_STATUSES = new Set(["draft", "active", "deprecated"]);

const VALID_VALIDATOR_TYPES = new Set([
  "json_parse",
  "required_keys",
  "enum_values",
  "length_bounds",
  "citation_presence",
  "prompt_constraint_presence",
  "forbidden_secret_pattern",
  "source_summary_ratio"
]);

const VALID_VALIDATOR_SEVERITIES = new Set(["info", "warning", "error"]);

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value) => typeof value === "string";

const isNonEmptyString = (value) => isString(value) && value.trim().length > 0;

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

const isStringArray = (value) => Array.isArray(value) && value.every(isNonEmptyString);

const isEvaluationValidatorType = (value) =>
  isString(value) && VALID_VALIDATOR_TYPES.has(value);

const isEvaluationPresetCriterion = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.label) ||
    !isNonEmptyString(value.description)
  ) {
    return false;
  }
  if (!isObject(value.scale)) {
    return false;
  }
  if (!isFiniteNumber(value.scale.min) || !isFiniteNumber(value.scale.max)) {
    return false;
  }
  if (value.scale.step !== undefined && !isFiniteNumber(value.scale.step)) {
    return false;
  }
  if (value.scale.label !== undefined && !isNonEmptyString(value.scale.label)) {
    return false;
  }
  if (!isFiniteNumber(value.weight) || typeof value.required !== "boolean") {
    return false;
  }
  return true;
};

const isEvaluationPresetValidator = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isEvaluationValidatorType(value.type) || !isNonEmptyString(value.description)) {
    return false;
  }
  if (
    value.severity !== undefined &&
    (!isString(value.severity) || !VALID_VALIDATOR_SEVERITIES.has(value.severity))
  ) {
    return false;
  }
  if (value.config !== undefined && !isObject(value.config)) {
    return false;
  }
  return true;
};

const isInputExpectations = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isFiniteNumber(value.minSubjects) || value.minSubjects < 1) {
    return false;
  }
  if (value.maxSubjects !== undefined && !isFiniteNumber(value.maxSubjects)) {
    return false;
  }
  if (!isStringArray(value.requiredContext) || !isStringArray(value.acceptedContentTypes)) {
    return false;
  }
  if (!isNonEmptyString(value.notes)) {
    return false;
  }
  return true;
};

const isOutputShape = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isNonEmptyString(value.kind) || !isStringArray(value.fields)) {
    return false;
  }
  if (!isNonEmptyString(value.notes)) {
    return false;
  }
  return true;
};

const isEvaluationPreset = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.title) ||
    !isNonEmptyString(value.purpose) ||
    !isString(value.evaluationType) ||
    !VALID_EVALUATION_TYPES.has(value.evaluationType) ||
    !isNonEmptyString(value.promptTemplateKey) ||
    !isNonEmptyString(value.version) ||
    !isString(value.status) ||
    !VALID_PRESET_STATUSES.has(value.status)
  ) {
    return false;
  }
  if (
    !Array.isArray(value.defaultCriteria) ||
    value.defaultCriteria.some((criterion) => !isEvaluationPresetCriterion(criterion))
  ) {
    return false;
  }
  if (
    !Array.isArray(value.defaultValidators) ||
    value.defaultValidators.some((validator) => !isEvaluationPresetValidator(validator))
  ) {
    return false;
  }
  if (!isInputExpectations(value.inputExpectations) || !isOutputShape(value.outputShape)) {
    return false;
  }
  if (!isStringArray(value.tags)) {
    return false;
  }
  if (
    value.allowsUserDefinedCriteria !== undefined &&
    typeof value.allowsUserDefinedCriteria !== "boolean"
  ) {
    return false;
  }
  return true;
};

const isEvaluationPresetCatalog = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isNonEmptyString(value.schemaVersion)) {
    return false;
  }
  if (!Array.isArray(value.presets) || value.presets.some((preset) => !isEvaluationPreset(preset))) {
    return false;
  }
  return true;
};

module.exports = {
  isEvaluationPreset,
  isEvaluationPresetCatalog,
  isEvaluationPresetCriterion,
  isEvaluationPresetValidator,
  isEvaluationValidatorType
};
