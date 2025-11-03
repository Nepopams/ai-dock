import { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import { ChatMessage } from "../../store/chatSlice";
import { createDisposableBag } from "../../../utils/disposables";

interface MessageItemProps {
  message: ChatMessage;
  canRegenerate: boolean;
  onCopyText: (message: ChatMessage) => Promise<void> | void;
  onCopyMarkdown: (message: ChatMessage) => Promise<void> | void;
  onDelete: (message: ChatMessage) => Promise<void> | void;
  onRegenerate: (message: ChatMessage) => Promise<void> | void;
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

function MessageItem({
  message,
  canRegenerate,
  onCopyText,
  onCopyMarkdown,
  onDelete,
  onRegenerate
}: MessageItemProps) {
  const status = statusLabels[message.status];
  const roleClass =
    message.role === "assistant" ? "chat-message--assistant" : "chat-message--user";
  const statusClass =
    message.status === "error"
      ? "chat-message--error"
      : message.status === "streaming"
      ? "chat-message--streaming"
      : "";
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = () => setMenuPosition(null);

  const openMenu = (event: ReactMouseEvent<HTMLElement>, viaCursor = true) => {
    event.preventDefault();
    event.stopPropagation();
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const estimateWidth = 192;
    const estimateHeight = canRegenerate ? 192 : 164;
    let posX = viaCursor ? event.clientX : 0;
    let posY = viaCursor ? event.clientY : 0;
    if (!viaCursor) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      posX = rect.right;
      posY = rect.bottom;
    }
    const left = Math.min(Math.max(8, posX), viewWidth - estimateWidth - 8);
    const top = Math.min(Math.max(8, posY), viewHeight - estimateHeight - 8);
    setMenuPosition({ x: left, y: top });
  };

  const runAction = async (action: (msg: ChatMessage) => Promise<void> | void) => {
    try {
      await action(message);
    } catch (error) {
      console.error("Message menu action failed", error);
    } finally {
      closeMenu();
    }
  };

  useEffect(() => {
    if (!menuPosition) {
      return;
    }
    const bag = createDisposableBag();
    const handlePointer = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };
    bag.addEventListener(window, "click", handlePointer);
    bag.addEventListener(window, "contextmenu", handlePointer);
    bag.addEventListener(window, "keydown", handleKeyDown);
    return () => {
      bag.disposeAll();
    };
  }, [menuPosition]);

  useEffect(() => {
    closeMenu();
  }, [message.id]);

  return (
    <>
      <div
        className={`chat-message ${roleClass} ${statusClass}`.trim()}
        onContextMenu={(event) => openMenu(event, true)}
      >
        <div className="chat-message-badge">
          {roleLabels[message.role].slice(0, 1).toUpperCase()}
        </div>
        <div className="chat-message-body">
          <div className="chat-message-meta">
            <span className="chat-message-role">{roleLabels[message.role]}</span>
            <div className="chat-message-meta-actions">
              {status && <span className="chat-message-status">{status}</span>}
              <button
                type="button"
                className="chat-message-menu-btn"
                aria-haspopup="menu"
                aria-expanded={Boolean(menuPosition)}
                onClick={(event) => openMenu(event, false)}
              >
                ...
              </button>
            </div>
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
      {menuPosition && (
        <div
          className="chat-message-menu"
          ref={menuRef}
          style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
          role="menu"
        >
          <button type="button" onClick={() => runAction(onCopyText)} role="menuitem">
            Copy text
          </button>
          <button type="button" onClick={() => runAction(onCopyMarkdown)} role="menuitem">
            Copy as Markdown
          </button>
          <button type="button" onClick={() => runAction(onDelete)} role="menuitem">
            Delete message
          </button>
          <button
            type="button"
            onClick={() => runAction(onRegenerate)}
            role="menuitem"
            disabled={!canRegenerate}
          >
            Regenerate from here
          </button>
        </div>
      )}
    </>
  );
}

export default MessageItem;
