import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import MessageList from "../components/chat/MessageList";
import CompareButton from "../components/CompareButton";
import ConversationList from "../components/chat/ConversationList";
import { useDockStore } from "../store/useDockStore";
import {
  ChatChunkPayload,
  ChatDonePayload,
  ChatErrorPayload,
  ChatMessageErrorMeta,
  ChatRetryPayload
} from "../store/chatSlice";

const statusText: Record<string, string> = {
  idle: "Idle",
  connecting: "Connecting to assistant...",
  streaming: "Assistant is replying...",
  retrying: "Retrying request...",
  error: "An error occurred",
  done: "Response ready",
  aborted: "Response aborted"
};

const statusChipLabels: Record<string, string> = {
  idle: "Idle",
  connecting: "Connecting",
  streaming: "Streaming",
  retrying: "Retrying",
  error: "Error",
  done: "Done",
  aborted: "Aborted"
};

const creativityPresets = [
  { id: "low", label: "Low", value: 0.2 },
  { id: "medium", label: "Medium", value: 0.7 },
  { id: "high", label: "High", value: 1.0 }
] as const;

type CreativityPresetId = (typeof creativityPresets)[number]["id"];

const maxTokenPresets = [
  { value: 512, label: "512" },
  { value: 1024, label: "1024" },
  { value: 2048, label: "2048" }
] as const;

