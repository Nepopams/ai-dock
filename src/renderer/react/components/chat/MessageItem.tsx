import { ChatMessage } from "../../store/chatSlice";

interface MessageItemProps {
  message: ChatMessage;
}

const roleLabels: Record<ChatMessage["role"], string> = {
  user: "You",
  assistant: "Assistant"
};

const statusLabels: Partial<Record<ChatMessage["status"], string>> = {
  streaming: "Streaming...",
  pending: "Pending...",
  error: "Failed",
  completed: ""
};

function MessageItem({ message }: MessageItemProps) {
  const status = statusLabels[message.status];
  const roleClass =
    message.role === "assistant" ? "chat-message--assistant" : "chat-message--user";
  const statusClass =
    message.status === "error"
      ? "chat-message--error"
      : message.status === "streaming"
      ? "chat-message--streaming"
      : "";

  return (
    <div className={`chat-message ${roleClass} ${statusClass}`.trim()}>
      <div className="chat-message-badge">
        {roleLabels[message.role].slice(0, 1).toUpperCase()}
      </div>
      <div className="chat-message-body">
        <div className="chat-message-meta">
          <span className="chat-message-role">
            {roleLabels[message.role]}
          </span>
          {status && (
            <span className="chat-message-status">{status}</span>
          )}
        </div>
        <div className="chat-message-content">
          {message.content || (message.status === "streaming" ? "..." : "")}
        </div>
        {message.status === "error" && (
          <div className="chat-message-error">
            <span>{message.metadata?.error?.message || "Failed to retrieve a response."}</span>
            {message.metadata?.error?.code && (
              <span className="chat-message-error-code">{message.metadata.error.code}</span>
            )}
          </div>
        )}
        {message.metadata?.usage && Object.keys(message.metadata.usage).length > 0 && (
          <div className="chat-message-usage">
            {Object.entries(message.metadata.usage).map(([key, value]) => (
              <span key={key}>
                {key}: {typeof value === "number" ? value : String(value)}
              </span>
            ))}
          </div>
        )}
        {message.metadata?.finishReason && (
          <div className="chat-message-finish">
            Finish reason: <span>{message.metadata.finishReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageItem;
