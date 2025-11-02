import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDockStore } from "../../store/useDockStore";
import type { Message as HistoryMessage } from "../../../shared/types/history";

const adapterByService: Record<string, string> = {
  chatgpt: "chatgpt",
  claude: "claude",
  deepseek: "deepseek"
};

const formatTimestamp = (value: string) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }
  return date.toLocaleString();
};

const roleLabel = (role: string) => {
  switch (role) {
    case "assistant":
      return "Assistant";
    case "user":
      return "User";
    default:
      return role;
  }
};

const extractMetaTabId = (message: HistoryMessage): string | undefined => {
  if (!message.meta || typeof message.meta !== "object") {
    return undefined;
  }
  const raw = (message.meta as Record<string, unknown>).tabId;
  return typeof raw === "string" && raw.trim() ? raw.trim() : undefined;
};

function HistoryView() {
  const services = useDockStore((state) => state.services);
  const tabs = useDockStore((state) => state.tabs);
  const threads = useDockStore((state) => state.historyThreads);
  const selectedThreadId = useDockStore((state) => state.historySelectedThreadId);
  const threadMessages = useDockStore((state) => state.historyThreadMessages);
  const historyLoading = useDockStore((state) => state.historyLoading);
  const historyError = useDockStore((state) => state.historyError);
  const historySearchResult = useDockStore((state) => state.historySearchResult);
  const historyIngesting = useDockStore((state) => state.historyIngesting);
  const historyIngestError = useDockStore((state) => state.historyIngestError);
  const historyLastIngest = useDockStore((state) => state.historyLastIngest);

  const refreshThreads = useDockStore((state) => state.actions.refreshHistoryThreads);
  const openThread = useDockStore((state) => state.actions.openHistoryThread);
  const searchHistory = useDockStore((state) => state.actions.searchHistory);
  const clearHistoryError = useDockStore((state) => state.actions.clearHistoryError);
  const ingestFromTab = useDockStore((state) => state.actions.ingestFromTab);
  const refreshTabs = useDockStore((state) => state.actions.refreshTabs);
  const focusLocalView = useDockStore((state) => state.actions.focusLocalView);
  const setPromptDraft = useDockStore((state) => state.actions.setPromptDraft);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [query, setQuery] = useState({
    q: "",
    agentId: "",
    clientId: "",
    role: "",
    tag: ""
  });
  const [selectedTabId, setSelectedTabId] = useState<string>("");

  useEffect(() => {
    void refreshThreads();
  }, [refreshThreads]);

  useEffect(() => {
    void refreshTabs();
  }, [refreshTabs]);

  useEffect(() => {
    if (!selectedThreadId && threads.length) {
      void openThread(threads[0].id);
    }
  }, [threads, selectedThreadId, openThread]);

  useEffect(() => {
    if (historyError) {
      showToast(historyError);
    }
  }, [historyError, showToast]);

  useEffect(() => {
    if (historyIngestError) {
      showToast(historyIngestError);
    }
  }, [historyIngestError, showToast]);

  useEffect(() => {
    if (historyLastIngest && historyLastIngest.added >= 0 && !historyIngesting) {
      const suffix = historyLastIngest.added === 1 ? "message" : "messages";
      showToast(
        historyLastIngest.added
          ? `Imported ${historyLastIngest.added} ${suffix} into history`
          : "Imported history without new messages"
      );
    }
  }, [historyLastIngest, historyIngesting, showToast]);

  const eligibleTabs = useMemo(
    () =>
      tabs.filter(
        (tab) => tab.serviceId && Object.prototype.hasOwnProperty.call(adapterByService, tab.serviceId)
      ),
    [tabs]
  );

  useEffect(() => {
    if (!selectedTabId && eligibleTabs.length) {
      setSelectedTabId(eligibleTabs[0].id);
    } else if (selectedTabId) {
      const stillExists = eligibleTabs.some((tab) => tab.id === selectedTabId);
      if (!stillExists && eligibleTabs.length) {
        setSelectedTabId(eligibleTabs[0].id);
      }
    }
  }, [eligibleTabs, selectedTabId]);

  const selectedTab = useMemo(
    () => eligibleTabs.find((tab) => tab.id === selectedTabId),
    [eligibleTabs, selectedTabId]
  );

  const selectedAdapterId = selectedTab?.serviceId
    ? adapterByService[selectedTab.serviceId]
    : undefined;

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const payload: Record<string, string> = {};
      if (query.q.trim()) {
        payload.q = query.q.trim();
      }
      if (query.agentId.trim()) {
        payload.agentId = query.agentId.trim();
      }
      if (query.clientId.trim()) {
        payload.clientId = query.clientId.trim();
      }
      if (query.role === "user" || query.role === "assistant") {
        payload.role = query.role;
      }
      if (query.tag.trim()) {
        payload.tag = query.tag.trim();
      }
      void searchHistory(payload);
    },
    [query, searchHistory]
  );

  const handleResetSearch = useCallback(() => {
    setQuery({ q: "", agentId: "", clientId: "", role: "", tag: "" });
    clearHistoryError();
  }, [clearHistoryError]);

  const handleIngest = useCallback(async () => {
    if (!selectedTab || !selectedAdapterId) {
      showToast("Select a compatible tab to import history");
      return;
    }
    await ingestFromTab({
      tabId: selectedTab.id,
      adapterId: selectedAdapterId,
      threadId: selectedThreadId || undefined,
      limit: 30
    });
  }, [ingestFromTab, selectedAdapterId, selectedTab, selectedThreadId, showToast]);

  const handleOpenSource = useCallback(
    async (message: HistoryMessage) => {
      const bridge = window.__AI_DOCK_HISTORY__;
      if (!bridge || typeof bridge.openInSource !== "function") {
        showToast("Open in source is not available");
        return;
      }
      const tabId = extractMetaTabId(message);
      const success = await bridge.openInSource({
        clientId: message.source?.clientId || message.agentId,
        tabId,
        url: message.source?.url
      });
      if (!success) {
        showToast("Unable to focus the original tab");
      }
    },
    [showToast]
  );

  const handleContinueInChat = useCallback(
    (message: HistoryMessage) => {
      if (!setPromptDraft || !focusLocalView) {
        showToast("Chat actions are not available");
        return;
      }
      const quoted = `> ${message.text.replace(/\n/g, "\n> ")}\n\n`;
      setPromptDraft(quoted);
      void focusLocalView("chat");
      showToast("Message copied to chat input");
    },
    [focusLocalView, setPromptDraft, showToast]
  );

  const handleNewThread = useCallback(async () => {
    if (!window.historyHub?.createThread) {
      showToast("History API unavailable");
      return;
    }
    const response = await window.historyHub.createThread("Untitled thread");
    if (!response || response.ok === false || !response.thread) {
      showToast(response?.error || "Failed to create thread");
      return;
    }
    await refreshThreads();
    await openThread(response.thread.id);
    showToast("New history thread created");
  }, [openThread, refreshThreads, showToast]);

  const threadList = useMemo(
    () =>
      threads
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [threads]
  );

  const serviceLabel = useCallback(
    (serviceId?: string | null) => {
      if (!serviceId) {
        return "Unknown";
      }
      const service = services.find((item) => item.id === serviceId);
      return service?.title || serviceId;
    },
    [services]
  );

  return (
    <div className="history-view">
      <aside className="history-sidebar">
        <form className="history-search" onSubmit={handleSearchSubmit}>
          <label>
            <span>Search</span>
            <input
              type="search"
              value={query.q}
              onChange={(event) => setQuery((prev) => ({ ...prev, q: event.target.value }))}
              placeholder="Text query"
            />
          </label>
          <label>
            <span>Agent</span>
            <input
              type="text"
              value={query.agentId}
              onChange={(event) => setQuery((prev) => ({ ...prev, agentId: event.target.value }))}
              placeholder="agent id"
            />
          </label>
          <label>
            <span>Client</span>
            <input
              type="text"
              value={query.clientId}
              onChange={(event) => setQuery((prev) => ({ ...prev, clientId: event.target.value }))}
              placeholder="client id"
            />
          </label>
          <label>
            <span>Role</span>
            <select
              value={query.role}
              onChange={(event) => setQuery((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="">Any</option>
              <option value="user">User</option>
              <option value="assistant">Assistant</option>
            </select>
          </label>
          <label>
            <span>Tag</span>
            <input
              type="text"
              value={query.tag}
              onChange={(event) => setQuery((prev) => ({ ...prev, tag: event.target.value }))}
              placeholder="tag"
            />
          </label>
          <div className="history-search-actions">
            <button type="submit" className="pill-btn">
              Search
            </button>
            <button type="button" className="pill-btn ghost" onClick={handleResetSearch}>
              Reset
            </button>
          </div>
        </form>
        <div className="history-thread-list">
          <div className="history-thread-header">
            <h2>Threads</h2>
            <button type="button" className="pill-btn ghost" onClick={handleNewThread}>
              New Thread
            </button>
          </div>
          {historyLoading && <div className="history-loading">Loading…</div>}
          <ul>
            {threadList.map((thread) => {
              const isActive = selectedThreadId === thread.id;
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    className={`history-thread-item${isActive ? " active" : ""}`}
                    onClick={() => openThread(thread.id)}
                  >
                    <span className="history-thread-title">{thread.title || thread.id}</span>
                    <span className="history-thread-date">{formatTimestamp(thread.createdAt)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
      <section className="history-main">
        <header className="history-main-header">
          <div className="history-main-title">
            <h1>{selectedThreadId ? `Thread ${selectedThreadId}` : "Select a thread"}</h1>
            {historySearchResult && (
              <span className="history-search-count">
                Search total: {historySearchResult.total}
              </span>
            )}
          </div>
          <div className="history-ingest-panel">
            <label>
              <span>Source tab</span>
              <select
                value={selectedTabId}
                onChange={(event) => setSelectedTabId(event.target.value)}
              >
                {eligibleTabs.length === 0 && <option value="">No compatible tabs</option>}
                {eligibleTabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {`${serviceLabel(tab.serviceId)} — ${tab.title}`}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="pill-btn"
              disabled={!selectedTab || !selectedAdapterId || historyIngesting}
              onClick={handleIngest}
            >
              {historyIngesting ? "Importing…" : "Import latest"}
            </button>
            {historyLastIngest && !historyIngesting && (
              <span className="history-ingest-summary">
                Last import: {formatTimestamp(historyLastIngest.at)}
              </span>
            )}
          </div>
        </header>
        <div className="history-messages">
          {selectedThreadId ? (
            threadMessages.length ? (
              <ul>
                {threadMessages.map((message) => (
                  <li key={message.id} className="history-message">
                    <header>
                      <span className={`history-badge history-badge--${message.role}`}>
                        {roleLabel(message.role)}
                      </span>
                      <span className="history-message-agent">
                        {message.agentId} • {serviceLabel(message.source?.clientId)}
                      </span>
                      <span className="history-message-date">{formatTimestamp(message.ts)}</span>
                    </header>
                    <pre>{message.text}</pre>
                    <footer>
                      <button
                        type="button"
                        className="pill-btn ghost"
                        onClick={() => handleOpenSource(message)}
                      >
                        Open in source
                      </button>
                      <button
                        type="button"
                        className="pill-btn ghost"
                        onClick={() => handleContinueInChat(message)}
                      >
                        Continue in chat
                      </button>
                    </footer>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="history-empty">No messages yet</div>
            )
          ) : (
            <div className="history-empty">Pick a thread to view messages</div>
          )}
        </div>
        {historySearchResult && (
          <aside className="history-search-results">
            <h2>Search results</h2>
            <ul>
              {historySearchResult.messages.map((message) => (
                <li key={message.id}>
                  <span className="history-result-title">
                    [{message.agentId}] {formatTimestamp(message.ts)}
                  </span>
                  <span className="history-result-text">{message.text}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </section>
    </div>
  );
}

export default HistoryView;
