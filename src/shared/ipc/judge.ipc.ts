import type { JudgeInput, JudgeResult } from "../types/judge";

export const IPC_JUDGE_RUN = "judge:run";
export const IPC_JUDGE_PROGRESS = "judge:progress";

export interface JudgeRunResponse {
  ok: boolean;
  result?: JudgeResult;
  error?: string;
  details?: string;
}

export interface JudgeProgressEvent {
  requestId: string;
  stage: "queued" | "running" | "parsing";
  message?: string;
}

export interface JudgeRunRequest {
  input: JudgeInput;
}
