import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDockStore } from "../store/useDockStore";
import CompareView from "./CompareView";
import type { JudgeResult } from "../../../shared/types/judge";
import type {
  EvaluationRunExport,
  EvaluationRunRecord,
  EvaluationRunSummary
} from "../../../shared/types/evaluationRun";

type StudioMode = {
  title: string;
  status: "Available" | "Planned";
  description: string;
};

type EvaluationRunListResponse =
  | { ok: true; runs: EvaluationRunSummary[]; total: number }
  | { ok: false; error?: string };

type EvaluationRunReadResponse =
  | { ok: true; record: EvaluationRunRecord }
  | { ok: false; error?: string };

type EvaluationRunDeleteResponse =
  | { ok: true; deleted: true }
  | { ok: false; error?: string };

type EvaluationRunsBridge = {
  list: (paging: { limit?: number; offset?: number }) => Promise<EvaluationRunListResponse>;
  read: (id: string) => Promise<EvaluationRunReadResponse>;
  delete: (id: string) => Promise<EvaluationRunDeleteResponse>;
};

const studioModes: StudioMode[] = [
  {
    title: "Answer comparison",
    status: "Available",
    description: "Run the current Judge flow across two or more candidate answers."
  },
  {
    title: "JSON contract check",
    status: "Available",
    description: "Use the existing Judge form to validate required JSON keys and structure."
  },
  {
    title: "Custom rubric/instructions",
    status: "Available",
    description: "Add a scoped rubric or judge prompt before running evaluation."
  },
  {
    title: "Evaluation history",
    status: "Available",
    description: "Save, reopen, and delete EvaluationRuns from the Studio."
  },
  {
    title: "Research comparison",
    status: "Planned",
    description: "Compare richer research outputs in a later Evaluation Studio slice."
  }
];

const getEvaluationRunsBridge = (): EvaluationRunsBridge | undefined =>
  (window as unknown as { evaluationRuns?: EvaluationRunsBridge }).evaluationRuns;

const formatDateTime = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return "-";
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  } catch {
    return date.toISOString();
  }
};

const formatEvaluationType = (value: string) =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatAverageScore = (value?: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return value.toFixed(1).replace(/\.0$/, "");
};

const getSafeError = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const buildCompareAnswersFromRun = (run: EvaluationRunExport) =>
  run.subjects
    .filter((subject) => subject.kind === "answer")
    .map((subject, index) => ({
      id: subject.id || `answer_${index + 1}`,
      agentId: subject.agentId || subject.label || `Answer ${index + 1}`,
      text: typeof subject.content === "string" ? subject.content : ""
    }))
    .filter((answer) => answer.text.trim().length > 0);

const buildJudgeResultFromRun = (run: EvaluationRunExport): JudgeResult => {
  const result: JudgeResult = {
    requestId: run.result.requestId || run.runId,
    scores: run.result.scores as JudgeResult["scores"],
    verdict: run.result.verdict,
    summary: run.result.summary,
    partial: Boolean(run.result.partial),
    metadata: run.metadata as JudgeResult["metadata"],
    validatorResults: run.validatorResults as JudgeResult["validatorResults"]
  };
  if (typeof run.result.notes === "string" && run.result.notes.trim()) {
    result.notes = run.result.notes;
  }
  if (Object.prototype.hasOwnProperty.call(run.result, "rawResponse")) {
    result.rawResponse = run.result.rawResponse;
  }
  return result;
};

