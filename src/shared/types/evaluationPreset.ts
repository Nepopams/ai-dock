export type EvaluationType =
  | "answer_comparison"
  | "research_comparison"
  | "json_contract_check"
  | "prompt_adherence"
  | "factuality_grounding"
  | "code_review"
  | "security_review"
  | "ux_product_review"
  | "summarization_quality"
  | "custom_user_rubric"
  | "single_answer_quality"
  | "multi_agent_tournament";

export type EvaluationPresetStatus = "draft" | "active" | "deprecated";

export type EvaluationValidatorType =
  | "json_parse"
  | "required_keys"
  | "enum_values"
  | "length_bounds"
  | "citation_presence"
  | "prompt_constraint_presence"
  | "forbidden_secret_pattern"
  | "source_summary_ratio";

export interface EvaluationCriterionScale {
  min: number;
  max: number;
  step?: number;
  label?: string;
}

export interface EvaluationPresetCriterion {
  id: string;
  label: string;
  description: string;
  scale: EvaluationCriterionScale;
  weight: number;
  required: boolean;
}

export interface EvaluationPresetValidator {
  type: EvaluationValidatorType;
  description: string;
  severity?: "info" | "warning" | "error";
  config?: Record<string, unknown>;
}

export interface EvaluationPresetInputExpectations {
  minSubjects: number;
  maxSubjects?: number;
  requiredContext: string[];
  acceptedContentTypes: string[];
  notes: string;
}

export interface EvaluationPresetOutputShape {
  kind: string;
  fields: string[];
  notes: string;
}

export interface EvaluationPreset {
  id: string;
  title: string;
  purpose: string;
  evaluationType: EvaluationType;
  defaultCriteria: EvaluationPresetCriterion[];
  defaultValidators: EvaluationPresetValidator[];
  inputExpectations: EvaluationPresetInputExpectations;
  outputShape: EvaluationPresetOutputShape;
  promptTemplateKey: string;
  version: string;
  tags: string[];
  status: EvaluationPresetStatus;
  allowsUserDefinedCriteria?: boolean;
}

export interface EvaluationPresetCatalog {
  schemaVersion: string;
  presets: EvaluationPreset[];
}

const VALID_EVALUATION_TYPES = new Set<EvaluationType>([
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

const VALID_PRESET_STATUSES = new Set<EvaluationPresetStatus>([
  "draft",
  "active",
  "deprecated"
]);

const VALID_VALIDATOR_TYPES = new Set<EvaluationValidatorType>([
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

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isNonEmptyString);

export const isEvaluationValidatorType = (
  value: unknown
): value is EvaluationValidatorType =>
  isString(value) && VALID_VALIDATOR_TYPES.has(value as EvaluationValidatorType);

export const isEvaluationPresetCriterion = (
  value: unknown
): value is EvaluationPresetCriterion => {
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
export const isEvaluationPresetValidator = (
  value: unknown
): value is EvaluationPresetValidator => {
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

const isInputExpectations = (
  value: unknown
): value is EvaluationPresetInputExpectations => {
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

const isOutputShape = (value: unknown): value is EvaluationPresetOutputShape => {
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

export const isEvaluationPreset = (value: unknown): value is EvaluationPreset => {
  if (!isObject(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.title) ||
    !isNonEmptyString(value.purpose) ||
    !isString(value.evaluationType) ||
    !VALID_EVALUATION_TYPES.has(value.evaluationType as EvaluationType) ||
    !isNonEmptyString(value.promptTemplateKey) ||
    !isNonEmptyString(value.version) ||
    !isString(value.status) ||
    !VALID_PRESET_STATUSES.has(value.status as EvaluationPresetStatus)
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

export const isEvaluationPresetCatalog = (
  value: unknown
): value is EvaluationPresetCatalog => {
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
