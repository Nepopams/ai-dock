const { ipcMain } = require("electron");
const chatBridge = require("../services/chatBridge");
const historyFs = require("../storage/historyFs");

let registered = false;

const ensureArray = (value) => (Array.isArray(value) ? value : []);
const ensureObject = (value) => (value && typeof value === "object" ? value : {});
const ensureString = (value) => (typeof value === "string" ? value : "");
const ensureNumber = (value) => (Number.isFinite(value) ? Number(value) : null);

const conversationToSummary = (conversation) => ({
  id: conversation.id,
  title: conversation.title,
  createdAt: conversation.createdAt,
  updatedAt: conversation.updatedAt,
  model: conversation.model || null,
  profile: conversation.profile || null,
  messageCount: Array.isArray(conversation.messages) ? conversation.messages.length : 0
});

function registerChatIpc() {
  if (registered) {
    return;
  }
  registered = true;

  ipcMain.handle("chat:send", async (event, payload = {}) => {
    const conversationId = ensureString(payload.conversationId).trim();
    const messages = ensureArray(payload.messages);
    const options = ensureObject(payload.options);
    const result = await chatBridge.start(conversationId, messages, options, event.sender);
    return {
      requestId: result.requestId,
      conversationId: result.conversationId
    };
  });

  ipcMain.on("chat:abort", (_event, requestId) => {
    chatBridge.abort(typeof requestId === "string" ? requestId.trim() : "");
  });

  ipcMain.handle("chat:getConversations", async () => {
    return historyFs.listConversations();
  });

  ipcMain.handle("chat:getHistory", async (_event, payload = {}) => {
    const normalized =
      typeof payload === "string" ? { conversationId: payload } : ensureObject(payload);
    const conversationId = ensureString(normalized.conversationId).trim();
    if (!conversationId) {
      return { conversation: null, messages: [] };
    }
    const cursor =
      typeof normalized.cursor === "string" && normalized.cursor.trim()
        ? normalized.cursor.trim()
        : undefined;
    const limitValue = ensureNumber(normalized.limit);
    const limit = limitValue && limitValue > 0 ? limitValue : undefined;
    return historyFs.getMessages(conversationId, cursor, limit);
  });

  ipcMain.handle("chat:createConversation", async (_event, payload) => {
    const input = ensureObject(payload);
    const title =
      typeof payload === "string"
        ? payload
        : ensureString(input.title);
    const model =
      typeof input.model === "string" && input.model.trim() ? input.model.trim() : undefined;
    const profile =
      typeof input.profile === "string" && input.profile.trim() ? input.profile.trim() : undefined;
    const id =
      typeof input.id === "string" && input.id.trim() ? input.id.trim() : undefined;
    const conversation = await historyFs.createConversation(
      title && title.trim() ? title.trim() : undefined,
      model,
      profile,
      id
    );
    return conversationToSummary(conversation);
  });

  ipcMain.handle("chat:deleteConversation", async (_event, conversationId) => {
    const normalized = ensureString(conversationId).trim();
    if (!normalized) {
      return false;
    }
    return historyFs.deleteConversation(normalized);
  });
}

module.exports = { registerChatIpc };
