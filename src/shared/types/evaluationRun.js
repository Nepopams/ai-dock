const EVALUATION_RUN_EXPORT_SCHEMA_VERSION = "evaluation-run.export.v1";

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value) => typeof value === "string";

const isNonEmptyString = (value) => isString(value) && value.trim().length > 0;

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

const isOptionalString = (value) => value === undefined || isString(value);

const isOptionalBoolean = (value) => value === undefined || typeof value === "boolean";

const isOptionalFiniteNumber = (value) => value === undefined || isFiniteNumber(value);

const answerKey = (index) => `answer_${index + 1}`;

const cloneJsonValue = (value) => {
  if (value === undefined) {
    return undefined;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return undefined;
  }
};

const isEvaluationScore = (value) => {
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

const isEvaluationScores = (value) => {
  if (!isObject(value)) {
    return false;
  }
  return Object.values(value).every(
    (bucket) => Array.isArray(bucket) && bucket.every(isEvaluationScore)
  );
};

const isValidatorResult = (value) => {
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
  if (value.expected !== undefined && (!Array.isArray(value.expected) || !value.expected.every(isString))) {
    return false;
  }
  return true;
};

const isSafeMetadata = (value) => {
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

const isEvaluationSubject = (value) => {
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

const isEvaluationRunResult = (value) => {
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

const isExportOptions = (value) => {
  if (!isObject(value)) {
    return false;
  }
  return (
    typeof value.includeRawResponse === "boolean" &&
    typeof value.includeInputs === "boolean" &&
    isNonEmptyString(value.redactionMode)
  );
};

const isEvaluationRunExport = (value) => {
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

const isJudgeExportPayloadForEvaluationRun = (value) => {
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

const normalizeTimestamp = (value) => {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.valueOf())) {
    return new Date().toISOString();
  }
  return timestamp.toISOString();
};

const cloneScores = (scores) => {
  const cloned = {};
  for (const [key, bucket] of Object.entries(scores || {})) {
    if (!Array.isArray(bucket)) {
      continue;
    }
    cloned[key] = bucket
      .filter(isEvaluationScore)
      .map((score) => {
        const next = {
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

const cloneValidatorResults = (validatorResults) => {
  if (!Array.isArray(validatorResults)) {
    return [];
  }
  return validatorResults.filter(isValidatorResult).map((result) => {
    const next = {
      type: result.type,
      status: result.status,
      answerKey: result.answerKey,
      message: result.message
    };
    for (const key of ["agentId", "key", "path", "actual"]) {
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

const pickSafeMetadata = (metadata) => {
  const source = isObject(metadata) ? metadata : {};
  const safe = {};
  for (const key of ["judgeProfileId", "driver", "model", "validationMode", "parseState", "rubricSource"]) {
    if (typeof source[key] === "string" && source[key].trim()) {
      safe[key] = source[key].trim();
    }
  }
  if (typeof source.customPromptApplied === "boolean") {
    safe.customPromptApplied = source.customPromptApplied;
  }
  if (Number.isFinite(source.durationMs) && source.durationMs >= 0) {
    safe.durationMs = Number(source.durationMs);
  }
  return safe;
};

const buildSubjects = (answers) =>
  answers.map((answer, index) => ({
    id: answerKey(index),
    kind: "answer",
    label: `Answer ${index + 1}`,
    agentId: answer.agentId,
    content: answer.text,
    contentType: "text/plain"
  }));

const mapJudgeExportPayloadToEvaluationRun = (payload, options = {}) => {
  if (!isJudgeExportPayloadForEvaluationRun(payload)) {
    const error = new Error("Invalid judge export payload for EvaluationRun export");
    error.code = "invalid_payload";
    throw error;
  }

  const includeRawResponse = options.includeRawResponse === true;
  const createdAt = normalizeTimestamp(payload.generatedAt);
  const result = {
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

module.exports = {
  EVALUATION_RUN_EXPORT_SCHEMA_VERSION,
  isEvaluationRunExport,
  isJudgeExportPayloadForEvaluationRun,
  mapJudgeExportPayloadToEvaluationRun,
  _private: {
    pickSafeMetadata,
    cloneScores,
    cloneValidatorResults
  }
};
