import { ForwardedRef, forwardRef, useMemo } from "react";
import { useDockStore } from "../store/useDockStore";

const PromptRouter = forwardRef<HTMLDivElement>((_props, ref) => {
  const promptDraft = useDockStore((state) => state.promptDraft);
  const promptHistory = useDockStore((state) => state.promptHistory);
  const promptPanelHidden = useDockStore((state) => state.promptPanelHidden);
  const selectedAgents = useDockStore((state) => state.selectedAgents);
  const services = useDockStore((state) => state.services);
  const togglePromptPanel = useDockStore((state) => state.actions.togglePromptPanel);
  const setPromptDraft = useDockStore((state) => state.actions.setPromptDraft);
  const setSelectedAgents = useDockStore((state) => state.actions.setSelectedAgents);
  const sendPrompt = useDockStore((state) => state.actions.sendPrompt);

  const historyOptions = useMemo(() => promptHistory.slice(0, 50), [promptHistory]);

  return (
    <div id="prompt-router-container" ref={ref as ForwardedRef<HTMLDivElement>}>
      <section id="prompt-router">
        <div id="prompt-toolbar">
          <button id="toggle-prompt" onClick={() => togglePromptPanel()}>
            {promptPanelHidden ? "📤 Show" : "👁 Hide"}
          </button>
        </div>
        <div id="prompt-body" className={promptPanelHidden ? "hidden" : undefined}>
          <div className="prompt-router-row">
            <textarea
              id="prompt-input"
              placeholder="Введите промт..."
              rows={3}
              value={promptDraft}
              onChange={(event) => setPromptDraft(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  void sendPrompt();
                }
              }}
            />
            <div className="prompt-router-actions">
              <label className="prompt-router-label">
                Target agents
                <select
                  id="prompt-agents"
                  multiple
                  value={selectedAgents}
                  onChange={(event) => {
                    const values = Array.from(event.target.selectedOptions).map((option) => option.value);
                    setSelectedAgents(values);
                  }}
                >
                  {services.length === 0 && (
                    <option value="" disabled>
                      Загрузка сервисов...
                    </option>
                  )}
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="prompt-router-buttons">
                <button
                  id="prompt-send"
                  className="pill-btn"
                  onClick={() => {
                    void sendPrompt();
                  }}
                >
                  Send
                </button>
                <select
                  id="prompt-history"
                  value=""
                  onChange={(event) => {
                    if (event.target.value) {
                      setPromptDraft(event.target.value);
                      event.target.selectedIndex = 0;
                    }
                  }}
                >
                  <option value="">📜 История промтов</option>
                  {historyOptions.map((prompt) => (
                    <option key={prompt} value={prompt}>
                      {prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="router-separator" />
    </div>
  );
});

export default PromptRouter;
