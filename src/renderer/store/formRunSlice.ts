import { StateCreator } from "zustand";
import type {
  RunRes,
  RunSource
} from "../../shared/ipc/formRunner.contracts";

export interface FormRunSlice {
  formRunRunning: boolean;
  formRunLast?: RunRes;
  formRunError?: string | null;
  formRunProfileId?: string | null;
}

export interface FormRunActions {
  runFormSync: (
    source: RunSource,
    options?: { connectTimeoutMs?: number; totalTimeoutMs?: number }
  ) => Promise<RunRes | null>;
  clearFormRun: () => void;
  setFormRunProfile: (profileId?: string | null) => void;
}

const getFormRunnerApi = () => window.formRunner;

export const createFormRunSlice = <
  T extends FormRunSlice & { actions: FormRunActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setState = (partial: Partial<FormRunSlice>) => {
    set(partial as Partial<T>);
  };

  const runFormSync = async (
    source: RunSource,
    options?: { connectTimeoutMs?: number; totalTimeoutMs?: number }
  ): Promise<RunRes | null> => {
    const api = getFormRunnerApi();
    if (!api?.runSync) {
      setState({
        formRunError: "Form runner API unavailable"
      });
      return null;
    }
    setState({
      formRunRunning: true,
      formRunError: null
    });
    try {
      const response = await api.runSync(source, options);
      set({
        formRunRunning: false,
        formRunLast: response,
        formRunError: !response.ok ? response.message : null
      } as Partial<T>);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      set({
        formRunRunning: false,
        formRunError: message
      } as Partial<T>);
      return null;
    }
  };

  const setFormRunProfile = (profileId?: string | null) => {
    const value =
      typeof profileId === "string" && profileId.trim().length ? profileId.trim() : null;
    set({
      formRunProfileId: value
    } as Partial<T>);
  };

  const clearFormRun = () => {
    set({
      formRunRunning: false,
      formRunLast: undefined,
      formRunError: null
    } as Partial<T>);
  };

  return {
    state: {
      formRunRunning: false,
      formRunLast: undefined,
      formRunError: null,
      formRunProfileId: null
    } as FormRunSlice,
    actions: {
      runFormSync,
      clearFormRun,
      setFormRunProfile
    } as FormRunActions
  };
};
