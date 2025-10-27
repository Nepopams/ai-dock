import { StateCreator } from "zustand";

const generateId = () =>
  globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export type ChatRole = "user" | "assistant";

export interface ChatMessageErrorMeta {
  code: string;
  message?: string;
}

export interface ChatMessageMetadata {
  requestOptions?: ChatRequestOptions;
  usage?: Record<string, unknown>;
  finishReason?: string;
  error?: ChatMessageErrorMeta;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  status: "pending" | "streaming" | "completed" | "error";
  conversationId: string;
  requestId?: string | null;
  metadata?: ChatMessageMetadata;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type ChatSendStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "retrying"
  | "error"
  | "done"
  | "aborted";

export interface ChatChunkPayload {
  requestId: string;
  delta: string;
  conversationId?: string;
}

export interface ChatDonePayload {
  requestId: string;
  finishReason?: "stop" | "length";
  usage?: Record<string, unknown>;
  conversationId?: string;
}

export interface ChatErrorPayload {
  requestId: string;
  code: string;
  message?: string;
}

export interface ChatRetryPayload {
  requestId: string;
  attempt: number;
  maxAttempts: number;
}

export interface ChatRequestOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: Record<string, unknown>;
  stream?: boolean;
}

export interface ChatSlice {
  conversations: ChatConversation[];
  messagesByConvId: Record<string, ChatMessage[]>;
  activeConvId: string | null;
  sendStatus: ChatSendStatus;
  retryState: ChatRetryPayload | null;
  currentRequestId: string | null;
  requestMap: Record<string, { conversationId: string; messageId: string }>;
  lastRequestByConvId: Record<
    string,
    {
      messages: Array<{
        id: string;
        role: "user" | "assistant" | "system" | "tool";
        content: string;
        ts: number;
        meta?: Record<string, unknown>;
      }>;
      userMessageId: string;
      assistantMessageId: string;
      requestOptions?: ChatRequestOptions;
    }
  >;
}

export interface ChatSliceActions {
  ensureConversation: () => Promise<string>;
  startNewConversation: (title?: string) => Promise<string>;
  loadConversations: () => Promise<void>;
  loadConversationHistory: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversationId: string) => void;
  sendChatMessage: (text: string, requestOptions?: ChatRequestOptions) => Promise<void>;
  handleChatChunk: (payload: ChatChunkPayload) => void;
  handleChatDone: (payload: ChatDonePayload) => void;
  handleChatError: (payload: ChatErrorPayload) => void;
  handleChatRetry: (payload: ChatRetryPayload) => void;
  abortChat: () => void;
  retryLast: (conversationId: string) => Promise<void>;
}

export type ChatSliceCreator<T> = StateCreator<T, [["zustand/devtools", never]], [], T>;

const truncateTitle = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return "New Chat";
  }
  if (trimmed.length <= 80) {
    return trimmed;
  }
  return `${trimmed.slice(0, 77)}...`;
};

const summarizeAssistantTitle = (text: string) => {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) {
    return "New Chat";
  }
  if (compact.length <= 60) {
    return compact;
  }
  return `${compact.slice(0, 57)}...`;
};

const mapMessagesForSend = (messages: ChatMessage[]) =>
  messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    ts: Date.now(),
    ...(message.metadata ? { meta: message.metadata } : {})
  }));

const omitKey = <T extends Record<string, unknown>>(map: T, key: string): T => {
  const { [key]: _omitted, ...rest } = map;
  return rest as T;
};

const sortConversationsList = (conversations: ChatConversation[]) =>
  [...conversations].sort((a, b) => {
    const aTime = Date.parse(a.updatedAt || a.createdAt);
    const bTime = Date.parse(b.updatedAt || b.createdAt);
    return bTime - aTime;
  });

const mergeConversationSummary = (
  conversations: ChatConversation[],
  updated: ChatConversation
) =>
  sortConversationsList([
    ...conversations.filter((conversation) => conversation.id !== updated.id),
    updated
  ]);

