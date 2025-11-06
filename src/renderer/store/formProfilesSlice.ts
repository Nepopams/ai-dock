import { StateCreator } from "zustand";
import type { FormProfile } from "../../shared/types/form";
import type {
  FormProfilesListRes,
  FormProfilesSaveReq,
  FormProfilesSaveRes,
  FormProfilesDeleteReq,
  FormProfilesDeleteRes,
  FormProfilesDuplicateReq,
  FormProfilesDuplicateRes,
  FormProfilesTestReq,
  FormProfilesTestRes
} from "../../shared/ipc/formProfiles.contracts";

export interface FormProfilesSlice {
  formProfiles: FormProfile[];
  formProfilesLoading: boolean;
  formProfilesError: string | null;
  formProfilesFilter: string;
  formProfilesSelectedId?: string;
  formProfilesLastTest?: FormProfilesTestRes | null;
}

export interface FormProfilesActions {
  fetchFormProfiles: () => Promise<void>;
  saveAllFormProfiles: (profiles: FormProfile[]) => Promise<boolean>;
  upsertFormProfile: (profile: FormProfile) => Promise<boolean>;
  removeFormProfile: (id: string) => Promise<boolean>;
  duplicateFormProfile: (id: string) => Promise<FormProfile | undefined>;
  selectFormProfile: (id?: string) => void;
  setFormProfilesFilter: (value: string) => void;
  testFormProfile: (
    profile: FormProfile,
    sample?: Record<string, unknown>
  ) => Promise<FormProfilesTestRes | null>;
}

type SliceState = FormProfilesSlice & { actions: FormProfilesActions };

const getApi = () => window.formProfiles;

const sortProfiles = (profiles: FormProfile[]): FormProfile[] =>
  [...profiles].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

