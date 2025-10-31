import { MouseEvent, useEffect } from "react";
import { useDockStore } from "../../store/useDockStore";

function ConversationList() {
  const conversations = useDockStore((state) => state.conversations);
  const activeConvId = useDockStore((state) => state.activeConvId);
  const startNewConversation = useDockStore(
    (state) => state.actions.startNewConversation
  );
  const setActiveConversation = useDockStore(
    (state) => state.actions.setActiveConversation
  );
  const deleteConversation = useDockStore(
    (state) => state.actions.deleteConversation
  );
  const loadConversations = useDockStore((state) => state.actions.loadConversations);
  const showToast = useDockStore((state) => state.actions.showToast);

  useEffect(() => {
    if (!conversations.length) {
      void loadConversations();
    }
  }, [conversations.length, loadConversations]);

  const handleNewChat = async () => {
    const conversationId = await startNewConversation();
    setActiveConversation(conversationId);
  };

  const formatUpdatedAt = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString();
    } catch {
      return "";
    }
  };

  const handleExport = async (event: MouseEvent<HTMLButtonElement>, conversationId: string) => {
    event.stopPropagation();
    if (!window.chat?.exportMarkdown) {
      showToast("Export is unavailable");
      return;
    }
    try {
      const result = await window.chat.exportMarkdown(conversationId);
      if (!result?.canceled) {
        showToast("Conversation exported");
      }
    } catch (error) {
      console.error("Failed to export conversation", error);
      showToast("Failed to export conversation");
    }
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>, conversationId: string) => {
    event.stopPropagation();
    void deleteConversation(conversationId);
  };

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h2>Conversations</h2>
        <button type="button" className="pill-btn chat-new-btn" onClick={handleNewChat}>
          New Chat
        </button>
      </div>
      <div className="chat-conversation-list">
        {!conversations.length && (
          <div className="chat-conversation-empty">No conversations yet</div>
        )}
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConvId;
          return (
            <div
              key={conversation.id}
              className={`chat-conversation-item${
                isActive ? " chat-conversation-item--active" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveConversation(conversation.id)}
              >
                <span className="chat-conversation-title">{conversation.title}</span>
                <span className="chat-conversation-date">
                  {formatUpdatedAt(conversation.updatedAt)}
                </span>
                <div className="chat-conversation-meta">
                  {conversation.profile && (
                    <span className="chat-conversation-chip">{conversation.profile}</span>
                  )}
                  {conversation.model && (
                    <span className="chat-conversation-chip muted">{conversation.model}</span>
                  )}
                  {typeof conversation.messageCount === "number" && (
                    <span className="chat-conversation-chip count">
                      {conversation.messageCount}
                    </span>
                  )}
                </div>
              </button>
              <div className="chat-conversation-actions">
                <button
                  type="button"
                  className="chat-conversation-export"
                  onClick={(event) => handleExport(event, conversation.id)}
                  title="Export to Markdown"
                >
                  MD
                </button>
                <button
                  type="button"
                  className="chat-conversation-delete"
                  onClick={(event) => handleDelete(event, conversation.id)}
                  title="Delete conversation"
                >
                  X
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ConversationList;
