const { dialog, BrowserWindow } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const historyFs = require("../storage/historyFs");

const sanitizeFilename = (input) =>
  (input || "conversation")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 120);

const formatTimestamp = (value) => {
  if (!value) {
    return "";
  }
  try {
    if (typeof value === "number") {
      return new Date(value).toISOString();
    }
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
      return value;
    }
    return new Date(value).toISOString();
  } catch {
    return String(value);
  }
};

const escapeMarkdown = (text) => {
  if (!text) {
    return "";
  }
  return String(text).replace(/```/g, "```\u200b```");
};

const formatRoleLabel = (role) => {
  switch (role) {
    case "assistant":
      return "Assistant";
    case "system":
      return "System";
    case "tool":
      return "Tool";
    default:
      return "User";
  }
};

const formatConversationToMarkdown = (conversation) => {
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  const title = conversation.title || "Untitled Conversation";
  const createdAt = formatTimestamp(conversation.createdAt);
  const updatedAt = formatTimestamp(conversation.updatedAt);
  const model = conversation.model || "unknown";
  const profile = conversation.profile || "default";
  const headerLines = [
    `# ${title}`,
    ``,
    `- Model: ${model} • Profile: ${profile} • Created: ${createdAt} • Updated: ${updatedAt}`,
    `---`,
    `## Messages`,
    ``
  ];

  const messageLines = (Array.isArray(conversation.messages) ? conversation.messages : []).map(
    (message) => {
      const timestamp = formatTimestamp(message.ts);
      const label = formatRoleLabel(message.role);
      const content = escapeMarkdown(message.content || "");
      const metaLines = [];
      if (timestamp) {
        metaLines.push(`**[${timestamp}] ${label}:**`);
      } else {
        metaLines.push(`**${label}:**`);
      }
      const body = content || " ";
      return `${metaLines.join(" ")}  \n${body}`;
    }
  );

  return [...headerLines, ...messageLines].join("\n\n").trimEnd() + "\n";
};

const exportConversationToMarkdown = async (conversationId, webContents) => {
  const conversation = await historyFs.readConversation(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  const markdown = formatConversationToMarkdown(conversation);
  const defaultName = sanitizeFilename(conversation.title || conversation.id);
  const browserWindow = webContents ? BrowserWindow.fromWebContents(webContents) : null;
  const dialogResult = await dialog.showSaveDialog(browserWindow || undefined, {
    title: "Export conversation to Markdown",
    defaultPath: path.join(process.cwd(), `${defaultName}.md`),
    filters: [{ name: "Markdown", extensions: ["md"] }]
  });
  if (dialogResult.canceled || !dialogResult.filePath) {
    return { canceled: true };
  }
  await fs.writeFile(dialogResult.filePath, markdown, "utf8");
  return { canceled: false, filePath: dialogResult.filePath };
};

module.exports = {
  formatConversationToMarkdown,
  exportConversationToMarkdown
};