export const createFormProfilesSlice = <
  T extends FormProfilesSlice & { actions: FormProfilesActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setSliceState = (partial: Partial<FormProfilesSlice>) => {
    set(partial as Partial<T>);
  };

  const getSlice = (): SliceState => get() as unknown as SliceState;

  const fetchFormProfiles = async () => {
    const api = getApi();
    if (!api?.list) {
      setSliceState({
        formProfilesLoading: false,
        formProfilesError: "Form profiles API unavailable"
      });
      return;
    }
    setSliceState({
      formProfilesLoading: true,
      formProfilesError: null
    });
    try {
      const response: FormProfilesListRes = await api.list();
      const profiles = response?.profiles ? sortProfiles(response.profiles) : [];
      const currentSelection = getSlice().formProfilesSelectedId;
      const nextSelection = profiles.find((profile) => profile.id === currentSelection)
        ? currentSelection
        : profiles[0]?.id;
      set({
        formProfiles: profiles,
        formProfilesLoading: false,
        formProfilesError: null,
        formProfilesSelectedId: nextSelection
      } as Partial<T>);
    } catch (error) {
      setSliceState({
        formProfilesLoading: false,
        formProfilesError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const saveAllFormProfiles = async (profiles: FormProfile[]): Promise<boolean> => {
    const api = getApi();
    if (!api?.save) {
      setSliceState({
        formProfilesError: "Form profiles API unavailable"
      });
      return false;
    }
    try {
      const payload: FormProfilesSaveReq = { profiles: JSON.parse(JSON.stringify(profiles)) };
      const response: FormProfilesSaveRes = await api.save(payload);
      if (!response || response.ok === false) {
        setSliceState({
          formProfilesError: response?.error || "Failed to save form profiles"
        });
        return false;
      }
      await fetchFormProfiles();
      return true;
    } catch (error) {
      setSliceState({
        formProfilesError: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  };

  const upsertFormProfile = async (profile: FormProfile): Promise<boolean> => {
    const api = getApi();
    if (!api?.save) {
      setSliceState({
        formProfilesError: "Form profiles API unavailable"
      });
      return false;
    }
    try {
      const payload: FormProfilesSaveReq = { upsert: JSON.parse(JSON.stringify(profile)) };
      const response: FormProfilesSaveRes = await api.save(payload);
      if (!response || response.ok === false) {
        setSliceState({
          formProfilesError: response?.error || "Failed to save form profile"
        });
        return false;
      }
      await fetchFormProfiles();
      set({ formProfilesSelectedId: profile.id } as Partial<T>);
      return true;
    } catch (error) {
      setSliceState({
        formProfilesError: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  };

  const removeFormProfile = async (id: string): Promise<boolean> => {
    const api = getApi();
    if (!api?.delete) {
      setSliceState({
        formProfilesError: "Form profiles API unavailable"
      });
      return false;
    }
    try {
      const request: FormProfilesDeleteReq = { id };
      const response: FormProfilesDeleteRes = await api.delete(request);
      if (!response || response.ok === false) {
        setSliceState({
          formProfilesError: response?.error || "Failed to delete form profile"
        });
        return false;
      }
      const state = getSlice();
      const remaining = state.formProfiles.filter((profile) => profile.id !== id);
      const nextSelection = state.formProfilesSelectedId === id
        ? remaining[0]?.id
        : state.formProfilesSelectedId;
      set({
        formProfiles: remaining,
        formProfilesSelectedId: nextSelection
      } as Partial<T>);
      return true;
    } catch (error) {
      setSliceState({
        formProfilesError: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  };

  const duplicateFormProfile = async (
    id: string
  ): Promise<FormProfile | undefined> => {
    const api = getApi();
    if (!api?.duplicate) {
      setSliceState({
        formProfilesError: "Form profiles API unavailable"
      });
      return undefined;
    }
    try {
      const request: FormProfilesDuplicateReq = { id };
      const response: FormProfilesDuplicateRes = await api.duplicate(request);
      if (!response || response.ok === false) {
        setSliceState({
          formProfilesError: response?.error || "Failed to duplicate form profile"
        });
        return undefined;
      }
      const profile = response.profile;
      const next = sortProfiles([...getSlice().formProfiles, profile]);
      set({
        formProfiles: next,
        formProfilesSelectedId: profile.id
      } as Partial<T>);
      return profile;
    } catch (error) {
      setSliceState({
        formProfilesError: error instanceof Error ? error.message : String(error)
      });
      return undefined;
    }
  };

  const selectFormProfile = (id?: string) => {
    set({ formProfilesSelectedId: id } as Partial<T>);
  };

  const setFormProfilesFilter = (value: string) => {
    set({ formProfilesFilter: value } as Partial<T>);
  };

  const testFormProfile = async (
    profile: FormProfile,
    sample?: Record<string, unknown>
  ): Promise<FormProfilesTestRes | null> => {
    const api = getApi();
    if (!api?.test) {
      setSliceState({
        formProfilesError: "Form profiles API unavailable"
      });
      return null;
    }
    try {
      const request: FormProfilesTestReq = {
        profile: JSON.parse(JSON.stringify(profile)),
        sampleValues: sample ? JSON.parse(JSON.stringify(sample)) : undefined
      };
      const response: FormProfilesTestRes = await api.test(request);
      set({ formProfilesLastTest: response } as Partial<T>);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const fallback: FormProfilesTestRes = {
        ok: false,
        error: "Test failed",
        details: message
      };
      set({
        formProfilesLastTest: fallback,
        formProfilesError: message
      } as Partial<T>);
      return fallback;
    }
  };

  return {
    state: {
      formProfiles: [],
      formProfilesLoading: false,
      formProfilesError: null,
      formProfilesFilter: "",
      formProfilesSelectedId: undefined,
      formProfilesLastTest: null
    } as FormProfilesSlice,
    actions: {
      fetchFormProfiles,
      saveAllFormProfiles,
      upsertFormProfile,
      removeFormProfile,
      duplicateFormProfile,
      selectFormProfile,
      setFormProfilesFilter,
      testFormProfile
    } as FormProfilesActions
  };
};

export const validateProfile = (
  profile: FormProfile
): { ok: true } | { ok: false; issues: string[] } => {
  const issues: string[] = [];
  if (!profile.baseUrl?.trim()) {
    issues.push("Base URL is required");
  }
  if (!profile.template?.method) {
    issues.push("HTTP method is required");
  }
  if (!profile.template?.path?.trim()) {
    issues.push("Request path is required");
  }
  const fields = profile.schema?.fields ?? [];
  if (!fields.length) {
    issues.push("Form schema must contain at least one field");
  }
  const names = new Map<string, number>();
  fields.forEach((field) => {
    const trimmed = field.name.trim();
    if (!trimmed) {
      issues.push(`Field "${field.label || field.id}" must have a name`);
    }
    const count = names.get(trimmed) ?? 0;
    names.set(trimmed, count + 1);
  });
  const duplicates = Array.from(names.entries())
    .filter(([name, count]) => !!name && count > 1)
    .map(([name]) => name);
  if (duplicates.length) {
    issues.push(`Field names must be unique: ${duplicates.join(", ")}`);
  }
  return issues.length ? { ok: false, issues } : { ok: true };
};