const mapConversationRecord = (input: any, fallbackTitle?: string): ChatConversation => {
  const safeTitle =
    typeof fallbackTitle === "string" && fallbackTitle.trim() ? fallbackTitle.trim() : "New Chat";
  if (!input || typeof input !== "object") {
    const now = new Date().toISOString();
    return {
      id: generateId(),
      title: safeTitle,
      createdAt: now,
      updatedAt: now
    };
  }
  const id =
    typeof input.id === "string" && input.id.trim() ? input.id.trim() : generateId();
  const title =
    typeof input.title === "string" && input.title.trim()
      ? input.title.trim()
      : safeTitle;
  const createdAt =
    typeof input.createdAt === "string" && input.createdAt
      ? input.createdAt
      : new Date().toISOString();
  const updatedAt =
    typeof input.updatedAt === "string" && input.updatedAt ? input.updatedAt : createdAt;
  return {
    id,
    title,
    createdAt,
    updatedAt
  };
};

const mapStoredMessageToChatMessage = (
  conversationId: string,
  stored: any
): ChatMessage | null => {
  if (!stored || typeof stored !== "object") {
    return null;
  }
  const role =
    stored.role === "assistant"
      ? "assistant"
      : stored.role === "user"
        ? "user"
        : null;
  if (!role) {
    return null;
  }
  const id =
    typeof stored.id === "string" && stored.id.trim() ? stored.id.trim() : generateId();
  const content =
    typeof stored.content === "string" ? stored.content : String(stored.content || "");
  const metadata =
    stored.meta && typeof stored.meta === "object"
      ? (stored.meta as Record<string, unknown>)
      : undefined;
  return {
    id,
    role,
    content,
    status: "completed",
    conversationId,
    metadata
  };
};

