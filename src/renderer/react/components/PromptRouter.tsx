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
            {promptPanelHidden ? "рџ“¤ Show" : "рџ‘Ѓ Hide"}
          </button>
        </div>
        <div id="prompt-body" className={promptPanelHidden ? "hidden" : undefined}>
          <div className="prompt-router-row">
            <textarea
              id="prompt-input"
              placeholder="Р’РІРµРґРёС‚Рµ РїСЂРѕРјС‚..."
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
                Target tabs
                <select
                  id="prompt-tabs"
                  multiple
                  value={selectedTabIds}
                  onChange={(event) => {
                    const values = Array.from(event.target.selectedOptions).map((option) => option.value);
                    setSelectedTabs(values);
                  }}
                >
                  {targetTabs.length === 0 && (
                    <option value="" disabled>
                      No AI tabs detected
                    </option>
                  )}
                  {targetTabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.title || tab.id}
                    </option>
                  ))}
                </select>
              </label>
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
                      �-���?�?�?����� �?��?�?��?�?�?...
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
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => {
                    void insertPromptToTabs({ send: false });
                  }}
                >
                  Insert
                </button>
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => {
                    void insertPromptToTabs({ send: true });
                  }}
                >
                  Insert + Send
                </button>
                <button
                  id="prompt-send"
                  className="pill-btn"
                  onClick={() => {
                    void sendPrompt();
                  }}
                >
                  Broadcast
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
                  <option value="">�?"? �?�?�'�?�?��? ���?�?�?�'�?�?</option>
                  {historyOptions.map((prompt) => (
                    <option key={prompt} value={prompt}>
                      {prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="adapter-status-list">
                {statusTabs.map((tab) => {
                  const state = adapterStateByTab[tab.id];
                  let statusText = "Idle";
                  let statusClass = "idle";
                  if (state?.checking) {
                    statusText = "Checking…";
                    statusClass = "checking";
                  } else if (state?.lastError) {
                    statusText = state.lastError;
                    statusClass = "error";
                  } else if (state?.ready) {
                    statusText = "Ready";
                    statusClass = "ready";
                  }
                  return (
                    <div key={tab.id} className={`adapter-status adapter-status--${statusClass}`}>
                      <span className="adapter-status-title">{tab.title || tab.id}</span>
                      <span className="adapter-status-text">{statusText}</span>
                    </div>
                  );
                })}
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








