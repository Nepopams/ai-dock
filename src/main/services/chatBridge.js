const { webContents } = require("electron");
const { randomUUID } = require("crypto");
const {
  getActiveProfile,
  secureRetrieveToken
} = require("./settings");
const historyFs = require("../storage/historyFs");
const { send: sendOpenAI } = require("../providers/openaiCompatible");

const wait = (ms) =>
  new Promise((resolve) => {
    if (ms > 0) {
      setTimeout(resolve, ms);
    } else {
      resolve();
    }
  });

const deriveInitialTitle = (messages) => {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  if (!lastUser) {
    return "New Chat";
  }
  const compact = String(lastUser.content || "").replace(/\s+/g, " ").trim();
  if (!compact) {
    return "New Chat";
  }
  return compact.length > 80 ? `${compact.slice(0, 77)}...` : compact;
};

const deriveAssistantTitle = (content) => {
  const compact = String(content || "").replace(/\s+/g, " ").trim();
  if (!compact) {
    return null;
  }
  return compact.length > 60 ? `${compact.slice(0, 57)}...` : compact;
};

const shouldRetryError = (error) => {
  if (!error || typeof error !== "object") {
    return false;
  }
  if (error.code === "aborted" || error.code === "timeout") {
    return false;
  }
  if (typeof error.status === "number") {
    if (error.status >= 500) {
      return true;
    }
    if (error.status >= 400 && error.status < 500) {
      return false;
    }
  }
  const normalizedCode = typeof error.code === "string" ? error.code.toLowerCase() : "";
  if (normalizedCode === "network_error" || normalizedCode === "etimedout") {
    return true;
  }
  return false;
};

const normalizeErrorCode = (error) => {
  if (!error || typeof error !== "object") {
    return "upstream_error";
  }
  if (error.code === "timeout") {
    return "timeout";
  }
  if (error.code === "network_error") {
    return "network";
  }
  if (typeof error.status === "number" && error.status >= 500) {
    return "network";
  }
  if (typeof error.code === "string") {
    return error.code;
  }
  if (typeof error.status === "number") {
    return `http_${error.status}`;
  }
  return "upstream_error";
};

class ChatBridge {
  constructor() {
    /**
     * @type {Map<string, { controller: AbortController | null, webContentsId: number, aborted: boolean, destroyHandler?: () => void, assistantMessageId: string, conversationId: string, pendingContent: string, attempt: number, maxAttempts: number }>}
     */
    this.streams = new Map();
  }

  getWebContents(id) {
    const target = webContents.fromId(id);
    if (!target || target.isDestroyed()) {
      return null;
    }
    return target;
  }

  cleanup(requestId) {
    const stream = this.streams.get(requestId);
    if (!stream) {
      return;
    }
    const target = this.getWebContents(stream.webContentsId);
    if (target && stream.destroyHandler) {
      target.removeListener("destroyed", stream.destroyHandler);
    }
    this.streams.delete(requestId);
  }

