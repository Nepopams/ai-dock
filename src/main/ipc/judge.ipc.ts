import type { JudgeRunResponse } from "../../shared/ipc/judge.ipc";
import type { JudgeResult } from "../../shared/types/judge";

const runtime = require("./judge.ipc.js") as {
  registerJudgeIpc: () => void;
};

export const registerJudgeIpc: () => void = runtime.registerJudgeIpc;
export type { JudgeRunResponse, JudgeResult };