export const createChatSlice = <T extends ChatSlice & { actions: ChatSliceActions }>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => {
  const buildRequestOptionsPayload = (requestOptions?: ChatRequestOptions) => {
    const payload: Record<string, unknown> = {};
    if (requestOptions?.model) {
      payload.model = requestOptions.model;
    }
    if (typeof requestOptions?.temperature === "number") {
      payload.temperature = requestOptions.temperature;
    }
    if (typeof requestOptions?.max_tokens === "number") {
      payload.max_tokens = requestOptions.max_tokens;
    }
    if (requestOptions?.response_format) {
      payload.response_format = requestOptions.response_format;
    }
    if (typeof requestOptions?.stream === "boolean") {
      payload.stream = requestOptions.stream;
    }
    return payload;
  };

  const loadConversations = async () => {
    if (!window.chat?.getConversations) {
      return;
    }
    try {
      const list = await window.chat.getConversations();
      const mapped = Array.isArray(list)
        ? sortConversationsList(list.map((item) => mapConversationRecord(item)))
        : [];
      set((current) => {
        const hasActive = mapped.some((conversation) => conversation.id === current.activeConvId);
        const nextActive = hasActive ? current.activeConvId : mapped[0]?.id || null;
        return {
          conversations: mapped,
          activeConvId: nextActive
        } as Partial<T>;
      });
    } catch (error) {
      console.error("Failed to load conversations", error);
    }
  };

  const startNewConversation = async (title?: string): Promise<string> => {
    const state = get();
    const fallbackTitle =
      typeof title === "string" && title.trim()
        ? title.trim()
        : `Chat ${state.conversations.length + 1}`;
    if (window.chat?.createConversation) {
      try {
        const created = await window.chat.createConversation(fallbackTitle);
        const mapped = mapConversationRecord(created, fallbackTitle);
        set((current) => ({
          conversations: mergeConversationSummary(current.conversations, mapped),
          activeConvId: mapped.id,
          messagesByConvId: {
            ...current.messagesByConvId,
            [mapped.id]: current.messagesByConvId[mapped.id] || []
          }
        }) as Partial<T>);
        return mapped.id;
      } catch (error) {
        console.error("Failed to create conversation", error);
      }
    }
    const now = new Date().toISOString();
    const mapped: ChatConversation = {
      id: generateId(),
      title: fallbackTitle,
      createdAt: now,
      updatedAt: now
    };
    set((current) => ({
      conversations: mergeConversationSummary(current.conversations, mapped),
      activeConvId: mapped.id,
      messagesByConvId: {
        ...current.messagesByConvId,
        [mapped.id]: []
      }
    }) as Partial<T>);
    return mapped.id;
  };

  const ensureConversation = async (): Promise<string> => {
    let state = get();
    if (
      state.activeConvId &&
      state.conversations.some((conversation) => conversation.id === state.activeConvId)
    ) {
      return state.activeConvId;
    }
    if (!state.conversations.length && window.chat?.getConversations) {
      await loadConversations();
      state = get();
    }
    if (
      state.activeConvId &&
      state.conversations.some((conversation) => conversation.id === state.activeConvId)
    ) {
      return state.activeConvId;
    }
    if (state.conversations.length) {
      const nextId = state.conversations[0].id;
      set({ activeConvId: nextId } as Partial<T>);
      return nextId;
    }
    return startNewConversation();
  };

  const loadConversationHistory = async (conversationId: string) => {
    if (!conversationId || !window.chat?.getHistory) {
      return;
    }
    try {
      const result = await window.chat.getHistory(conversationId);
      const mappedMessages = Array.isArray(result?.messages)
        ? result.messages
            .map((message) => mapStoredMessageToChatMessage(conversationId, message))
            .filter((message): message is ChatMessage => Boolean(message))
        : [];
      set((current) => {
        const partial: Partial<T> = {
          messagesByConvId: {
            ...current.messagesByConvId,
            [conversationId]: mappedMessages
          }
        } as Partial<T>;
        if (result?.conversation) {
          const summary = mapConversationRecord(result.conversation);
          partial.conversations = mergeConversationSummary(current.conversations, summary);
        }
        return partial;
      });
    } catch (error) {
      console.error(`Failed to load conversation history for ${conversationId}`, error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!conversationId) {
      return;
    }
    if (window.chat?.deleteConversation) {
      try {
        await window.chat.deleteConversation(conversationId);
      } catch (error) {
        console.error(`Failed to delete conversation ${conversationId}`, error);
      }
    }
    set((current) => {
      const conversations = current.conversations.filter((conv) => conv.id !== conversationId);
      const nextActive =
        current.activeConvId === conversationId ? conversations[0]?.id || null : current.activeConvId;
      const { [conversationId]: _removedMessages, ...restMessages } = current.messagesByConvId;
      const { [conversationId]: _removedSnapshots, ...restSnapshots } = current.lastRequestByConvId;
      const nextRequestMap = Object.fromEntries(
        Object.entries(current.requestMap).filter(([, entry]) => entry.conversationId !== conversationId)
      );
      return {
        conversations,
        activeConvId: nextActive,
        messagesByConvId: restMessages,
        lastRequestByConvId: restSnapshots,
        requestMap: nextRequestMap,
        currentRequestId:
          current.currentRequestId && nextRequestMap[current.currentRequestId]
            ? current.currentRequestId
            : null,
        sendStatus: nextActive ? current.sendStatus : "idle",
        retryState: nextActive ? current.retryState : null
      } as Partial<T>;
    });
    const nextActiveId = get().activeConvId;
    if (nextActiveId) {
      void loadConversationHistory(nextActiveId);
    }
  };

  const appendMessage = (conversationId: string, message: ChatMessage) => {
    set((current) => {
      const existing = current.messagesByConvId[conversationId] || [];
      const now = new Date().toISOString();
      const isFirstUserMessage = !existing.length && message.role === "user";
      const updatedMessages = [...existing, message];
      const existingConversation = current.conversations.find((conv) => conv.id === conversationId);

      const updatedConversation: ChatConversation = existingConversation
        ? {
            ...existingConversation,
            updatedAt: now,
            title: isFirstUserMessage
              ? truncateTitle(message.content)
              : existingConversation.title
          }
        : {
            id: conversationId,
            title: isFirstUserMessage ? truncateTitle(message.content) : "New Chat",
            createdAt: now,
            updatedAt: now
          };

      return {
        messagesByConvId: {
          ...current.messagesByConvId,
          [conversationId]: updatedMessages
        },
        conversations: mergeConversationSummary(current.conversations, updatedConversation)
      } as Partial<T>;
    });
  };

  const updateStreamingMessage = (
    conversationId: string,
    messageId: string,
    updater: (message: ChatMessage) => ChatMessage,
    touchUpdatedAt = false
  ) => {
    set((current) => {
      const messages = current.messagesByConvId[conversationId] || [];
      const updatedMessages = messages.map((message) =>
        message.id === messageId ? updater(message) : message
      );

      let conversations = current.conversations;
      if (touchUpdatedAt) {
        const now = new Date().toISOString();
        const existingConversation = current.conversations.find(
          (conv) => conv.id === conversationId
        );
        if (existingConversation) {
          conversations = mergeConversationSummary(current.conversations, {
            ...existingConversation,
            updatedAt: now
          });
        }
      }

      return {
        messagesByConvId: {
          ...current.messagesByConvId,
          [conversationId]: updatedMessages
        },
        ...(touchUpdatedAt ? { conversations } : {})
      } as Partial<T>;
    });
  };

  const sendChatMessage = async (text: string, requestOptions?: ChatRequestOptions) => {
    const content = text.trim();
    if (!content) {
      return;
    }
    const status = get().sendStatus;
    if (status === "streaming" || status === "connecting" || status === "retrying") {
      return;
    }
    const conversationId = await ensureConversation();
    if (!conversationId) {
      return;
    }
    if (!get().messagesByConvId[conversationId]) {
      await loadConversationHistory(conversationId);
    }
    const existingHistory = get().messagesByConvId[conversationId] || [];
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      status: "completed",
      conversationId
    };
    appendMessage(conversationId, userMessage);

    const assistantMessageId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      status: "streaming",
      conversationId,
      requestId: null,
      metadata: requestOptions ? { requestOptions } : undefined
    };
    appendMessage(conversationId, assistantMessage);

    set({
      sendStatus: "connecting",
      retryState: null,
      currentRequestId: null
    } as Partial<T>);

    if (!window.chat?.send) {
      updateStreamingMessage(
        conversationId,
        assistantMessageId,
        (message) => ({
          ...message,
          status: "error",
          metadata: {
            ...(message.metadata || {}),
            error: {
              code: "unavailable",
              message: "Chat bridge unavailable"
            }
          }
        }),
        true
      );
      set({ sendStatus: "error" } as Partial<T>);
      return;
    }

    try {
      const payloadMessages = mapMessagesForSend([...existingHistory, userMessage]);
      const optionsPayload: Record<string, unknown> = {
        ...buildRequestOptionsPayload(requestOptions),
        assistantMessageId,
        userMessageId: userMessage.id
      };
      const response = await window.chat.send(conversationId, payloadMessages, optionsPayload);
      const requestId = response?.requestId || generateId();
      const persistedConversationId = response?.conversationId || conversationId;

      if (persistedConversationId !== conversationId) {
        set((current) => {
          const messages = current.messagesByConvId[conversationId] || [];
          const { [conversationId]: _oldMessages, ...restMessages } = current.messagesByConvId;
          const { [conversationId]: _oldSnapshots, ...restSnapshots } = current.lastRequestByConvId;
          return {
            activeConvId: persistedConversationId,
            messagesByConvId: {
              ...restMessages,
              [persistedConversationId]: messages
            },
            lastRequestByConvId: restSnapshots
          } as Partial<T>;
        });
      }

      updateStreamingMessage(
        persistedConversationId,
        assistantMessageId,
        (message) => ({
          ...message,
          requestId,
          status: "streaming"
        }),
        true
      );

      set((current) => ({
        currentRequestId: requestId,
        requestMap: {
          ...current.requestMap,
          [requestId]: {
            conversationId: persistedConversationId,
            messageId: assistantMessageId
          }
        },
        lastRequestByConvId: {
          ...current.lastRequestByConvId,
          [persistedConversationId]: {
            messages: payloadMessages,
            userMessageId: userMessage.id,
            assistantMessageId,
            requestOptions
          }
        }
      }) as Partial<T>);
    } catch (error) {
      updateStreamingMessage(
        conversationId,
        assistantMessageId,
        (message) => ({
          ...message,
          status: "error",
          metadata: {
            ...(message.metadata || {}),
            error: {
              code: "send_failed",
              message: error instanceof Error ? error.message : "Failed to send request"
            }
          }
        }),
        true
      );
      set({
        sendStatus: "error",
        currentRequestId: null
      } as Partial<T>);
    }
  };

  const handleChatChunk = ({ requestId, delta }: ChatChunkPayload) => {
    const entry = get().requestMap[requestId];
    if (!entry) {
      return;
    }
    if (get().sendStatus !== "streaming") {
      set({ sendStatus: "streaming", retryState: null } as Partial<T>);
    }
    const { conversationId, messageId } = entry;
    updateStreamingMessage(conversationId, messageId, (message) => {
      if (message.requestId && message.requestId !== requestId) {
        return message;
      }
      return {
        ...message,
        requestId,
        status: "streaming",
        content: `${message.content}${delta || ""}`
      };
    });
  };

  const handleChatRetry = ({ requestId, attempt, maxAttempts }: ChatRetryPayload) => {
    if (!get().requestMap[requestId]) {
      return;
    }
    set({
      sendStatus: "retrying",
      retryState: { requestId, attempt, maxAttempts }
    } as Partial<T>);
  };

  const handleChatDone = ({ requestId, usage, finishReason }: ChatDonePayload) => {
    const entry = get().requestMap[requestId];
    if (!entry) {
      set({
        sendStatus: "done",
        retryState: null,
        currentRequestId: null
      } as Partial<T>);
      return;
    }
    const { conversationId, messageId } = entry;
    updateStreamingMessage(
      conversationId,
      messageId,
      (message) => {
        if (message.requestId && message.requestId !== requestId) {
          return message;
        }
        const metadata = {
          ...(message.metadata || {}),
          ...(usage ? { usage } : {}),
          ...(finishReason ? { finishReason } : {})
        };
        return {
          ...message,
          status: "completed",
          metadata: Object.keys(metadata).length ? metadata : message.metadata
        };
      },
      true
    );

    set((current) => {
      const messages = current.messagesByConvId[conversationId] || [];
      const assistantMessage = messages.find((message) => message.id === messageId);
      const title = assistantMessage ? summarizeAssistantTitle(assistantMessage.content) : undefined;
      const now = new Date().toISOString();
      const nextRequestMap = omitKey(current.requestMap, requestId);
      const existingConversation = current.conversations.find((conv) => conv.id === conversationId);
      const updatedConversation: ChatConversation = existingConversation
        ? {
            ...existingConversation,
            title: title || existingConversation.title,
            updatedAt: now
          }
        : {
            id: conversationId,
            title: title || "New Chat",
            createdAt: now,
            updatedAt: now
          };
      return {
        requestMap: nextRequestMap,
        sendStatus: "done",
        retryState: null,
        currentRequestId: current.currentRequestId === requestId ? null : current.currentRequestId,
        conversations: mergeConversationSummary(current.conversations, updatedConversation)
      } as Partial<T>;
    });
  };

  const handleChatError = ({ requestId, code, message: errorMessage }: ChatErrorPayload) => {
    const normalizedCode = (typeof code === "string" && code.trim()) || "unknown_error";
    const entry = get().requestMap[requestId];
    if (!entry) {
      set({
        sendStatus: normalizedCode === "aborted" ? "aborted" : "error",
        retryState: null,
        currentRequestId: null
      } as Partial<T>);
      return;
    }
    const { conversationId, messageId } = entry;
    updateStreamingMessage(
      conversationId,
      messageId,
      (message) => {
        const metadata = {
          ...(message.metadata || {}),
          error: {
            code: normalizedCode,
            ...(errorMessage && errorMessage.trim() ? { message: errorMessage.trim() } : {})
          }
        };
        return {
          ...message,
          status: "error",
          metadata
        };
      },
      true
    );

    set((current) => {
      const now = new Date().toISOString();
      const nextRequestMap = omitKey(current.requestMap, requestId);
      const existingConversation = current.conversations.find((conv) => conv.id === conversationId);
      const updatedConversation = existingConversation
        ? {
            ...existingConversation,
            updatedAt: now
          }
        : {
            id: conversationId,
            title: "New Chat",
            createdAt: now,
            updatedAt: now
          };
      return {
        requestMap: nextRequestMap,
        sendStatus: normalizedCode === "aborted" ? "aborted" : "error",
        retryState: null,
        currentRequestId: current.currentRequestId === requestId ? null : current.currentRequestId,
        conversations: mergeConversationSummary(current.conversations, updatedConversation)
      } as Partial<T>;
    });
  };

  const abortChat = () => {
    const requestId = get().currentRequestId;
    if (requestId && window.chat?.abort) {
      window.chat.abort(requestId);
    }
    set((current) => ({
      sendStatus: "aborted",
      retryState: null,
      currentRequestId: null,
      requestMap: requestId ? omitKey(current.requestMap, requestId) : current.requestMap
    }) as Partial<T>);
  };

  const retryLast = async (conversationId: string) => {
    const snapshot = get().lastRequestByConvId[conversationId];
    if (!snapshot) {
      return;
    }
    const status = get().sendStatus;
    if (status === "streaming" || status === "connecting" || status === "retrying") {
      return;
    }
    const assistantMessageId = snapshot.assistantMessageId;
    updateStreamingMessage(
      conversationId,
      assistantMessageId,
      (message) => {
        const metadata = { ...(message.metadata || {}) };
        if ("error" in metadata) {
          delete metadata.error;
        }
        if (snapshot.requestOptions) {
          metadata.requestOptions = snapshot.requestOptions;
        }
        return {
          ...message,
          content: "",
          status: "streaming",
          requestId: null,
          metadata: Object.keys(metadata).length ? metadata : undefined
        };
      },
      true
    );

    set({
      sendStatus: "connecting",
      retryState: null,
      currentRequestId: null
    } as Partial<T>);

    if (!window.chat?.send) {
      updateStreamingMessage(
        conversationId,
        assistantMessageId,
        (message) => ({
          ...message,
          status: "error",
          metadata: {
            ...(message.metadata || {}),
            error: {
              code: "unavailable",
              message: "Chat bridge unavailable"
            }
          }
        }),
        true
      );
      set({ sendStatus: "error" } as Partial<T>);
      return;
    }

    try {
      const optionsPayload: Record<string, unknown> = {
        ...buildRequestOptionsPayload(snapshot.requestOptions),
        assistantMessageId: snapshot.assistantMessageId,
        userMessageId: snapshot.userMessageId,
        isRetry: true
      };
      const response = await window.chat.send(conversationId, snapshot.messages, optionsPayload);
      const requestId = response?.requestId || generateId();

      updateStreamingMessage(
        conversationId,
        assistantMessageId,
        (message) => ({
          ...message,
          requestId,
          status: "streaming"
        }),
        true
      );

      set((current) => ({
        currentRequestId: requestId,
        requestMap: {
          ...current.requestMap,
          [requestId]: {
            conversationId,
            messageId: assistantMessageId
          }
        },
        lastRequestByConvId: {
          ...current.lastRequestByConvId,
          [conversationId]: snapshot
        }
      }) as Partial<T>);
    } catch (error) {
      updateStreamingMessage(
        conversationId,
        assistantMessageId,
        (message) => ({
          ...message,
          status: "error",
          metadata: {
            ...(message.metadata || {}),
            error: {
              code: "retry_failed",
              message: error instanceof Error ? error.message : "Retry failed"
            }
          }
        }),
        true
      );
      set({
        sendStatus: "error",
        currentRequestId: null
      } as Partial<T>);
    }
  };

  return {
    state: {
      conversations: [],
      messagesByConvId: {},
      activeConvId: null,
      sendStatus: "idle",
      retryState: null,
      currentRequestId: null,
      requestMap: {},
      lastRequestByConvId: {}
    } as ChatSlice,
    actions: {
      ensureConversation,
      startNewConversation,
      loadConversations,
      loadConversationHistory,
      deleteConversation,
      setActiveConversation: (conversationId: string) => {
        set({ activeConvId: conversationId } as Partial<T>);
      },
      sendChatMessage,
      handleChatChunk,
      handleChatDone,
      handleChatError,
      handleChatRetry,
      abortChat,
      retryLast
    } as ChatSliceActions
  };
};
