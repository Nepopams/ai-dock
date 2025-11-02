export const IPC_EXPORT_JUDGE_MD = "export:judge:md";
export const IPC_EXPORT_JUDGE_JSON = "export:judge:json";

export interface ExportResponse {
  ok: boolean;
  path?: string;
  error?: string;
}