function ChatView() {
  const messagesByConvId = useDockStore((state) => state.messagesByConvId);
  const activeConvId = useDockStore((state) => state.activeConvId);
  const sendStatus = useDockStore((state) => state.sendStatus);
  const retryState = useDockStore((state) => state.retryState);
  const conversationSettingsMap = useDockStore((state) => state.conversationSettings);
  const conversations = useDockStore((state) => state.conversations);
  const lastRequestByConvId = useDockStore((state) => state.lastRequestByConvId);
  const ensureConversation = useDockStore((state) => state.actions.ensureConversation);
  const loadConversationHistory = useDockStore(
    (state) => state.actions.loadConversationHistory
  );
  const sendChatMessage = useDockStore((state) => state.actions.sendChatMessage);
  const handleChatChunk = useDockStore((state) => state.actions.handleChatChunk);
  const handleChatDone = useDockStore((state) => state.actions.handleChatDone);
  const handleChatError = useDockStore((state) => state.actions.handleChatError);
  const handleChatRetry = useDockStore((state) => state.actions.handleChatRetry);
  const abortChat = useDockStore((state) => state.actions.abortChat);
  const retryLast = useDockStore((state) => state.actions.retryLast);
  const setConversationSettings = useDockStore(
    (state) => state.actions.setConversationSettings
  );
  const showToast = useDockStore((state) => state.actions.showToast);

  const [draft, setDraft] = useState("");
  const [lastErrorToast, setLastErrorToast] = useState<string | null>(null);
  const [activeProfileName, setActiveProfileName] = useState<string>("default");
  const [defaultModelName, setDefaultModelName] = useState<string | null>(null);

  const loadCompletionsProfile = useCallback(async () => {
    if (!window.completions?.getProfiles) {
      return;
    }
    try {
      const response = await window.completions.getProfiles();
      const activeName =
        typeof response?.active === "string" && response.active ? response.active : "default";
      const profiles = Array.isArray(response?.profiles) ? response.profiles : [];
      const activeProfile =
        profiles.find(
          (profile: any) =>
            profile &&
            typeof profile === "object" &&
            typeof profile.name === "string" &&
            profile.name === activeName
        ) || null;
      setActiveProfileName(activeName);
      setDefaultModelName(
        activeProfile && typeof activeProfile.defaultModel === "string" && activeProfile.defaultModel
          ? activeProfile.defaultModel
          : null
      );
    } catch (error) {
      console.error("Failed to load completions profiles", error);
    }
  }, []);

  useEffect(() => {
    if (!activeConvId) {
      void ensureConversation();
    }
  }, [activeConvId, ensureConversation]);

  useEffect(() => {
    if (activeConvId) {
      void loadConversationHistory(activeConvId);
    }
  }, [activeConvId, loadConversationHistory]);

  useEffect(() => {
    void loadCompletionsProfile();
  }, [loadCompletionsProfile]);

  useEffect(() => {
    if (sendStatus === "done") {
      void loadCompletionsProfile();
    }
  }, [sendStatus, loadCompletionsProfile]);

  useEffect(() => {
    if (!window.chat) {
      return;
    }

    const offChunk = window.chat.onChunk?.((payload: ChatChunkPayload) => {
      handleChatChunk(payload);
    });
    const offDone = window.chat.onDone?.((payload: ChatDonePayload) => {
      handleChatDone(payload);
    });
    const offError = window.chat.onError?.((payload: ChatErrorPayload) => {
      handleChatError(payload);
    });
    const offRetry = window.chat.onRetry?.((payload: ChatRetryPayload) => {
      handleChatRetry(payload);
    });

    return () => {
      offChunk?.();
      offDone?.();
      offError?.();
      offRetry?.();
    };
  }, [handleChatChunk, handleChatDone, handleChatError, handleChatRetry]);

  const messages = useMemo(() => {
    if (!activeConvId) {
      return [];
    }
    return messagesByConvId[activeConvId] || [];
  }, [activeConvId, messagesByConvId]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConvId) || null,
    [conversations, activeConvId]
  );

  const activeSettings = useMemo(
    () => (activeConvId ? conversationSettingsMap[activeConvId] || {} : {}),
    [activeConvId, conversationSettingsMap]
  );

  const temperatureValue =
    typeof activeSettings?.temperature === "number" ? activeSettings.temperature : null;

  const selectedCreativity = useMemo<CreativityPresetId | null>(() => {
    if (temperatureValue === null) {
      return null;
    }
    const preset = creativityPresets.find(
      (item) => Math.abs(item.value - temperatureValue) < 1e-6
    );
    return preset ? preset.id : null;
  }, [temperatureValue]);

  const maxTokensValue =
    typeof activeSettings?.maxTokens === "number" ? activeSettings.maxTokens : null;
  const jsonModeEnabled = activeSettings?.responseFormat === "json";

  const lastRequestSnapshot = activeConvId ? lastRequestByConvId[activeConvId] : undefined;

  const providerBadge =
    (activeConversation?.profile && activeConversation.profile.trim()) ||
    activeProfileName ||
    "default";
  const modelBadge =
    (lastRequestSnapshot?.requestOptions?.model &&
      lastRequestSnapshot.requestOptions.model.trim()) ||
    (activeConversation?.model && activeConversation.model.trim()) ||
    defaultModelName ||
    "default";

  const errorDetails = useMemo<ChatMessageErrorMeta | null>(() => {
    if (sendStatus !== "error") {
      return null;
    }
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];
      if (message.status !== "error") {
        continue;
      }
      if (message.metadata?.error) {
        return message.metadata.error;
      }
    }
    return null;
  }, [messages, sendStatus]);

  useEffect(() => {
    if (sendStatus !== "error") {
      if (lastErrorToast) {
        setLastErrorToast(null);
      }
      return;
    }
    if (!errorDetails) {
      return;
    }
    const text = `${errorDetails.message || "Request failed"}${
      errorDetails.code ? ` (${errorDetails.code})` : ""
    }`;
    if (lastErrorToast === text) {
      return;
    }
    showToast(text);
    setLastErrorToast(text);
  }, [errorDetails, lastErrorToast, sendStatus, showToast]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }
    await sendChatMessage(draft);
    setDraft("");
  };

  const isStreaming = sendStatus === "streaming";
  const isBusy =
    sendStatus === "streaming" || sendStatus === "connecting" || sendStatus === "retrying";
  const retryableCodes = new Set(["timeout", "network", "network_error"]);
  const showRetryAction =
    sendStatus === "error" &&
    !!errorDetails &&
    retryableCodes.has(String(errorDetails.code || "").toLowerCase()) &&
    Boolean(activeConvId);

  let status = statusText[sendStatus] || statusText.idle;
  if (sendStatus === "retrying" && retryState) {
    status = `Retrying (${Math.max(1, retryState.attempt)}/${retryState.maxAttempts})`;
  } else if (sendStatus === "error") {
    status = errorDetails
      ? `${errorDetails.message || "Request failed"}${
          errorDetails.code ? ` (${errorDetails.code})` : ""
        }`
      : statusText.error;
  }

  const handleExportConversation = async () => {
    if (!activeConvId || !window.chat?.exportMarkdown) {
      showToast("No conversation to export");
      return;
    }
    try {
      const result = await window.chat.exportMarkdown(activeConvId);
      if (!result?.canceled) {
        showToast("Conversation exported to Markdown");
      }
    } catch (error) {
      console.error("Failed to export conversation", error);
      showToast("Failed to export conversation");
    }
  };

  const handleCreativitySelect = (presetId: CreativityPresetId) => {
    if (!activeConvId) {
      return;
    }
    const preset = creativityPresets.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }
    const current =
      typeof activeSettings.temperature === "number" ? activeSettings.temperature : null;
    setConversationSettings(activeConvId, {
      temperature: current === preset.value ? undefined : preset.value
    });
  };

  const handleMaxTokensSelect = (value: number) => {
    if (!activeConvId) {
      return;
    }
    const current =
      typeof activeSettings.maxTokens === "number" ? activeSettings.maxTokens : null;
    setConversationSettings(activeConvId, {
      maxTokens: current === value ? undefined : value
    });
  };

  const handleJsonModeToggle = (nextEnabled: boolean) => {
    if (!activeConvId) {
      return;
    }
    setConversationSettings(activeConvId, {
      responseFormat: nextEnabled ? "json" : undefined
    });
  };

  const statusChipLabel = statusChipLabels[sendStatus] || statusChipLabels.idle;

  return (
    <div className="chat-shell">
      <div className="chat-view">
        <ConversationList />
        <section className="chat-main">
          <div className="chat-main-content">
            <header className="chat-main-header">
              <div className="chat-header-left">
                <div className="chat-status">
                  <span className="chat-status-indicator" data-status={sendStatus} />
                  <span>{status}</span>
                </div>
                <div className="chat-header-meta">
                  <span className="chat-badge chat-badge--provider">{providerBadge}</span>
                  <span className="chat-badge chat-badge--model">{modelBadge}</span>
                  <span className={`chat-badge chat-badge--status status-${sendStatus}`}>
                    {statusChipLabel}
                  </span>
                </div>
              </div>
              <div className="chat-header-actions">
                <CompareButton messages={messages} defaultJudgeProfile={activeProfileName} />
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => {
                    void handleExportConversation();
                  }}
                  disabled={!activeConvId}
                >
                  Export
                </button>
                <button
                  type="button"
                  className="pill-btn chat-abort-btn"
                  onClick={() => abortChat()}
                  disabled={!isBusy}
                >
                  Stop
                </button>
              </div>
            </header>
            <div className="chat-messages-container">
              <MessageList messages={messages} isStreaming={isStreaming} />
            </div>
            <div className="chat-input-wrapper">
              <form className="chat-input-form" onSubmit={onSubmit}>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask anything..."
                  rows={3}
                  disabled={isBusy}
                />
                <div className="chat-input-actions">
                  <button
                    type="submit"
                    className="pill-btn"
                    disabled={!draft.trim() || isBusy}
                  >
                    Send
                  </button>
                </div>
              </form>
              <div className="chat-status-panel">
                <span>{status}</span>
                {showRetryAction && activeConvId && (
                  <button
                    type="button"
                    className="pill-btn ghost"
                    onClick={() => {
                      if (activeConvId) {
                        void retryLast(activeConvId);
                      }
                    }}
                    disabled={isBusy}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
          <aside className="chat-presets">
            <h3>Response Presets</h3>
            <div className="chat-presets-group">
              <span className="chat-presets-label">Creativity</span>
              <div className="chat-presets-options">
                {creativityPresets.map((preset) => {
                  const isActive = selectedCreativity === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`chat-preset-option${isActive ? " active" : ""}`}
                      onClick={() => handleCreativitySelect(preset.id)}
                      disabled={!activeConvId || isBusy}
                      aria-pressed={isActive}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="chat-presets-group">
              <span className="chat-presets-label">Max tokens</span>
              <div className="chat-presets-options">
                {maxTokenPresets.map((preset) => {
                  const isActive = maxTokensValue === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      className={`chat-preset-option${isActive ? " active" : ""}`}
                      onClick={() => handleMaxTokensSelect(preset.value)}
                      disabled={!activeConvId || isBusy}
                      aria-pressed={isActive}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="chat-presets-group">
              <label className="chat-json-toggle">
                <input
                  type="checkbox"
                  checked={jsonModeEnabled}
                  onChange={(event) => handleJsonModeToggle(event.target.checked)}
                  disabled={!activeConvId || isBusy}
                />
                <span>JSON mode</span>
              </label>
              <p className="chat-presets-hint">
                Forces the assistant to respond with a JSON object.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default ChatView;
