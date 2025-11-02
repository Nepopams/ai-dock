const { BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const { IPC_EXPORT_JUDGE_MD, IPC_EXPORT_JUDGE_JSON } = require("../../shared/ipc/export.ipc");
const { isJudgeExportPayload, isJudgeResult, isJudgeScore } = require("../../shared/types/judge.js");

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

const formatMarkdownTable = (payload) => {
  const answers = payload.answers || [];
  const headers = ["Criterion"].concat(
    answers.map((answer, index) => `Answer ${index + 1} (${answer.agentId || `agent_${index + 1}`})`)
  );
  const criteria = ["coherence", "factuality", "helpfulness"];
  const rows = criteria.map((criterion) => {
    const cells = [criterion];
    for (let index = 0; index < answers.length; index += 1) {
      const bucket = payload.result?.scores?.[answerKey(index)];
      const scoreEntry = Array.isArray(bucket)
        ? bucket.find((item) => item?.criterion === criterion)
        : null;
      if (scoreEntry && isJudgeScore(scoreEntry)) {
        const scoreText = Number.isFinite(scoreEntry.score) ? scoreEntry.score.toFixed(1).replace(/\.0$/, "") : "—";
        const rationale = scoreEntry.rationale ? ` — ${scoreEntry.rationale}` : "";
        cells.push(`${scoreText}${rationale}`);
      } else {
        cells.push("—");
      }
    }
    return cells;
  });

  const headerLine = `| ${headers.join(" | ")} |`;
  const separatorLine = `| ${headers.map(() => "---").join(" | ")} |`;
  const rowLines = rows.map((row) => `| ${row.join(" | ")} |`);
  return [headerLine, separatorLine, ...rowLines].join("\n");
};

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

  if (payload.result?.partial) {
    lines.push("", "> ⚠️ Parsed with warnings.", "");
  }

  if (payload.result?.rawResponse) {
    lines.push("## Raw Response", "", "```json", JSON.stringify(payload.result.rawResponse, null, 2), "```");
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
  if (!isJudgeExportPayload(payload)) {
    const error = new Error("Invalid judge export payload");
    error.code = "invalid_payload";
    throw error;
  }
  if (!isJudgeResult(payload.result)) {
    const error = new Error("Judge result is not provided");
    error.code = "invalid_result";
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
      const serializable = {
        question: normalized.question,
        answers: normalized.answers,
        result: normalized.result,
        generatedAt: normalized.generatedAt
      };
      await fs.writeFile(filePath, `${JSON.stringify(serializable, null, 2)}\n`, "utf8");
      return ok(filePath);
    } catch (error) {
      return fail(error);
    }
  });
};

module.exports = {
  registerExportIpc
};
