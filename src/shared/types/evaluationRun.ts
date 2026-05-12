export const EVALUATION_RUN_EXPORT_SCHEMA_VERSION = "evaluation-run.export.v1";

export type EvaluationRunExportSource = {
  kind: "judge_export";
  app: "vr-ai-dock";
  surface: "compare_view";
  payload: "JudgeExportPayload";
};

export type EvaluationRunExportSubject = {
  id: string;
  kind: "answer";
  label: string;
  agentId?: string;
  content: string;
  contentType: "text/plain";
};

export type EvaluationRunExportScore = {
  criterion: string;
  score: number;
  rationale?: string;
};

export type EvaluationRunExportValidatorResult = {
  type: string;
  status: string;
  answerKey: string;
  agentId?: string;
  message: string;
  key?: string;
  path?: string;
  expected?: string[];
  actual?: string;
};

export type EvaluationRunExportMetadata = {
  judgeProfileId?: string;
  driver?: string;
  model?: string;
  validationMode?: string;
  parseState?: string;
  durationMs?: number;
  customPromptApplied?: boolean;
  rubricSource?: string;
};

export type EvaluationRunExportResult = {
  requestId: string;
  scores: Record<string, EvaluationRunExportScore[]>;
  verdict: string;
  summary: string;
  notes?: string;
  partial?: boolean;
  rawResponse?: unknown;
};

export type EvaluationRunExportOptions = {
  includeRawResponse: boolean;
  includeInputs: boolean;
  redactionMode: "safe_metadata" | string;
};

export type EvaluationRunExport = {
  runId: string;
  schemaVersion: typeof EVALUATION_RUN_EXPORT_SCHEMA_VERSION;
  createdAt: string;
  source: EvaluationRunExportSource;
  evaluationType: "answer_comparison" | string;
  question: string;
  subjects: EvaluationRunExportSubject[];
  result: EvaluationRunExportResult;
  validatorResults: EvaluationRunExportValidatorResult[];
  metadata: EvaluationRunExportMetadata;
  exportOptions: EvaluationRunExportOptions;
};

type JudgeExportPayloadLike = {
  question: string;
  answers: Array<{
    agentId: string;
    text: string;
  }>;
  result: {
    requestId: string;
    scores: Record<string, EvaluationRunExportScore[]>;
    verdict: string;
    summary: string;
    notes?: string;
    rawResponse?: unknown;
    partial?: boolean;
    metadata?: Record<string, unknown>;
    validatorResults?: EvaluationRunExportValidatorResult[];
  };
  generatedAt: string;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || isString(value);

const isOptionalBoolean = (value: unknown): value is boolean | undefined =>
  value === undefined || typeof value === "boolean";

const isOptionalFiniteNumber = (value: unknown): value is number | undefined =>
  value === undefined || isFiniteNumber(value);

const answerKey = (index: number) => `answer_${index + 1}`;

const cloneJsonValue = (value: unknown): unknown => {
  if (value === undefined) {
    return undefined;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return undefined;
  }
};

const isEvaluationScore = (value: unknown): value is EvaluationRunExportScore => {
  if (!isObject(value)) {
    return false;
  }
  if (!isNonEmptyString(value.criterion) || !isFiniteNumber(value.score)) {
    return false;
  }
  if (value.rationale !== undefined && !isString(value.rationale)) {
    return false;
  }
  return true;
};

const isEvaluationScores = (value: unknown): value is Record<string, EvaluationRunExportScore[]> => {
  if (!isObject(value)) {
    return false;
  }
  return Object.values(value).every(
    (bucket) => Array.isArray(bucket) && bucket.every(isEvaluationScore)
  );
};

const isValidatorResult = (value: unknown): value is EvaluationRunExportValidatorResult => {
  if (!isObject(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.type) ||
    !isNonEmptyString(value.status) ||
    !isNonEmptyString(value.answerKey) ||
    !isNonEmptyString(value.message)
  ) {
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
  if (
    value.expected !== undefined &&
    (!Array.isArray(value.expected) || !value.expected.every(isString))
  ) {
    return false;
  }
  return true;
};

const isSafeMetadata = (value: unknown): value is EvaluationRunExportMetadata => {
  if (!isObject(value)) {
    return false;
  }
  return (
    isOptionalString(value.judgeProfileId) &&
    isOptionalString(value.driver) &&
    isOptionalString(value.model) &&
    isOptionalString(value.validationMode) &&
    isOptionalString(value.parseState) &&
    isOptionalString(value.rubricSource) &&
    isOptionalBoolean(value.customPromptApplied) &&
    isOptionalFiniteNumber(value.durationMs)
  );
};

const isEvaluationSubject = (value: unknown): value is EvaluationRunExportSubject => {
  if (!isObject(value)) {
    return false;
  }
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.kind) &&
    isNonEmptyString(value.label) &&
    isOptionalString(value.agentId) &&
    isString(value.content) &&
    isNonEmptyString(value.contentType)
  );
};

