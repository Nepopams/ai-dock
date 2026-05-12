const createJudgeSanitizers = ({ validateString, ensureRequestId }) => {
  const MAX_VALIDATION_KEYS = 50;
  const MAX_VALIDATION_KEY_LENGTH = 200;
  const MAX_ENUM_VALUES_PER_KEY = 50;
  const MAX_ENUM_VALUE_LENGTH = 200;

  const normalizeValidationKey = (value, path) => {
    if (typeof value !== "string") {
      throw new Error(`${path} must be a string`);
    }
    return value.trim().slice(0, MAX_VALIDATION_KEY_LENGTH);
  };

  const sanitizeStringList = (value, path, limit, maxLength) => {
    if (value === undefined) {
      return undefined;
    }
    if (!Array.isArray(value)) {
      throw new Error(`${path} must be an array`);
    }
    const result = [];
    for (let index = 0; index < value.length && result.length < limit; index += 1) {
      const item = value[index];
      if (typeof item !== "string") {
        throw new Error(`${path}[${index}] must be a string`);
      }
      const normalized = item.trim().slice(0, maxLength);
      if (normalized && !result.includes(normalized)) {
        result.push(normalized);
      }
    }
    return result.length ? result : undefined;
  };

  const sanitizeEnumValues = (value) => {
    if (value === undefined) {
      return undefined;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("validation.enumValues must be an object");
    }
    const result = {};
    for (const [rawKey, rawValues] of Object.entries(value).slice(0, MAX_VALIDATION_KEYS)) {
      const key = normalizeValidationKey(rawKey, "validation.enumValues key");
      if (!key) {
        continue;
      }
      const values = sanitizeStringList(
        rawValues,
        `validation.enumValues.${key}`,
        MAX_ENUM_VALUES_PER_KEY,
        MAX_ENUM_VALUE_LENGTH
      );
      if (values) {
        result[key] = values;
      }
    }
    return Object.keys(result).length ? result : undefined;
  };

  const sanitizeValidationConfig = (validation) => {
    if (validation === undefined) {
      return undefined;
    }
    if (!validation || typeof validation !== "object" || Array.isArray(validation)) {
      throw new Error("validation must be an object");
    }
    const mode = validateString(validation.mode, "validation.mode");
    if (mode !== "json_contract_check") {
      throw new Error("validation.mode must be json_contract_check");
    }
    if (validation.enabled !== undefined && typeof validation.enabled !== "boolean") {
      throw new Error("validation.enabled must be a boolean");
    }
    if (
      validation.allowMarkdownFence !== undefined &&
      typeof validation.allowMarkdownFence !== "boolean"
    ) {
      throw new Error("validation.allowMarkdownFence must be a boolean");
    }
    const sanitized = {
      mode,
      enabled: validation.enabled !== false,
      allowMarkdownFence: Boolean(validation.allowMarkdownFence)
    };
    const requiredKeys = sanitizeStringList(
      validation.requiredKeys,
      "validation.requiredKeys",
      MAX_VALIDATION_KEYS,
      MAX_VALIDATION_KEY_LENGTH
    );
    if (requiredKeys) {
      sanitized.requiredKeys = requiredKeys;
    }
    const enumValues = sanitizeEnumValues(validation.enumValues);
    if (enumValues) {
      sanitized.enumValues = enumValues;
    }
    return sanitized;
  };

  const sanitizeJudgeAnswer = (answer, index) => {
    if (!answer || typeof answer !== "object") {
      throw new Error(`answer at index ${index} must be an object`);
    }
    const agentId =
      typeof answer.agentId === "string" && answer.agentId.trim()
        ? answer.agentId.trim()
        : `agent_${index + 1}`;
    const text = validateString(answer.text, `answers[${index}].text`);
    return {
      agentId,
      text
    };
  };

  const sanitizeJudgeInput = (input) => {
    if (!input || typeof input !== "object") {
      throw new Error("judge input must be an object");
    }
    const judgeProfileId = validateString(input.judgeProfileId, "judgeProfileId");
    const question = validateString(input.question, "question");
    if (!Array.isArray(input.answers) || input.answers.length < 2) {
      throw new Error("answers must include at least two items");
    }
    const answers = input.answers.map((answer, index) => sanitizeJudgeAnswer(answer, index));
    const payload = {
      requestId: ensureRequestId(input.requestId),
      judgeProfileId,
      question,
      answers
    };
    if (typeof input.rubric === "string" && input.rubric.trim()) {
      payload.rubric = input.rubric.trim();
    }
    if (input.customPrompt !== undefined && typeof input.customPrompt !== "string") {
      throw new Error("customPrompt must be a string");
    }
    if (typeof input.customPrompt === "string" && input.customPrompt.trim()) {
      payload.customPrompt = input.customPrompt.trim();
    }
    const validation = sanitizeValidationConfig(input.validation);
    if (validation) {
      payload.validation = validation;
    }
    return payload;
  };

  const sanitizeJudgeCriterion = (value, path) => {
    const normalized = validateString(value, path);
    if (normalized !== "coherence" && normalized !== "factuality" && normalized !== "helpfulness") {
      throw new Error(`Invalid criterion at ${path}`);
    }
    return normalized;
  };

  const sanitizeOptionalString = (value) =>
    typeof value === "string" && value.trim() ? value.trim() : undefined;

  const sanitizeJsonLikeValue = (value) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch {
      return undefined;
    }
  };

  const sanitizeJudgeMetadata = (metadata) => {
    if (!metadata || typeof metadata !== "object") {
      return undefined;
    }
    const sanitized = {};
    for (const key of [
      "schemaVersion",
      "contractVersion",
      "judgeProfileId",
      "driver",
      "model",
      "validationMode",
      "finishReason",
      "responseFormat",
      "parseState",
      "partialReason"
    ]) {
      const value = sanitizeOptionalString(metadata[key]);
      if (value) {
        sanitized[key] = value;
      }
    }
    if (Number.isFinite(metadata.durationMs) && metadata.durationMs >= 0) {
      sanitized.durationMs = Number(metadata.durationMs);
    }
    if (metadata.rubricSource === "default" || metadata.rubricSource === "custom") {
      sanitized.rubricSource = metadata.rubricSource;
    }
    if (typeof metadata.customPromptApplied === "boolean") {
      sanitized.customPromptApplied = metadata.customPromptApplied;
    }
    if (typeof metadata.validationApplied === "boolean") {
      sanitized.validationApplied = metadata.validationApplied;
    }
    const usage = sanitizeJsonLikeValue(metadata.usage);
    if (usage && typeof usage === "object") {
      sanitized.usage = usage;
    }
    return Object.keys(sanitized).length ? sanitized : undefined;
  };

  const sanitizeJudgeValidatorResultForExport = (result, index) => {
    if (!result || typeof result !== "object") {
      throw new Error(`Invalid validator result at result.validatorResults[${index}]`);
    }
    const type = validateString(result.type, `result.validatorResults[${index}].type`);
    if (type !== "json_parse" && type !== "required_keys" && type !== "enum_values") {
      throw new Error(`Invalid validator type at result.validatorResults[${index}].type`);
    }
    const status = validateString(result.status, `result.validatorResults[${index}].status`);
    if (status !== "pass" && status !== "fail" && status !== "warning") {
      throw new Error(`Invalid validator status at result.validatorResults[${index}].status`);
    }
    const sanitized = {
      type,
      status,
      answerKey: validateString(result.answerKey, `result.validatorResults[${index}].answerKey`),
      message: validateString(result.message, `result.validatorResults[${index}].message`)
    };
    for (const key of ["agentId", "key", "path", "actual"]) {
      const value = sanitizeOptionalString(result[key]);
      if (value) {
        sanitized[key] = value.slice(0, 500);
      }
    }
    const expected = sanitizeStringList(
      result.expected,
      `result.validatorResults[${index}].expected`,
      MAX_ENUM_VALUES_PER_KEY,
      MAX_ENUM_VALUE_LENGTH
    );
    if (expected) {
      sanitized.expected = expected;
    }
    return sanitized;
  };

  const sanitizeJudgeScoreForExport = (score, path, fallbackAgentId) => {
    if (!score || typeof score !== "object") {
      throw new Error(`Invalid score at ${path}`);
    }
    const sanitized = {
      criterion: sanitizeJudgeCriterion(score.criterion, `${path}.criterion`),
      score: Number.isFinite(score.score)
        ? Number(score.score)
        : (() => {
            throw new Error(`Invalid score at ${path}.score`);
          })()
    };
    const agentId =
      typeof score.agentId === "string" && score.agentId.trim()
        ? score.agentId.trim()
        : fallbackAgentId;
    if (agentId) {
      sanitized.agentId = agentId;
    }
    if (typeof score.rationale === "string" && score.rationale.trim()) {
      sanitized.rationale = score.rationale.trim();
    }
    return sanitized;
  };

  const sanitizeJudgeResultForExport = (result) => {
    if (!result || typeof result !== "object") {
      throw new Error("export payload is missing judge result");
    }
    const sanitized = {
      requestId: validateString(result.requestId, "result.requestId"),
      verdict: validateString(result.verdict, "result.verdict"),
      summary: validateString(result.summary, "result.summary"),
      scores: {},
      partial: Boolean(result.partial)
    };

    if (Array.isArray(result.scores)) {
      sanitized.scores = {
        default: result.scores.map((score, index) =>
          sanitizeJudgeScoreForExport(
            score,
            `result.scores[${index}]`,
            typeof score?.agentId === "string" && score.agentId.trim()
              ? score.agentId.trim()
              : `score_${index + 1}`
          )
        )
      };
    } else if (result.scores && typeof result.scores === "object") {
      sanitized.scores = {};
      for (const [key, scores] of Object.entries(result.scores)) {
        if (!Array.isArray(scores)) {
          continue;
        }
        sanitized.scores[key] = scores.map((score, index) =>
          sanitizeJudgeScoreForExport(score, `result.scores.${key}[${index}]`)
        );
      }
    }

    if (typeof result.notes === "string" && result.notes.trim()) {
      sanitized.notes = result.notes.trim();
    } else if (Array.isArray(result.notes)) {
      const notes = result.notes
        .filter((note) => typeof note === "string" && note.trim())
        .map((note, index) => validateString(note, `result.notes[${index}]`));
      if (notes.length) {
        sanitized.notes = notes.join("\n");
      }
    }

    const metadata = sanitizeJudgeMetadata(result.metadata);
    if (metadata) {
      sanitized.metadata = metadata;
    }
    if (Array.isArray(result.validatorResults)) {
      sanitized.validatorResults = result.validatorResults.map((item, index) =>
        sanitizeJudgeValidatorResultForExport(item, index)
      );
    }

    return sanitized;
  };

  const sanitizeJudgeExportPayload = (payload) => {
    if (!payload || typeof payload !== "object") {
      throw new Error("export payload must be an object");
    }
    const question = validateString(payload.question, "export.question");
    const answers =
      Array.isArray(payload.answers) && payload.answers.length
        ? payload.answers.map((answer, index) => ({
            ...sanitizeJudgeAnswer(answer, index),
            id: undefined
          }))
        : [];
    const generatedAt =
      typeof payload.generatedAt === "string" && payload.generatedAt.trim()
        ? payload.generatedAt.trim()
        : new Date().toISOString();
    return {
      question,
      answers,
      result: sanitizeJudgeResultForExport(payload.result || {}),
      generatedAt
    };
  };

  return {
    sanitizeJudgeInput,
    sanitizeJudgeExportPayload
  };
};

module.exports = {
  createJudgeSanitizers
};
