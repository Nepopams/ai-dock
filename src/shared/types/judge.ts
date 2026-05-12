export type JudgeCriterion = "coherence" | "factuality" | "helpfulness";

export interface JudgeScore {
  criterion: JudgeCriterion;
  score: number;
  rationale?: string;
}

export type JudgeResultParseState = "strict_json" | "extracted_json" | "failed";

export interface JudgeResultMetadata {
  schemaVersion?: string;
  contractVersion?: string;
  judgeProfileId?: string;
  driver?: string;
  model?: string;
  rubricSource?: "default" | "custom";
  customPromptApplied?: boolean;
  durationMs?: number;
  finishReason?: string;
  usage?: unknown;
  responseFormat?: string;
  parseState?: JudgeResultParseState | string;
  partialReason?: string;
}

export interface JudgeInputAnswer {
  agentId: string;
  text: string;
}

export interface JudgeInput {
  requestId: string;
  judgeProfileId: string;
  question: string;
  answers: JudgeInputAnswer[];
  rubric?: string;
  customPrompt?: string;
}

export interface JudgeResult {
  requestId: string;
  scores: Record<string, JudgeScore[]>;
  verdict: string;
  summary: string;
  notes?: string;
  rawResponse?: unknown;
  partial?: boolean;
  metadata?: JudgeResultMetadata;
}

export interface JudgeExportPayload {
  question: string;
  answers: JudgeInputAnswer[];
  result: JudgeResult;
  generatedAt: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isJudgeCriterion = (value: unknown): value is JudgeCriterion =>
  value === "coherence" || value === "factuality" || value === "helpfulness";

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || isString(value);

const isOptionalNumber = (value: unknown): value is number | undefined =>
  value === undefined || (typeof value === "number" && !Number.isNaN(value));

const isOptionalBoolean = (value: unknown): value is boolean | undefined =>
  value === undefined || typeof value === "boolean";

const isOptionalRubricSource = (value: unknown): value is "default" | "custom" | undefined =>
  value === undefined || value === "default" || value === "custom";

export const isJudgeScore = (value: unknown): value is JudgeScore => {
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

export const isJudgeResultMetadata = (value: unknown): value is JudgeResultMetadata => {
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

export const isJudgeInput = (value: unknown): value is JudgeInput => {
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
  return true;
};

export const isJudgeResult = (value: unknown): value is JudgeResult => {
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

export const isJudgeExportPayload = (value: unknown): value is JudgeExportPayload => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.question)) {
    return false;
  }
  if (!Array.isArray(value.answers) || value.answers.some((answer) => !isObject(answer) || !isString(answer.agentId) || !isString(answer.text))) {
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