  async start(conversationId, messages, options = {}, sender) {
    if (!sender || sender.isDestroyed()) {
      throw new Error("Cannot start chat stream without a valid sender");
    }

    for (const [id, stream] of this.streams.entries()) {
      if (stream.webContentsId === sender.id) {
        this.abort(id);
      }
    }

    const profile = await getActiveProfile();
    if (!profile?.auth?.tokenRef) {
      const error = new Error("Active profile is missing authentication token");
      error.code = "missing_token";
      throw error;
    }
    const token = await secureRetrieveToken(profile.auth.tokenRef);
    const runtimeProfile = {
      ...profile,
      auth: {
        ...profile.auth,
        token
      }
    };

    const {
      __internal: internalOptions = {},
      ...driverOptions
    } = options && typeof options === "object" ? options : {};

    const assistantMessageId =
      typeof internalOptions.assistantMessageId === "string" &&
      internalOptions.assistantMessageId.trim()
        ? internalOptions.assistantMessageId.trim()
        : randomUUID();
    const userMessageId =
      typeof internalOptions.userMessageId === "string" &&
      internalOptions.userMessageId.trim()
        ? internalOptions.userMessageId.trim()
        : null;
    const isRetry = Boolean(internalOptions.isRetry);
    const maxAttempts =
      Number.isInteger(internalOptions.maxRetries) && internalOptions.maxRetries > 0
        ? internalOptions.maxRetries
        : 3;
    const baseDelayMs =
      Number.isFinite(internalOptions.baseDelayMs) && internalOptions.baseDelayMs > 0
        ? internalOptions.baseDelayMs
        : 1000;

    const resolvedConversationId =
      typeof conversationId === "string" && conversationId.trim()
        ? conversationId.trim()
        : "";

    const modelName =
      typeof driverOptions.model === "string" && driverOptions.model.trim()
        ? driverOptions.model.trim()
        : runtimeProfile.defaultModel;
    const profileName =
      typeof runtimeProfile.name === "string" && runtimeProfile.name.trim()
        ? runtimeProfile.name.trim()
        : runtimeProfile.id || "default";

    const messageList = Array.isArray(messages) ? messages : [];

    let conversation =
      resolvedConversationId && (await historyFs.readConversation(resolvedConversationId));
    if (!conversation) {
      conversation = await historyFs.createConversation(
        deriveInitialTitle(messageList),
        modelName,
        profileName,
        resolvedConversationId || undefined
      );
    } else {
      await historyFs.updateConversationMeta(conversation.id, {
        model: modelName,
        profile: profileName
      });
    }

    const conversationIdForRequest = conversation.id;

    const existingMessages = Array.isArray(conversation.messages)
      ? conversation.messages
      : [];

    const normalizeMessageForHistory = (message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      ts: Number.isFinite(message.ts) ? Number(message.ts) : Date.now(),
      ...(message.meta && typeof message.meta === "object" ? { meta: message.meta } : {})
    });

    if (!isRetry) {
      const targetUserMessage = messageList.find((message) => message.id === userMessageId);
      if (targetUserMessage && !existingMessages.find((msg) => msg.id === targetUserMessage.id)) {
        await historyFs.appendMessage(
          conversationIdForRequest,
          normalizeMessageForHistory(targetUserMessage)
        );
      }
    }

    const requestId = randomUUID();

