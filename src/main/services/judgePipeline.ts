import type { JudgeInput, JudgeResult } from "../../shared/types/judge";

const runtime = require("./judgePipeline.js") as {
  runJudge: (input: JudgeInput) => Promise<JudgeResult>;
};

export const runJudge: (input: JudgeInput) => Promise<JudgeResult> = runtime.runJudge;
