import { useEffect, useRef } from "react";
import { ChatMessage } from "../../store/chatSlice";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

function MessageList({ messages, isStreaming }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    const updateStickState = () => {
      const distance =
        element.scrollHeight - element.scrollTop - element.clientHeight;
      stickToBottomRef.current = distance <= 120;
    };
    updateStickState();
    element.addEventListener("scroll", updateStickState);
    return () => {
      element.removeEventListener("scroll", updateStickState);
    };
  }, [messages.length]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    if (!messages.length) {
      stickToBottomRef.current = true;
    }
    if (stickToBottomRef.current) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, isStreaming]);

  if (!messages.length) {
    return (
      <div className="chat-empty" ref={containerRef}>
        <div className="chat-empty-state">
          <h3>No messages yet</h3>
          <p>Start a new conversation by typing a prompt below.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-message-list" ref={containerRef}>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isStreaming && (
        <div className="chat-stream-indicator">
          <span className="chat-stream-dot" />
          <span>Streaming response...</span>
        </div>
      )}
    </div>
  );
}

export default MessageList;
