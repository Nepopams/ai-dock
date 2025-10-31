export const IPC_ADAPTER_EXEC = "adapter:exec";
export const IPC_ADAPTER_PING = "adapter:ping";

export interface AdapterExecRequest {
  tabId: string;
  fnSource: string;
  args?: unknown[];
}

export interface AdapterExecResponse<T = unknown> {
  ok: true;
  data: T;
}

export interface AdapterExecError {
  ok: false;
  error: string;
  code?: string;
}

export type AdapterExecResult<T = unknown> = AdapterExecResponse<T> | AdapterExecError;

export interface AdapterPingResponse {
  ok: true;
}