const isEvaluationRunResult = (value: unknown): value is EvaluationRunExportResult => {
  if (!isObject(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.requestId) ||
    !isEvaluationScores(value.scores) ||
    !isString(value.summary) ||
    !isString(value.verdict)
  ) {
    return false;
  }
  if (!isOptionalString(value.notes) || !isOptionalBoolean(value.partial)) {
    return false;
  }
  return true;
};

const isExportOptions = (value: unknown): value is EvaluationRunExportOptions => {
  if (!isObject(value)) {
    return false;
  }
  return (
    typeof value.includeRawResponse === "boolean" &&
    typeof value.includeInputs === "boolean" &&
    isNonEmptyString(value.redactionMode)
  );
};

export const isEvaluationRunExport = (value: unknown): value is EvaluationRunExport => {
  if (!isObject(value)) {
    return false;
  }
  if (
    !isNonEmptyString(value.runId) ||
    value.schemaVersion !== EVALUATION_RUN_EXPORT_SCHEMA_VERSION ||
    !isNonEmptyString(value.createdAt) ||
    !isObject(value.source) ||
    !isNonEmptyString(value.source.kind) ||
    !isNonEmptyString(value.evaluationType) ||
    !isString(value.question) ||
    !Array.isArray(value.subjects) ||
    !value.subjects.every(isEvaluationSubject) ||
    !isEvaluationRunResult(value.result) ||
    !Array.isArray(value.validatorResults) ||
    !value.validatorResults.every(isValidatorResult) ||
    !isSafeMetadata(value.metadata) ||
    !isExportOptions(value.exportOptions)
  ) {
    return false;
  }
  return true;
};

export const isJudgeExportPayloadForEvaluationRun = (
  value: unknown
): value is JudgeExportPayloadLike => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.question) || !Array.isArray(value.answers) || !isNonEmptyString(value.generatedAt)) {
    return false;
  }
  const answersValid = value.answers.every(
    (answer) => isObject(answer) && isNonEmptyString(answer.agentId) && isString(answer.text)
  );
  if (!answersValid || !isObject(value.result)) {
    return false;
  }
  if (
    !isNonEmptyString(value.result.requestId) ||
    !isEvaluationScores(value.result.scores) ||
    !isString(value.result.summary) ||
    !isString(value.result.verdict)
  ) {
    return false;
  }
  if (!isOptionalString(value.result.notes) || !isOptionalBoolean(value.result.partial)) {
    return false;
  }
  if (value.result.metadata !== undefined && !isObject(value.result.metadata)) {
    return false;
  }
  if (
    value.result.validatorResults !== undefined &&
    (!Array.isArray(value.result.validatorResults) ||
      !value.result.validatorResults.every(isValidatorResult))
  ) {
    return false;
  }
  return true;
};

const normalizeTimestamp = (value: string) => {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.valueOf())) {
    return new Date().toISOString();
  }
  return timestamp.toISOString();
};

