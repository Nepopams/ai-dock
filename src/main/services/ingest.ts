import type { WebContents } from "electron";

export interface IngestMessage {
  role: "user" | "assistant";
  text: string;
  ts?: string;
  id?: string;
}

export interface IngestResult {
  ok: boolean;
  result?: {
    adapterId?: string;
    clientId?: string;
    title?: string;
    url?: string;
    messages?: IngestMessage[];
  };
  error?: string;
  details?: string;
}

const runtime = require("./ingest.js") as {
  importLastFromAdapter: (
    webContents: WebContents,
    payload: { tabId: string; adapterId: string; limit?: number }
  ) => Promise<IngestResult>;
};

export const importLastFromAdapter: (
  webContents: WebContents,
  payload: { tabId: string; adapterId: string; limit?: number }
) => Promise<IngestResult> = runtime.importLastFromAdapter;
