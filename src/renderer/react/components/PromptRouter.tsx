import { ForwardedRef, forwardRef, useCallback, useMemo, useState } from "react";
import { useDockStore, TabMeta } from "../store/useDockStore";
import InsertPromptDialog from "../views/prompts/InsertPromptDialog";
import { PromptTemplate } from "../../../shared/types/templates";
import { renderTemplate } from "../../../shared/utils/templateVars";

const MAX_HISTORY_ITEMS = 12;

const PromptRouter = forwardRef<HTMLDivElement>((_props, ref) => {
  const promptDraft = useDockStore((state) => state.promptDraft);
  const promptPanelHidden = useDockStore((state) => state.promptPanelHidden);
  const selectedAgents = useDockStore((state) => state.selectedAgents);
  const selectedTabIds = useDockStore((state) => state.selectedTabIds);
  const tabs = useDockStore((state) => state.tabs);
  const services = useDockStore((state) => state.services);
  const templates = useDockStore((state) => state.templates);
  const promptHistoryEntries = useDockStore((state) => state.promptHistoryEntries);
  const adapterStateByTab = useDockStore((state) => state.adapterStateByTab);

  const togglePromptPanel = useDockStore((state) => state.actions.togglePromptPanel);
  const setPromptDraft = useDockStore((state) => state.actions.setPromptDraft);
  const setSelectedAgents = useDockStore((state) => state.actions.setSelectedAgents);
  const setSelectedTabs = useDockStore((state) => state.actions.setSelectedTabs);
  const insertPromptToTabs = useDockStore((state) => state.actions.insertPromptToTabs);
  const sendPrompt = useDockStore((state) => state.actions.sendPrompt);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [isTemplatesOpen, setTemplatesOpen] = useState(false);

  const aiTabs = useMemo<TabMeta[]>(() => tabs.filter((tab) => Boolean(tab.serviceId)), [tabs]);
  const limitedHistory = useMemo(
    () => promptHistoryEntries.slice(0, MAX_HISTORY_ITEMS),
    [promptHistoryEntries]
  );

  const handleManualInsert = useCallback(
    async (send: boolean) => {
      const text = promptDraft.trim();
      if (!text) {
        showToast("Prompt is empty");
        return;
      }
      const title = text.split("\n")[0].slice(0, 80) || "Manual prompt";
      await insertPromptToTabs({
        send,
        text,
        historyMeta: {
          title,
          renderedText: text
        }
      });
    },
    [insertPromptToTabs, promptDraft, showToast]
  );

  const handleTemplateSubmit = useCallback(
    async ({
      template,
      values,
      targetTabIds,
      send
    }: {
      template: PromptTemplate;
      values: Record<string, string>;
      targetTabIds: string[];
      send: boolean;
    }) => {
      const rendered = renderTemplate(template.body, values);
      await insertPromptToTabs({
        send,
        text: rendered,
        targetTabIds,
        historyMeta: {
          templateId: template.id,
          title: template.title,
          renderedText: rendered
        }
      });
    },
    [insertPromptToTabs]
  );

  const handleRecentRepeat = useCallback(
    async (entryId: string) => {
      const entry = promptHistoryEntries.find((item) => item.id === entryId);
      if (!entry) {
        return;
      }
      if (entry.targetTabIds?.length) {
        setSelectedTabs(entry.targetTabIds);
      }
      await insertPromptToTabs({
        send: entry.action === "insert_send",
        text: entry.renderedPreview,
        targetTabIds: entry.targetTabIds,
        historyMeta: {
          templateId: entry.templateId,
          title: entry.title,
          renderedText: entry.renderedPreview
        }
      });
    },
    [insertPromptToTabs, promptHistoryEntries, setSelectedTabs]
  );

  const renderAdapterStatus = () => {
    if (!aiTabs.length) {
      return null;
    }
    return (
      <div className="adapter-status-list">
        {aiTabs.map((tab) => {
          const state = adapterStateByTab[tab.id];
          let statusClass = "adapter-status--idle";
          let statusText = "Idle";
          if (state?.checking) {
            statusClass = "adapter-status--checking";
            statusText = "Checking…";
          } else if (state?.lastError) {
            statusClass = "adapter-status--error";
            statusText = state.lastError;
          } else if (state?.ready) {
            statusClass = "adapter-status--ready";
            statusText = "Ready";
          }
          return (
            <div key={tab.id} className={`adapter-status ${statusClass}`}>
              <span className="adapter-status-title">{tab.title || tab.id}</span>
              <span className="adapter-status-text">{statusText}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div id="prompt-router-container" ref={ref as ForwardedRef<HTMLDivElement>}>
      <section id="prompt-router">
        <div id="prompt-toolbar">
          <button id="toggle-prompt" onClick={() => togglePromptPanel()}>
            {promptPanelHidden ? "Show panel" : "Hide panel"}
          </button>
        </div>
        <div id="prompt-body" className={promptPanelHidden ? "hidden" : undefined}>
          <div className="prompt-router-row">
            <textarea
              id="prompt-input"
              placeholder="Write a prompt for the selected services…"
              value={promptDraft}
              onChange={(event) => setPromptDraft(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
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
                  {aiTabs.length === 0 && (
                    <option value="" disabled>
                      No AI tabs detected
                    </option>
                  )}
                  {aiTabs.map((tab) => (
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
                      No services available
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
                  onClick={() => void handleManualInsert(false)}
                >
                  Insert
                </button>
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => void handleManualInsert(true)}
                >
                  Insert + Send
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  onClick={() => setTemplatesOpen(true)}
                >
                  Templates
                </button>
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => void sendPrompt()}
                >
                  Broadcast
                </button>
              </div>
              <select
                id="prompt-history"
                value=""
                onChange={(event) => {
                  const value = event.target.value;
                  if (value) {
                    void handleRecentRepeat(value);
                  }
                  event.currentTarget.selectedIndex = 0;
                }}
              >
                <option value="">Recent inserts</option>
                {limitedHistory.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.title.length > 60 ? `${entry.title.slice(0, 57)}…` : entry.title}
                  </option>
                ))}
              </select>
              {renderAdapterStatus()}
            </div>
          </div>
        </div>
      </section>
      <InsertPromptDialog
        open={isTemplatesOpen}
        templates={templates}
        tabs={aiTabs}
        defaultTabIds={selectedTabIds}
        onSubmit={handleTemplateSubmit}
        onClose={() => setTemplatesOpen(false)}
      />
    </div>
  );
});

PromptRouter.displayName = "PromptRouter";

export default PromptRouter;
