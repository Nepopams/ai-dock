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
        default: result.scores.map((score, index) => ({
          agentId: validateString(score.agentId, `result.scores[${index}].agentId`),
          criterion: sanitizeJudgeCriterion(
            score.criterion,
            `result.scores[${index}].criterion`
          ),
          score: Number.isFinite(score.score)
            ? Number(score.score)
            : (() => {
                throw new Error(`Invalid score at result.scores[${index}].score`);
              })()
        }))
      };
    } else if (result.scores && typeof result.scores === "object") {
      sanitized.scores = {};
      for (const [key, scores] of Object.entries(result.scores)) {
        if (!Array.isArray(scores)) {
          continue;
        }
        sanitized.scores[key] = scores.map((score, index) => ({
          agentId: validateString(score.agentId, `result.scores.${key}[${index}].agentId`),
          criterion: sanitizeJudgeCriterion(
            score.criterion,
            `result.scores.${key}[${index}].criterion`
          ),
          score: Number.isFinite(score.score)
            ? Number(score.score)
            : (() => {
                throw new Error(`Invalid score at result.scores.${key}[${index}].score`);
              })()
        }));
      }
    }

    if (Array.isArray(result.notes)) {
      sanitized.notes = result.notes
        .filter((note) => typeof note === "string" && note.trim())
        .map((note, index) => validateString(note, `result.notes[${index}]`));
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
