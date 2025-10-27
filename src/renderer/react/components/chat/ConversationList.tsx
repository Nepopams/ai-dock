import { useEffect } from "react";
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
              </button>
              <button
                type="button"
                className="chat-conversation-delete"
                onClick={(event) => {
                  event.stopPropagation();
                  void deleteConversation(conversation.id);
                }}
                title="Delete conversation"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ConversationList;
