import type { ConversationRecord } from "../storage/historyFs";

export interface ExportResult {
  canceled: boolean;
  filePath?: string;
}

const runtime = require("./exporter.js") as {
  formatConversationToMarkdown: (conversation: ConversationRecord) => string;
  exportConversationToMarkdown: (
    conversationId: string,
    webContents: Electron.WebContents
  ) => Promise<ExportResult>;
};

export const formatConversationToMarkdown = runtime.formatConversationToMarkdown;
export const exportConversationToMarkdown = runtime.exportConversationToMarkdown;
