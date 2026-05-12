import { useEffect, useMemo, useState } from "react";
import { useDockStore, CompareDraftAnswer } from "../store/useDockStore";
import type { JudgeResult } from "../../../shared/types/judge";
import { inferCompletionsProfileLabels } from "../../../shared/utils/completionsProfileLabels";

type JudgeProfileOption = {
  name: string;
  label: string;
};

type LocalAnswer = CompareDraftAnswer & { selected: boolean };

const answerKey = (index: number) => `answer_${index + 1}`;

const buildProfileOptions = (payload: any): JudgeProfileOption[] => {
  if (!payload || !Array.isArray(payload.profiles)) {
    return [];
  }
  return payload.profiles.map((profile: any) => {
    const name =
      typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim()
        : "Unnamed profile";
    const labels = inferCompletionsProfileLabels(profile);
    return {
      name: typeof profile.name === "string" ? profile.name : "",
      label: `${name} - ${labels.summaryLabel}`
    };
  });
};

const ensureArray = <T,>(value: T[] | undefined | null): T[] => (Array.isArray(value) ? value : []);

const parseRequiredKeys = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

const findScore = (
  result: JudgeResult | null,
  answerIndex: number,
  criterion: "coherence" | "factuality" | "helpfulness"
) => {
  if (!result) {
    return null;
  }
  const key = answerKey(answerIndex);
  const bucket = ensureArray(result.scores[key]);
  return bucket.find((item) => item.criterion === criterion) || null;
};

