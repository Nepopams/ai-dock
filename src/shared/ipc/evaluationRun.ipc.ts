import type {
  EvaluationRunExport,
  EvaluationRunRecord,
  EvaluationRunSummary
} from "../types/evaluationRun";

export const IPC_EVALUATION_RUN_SAVE = "evaluationRun:save";
export const IPC_EVALUATION_RUN_LIST = "evaluationRun:list";
export const IPC_EVALUATION_RUN_READ = "evaluationRun:read";
export const IPC_EVALUATION_RUN_DELETE = "evaluationRun:delete";

export type EvaluationRunErrorCode =
  | "invalid_payload"
  | "not_found"
  | "storage_failed"
  | "unknown";

export interface EvaluationRunErrorResponse {
  ok: false;
  code: EvaluationRunErrorCode;
  error: string;
}

export interface EvaluationRunSaveRequest {
  run: EvaluationRunExport | EvaluationRunRecord;
}

export interface EvaluationRunSaveResponse {
  ok: true;
  record: EvaluationRunRecord;
  summary: EvaluationRunSummary;
}

export interface EvaluationRunListRequest {
  limit?: number;
  offset?: number;
}

export interface EvaluationRunListResponse {
  ok: true;
  runs: EvaluationRunSummary[];
  total: number;
}

export interface EvaluationRunReadRequest {
  id: string;
}

export interface EvaluationRunReadResponse {
  ok: true;
  record: EvaluationRunRecord;
}

export interface EvaluationRunDeleteRequest {
  id: string;
}

export interface EvaluationRunDeleteResponse {
  ok: true;
  deleted: true;
}

export type EvaluationRunResponse =
  | EvaluationRunSaveResponse
  | EvaluationRunListResponse
  | EvaluationRunReadResponse
  | EvaluationRunDeleteResponse
  | EvaluationRunErrorResponse;
