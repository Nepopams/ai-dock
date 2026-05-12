const { BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const { IPC_EXPORT_JUDGE_MD, IPC_EXPORT_JUDGE_JSON } = require("../../shared/ipc/export.ipc");
const {
  isJudgeExportPayloadForEvaluationRun,
  mapJudgeExportPayloadToEvaluationRun
} = require("../../shared/types/evaluationRun.js");

const ok = (filePath) => ({
  ok: true,
  path: filePath
});

const fail = (error) => ({
  ok: false,
  error: error instanceof Error ? error.message : String(error || "Export failed")
});

const answerKey = (index) => `answer_${index + 1}`;

const formatBlockquote = (text) =>
  String(text || "")
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join("\n");

const escapeMarkdownTableCell = (value) =>
  String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br>");

const isScoreEntry = (value) =>
  value &&
  typeof value === "object" &&
  typeof value.criterion === "string" &&
  value.criterion.trim() &&
  typeof value.score === "number" &&
  Number.isFinite(value.score);

const discoverCriteria = (payload) => {
  const criteria = [];
  const seen = new Set();
  const scores = payload.result?.scores || {};
  const buckets = [];

  for (let index = 0; index < (payload.answers || []).length; index += 1) {
    const bucket = scores[answerKey(index)];
    if (Array.isArray(bucket)) {
      buckets.push(bucket);
    }
  }

  for (const bucket of Object.values(scores)) {
    if (Array.isArray(bucket) && !buckets.includes(bucket)) {
      buckets.push(bucket);
    }
  }

  for (const bucket of buckets) {
    for (const score of bucket) {
      if (!isScoreEntry(score)) {
        continue;
      }
      const criterion = score.criterion.trim();
      if (!seen.has(criterion)) {
        seen.add(criterion);
        criteria.push(criterion);
      }
    }
  }

  return criteria;
};

const formatMarkdownTable = (payload) => {
  const answers = payload.answers || [];
  const headers = ["Criterion"].concat(
    answers.map((answer, index) => `Answer ${index + 1} (${answer.agentId || `agent_${index + 1}`})`)
  );
  const criteria = discoverCriteria(payload);
  if (!criteria.length) {
    return "_No scores provided._";
  }

  const rows = criteria.map((criterion) => {
    const cells = [criterion];
    for (let index = 0; index < answers.length; index += 1) {
      const bucket = payload.result?.scores?.[answerKey(index)];
      const scoreEntry = Array.isArray(bucket)
        ? bucket.find((item) => item?.criterion === criterion)
        : null;
      if (scoreEntry && isScoreEntry(scoreEntry)) {
        const scoreText = scoreEntry.score.toFixed(1).replace(/\.0$/, "");
        const rationale =
          typeof scoreEntry.rationale === "string" && scoreEntry.rationale.trim()
            ? ` - ${scoreEntry.rationale.trim()}`
            : "";
        cells.push(`${scoreText}${rationale}`);
      } else {
        cells.push("-");
      }
    }
    return cells;
  });

  const headerLine = `| ${headers.map(escapeMarkdownTableCell).join(" | ")} |`;
  const separatorLine = `| ${headers.map(() => "---").join(" | ")} |`;
  const rowLines = rows.map((row) => `| ${row.map(escapeMarkdownTableCell).join(" | ")} |`);
  return [headerLine, separatorLine, ...rowLines].join("\n");
};

const formatValidatorFindings = (validatorResults) => {
  if (!Array.isArray(validatorResults) || !validatorResults.length) {
    return [];
  }
  const headers = ["Answer", "Type", "Status", "Key/Path", "Expected", "Actual", "Message"];
  const rows = validatorResults.map((finding) => [
    finding.answerKey || "-",
    finding.type || "-",
    finding.status || "-",
    finding.key || finding.path || "-",
    Array.isArray(finding.expected) && finding.expected.length ? finding.expected.join(", ") : "-",
    finding.actual || "-",
    finding.message || "-"
  ]);
  return [
    "## Validator Findings",
    "",
    `| ${headers.map(escapeMarkdownTableCell).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escapeMarkdownTableCell).join(" | ")} |`)
  ];
};

const formatMetadata = (metadata) => {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }

  const rows = [];
  const addString = (label, value) => {
    if (typeof value === "string" && value.trim()) {
      rows.push([label, value.trim()]);
    }
  };

  addString("Profile ID", metadata.judgeProfileId);
  addString("Driver", metadata.driver);
  addString("Model", metadata.model);
  addString("Validation mode", metadata.validationMode);
  addString("Parse state", metadata.parseState);
  if (Number.isFinite(metadata.durationMs) && metadata.durationMs >= 0) {
    rows.push(["Duration", `${Number(metadata.durationMs)} ms`]);
  }
  if (typeof metadata.customPromptApplied === "boolean") {
    rows.push(["Custom prompt applied", metadata.customPromptApplied ? "true" : "false"]);
  }
  addString("Rubric source", metadata.rubricSource);

  if (!rows.length) {
    return [];
  }

  return [
    "## Metadata",
    "",
    "| Field | Value |",
    "| --- | --- |",
    ...rows.map((row) => `| ${row.map(escapeMarkdownTableCell).join(" | ")} |`)
  ];
};