const cloneScores = (scores: Record<string, EvaluationRunExportScore[]>) => {
  const cloned: Record<string, EvaluationRunExportScore[]> = {};
  for (const [key, bucket] of Object.entries(scores || {})) {
    if (!Array.isArray(bucket)) {
      continue;
    }
    cloned[key] = bucket.filter(isEvaluationScore).map((score) => {
      const next: EvaluationRunExportScore = {
        criterion: score.criterion.trim(),
        score: Number(score.score)
      };
      if (typeof score.rationale === "string" && score.rationale.trim()) {
        next.rationale = score.rationale.trim();
      }
      return next;
    });
  }
  return cloned;
};

const cloneValidatorResults = (validatorResults: unknown) => {
  if (!Array.isArray(validatorResults)) {
    return [];
  }
  return validatorResults.filter(isValidatorResult).map((result) => {
    const next: EvaluationRunExportValidatorResult = {
      type: result.type,
      status: result.status,
      answerKey: result.answerKey,
      message: result.message
    };
    for (const key of ["agentId", "key", "path", "actual"] as const) {
      if (typeof result[key] === "string" && result[key].trim()) {
        next[key] = result[key].trim();
      }
    }
    if (Array.isArray(result.expected)) {
      next.expected = result.expected.filter(isString);
    }
    return next;
  });
};

const pickSafeMetadata = (metadata: unknown) => {
  const source = isObject(metadata) ? metadata : {};
  const safe: EvaluationRunExportMetadata = {};
  for (const key of ["judgeProfileId", "driver", "model", "validationMode", "parseState", "rubricSource"] as const) {
    if (typeof source[key] === "string" && source[key].trim()) {
      safe[key] = source[key].trim();
    }
  }
  if (typeof source.customPromptApplied === "boolean") {
    safe.customPromptApplied = source.customPromptApplied;
  }
  if (typeof source.durationMs === "number" && Number.isFinite(source.durationMs) && source.durationMs >= 0) {
    safe.durationMs = source.durationMs;
  }
  return safe;
};

const buildSubjects = (answers: JudgeExportPayloadLike["answers"]): EvaluationRunExportSubject[] =>
  answers.map((answer, index) => ({
    id: answerKey(index),
    kind: "answer",
    label: `Answer ${index + 1}`,
    agentId: answer.agentId,
    content: answer.text,
    contentType: "text/plain"
  }));

export const mapJudgeExportPayloadToEvaluationRun = (
  payload: unknown,
  options: { includeRawResponse?: boolean } = {}
): EvaluationRunExport => {
  if (!isJudgeExportPayloadForEvaluationRun(payload)) {
    throw new Error("Invalid judge export payload for EvaluationRun export");
  }

  const includeRawResponse = options.includeRawResponse === true;
  const createdAt = normalizeTimestamp(payload.generatedAt);
  const result: EvaluationRunExportResult = {
    requestId: payload.result.requestId,
    scores: cloneScores(payload.result.scores),
    summary: payload.result.summary,
    verdict: payload.result.verdict,
    partial: Boolean(payload.result.partial)
  };
  if (typeof payload.result.notes === "string" && payload.result.notes.trim()) {
    result.notes = payload.result.notes.trim();
  }
  if (includeRawResponse) {
    const rawResponse = cloneJsonValue(payload.result.rawResponse);
    if (rawResponse !== undefined) {
      result.rawResponse = rawResponse;
    }
  }

  return {
    runId: payload.result.requestId,
    schemaVersion: EVALUATION_RUN_EXPORT_SCHEMA_VERSION,
    createdAt,
    source: {
      kind: "judge_export",
      app: "vr-ai-dock",
      surface: "compare_view",
      payload: "JudgeExportPayload"
    },
    evaluationType: "answer_comparison",
    question: payload.question,
    subjects: buildSubjects(payload.answers),
    result,
    validatorResults: cloneValidatorResults(payload.result.validatorResults),
    metadata: pickSafeMetadata(payload.result.metadata),
    exportOptions: {
      includeRawResponse,
      includeInputs: true,
      redactionMode: "safe_metadata"
    }
  };
};
