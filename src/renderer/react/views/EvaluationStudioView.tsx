import { FormEvent, useMemo, useState } from "react";
import { useDockStore } from "../store/useDockStore";
import CompareView from "./CompareView";

type StudioMode = {
  title: string;
  status: "Available" | "Planned";
  description: string;
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
    title: "Research comparison",
    status: "Planned",
    description: "Compare richer research outputs in a later Evaluation Studio slice."
  },
  {
    title: "Evaluation history/export",
    status: "Planned",
    description: "Persist and revisit EvaluationRuns in a separate roadmap workpack."
  }
];

function EvaluationStudioView() {
  const compareDraft = useDockStore((state) => state.compareDraft);
  const prepareJudgeComparison = useDockStore(
    (state) => state.actions.prepareJudgeComparison
  );
  const showToast = useDockStore((state) => state.actions.showToast);

  const [question, setQuestion] = useState("");
  const [answerAText, setAnswerAText] = useState("");
  const [answerBText, setAnswerBText] = useState("");
  const [answerALabel, setAnswerALabel] = useState("");
  const [answerBLabel, setAnswerBLabel] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  const hasDraft = Boolean(compareDraft);

  const availableCount = useMemo(
    () => studioModes.filter((mode) => mode.status === "Available").length,
    []
  );

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
          <CompareView />
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