const buildJsonExportObject = (payload) => ({
  question: payload.question,
  answers: payload.answers,
  result: payload.result,
  generatedAt: payload.generatedAt,
  evaluationRun: mapJudgeExportPayloadToEvaluationRun(payload)
});

const buildMarkdownReport = (payload) => {
  const generatedAt = (() => {
    const source = typeof payload.generatedAt === "string" ? payload.generatedAt : new Date().toISOString();
    const timestamp = new Date(source);
    return Number.isNaN(timestamp.valueOf()) ? new Date().toISOString() : timestamp.toISOString();
  })();

  const answersSection = payload.answers
    .map(
      (answer, index) =>
        `### Answer ${index + 1} (${answer.agentId || `agent_${index + 1}`})\n\n${formatBlockquote(
          answer.text || ""
        )}`
    )
    .join("\n\n");

  const table = formatMarkdownTable(payload);

  const lines = [
    "# Judge Comparison Report",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "## Question",
    "",
    formatBlockquote(payload.question || ""),
    "",
    "## Answers",
    "",
    answersSection || "_No answers provided._",
    "",
    "## Scores",
    "",
    table,
    "",
    "## Summary",
    "",
    payload.result?.summary || "No summary provided.",
    "",
    "## Verdict",
    "",
    payload.result?.verdict || "No verdict provided."
  ];

  const validatorLines = formatValidatorFindings(payload.result?.validatorResults);
  if (validatorLines.length) {
    lines.push("", ...validatorLines);
  }

  const metadataLines = formatMetadata(payload.result?.metadata);
  if (metadataLines.length) {
    lines.push("", ...metadataLines);
  }

  if (payload.result?.partial) {
    lines.push("", "> Parsed with warnings.", "");
  }

  return lines.join("\n");
};

const extractTimestamp = (value) => {
  const source =
    typeof value === "string" && value.trim() ? value.trim() : new Date().toISOString();
  const timestamp = new Date(source);
  if (Number.isNaN(timestamp.valueOf())) {
    return new Date().toISOString().replace(/[:.]/g, "-");
  }
  return timestamp.toISOString().replace(/[:.]/g, "-");
};

const ensurePayload = (payload) => {
  if (!isJudgeExportPayloadForEvaluationRun(payload)) {
    const error = new Error("Invalid judge export payload");
    error.code = "invalid_payload";
    throw error;
  }
  return payload;
};

const selectWindow = (event) => BrowserWindow.fromWebContents(event.sender) || undefined;

const registerExportIpc = () => {
  ipcMain.handle(IPC_EXPORT_JUDGE_MD, async (event, payload) => {
    try {
      const normalized = ensurePayload(payload);
      const window = selectWindow(event);
      const timestamp = extractTimestamp(normalized.generatedAt);
      const { canceled, filePath } = await dialog.showSaveDialog(window, {
        title: "Export judge report (Markdown)",
        defaultPath: path.join(process.cwd(), `judge-report-${timestamp}.md`),
        filters: [{ name: "Markdown", extensions: ["md"] }]
      });
      if (canceled || !filePath) {
        return fail("Export cancelled");
      }
      const markdown = buildMarkdownReport(normalized);
      await fs.writeFile(filePath, markdown, "utf8");
      return ok(filePath);
    } catch (error) {
      return fail(error);
    }
  });

  ipcMain.handle(IPC_EXPORT_JUDGE_JSON, async (event, payload) => {
    try {
      const normalized = ensurePayload(payload);
      const window = selectWindow(event);
      const timestamp = extractTimestamp(normalized.generatedAt);
      const { canceled, filePath } = await dialog.showSaveDialog(window, {
        title: "Export judge report (JSON)",
        defaultPath: path.join(process.cwd(), `judge-report-${timestamp}.json`),
        filters: [{ name: "JSON", extensions: ["json"] }]
      });
      if (canceled || !filePath) {
        return fail("Export cancelled");
      }
      const serializable = buildJsonExportObject(normalized);
      await fs.writeFile(filePath, `${JSON.stringify(serializable, null, 2)}\n`, "utf8");
      return ok(filePath);
    } catch (error) {
      return fail(error);
    }
  });
};

module.exports = {
  registerExportIpc,
  _private: {
    buildJsonExportObject,
    buildMarkdownReport,
    discoverCriteria,
    ensurePayload,
    formatMarkdownTable,
    formatMetadata,
    formatValidatorFindings
  }
};
