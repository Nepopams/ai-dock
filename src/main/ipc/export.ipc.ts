import type { ExportResponse } from "../../shared/ipc/export.ipc";

const runtime = require("./export.ipc.js") as {
  registerExportIpc: () => void;
};

export const registerExportIpc: () => void = runtime.registerExportIpc;
export type { ExportResponse };
