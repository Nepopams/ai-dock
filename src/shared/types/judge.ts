export type JudgeCriterion = "coherence" | "factuality" | "helpfulness";

export interface JudgeScore {
  criterion: JudgeCriterion;
  score: number;
  rationale?: string;
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
}

export interface JudgeResult {
  requestId: string;
  scores: Record<string, JudgeScore[]>;
  verdict: string;
  summary: string;
  notes?: string;
  rawResponse?: unknown;
  partial?: boolean;
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