function EvaluationStudioView() {
  const compareDraft = useDockStore((state) => state.compareDraft);
  const prepareJudgeComparison = useDockStore(
    (state) => state.actions.prepareJudgeComparison
  );
  const hydrateJudgeResult = useDockStore((state) => state.actions.hydrateJudgeResult);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [question, setQuestion] = useState("");
  const [answerAText, setAnswerAText] = useState("");
  const [answerBText, setAnswerBText] = useState("");
  const [answerALabel, setAnswerALabel] = useState("");
  const [answerBLabel, setAnswerBLabel] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);
  const [savedRuns, setSavedRuns] = useState<EvaluationRunSummary[]>([]);
  const [savedRunsTotal, setSavedRunsTotal] = useState(0);
  const [savedRunsLoading, setSavedRunsLoading] = useState(false);
  const [savedRunsError, setSavedRunsError] = useState<string | null>(null);
  const [openingRunId, setOpeningRunId] = useState<string | null>(null);
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);
  const [currentOpenedRunId, setCurrentOpenedRunId] = useState<string | null>(null);

  const hasDraft = Boolean(compareDraft);

  const availableCount = useMemo(
    () => studioModes.filter((mode) => mode.status === "Available").length,
    []
  );

  const loadSavedRuns = useCallback(async () => {
    const api = getEvaluationRunsBridge();
    if (!api?.list) {
      setSavedRuns([]);
      setSavedRunsTotal(0);
      setSavedRunsError("Evaluation history API unavailable.");
      return;
    }
    setSavedRunsLoading(true);
    setSavedRunsError(null);
    try {
      const response = await api.list({ limit: 20, offset: 0 });
      if (response?.ok) {
        setSavedRuns(Array.isArray(response.runs) ? response.runs : []);
        setSavedRunsTotal(Number.isFinite(response.total) ? response.total : 0);
      } else {
        setSavedRunsError(response?.error || "Failed to load saved evaluations.");
      }
    } catch (error) {
      setSavedRunsError(getSafeError(error, "Failed to load saved evaluations."));
    } finally {
      setSavedRunsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSavedRuns();
  }, [loadSavedRuns]);

  const handleManualStart = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedAnswerA = answerAText.trim();
    const trimmedAnswerB = answerBText.trim();

    if (!trimmedAnswerA || !trimmedAnswerB) {
      const message = "Add both answers to start a comparison.";
      setManualError(message);
      showToast(message);
      return;
    }

    setManualError(null);
    setCurrentOpenedRunId(null);
    await prepareJudgeComparison({
      question: question.trim(),
      requestId: `manual-evaluation-${Date.now()}`,
      answers: [
        {
          id: "manual-answer-a",
          agentId: answerALabel.trim() || "Answer A",
          text: trimmedAnswerA
        },
        {
          id: "manual-answer-b",
          agentId: answerBLabel.trim() || "Answer B",
          text: trimmedAnswerB
        }
      ]
    });
  };

  const handleOpenSavedRun = async (summary: EvaluationRunSummary) => {
    const api = getEvaluationRunsBridge();
    if (!api?.read) {
      showToast("Evaluation history API unavailable");
      return;
    }
    setOpeningRunId(summary.id);
    try {
      const response = await api.read(summary.id);
      if (!response?.ok || !response.record?.run) {
        showToast(response?.error || "Saved evaluation not found");
        return;
      }
      const run = response.record.run;
      const answers = buildCompareAnswersFromRun(run);
      if (answers.length < 2) {
        showToast("Saved evaluation has fewer than two answers");
        return;
      }
      await prepareJudgeComparison({
        question: run.question || "",
        requestId: run.runId || response.record.id,
        judgeProfileId: run.metadata?.judgeProfileId,
        answers
      });
      hydrateJudgeResult(buildJudgeResultFromRun(run));
      setCurrentOpenedRunId(response.record.id);
      showToast("Saved evaluation opened");
    } catch (error) {
      showToast(getSafeError(error, "Failed to open saved evaluation"));
    } finally {
      setOpeningRunId(null);
    }
  };

  const handleDeleteSavedRun = async (summary: EvaluationRunSummary) => {
    const api = getEvaluationRunsBridge();
    if (!api?.delete) {
      showToast("Evaluation history API unavailable");
      return;
    }
    const confirmed = window.confirm(`Delete saved evaluation "${summary.title}"?`);
    if (!confirmed) {
      return;
    }
    const deletingOpenRun =
      currentOpenedRunId === summary.id || compareDraft?.requestId === summary.id;
    setDeletingRunId(summary.id);
    try {
      const response = await api.delete(summary.id);
      if (response?.ok) {
        await loadSavedRuns();
        showToast(
          deletingOpenRun
            ? "Saved evaluation deleted; open result remains in workspace"
            : "Saved evaluation deleted"
        );
      } else {
        showToast(response?.error || "Delete failed");
      }
    } catch (error) {
      showToast(getSafeError(error, "Delete failed"));
    } finally {
      setDeletingRunId(null);
    }
  };

  return (
    <section className="evaluation-studio-view" aria-labelledby="evaluation-studio-title">
      <header className="evaluation-studio-header">
        <div className="evaluation-studio-heading">
          <span className="evaluation-studio-kicker">Judge Mode</span>
          <h1 id="evaluation-studio-title">Evaluation Studio</h1>
          <p>
            Compare candidate answers with Judge, tune rubric guidance, and validate
            structured outputs from one focused workspace.
          </p>
        </div>
        <div className="evaluation-studio-summary" aria-label="Evaluation Studio status">
          <strong>{availableCount}</strong>
          <span>available modes</span>
        </div>
      </header>

      <div className="evaluation-studio-modes" aria-label="Evaluation modes">
        {studioModes.map((mode) => (
          <article
            className={`evaluation-mode-card evaluation-mode-card--${mode.status.toLowerCase()}`}
            key={mode.title}
          >
            <span className="evaluation-mode-status">{mode.status}</span>
            <h2>{mode.title}</h2>
            <p>{mode.description}</p>
          </article>
        ))}
      </div>

      <section className="evaluation-history-panel" aria-labelledby="evaluation-history-title">
        <div className="evaluation-history-header">
          <div>
            <span className="evaluation-studio-kicker">Saved runs</span>
            <h2 id="evaluation-history-title">Saved evaluations</h2>
            <p>
              {savedRunsTotal
                ? `Showing ${savedRuns.length} of ${savedRunsTotal}`
                : "No saved evaluations yet"}
            </p>
          </div>
          <button
            type="button"
            className="pill-btn ghost"
            onClick={() => void loadSavedRuns()}
            disabled={savedRunsLoading}
          >
            {savedRunsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {savedRunsError && <p className="evaluation-history-error">{savedRunsError}</p>}

        {savedRunsLoading && !savedRuns.length ? (
          <div className="evaluation-history-empty">Loading saved evaluations...</div>
        ) : savedRuns.length ? (
          <div className="evaluation-history-list">
            {savedRuns.map((run) => {
              const averageScore = formatAverageScore(run.scoreSummary?.averageScore);
              const validatorFailCount =
                run.validatorSummary.fail + run.validatorSummary.error;
              const validatorWarnCount = run.validatorSummary.warn;
              const metadata = run.metadataSummary || {};
              return (
                <article className="evaluation-history-item" key={run.id}>
                  <div className="evaluation-history-item-main">
                    <h3>{run.title}</h3>
                    <p>{run.questionPreview || "No question preview"}</p>
                    <div className="evaluation-history-meta">
                      <span>Created {formatDateTime(run.createdAt)}</span>
                      <span>Updated {formatDateTime(run.updatedAt)}</span>
                    </div>
                    <div className="evaluation-history-chips">
                      <span className="evaluation-history-chip">
                        {formatEvaluationType(run.evaluationType)}
                      </span>
                      <span className="evaluation-history-chip">
                        {run.subjectCount} subjects
                      </span>
                      {averageScore !== null && (
                        <span className="evaluation-history-chip">
                          Avg {averageScore}
                        </span>
                      )}
                      <span className="evaluation-history-chip">
                        Fail {validatorFailCount}
                      </span>
                      <span className="evaluation-history-chip">
                        Warn {validatorWarnCount}
                      </span>
                      {metadata.model && (
                        <span className="evaluation-history-chip">
                          Model {metadata.model}
                        </span>
                      )}
                      {metadata.judgeProfileId && (
                        <span className="evaluation-history-chip">
                          Profile {metadata.judgeProfileId}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="evaluation-history-actions">
                    <button
                      type="button"
                      className="pill-btn ghost"
                      onClick={() => void handleOpenSavedRun(run)}
                      disabled={openingRunId === run.id}
                    >
                      {openingRunId === run.id ? "Opening..." : "Open"}
                    </button>
                    <button
                      type="button"
                      className="pill-btn danger"
                      onClick={() => void handleDeleteSavedRun(run)}
                      disabled={deletingRunId === run.id}
                    >
                      {deletingRunId === run.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="evaluation-history-empty">Saved evaluations will appear here.</div>
        )}
      </section>

      <section className="evaluation-studio-workspace" aria-labelledby="evaluation-workspace-title">
        <div className="evaluation-working-header">
          <div>
            <span className="evaluation-studio-kicker">Working mode</span>
            <h2 id="evaluation-workspace-title">Answer comparison</h2>
          </div>
          <span className="evaluation-working-state">
            {hasDraft ? "Draft ready" : "Manual start"}
          </span>
        </div>

        {hasDraft ? (
          <CompareView onEvaluationSaved={loadSavedRuns} />
        ) : (
          <form className="evaluation-manual-start" onSubmit={handleManualStart}>
            <div className="evaluation-manual-copy">
              <h3>Start a comparison manually</h3>
              <p>
                Paste two candidate answers here. The existing Judge form opens next,
                with JSON checks, rubric, instructions, and exports still handled there.
              </p>
            </div>

            <label className="evaluation-field evaluation-field--wide">
              <span>Question or task</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What should the answers be evaluated against?"
                rows={3}
              />
            </label>

            <div className="evaluation-manual-grid">
              <div className="evaluation-answer-column">
                <label className="evaluation-field">
                  <span>Answer A label</span>
                  <input
                    value={answerALabel}
                    onChange={(event) => setAnswerALabel(event.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label className="evaluation-field">
                  <span>Answer A text</span>
                  <textarea
                    value={answerAText}
                    onChange={(event) => setAnswerAText(event.target.value)}
                    placeholder="Paste the first answer"
                    rows={8}
                  />
                </label>
              </div>

              <div className="evaluation-answer-column">
                <label className="evaluation-field">
                  <span>Answer B label</span>
                  <input
                    value={answerBLabel}
                    onChange={(event) => setAnswerBLabel(event.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label className="evaluation-field">
                  <span>Answer B text</span>
                  <textarea
                    value={answerBText}
                    onChange={(event) => setAnswerBText(event.target.value)}
                    placeholder="Paste the second answer"
                    rows={8}
                  />
                </label>
              </div>
            </div>

            {manualError && <p className="evaluation-manual-error">{manualError}</p>}

            <div className="evaluation-manual-actions">
              <button type="submit" className="evaluation-start-button">
                Start comparison
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  );
}

export default EvaluationStudioView;
