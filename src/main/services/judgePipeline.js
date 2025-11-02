const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const {
  loadCompletions,
  secureRetrieveToken
} = require("./settings.js");
const { send: sendOpenAI } = require("../providers/openaiCompatible");
const { send: sendGenericHttp } = require("../providers/genericHttp");
const { isJudgeInput, isJudgeScore } = require("../../shared/types/judge.js");

const SYSTEM_PROMPT = (() => {
  try {
    return fs.readFileSync(
      path.join(__dirname, "..", "..", "shared", "prompts", "judge", "system.md"),
      "utf8"
    );
  } catch (error) {
    return "You are a strict judge. Return JSON with scores, summary, verdict.";
  }
})();

const DEFAULT_RUBRIC = (() => {
  try {
    return fs.readFileSync(
      path.join(__dirname, "..", "..", "shared", "prompts", "judge", "rubric.md"),
      "utf8"
    );
  } catch (error) {
    return [
      "Coherence (1-5)",
      "Factuality (1-5)",
      "Helpfulness (1-5)",
      "Return JSON: scores{answer_1:[...]}, summary, verdict"
    ].join("\n");
  }
})();

const answerKey = (index) => `answer_${index + 1}`;

const buildUserPrompt = (input, rubric) => {
  const question = (input.question || "").trim();
  const formattedAnswers = input.answers
    .map(
      (answer, index) =>
        `Answer ${index + 1} [${answer.agentId || `agent_${index + 1}`}]:\n${(answer.text || "").trim()}`
    )
    .join("\n\n");
  return [
    "Rubric:",
    rubric.trim(),
    "",
    "Question:",
    question,
    "",
    "Answers (use keys answer_1, answer_2, ... to match the order below):",
    formattedAnswers,
    "",
    "Return strictly the JSON structure described above."
  ].join("\n");
};

const resolveProfile = async (profileId) => {
  const state = await loadCompletions();
  const profile = state?.profiles?.[profileId];
  if (!profile) {
    const err = new Error(`Judge profile "${profileId}" not found`);
    err.code = "profile_not_found";
    throw err;
  }
  let token;
  if (profile.auth?.tokenRef) {
    token = await secureRetrieveToken(profile.auth.tokenRef);
  }
  return {
    profile,
    runtimeProfile: {
      ...profile,
      auth: profile.auth
        ? {
            ...profile.auth,
            token: token || (profile.auth.tokenRef ? undefined : undefined)
          }
        : undefined
    }
  };
};

const collectCompletion = async (provider, messages, options, runtimeProfile, abortSignal) => {
  const generator = provider(messages, options, runtimeProfile, abortSignal);
  let content = "";
  let usage;
  let finishReason;
  for await (const chunk of generator) {
    if (chunk?.delta) {
      content += chunk.delta;
    }
    if (chunk?.usage) {
      usage = chunk.usage;
    }
    if (chunk?.finishReason) {
      finishReason = chunk.finishReason;
    }
  }
  return {
    content: content.trim(),
    usage,
    finishReason
  };
};

const extractJson = (raw) => {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  try {
    return {
      data: JSON.parse(trimmed),
      partial: false
    };
  } catch {
    // continue
  }
  const fenced = trimmed.match(/```json\s*([\s\S]+?)```/i) || trimmed.match(/```([\s\S]+?)```/i);
  if (fenced && fenced[1]) {
    try {
      return {
        data: JSON.parse(fenced[1].trim()),
        partial: true
      };
    } catch {
      // continue
    }
  }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const slice = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return {
        data: JSON.parse(slice),
        partial: true
      };
    } catch {
      // ignore
    }
  }
  return null;
};

const normalizeScores = (input, payloadScores) => {
  const result = {};
  for (let index = 0; index < input.answers.length; index += 1) {
    const key = answerKey(index);
    const rawScores = Array.isArray(payloadScores?.[key]) ? payloadScores[key] : [];
    const normalized = rawScores.filter((score) => isJudgeScore(score)).map((score) => ({
      criterion: score.criterion,
      score: typeof score.score === "number" ? score.score : 0,
      rationale: typeof score.rationale === "string" ? score.rationale : undefined
    }));
    result[key] = normalized;
  }
  return result;
};

const buildFallbackResult = (input, raw, reason) => {
  const scores = {};
  for (let index = 0; index < input.answers.length; index += 1) {
    const key = answerKey(index);
    scores[key] = [];
  }
  return {
    requestId: input.requestId,
    scores,
    summary: reason || "Failed to parse judge response",
    verdict: "Unable to determine winner",
    notes: reason,
    rawResponse: raw,
    partial: true
  };
};

const runJudge = async (input) => {
  if (!isJudgeInput(input)) {
    const err = new Error("Invalid judge input payload");
    err.code = "invalid_input";
    throw err;
  }

  const { profile, runtimeProfile } = await resolveProfile(input.judgeProfileId);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: buildUserPrompt(input, input.rubric || DEFAULT_RUBRIC)
    }
  ];

  const abortController = new AbortController();
  const provider = profile.driver === "generic-http" ? sendGenericHttp : sendOpenAI;
  let completion;
  try {
    completion = await collectCompletion(
      provider,
      messages,
      {
        model: profile.defaultModel,
        stream: true,
        response_format: { type: "json_object" }
      },
      runtimeProfile,
      abortController.signal
    );
  } catch (error) {
    const err = new Error(
      typeof error?.message === "string" ? error.message : "Judge request failed"
    );
    err.code = error?.code || error?.status || "judge_failed";
    throw err;
  }

  const parsed = extractJson(completion.content);
  if (!parsed || !parsed.data || typeof parsed.data !== "object") {
    return buildFallbackResult(
      input,
      completion.content,
      "Judge response is not valid JSON"
    );
  }

  const result = parsed.data;
  const scores = normalizeScores(input, result.scores || {});
  const summary =
    typeof result.summary === "string" && result.summary.trim()
      ? result.summary.trim()
      : "No summary provided";
  const verdict =
    typeof result.verdict === "string" && result.verdict.trim()
      ? result.verdict.trim()
      : "No verdict provided";

  return {
    requestId: input.requestId || randomUUID(),
    scores,
    summary,
    verdict,
    rawResponse: completion.content,
    partial: Boolean(parsed.partial)
  };
};

module.exports = {
  runJudge
};
