import { StateCreator } from "zustand";
import type { JudgeResult } from "../../shared/types/judge";
import type { JudgeProgressEvent } from "../../shared/ipc/judge.ipc";

export interface JudgeSlice {
  judgeRunning: boolean;
  judgeResult: JudgeResult | null;
  judgeError: string | null;
  judgeErrorCode: string | null;
  judgeErrorDetails: string | null;
  judgeProgress: JudgeProgressEvent | null;
}

export interface JudgeActions {
  runJudge: (input: Parameters<NonNullable<Window["judge"]>["run"]>[0]) => Promise<JudgeResult | null>;
  clearJudge: () => void;
  setJudgeError: (message: string | null, details?: string | null, code?: string | null) => void;
  handleJudgeProgress: (event: JudgeProgressEvent) => void;
}

export const createJudgeSlice = <
  T extends JudgeSlice & { actions: JudgeActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setState = (partial: Partial<JudgeSlice>) => {
    set(partial as Partial<T>);
  };

  const runJudge: JudgeActions["runJudge"] = async (input) => {
    const api = window.judge;
    if (!api?.run) {
      setState({
        judgeRunning: false,
        judgeError: "Judge API unavailable",
        judgeErrorCode: "unknown",
        judgeErrorDetails: null
      });
      return null;
    }
    setState({
      judgeRunning: true,
      judgeError: null,
      judgeErrorCode: null,
      judgeErrorDetails: null,
      judgeProgress: null
    });
    try {
      const response = await api.run(input);
      if (!response || response.ok === false || !response.result) {
        const message = response?.error || "Judge pipeline failed";
        setState({
          judgeRunning: false,
          judgeError: message,
          judgeErrorCode: response?.code || "unknown",
          judgeErrorDetails: response?.details || null
        });
        return null;
      }
      setState({
        judgeRunning: false,
        judgeResult: response.result,
        judgeError: null,
        judgeErrorCode: null,
        judgeErrorDetails: null
      });
      return response.result;
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : "Judge request failed";
      setState({
        judgeRunning: false,
        judgeError: message,
        judgeErrorCode: "unknown",
        judgeErrorDetails: null
      });
      return null;
    }
  };

  const clearJudge = () => {
    setState({
      judgeResult: null,
      judgeError: null,
      judgeErrorCode: null,
      judgeErrorDetails: null,
      judgeProgress: null
    });
  };

  const setJudgeError: JudgeActions["setJudgeError"] = (message, details, code) => {
    setState({
      judgeError: message,
      judgeErrorCode: code ?? null,
      judgeErrorDetails: details ?? null
    });
  };

  const handleJudgeProgress = (event: JudgeProgressEvent) => {
    if (!event) {
      return;
    }
    setState({
      judgeProgress: event
    });
  };

  return {
    state: {
      judgeRunning: false,
      judgeResult: null,
      judgeError: null,
      judgeErrorCode: null,
      judgeErrorDetails: null,
      judgeProgress: null
    } as JudgeSlice,
    actions: {
      runJudge,
      clearJudge,
      setJudgeError,
      handleJudgeProgress
    } as JudgeActions
  };
};