function CompareView() {
  const compareDraft = useDockStore((state) => state.compareDraft);
  const judgeRunning = useDockStore((state) => state.judgeRunning);
  const judgeResult = useDockStore((state) => state.judgeResult);
  const judgeError = useDockStore((state) => state.judgeError);
  const judgeErrorDetails = useDockStore((state) => state.judgeErrorDetails);
  const judgeProgress = useDockStore((state) => state.judgeProgress);
  const runJudge = useDockStore((state) => state.actions.runJudge);
  const clearJudge = useDockStore((state) => state.actions.clearJudge);
  const updateCompareDraft = useDockStore((state) => state.actions.updateCompareDraft);
  const focusLocalView = useDockStore((state) => state.actions.focusLocalView);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<LocalAnswer[]>([]);
  const [rubric, setRubric] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [jsonValidationEnabled, setJsonValidationEnabled] = useState<boolean>(false);
  const [jsonRequiredKeys, setJsonRequiredKeys] = useState<string>("");
  const [jsonAllowMarkdownFence, setJsonAllowMarkdownFence] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<JudgeProfileOption[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [profilesLoading, setProfilesLoading] = useState<boolean>(false);
  const [lastRunAnswerIds, setLastRunAnswerIds] = useState<string[]>([]);

  useEffect(() => {
    if (!compareDraft) {
      return;
    }
    setQuestion(compareDraft.question || "");
    setAnswers(
      compareDraft.answers.map((answer) => ({
        id: answer.id,
        agentId: answer.agentId,
        text: answer.text,
        selected: answer.selected !== false
      }))
    );
    setRubric(compareDraft.rubric || "");
    setCustomPrompt(compareDraft.customPrompt || "");
    setJsonValidationEnabled(Boolean(compareDraft.validation?.enabled));
    setJsonRequiredKeys(compareDraft.validation?.requiredKeysText || "");
    setJsonAllowMarkdownFence(Boolean(compareDraft.validation?.allowMarkdownFence));
    if (compareDraft.judgeProfileId) {
      setSelectedProfile(compareDraft.judgeProfileId);
    }
  }, [compareDraft?.requestId]);

  useEffect(() => {
    const loadProfiles = async () => {
      if (!window.completions?.getProfiles) {
        return;
      }
      setProfilesLoading(true);
      try {
        const data = await window.completions.getProfiles();
        const options = buildProfileOptions(data);
        setProfiles(options);
        if (!selectedProfile) {
          const active =
            typeof data?.active === "string" && data.active.trim()
              ? data.active.trim()
              : options[0]?.name || "";
          setSelectedProfile(active);
        }
      } catch (error) {
        console.error("Failed to load judge profiles", error);
        showToast("Failed to load judge profiles");
      } finally {
        setProfilesLoading(false);
      }
    };
    void loadProfiles();
    // we intentionally avoid dependencies to prevent refetch loops
  }, []);

  useEffect(() => {
    if (!compareDraft || !updateCompareDraft) {
      return;
    }
    updateCompareDraft({
      question,
      rubric,
      customPrompt,
      validation: {
        enabled: jsonValidationEnabled,
        allowMarkdownFence: jsonAllowMarkdownFence,
        requiredKeysText: jsonRequiredKeys
      },
      judgeProfileId: selectedProfile || undefined,
      answers: answers.map((answer) => ({
        id: answer.id,
        agentId: answer.agentId,
        text: answer.text,
        selected: answer.selected
      }))
    });
  }, [
    question,
    rubric,
    customPrompt,
    jsonValidationEnabled,
    jsonAllowMarkdownFence,
    jsonRequiredKeys,
    selectedProfile,
    answers,
    compareDraft,
    updateCompareDraft
  ]);

  useEffect(() => {
    return () => {
      clearJudge();
    };
  }, [clearJudge]);

  const selectedAnswers = useMemo(
    () => answers.filter((answer) => answer.selected && answer.text.trim().length > 0),
    [answers]
  );

  const handleToggleAnswer = (id: string) => {
    setAnswers((current) =>
      current.map((answer) =>
        answer.id === id ? { ...answer, selected: !answer.selected } : answer
      )
    );
  };

  const handleRunJudge = async () => {
    if (!compareDraft) {
      showToast("Nothing to compare yet");
      return;
    }
    if (selectedAnswers.length < 2) {
      showToast("Select at least two answers");
      return;
    }
    if (!selectedProfile) {
      showToast("Choose judge profile");
      return;
    }
    const validation = jsonValidationEnabled
      ? {
          mode: "json_contract_check" as const,
          enabled: true,
          allowMarkdownFence: jsonAllowMarkdownFence,
          requiredKeys: parseRequiredKeys(jsonRequiredKeys)
        }
      : undefined;
    const input = {
      requestId: compareDraft.requestId,
      judgeProfileId: selectedProfile,
      question: question.trim(),
      answers: selectedAnswers.map((answer) => ({
        agentId: answer.agentId,
        text: answer.text
      })),
      rubric: rubric.trim() ? rubric : undefined,
      customPrompt: customPrompt.trim() ? customPrompt : undefined,
      validation
    };
    const result = await runJudge(input);
    if (result) {
      setLastRunAnswerIds(selectedAnswers.map((answer) => answer.id));
    }
  };

  const handleBack = async () => {
    await focusLocalView("chat");
  };

  const handleCopyErrorDetails = async () => {
    if (!judgeErrorDetails) {
      return;
    }
    const text = judgeErrorDetails;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        showToast("Error details copied");
        return;
      }
    } catch {
      // fall back to preload clipboard
    }
    if (window.api?.clipboard?.copy) {
      try {
        await window.api.clipboard.copy(text);
        showToast("Error details copied");
        return;
      } catch {
        // ignore
      }
    }
    showToast("Clipboard unavailable");
  };

  const handleExport = async (format: "md" | "json") => {
    if (!judgeResult) {
      showToast("Run judge before exporting");
      return;
    }
    if (!evaluatedAnswers.length) {
      showToast("No answers to export");
      return;
    }
    if (!window.exporter) {
      showToast("Export API unavailable");
      return;
    }
    const payload = {
      question,
      answers: evaluatedAnswers.map((answer) => ({
        agentId: answer.agentId,
        text: answer.text
      })),
      result: judgeResult,
      generatedAt: new Date().toISOString()
    };
    try {
      const response =
        format === "md"
          ? await window.exporter.judgeMarkdown(payload)
          : await window.exporter.judgeJson(payload);
      if (response?.ok && response.path) {
        showToast(`Saved to ${response.path}`);
      } else {
        showToast(response?.error || "Export failed");
      }
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : "Export failed";
      showToast(message);
    }
  };

  const evaluatedAnswers = useMemo(() => {
    const map = lastRunAnswerIds.length ? lastRunAnswerIds : selectedAnswers.map((a) => a.id);
    return map
      .map((id, index) => {
        const answer =
          answers.find((item) => item.id === id) || compareDraft?.answers.find((item) => item.id === id);
        if (!answer) {
          return null;
        }
        return {
          key: answerKey(index),
          agentId: answer.agentId,
          text: answer.text
        };
      })
      .filter((item): item is { key: string; agentId: string; text: string } => Boolean(item));
  }, [answers, compareDraft, lastRunAnswerIds, selectedAnswers]);

  const exportDisabled = !judgeResult || !evaluatedAnswers.length;
  const validatorResults = ensureArray(judgeResult?.validatorResults);

  return (
    <div className="compare-view">
      <header className="compare-header">
        <div>
          <h1>Judge Comparison</h1>
          <p>Select at least two answers and run the judge to get detailed scores.</p>
        </div>
        <div className="compare-header-actions">
          <button type="button" className="pill-btn ghost" onClick={handleBack}>
            Back to Chat
          </button>
        </div>
      </header>
      <section className="compare-panel">
        <div className="compare-column compare-column--inputs">
          <label className="compare-field">
            <span className="compare-label">Question</span>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
            />
          </label>
          <label className="compare-field">
            <span className="compare-label">Judge profile</span>
            <select
              value={selectedProfile}
              onChange={(event) => setSelectedProfile(event.target.value)}
              disabled={profilesLoading}
            >
              {!profiles.length && <option value="">No profiles available</option>}
              {profiles.map((profile) => (
                <option key={profile.name} value={profile.name}>
                  {profile.label}
                </option>
              ))}
            </select>
            <span className="compare-label-hint">
              Local/private labels are inferred from profile endpoint and are not a privacy guarantee.
            </span>
          </label>
          <label className="compare-field">
            <span className="compare-label">
              Optional rubric override <span className="compare-label-hint">(Markdown)</span>
            </span>
            <textarea
              value={rubric}
              onChange={(event) => setRubric(event.target.value)}
              rows={6}
              placeholder="Leave empty to use default rubric"
            />
          </label>
          <label className="compare-field">
            <span className="compare-label">
              Custom judge instructions <span className="compare-label-hint">(optional)</span>
            </span>
            <textarea
              value={customPrompt}
              onChange={(event) => setCustomPrompt(event.target.value)}
              rows={5}
              placeholder="Add task-specific judge instructions"
            />
          </label>
          <div className="compare-field">
            <label className="compare-answer-toggle">
              <input
                type="checkbox"
                checked={jsonValidationEnabled}
                onChange={(event) => setJsonValidationEnabled(event.target.checked)}
              />
              <span>Run JSON contract check</span>
            </label>
            <textarea
              value={jsonRequiredKeys}
              onChange={(event) => setJsonRequiredKeys(event.target.value)}
              rows={3}
              disabled={!jsonValidationEnabled}
              placeholder="status, items"
            />
            <label className="compare-answer-toggle">
              <input
                type="checkbox"
                checked={jsonAllowMarkdownFence}
                onChange={(event) => setJsonAllowMarkdownFence(event.target.checked)}
                disabled={!jsonValidationEnabled}
              />
              <span>Allow fenced JSON</span>
            </label>
          </div>
          <div className="compare-actions">
            <button
              type="button"
              className="pill-btn"
              onClick={handleRunJudge}
              disabled={judgeRunning || selectedAnswers.length < 2}
            >
              {judgeRunning ? "Running…" : "Run Judge"}
            </button>
            <button
              type="button"
              className="pill-btn ghost"
              disabled={exportDisabled}
              onClick={() => handleExport("md")}
            >
              Export MD
            </button>
            <button
              type="button"
              className="pill-btn ghost"
              disabled={exportDisabled}
              onClick={() => handleExport("json")}
            >
              Export JSON
            </button>
          </div>
          {judgeProgress && (
            <div className="compare-progress">
              <span className="compare-progress-stage">
                {judgeProgress.stage === "queued" && "Queued…"}
                {judgeProgress.stage === "running" && "Evaluating answers…"}
                {judgeProgress.stage === "parsing" && "Parsing result…"}
                {judgeProgress.stage === "done" && "Evaluation complete"}
                {judgeProgress.stage === "failed" && "Evaluation failed"}
              </span>
            </div>
          )}
          {judgeError && (
            <div className="compare-error">
              <div>
                <strong>Judge error:</strong> {judgeError}
              </div>
              {judgeErrorDetails && (
                <button type="button" className="pill-btn ghost" onClick={handleCopyErrorDetails}>
                  Copy details
                </button>
              )}
            </div>
          )}
        </div>
        <div className="compare-column compare-column--answers">
          <h2>Answers</h2>
          <div className="compare-answers-list">
            {answers.map((answer, index) => (
              <article key={answer.id} className="compare-answer-card">
                <header>
                  <label className="compare-answer-toggle">
                    <input
                      type="checkbox"
                      checked={answer.selected}
                      onChange={() => handleToggleAnswer(answer.id)}
                    />
                    <span>Answer {index + 1}</span>
                  </label>
                  <span className="compare-answer-badge">{answer.agentId}</span>
                </header>
                <pre>{answer.text || "Empty answer"}</pre>
              </article>
            ))}
          </div>
        </div>
      </section>
      {judgeResult && (
        <section className="compare-results">
          <header>
            <h2>Scores</h2>
            <div className="compare-result-summary">
              <strong>Verdict:</strong> {judgeResult.verdict || "—"}
            </div>
            <p>{judgeResult.summary || "No summary provided."}</p>
          </header>
          {validatorResults.length > 0 && (
            <section className="compare-validator-results">
              <h3>JSON Contract Findings</h3>
              <ul>
                {validatorResults.map((finding, index) => (
                  <li key={`${finding.answerKey}-${finding.type}-${finding.key || index}`}>
                    <strong>{finding.answerKey}</strong> {finding.type} {finding.status}:{" "}
                    {finding.message}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="compare-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Criterion</th>
                  {evaluatedAnswers.map((answer, index) => (
                    <th key={answer.key}>
                      Answer {index + 1}
                      <span className="compare-answer-ref">{answer.agentId}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["coherence", "factuality", "helpfulness"].map((criterion) => (
                  <tr key={criterion}>
                    <td className="compare-criterion">{criterion}</td>
                    {evaluatedAnswers.map((_answer, index) => {
                      const score = findScore(
                        judgeResult,
                        index,
                        criterion as "coherence" | "factuality" | "helpfulness"
                      );
                      return (
                        <td key={`${criterion}-${index}`}>
                          <div className="compare-score">
                            <span className="compare-score-value">
                              {score ? score.score.toFixed(1).replace(/\.0$/, "") : "—"}
                            </span>
                            {score?.rationale && (
                              <span className="compare-score-note">{score.rationale}</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default CompareView;
