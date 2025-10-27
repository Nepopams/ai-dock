import { FormEvent, useEffect, useMemo, useState } from "react";
import MessageList from "../components/chat/MessageList";
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

function ChatView() {
  const messagesByConvId = useDockStore((state) => state.messagesByConvId);
  const activeConvId = useDockStore((state) => state.activeConvId);
  const sendStatus = useDockStore((state) => state.sendStatus);
  const retryState = useDockStore((state) => state.retryState);
  const ensureConversation = useDockStore(
    (state) => state.actions.ensureConversation
  );
  const loadConversationHistory = useDockStore(
    (state) => state.actions.loadConversationHistory
  );
  const sendChatMessage = useDockStore(
    (state) => state.actions.sendChatMessage
  );
  const handleChatChunk = useDockStore(
    (state) => state.actions.handleChatChunk
  );
  const handleChatDone = useDockStore(
    (state) => state.actions.handleChatDone
  );
  const handleChatError = useDockStore(
    (state) => state.actions.handleChatError
  );
  const handleChatRetry = useDockStore(
    (state) => state.actions.handleChatRetry
  );
  const abortChat = useDockStore((state) => state.actions.abortChat);
  const retryLast = useDockStore((state) => state.actions.retryLast);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [draft, setDraft] = useState("");
  const [lastErrorToast, setLastErrorToast] = useState<string | null>(null);

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

  return (
    <div className="chat-shell">
      <div className="chat-view">
        <ConversationList />
        <section className="chat-main">
          <header className="chat-main-header">
            <div className="chat-status">
              <span className="chat-status-indicator" data-status={sendStatus} />
              <span>{status}</span>
            </div>
            <button
              type="button"
              className="pill-btn chat-abort-btn"
              onClick={() => abortChat()}
              disabled={!isBusy}
            >
              Stop
            </button>
          </header>
          <MessageList messages={messages} isStreaming={isStreaming} />
          <form className="chat-input-area" onSubmit={onSubmit}>
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
        </section>
      </div>
    </div>
  );
}

export default ChatView;
