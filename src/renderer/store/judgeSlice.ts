import { StateCreator } from "zustand";
import type { JudgeResult } from "../../shared/types/judge";
import type { JudgeProgressEvent } from "../../shared/ipc/judge.ipc";

export interface JudgeSlice {
  judgeRunning: boolean;
  judgeResult: JudgeResult | null;
  judgeError: string | null;
  judgeErrorDetails: string | null;
  judgeProgress: JudgeProgressEvent | null;
}

export interface JudgeActions {
  runJudge: (input: Parameters<NonNullable<Window["judge"]>["run"]>[0]) => Promise<JudgeResult | null>;
  clearJudge: () => void;
  setJudgeError: (message: string | null, details?: string | null) => void;
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
        judgeErrorDetails: null
      });
      return null;
    }
    setState({
      judgeRunning: true,
      judgeError: null,
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
          judgeErrorDetails: response?.details || null
        });
        return null;
      }
      setState({
        judgeRunning: false,
        judgeResult: response.result,
        judgeError: null,
        judgeErrorDetails: null
      });
      return response.result;
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : "Judge request failed";
      setState({
        judgeRunning: false,
        judgeError: message,
        judgeErrorDetails: error instanceof Error && error.stack ? error.stack : null
      });
      return null;
    }
  };

  const clearJudge = () => {
    setState({
      judgeResult: null,
      judgeError: null,
      judgeErrorDetails: null,
      judgeProgress: null
    });
  };

  const setJudgeError: JudgeActions["setJudgeError"] = (message, details) => {
    setState({
      judgeError: message,
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
