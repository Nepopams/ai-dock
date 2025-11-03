import { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage } from "../../store/chatSlice";
import { useDockStore } from "../../store/useDockStore";
import MessageItem from "./MessageItem";
import { createDisposableBag } from "../../../utils/disposables";

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

const sanitizeMarkdown = (text: string) => text.replace(/```/g, "```\u200b");

const getDistanceFromBottom = (element: HTMLDivElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight;

function MessageList({ messages, isStreaming }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const deleteMessage = useDockStore((state) => state.actions.deleteMessage);
  const regenerateFromMessage = useDockStore(
    (state) => state.actions.regenerateFromMessage
  );
  const showToast = useDockStore((state) => state.actions.showToast);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const bag = createDisposableBag();

    const handleScroll = () => {
      const distance = getDistanceFromBottom(element);
      const atBottom = distance <= 50;

      if (isAtBottomRef.current !== atBottom) {
        isAtBottomRef.current = atBottom;
      }

      setShowScrollIndicator((prev) => {
        const shouldShow = !atBottom && distance > 150;
        return prev === shouldShow ? prev : shouldShow;
      });
    };

    handleScroll();
    bag.addEventListener(element, "scroll", handleScroll, { passive: true });

    return () => {
      bag.disposeAll();
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const bag = createDisposableBag();

    if (!messages.length) {
      isAtBottomRef.current = true;
      lastMessageIdRef.current = null;
      setShowScrollIndicator(false);
      element.scrollTop = element.scrollHeight;
      return () => {
        bag.disposeAll();
      };
    }

    const lastMessage = messages[messages.length - 1];
    const distance = getDistanceFromBottom(element);
    const atBottom = distance <= 50;
    const isInitialLoad = lastMessageIdRef.current === null;
    const isNewMessage =
      lastMessage && lastMessageIdRef.current !== lastMessage.id;

    if (isInitialLoad || isAtBottomRef.current || atBottom) {
      isAtBottomRef.current = true;
      const frameId = requestAnimationFrame(() => {
        if (!containerRef.current) {
          return;
        }
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: isInitialLoad ? "auto" : "smooth"
        });
      });
      bag.trackAnimationFrame(frameId);
      setShowScrollIndicator(false);
    } else if (isNewMessage) {
      setShowScrollIndicator((prev) => (prev ? prev : true));
    }

    if (lastMessage) {
      lastMessageIdRef.current = lastMessage.id;
    }
    return () => {
      bag.disposeAll();
    };
  }, [messages, isStreaming]);

  const handleScrollToBottom = () => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth"
    });
    isAtBottomRef.current = true;
    setShowScrollIndicator(false);
  };

  const copyToClipboard = async (text: string) => {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error("navigator.clipboard.writeText failed", error);
      }
    }
    if (window.api?.clipboard?.copy) {
      try {
        await window.api.clipboard.copy(text);
        return true;
      } catch (error) {
        console.error("window.api.clipboard.copy failed", error);
      }
    }
    return false;
  };

  const handleCopyText = async (message: ChatMessage) => {
    const success = await copyToClipboard(message.content || "");
    showToast(success ? "Message copied" : "Clipboard unavailable");
  };

  const handleCopyMarkdown = async (message: ChatMessage) => {
    const roleLabel = message.role === "assistant" ? "Assistant" : "User";
    const markdown = [`**${roleLabel}:**`, "", sanitizeMarkdown(message.content || "")].join(
      "\n"
    );
    const success = await copyToClipboard(markdown);
    showToast(success ? "Markdown copied" : "Clipboard unavailable");
  };

  const handleDelete = async (message: ChatMessage) => {
    await deleteMessage(message.conversationId, message.id);
    showToast("Message deleted");
  };

  const handleRegenerate = async (message: ChatMessage) => {
    await regenerateFromMessage(message.conversationId, message.id);
  };

  const lastUserMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.role === "user") {
        return messages[index]?.id || null;
      }
    }
    return null;
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="chat-message-pane" ref={containerRef}>
        <div className="chat-empty">
          <div className="chat-empty-state">
            <h3>No messages yet</h3>
            <p>Start a new conversation by typing a prompt below.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-message-pane" ref={containerRef}>
      <div className="chat-message-list">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            canRegenerate={message.role === "user" && message.id === lastUserMessageId}
            onCopyText={handleCopyText}
            onCopyMarkdown={handleCopyMarkdown}
            onDelete={handleDelete}
            onRegenerate={handleRegenerate}
          />
        ))}
        {isStreaming && (
          <div className="chat-stream-indicator">
            <span className="chat-stream-dot" />
            <span>Streaming response...</span>
          </div>
        )}
      </div>
      {showScrollIndicator && (
        <button
          type="button"
          className="chat-scroll-indicator"
          onClick={handleScrollToBottom}
        >
          {"\u2193 New messages"}
        </button>
      )}
    </div>
  );
}

export default MessageList;