    const assistantExists = existingMessages.some(
      (message) => message.id === assistantMessageId
    );
    if (!assistantExists) {
      await historyFs.appendMessage(conversationIdForRequest, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        ts: Date.now(),
        meta: {
          requestId
        }
      });
    } else if (isRetry) {
      await historyFs.finalizeAssistantMessage(conversationIdForRequest, assistantMessageId, "", {
        requestId
      });
    }

    const streamState = {
      controller: null,
      webContentsId: sender.id,
      aborted: false,
      destroyHandler: undefined,
      assistantMessageId,
      conversationId: conversationIdForRequest,
      pendingContent: "",
      attempt: 0,
      maxAttempts: Math.max(1, maxAttempts)
    };

    const destroyHandler = () => {
      this.abort(requestId);
    };
    sender.on("destroyed", destroyHandler);
    streamState.destroyHandler = destroyHandler;
    this.streams.set(requestId, streamState);

    const target = () => this.getWebContents(streamState.webContentsId);
    const emit = (channel, payload) => {
      const recipient = target();
      if (recipient) {
        recipient.send(channel, payload);
      }
    };

    const timeoutMs =
      Number.isFinite(runtimeProfile.request?.timeoutMs) && runtimeProfile.request.timeoutMs > 0
        ? runtimeProfile.request.timeoutMs
        : 60000;

    const runAttempt = async () => {
      streamState.pendingContent = "";
      const controller = new AbortController();
      streamState.controller = controller;
      const upstream = sendOpenAI(
        messageList,
        driverOptions,
        runtimeProfile,
        controller.signal
      );
      const iterator = upstream[Symbol.asyncIterator]();
      let finalUsage;
      let finalFinishReason;

      try {
        while (true) {
          const { done, value } = await iterator.next();
          if (done) {
            if (value?.usage) {
              finalUsage = value.usage;
            }
            if (value?.finishReason) {
              finalFinishReason = value.finishReason;
            }
            break;
          }

          if (streamState.aborted) {
            throw Object.assign(new Error("Request aborted"), { code: "aborted" });
          }

          const chunk = value;
          if (chunk.delta) {
            streamState.pendingContent = `${streamState.pendingContent}${chunk.delta}`;
            await historyFs.finalizeAssistantMessage(
              conversationIdForRequest,
              assistantMessageId,
              streamState.pendingContent,
              { requestId }
            );
            emit("chat:chunk", {
              requestId,
              delta: chunk.delta
            });
          }

          if (chunk.usage) {
            finalUsage = chunk.usage;
          }
          if (chunk.finishReason) {
            finalFinishReason = chunk.finishReason;
          }
        }
      } finally {
        streamState.controller = null;
      }

      const metaPatch = {};
      if (finalUsage) {
        metaPatch.usage = finalUsage;
      }
      if (finalFinishReason) {
        metaPatch.finishReason = finalFinishReason;
      }
      if (Object.keys(metaPatch).length) {
        await historyFs.finalizeAssistantMessage(
          conversationIdForRequest,
          assistantMessageId,
          streamState.pendingContent,
          metaPatch
        );
      }

      const assistantTitle = deriveAssistantTitle(streamState.pendingContent);
      await historyFs.updateConversationMeta(conversationIdForRequest, {
        title: assistantTitle || conversation.title,
        updatedAt: new Date().toISOString(),
        model: modelName,
        profile: profileName
      });

      return {
        usage: finalUsage,
        finishReason: finalFinishReason
      };
    };

    const runWithTimeout = (executor) =>
      new Promise((resolve, reject) => {
        let finished = false;
        const timeoutId = setTimeout(() => {
          if (finished) {
            return;
          }
          finished = true;
          if (streamState.controller) {
            streamState.controller.abort();
          }
          const timeoutError = new Error("Request timed out");
          timeoutError.code = "timeout";
          reject(timeoutError);
        }, timeoutMs);

        executor()
          .then((value) => {
            if (finished) {
              return;
            }
            finished = true;
            clearTimeout(timeoutId);
            resolve(value);
          })
          .catch((error) => {
            if (finished) {
              return;
            }
            finished = true;
            clearTimeout(timeoutId);
            reject(error);
          });
      });

    (async () => {
      let lastError = null;
      for (let attempt = 0; attempt < streamState.maxAttempts; attempt += 1) {
        streamState.attempt = attempt + 1;
        try {
          const result = await runWithTimeout(runAttempt);
          if (!streamState.aborted) {
            emit("chat:done", {
              requestId,
              usage: result.usage,
              finishReason: result.finishReason,
              conversationId: conversationIdForRequest
            });
          }
          this.cleanup(requestId);
          return;
        } catch (error) {
          lastError = error;
          if (streamState.aborted) {
            this.cleanup(requestId);
            return;
          }
          const retriable = shouldRetryError(error);
          if (retriable && attempt < streamState.maxAttempts - 1) {
            const nextAttempt = attempt + 2;
            const delay = baseDelayMs * Math.pow(2, attempt);
            console.warn(
              `[chatBridge] request ${requestId} retry ${nextAttempt}/${streamState.maxAttempts} (${error.message || error})`
            );
            emit("chat:retry", {
              requestId,
              attempt: nextAttempt,
              maxAttempts: streamState.maxAttempts
            });
            await wait(delay);
            continue;
          }

          const code = normalizeErrorCode(error);
          const message =
            typeof error?.message === "string" && error.message
              ? error.message
              : code === "timeout"
                ? "Upstream request timed out"
                : "Failed to complete request";
          console.error(
            `[chatBridge] request ${requestId} failed: ${message} (${code})`
          );
          emit("chat:error", {
            requestId,
            code,
            message
          });
          break;
        }
      }

      if (lastError && normalizeErrorCode(lastError) === "timeout") {
        await historyFs.finalizeAssistantMessage(
          conversationIdForRequest,
          assistantMessageId,
          streamState.pendingContent,
          {
            error: {
              code: "timeout",
              message: "Request timed out"
            }
          }
        );
      }

      this.cleanup(requestId);
    })();

    return { requestId, conversationId: conversationIdForRequest };
  }

  abort(requestId) {
    const stream = this.streams.get(requestId);
    if (!stream) {
      return;
    }
    if (stream.aborted) {
      return;
    }
    stream.aborted = true;
    if (stream.controller) {
      stream.controller.abort();
    }
    const recipient = this.getWebContents(stream.webContentsId);
    if (recipient) {
      recipient.send("chat:error", {
        requestId,
        code: "aborted",
        message: "Chat stream aborted by user"
      });
    }
    this.cleanup(requestId);
  }
}

module.exports = new ChatBridge();
