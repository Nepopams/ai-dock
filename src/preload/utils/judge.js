const createJudgeSanitizers = ({ validateString, ensureRequestId }) => {
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
    const usage = sanitizeJsonLikeValue(metadata.usage);
    if (usage && typeof usage === "object") {
      sanitized.usage = usage;
    }
    return Object.keys(sanitized).length ? sanitized : undefined;
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
