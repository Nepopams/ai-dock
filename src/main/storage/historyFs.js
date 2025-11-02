const { app } = require("electron");
const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs/promises");

const HISTORY_DIR = () => path.join(app.getPath("userData"), "ai-dock", "chat");

const toIsoString = () => new Date().toISOString();

const ensureStorageDir = async () => {
  const dir = HISTORY_DIR();
  await fs.mkdir(dir, { recursive: true });
  return dir;
};

const conversationPath = (conversationId) =>
  path.join(HISTORY_DIR(), `${conversationId}.json`);

const safeWrite = async (targetPath, data) => {
  await ensureStorageDir();
  const tempPath = `${targetPath}.${randomUUID()}.tmp`;
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(tempPath, payload, "utf8");
  await fs.rename(tempPath, targetPath);
};

const readConversation = async (conversationId) => {
  try {
    const filePath = conversationPath(conversationId);
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const sanitizeMessage = (message) => {
  if (!message || typeof message !== "object") {
    throw new Error("Message must be an object");
  }
  const id =
    typeof message.id === "string" && message.id.trim()
      ? message.id.trim()
      : randomUUID();
  const role =
    typeof message.role === "string" && message.role.trim()
      ? message.role.trim()
      : "assistant";
  const content =
    typeof message.content === "string" ? message.content : String(message.content || "");
  const ts = Number.isFinite(message.ts) ? Number(message.ts) : Date.now();
  const meta =
    message.meta && typeof message.meta === "object" ? message.meta : undefined;
  const sanitized = { id, role, content, ts };
  if (meta) {
    sanitized.meta = meta;
  }
  return sanitized;
};

const createConversation = async (title, model, profile, conversationId) => {
  await ensureStorageDir();
  const now = toIsoString();
  const id = conversationId && typeof conversationId === "string" && conversationId.trim()
    ? conversationId.trim()
    : randomUUID();
  const normalizedTitle =
    typeof title === "string" && title.trim() ? title.trim() : "New Chat";

  const conversation = {
    id,
    title: normalizedTitle,
    createdAt: now,
    updatedAt: now,
    model: typeof model === "string" && model.trim() ? model.trim() : null,
    profile: typeof profile === "string" && profile.trim() ? profile.trim() : null,
    messages: []
  };

  await safeWrite(conversationPath(id), conversation);
  return conversation;
};

const appendMessage = async (conversationId, message) => {
  const conversation = await readConversation(conversationId);
  if (!conversation) {
    throw new Error(`Conversation "${conversationId}" not found`);
  }
  const sanitizedMessage = sanitizeMessage(message);
  conversation.messages = Array.isArray(conversation.messages)
    ? [...conversation.messages, sanitizedMessage]
    : [sanitizedMessage];
  conversation.updatedAt = toIsoString();
  await safeWrite(conversationPath(conversationId), conversation);
  return sanitizedMessage;
};

const finalizeAssistantMessage = async (
  conversationId,
  messageId,
  content,
  metaPatch
) => {
  const conversation = await readConversation(conversationId);
  if (!conversation) {
    throw new Error(`Conversation "${conversationId}" not found`);
  }
  const messages = Array.isArray(conversation.messages)
    ? [...conversation.messages]
    : [];
  const targetIndex = messages.findIndex((message) => message.id === messageId);
  if (targetIndex === -1) {
    return null;
  }
  const target = messages[targetIndex];
  const next = {
    ...target,
    content: typeof content === "string" ? content : target.content,
    meta:
      metaPatch && typeof metaPatch === "object"
        ? {
            ...(target.meta && typeof target.meta === "object" ? target.meta : {}),
            ...metaPatch
          }
        : target.meta
  };
  messages[targetIndex] = next;
  conversation.messages = messages;
  conversation.updatedAt = toIsoString();
  await safeWrite(conversationPath(conversationId), conversation);
  return next;
};

const listConversations = async () => {
  await ensureStorageDir();
  const dir = HISTORY_DIR();
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
  const conversations = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }
    const id = entry.name.replace(/\.json$/i, "");
    const conversation = await readConversation(id);
    if (conversation) {
      conversations.push({
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        model: conversation.model || null,
        profile: conversation.profile || null,
        messageCount: Array.isArray(conversation.messages)
          ? conversation.messages.length
          : 0
      });
    }
  }
  conversations.sort((a, b) => {
    const aTime = Date.parse(a.updatedAt || a.createdAt || 0);
    const bTime = Date.parse(b.updatedAt || b.createdAt || 0);
    return bTime - aTime;
  });
  return conversations;
};

const getMessages = async (conversationId, cursor, limit) => {
  const conversation = await readConversation(conversationId);
  if (!conversation) {
    return { conversation: null, messages: [] };
  }
  const messages = Array.isArray(conversation.messages)
    ? [...conversation.messages]
    : [];
  let startIndex = 0;
  if (cursor) {
    const cursorIndex = messages.findIndex((message) => message.id === cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  } else if (Number.isFinite(limit) && limit > 0 && messages.length > limit) {
    startIndex = messages.length - limit;
  }
  let sliced = messages.slice(startIndex);
  if (Number.isFinite(limit) && limit > 0) {
    sliced = sliced.slice(0, limit);
  }
  return {
    conversation: {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      model: conversation.model || null,
      profile: conversation.profile || null
    },
    messages: sliced
  };
};

const deleteConversation = async (conversationId) => {
  try {
    await fs.unlink(conversationPath(conversationId));
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

const updateConversationMeta = async (conversationId, partial) => {
  const conversation = await readConversation(conversationId);
  if (!conversation) {
    throw new Error(`Conversation "${conversationId}" not found`);
  }
  const now = toIsoString();
  const next = {
    ...conversation,
    ...partial,
    updatedAt: partial && partial.updatedAt ? partial.updatedAt : now
  };
  await safeWrite(conversationPath(conversationId), next);
  return next;
};

const deleteMessage = async (conversationId, messageId) => {
  const conversation = await readConversation(conversationId);
  if (!conversation || !Array.isArray(conversation.messages)) {
    return false;
  }
  const messages = conversation.messages.filter((message) => message.id !== messageId);
  if (messages.length === conversation.messages.length) {
    return false;
  }
  const next = {
    ...conversation,
    messages,
    updatedAt: toIsoString()
  };
  await safeWrite(conversationPath(conversationId), next);
  return true;
};

const truncateAfterMessage = async (conversationId, messageId) => {
  const conversation = await readConversation(conversationId);
  if (!conversation || !Array.isArray(conversation.messages)) {
    return false;
  }
  const index = conversation.messages.findIndex((message) => message.id === messageId);
  if (index === -1) {
    return false;
  }
  const trimmed = conversation.messages.slice(0, index + 1);
  const next = {
    ...conversation,
    messages: trimmed,
    updatedAt: toIsoString()
  };
  await safeWrite(conversationPath(conversationId), next);
  return true;
};

module.exports = {
  ensureStorageDir,
  createConversation,
  appendMessage,
  finalizeAssistantMessage,
  listConversations,
  getMessages,
  deleteConversation,
  safeWrite,
  updateConversationMeta,
  readConversation,
  deleteMessage,
  truncateAfterMessage
};
