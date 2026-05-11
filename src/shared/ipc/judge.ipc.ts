import type { JudgeInput, JudgeResult } from "../types/judge";

export const IPC_JUDGE_RUN = "judge:run";
export const IPC_JUDGE_PROGRESS = "judge:progress";

export type JudgeErrorCode =
  | "invalid_input"
  | "profile_not_found"
  | "judge_failed"
  | "provider_failed"
  | "parse_failed"
  | "unknown";

export interface JudgeRunResponse {
  ok: boolean;
  result?: JudgeResult;
  error?: string;
  code?: JudgeErrorCode;
  details?: string;
}

export type JudgeProgressStage = "queued" | "running" | "parsing" | "done" | "failed";

export interface JudgeProgressEvent {
  requestId: string;
  stage: JudgeProgressStage;
  message?: string;
  code?: JudgeErrorCode;
}

export interface JudgeRunRequest {
  input: JudgeInput;
}
