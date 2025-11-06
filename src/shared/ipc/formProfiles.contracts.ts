import { FormProfile, HttpMethod } from "../types/form";

export const FORM_PROFILES_LIST = "formProfiles:list";
export const FORM_PROFILES_SAVE = "formProfiles:save";
export const FORM_PROFILES_DELETE = "formProfiles:delete";
export const FORM_PROFILES_DUPLICATE = "formProfiles:duplicate";
export const FORM_PROFILES_TEST = "formProfiles:test";

export interface FormProfilesListRes {
  profiles: FormProfile[];
  updatedAt: string;
}

export interface FormProfilesSaveReq {
  profiles?: FormProfile[];
  upsert?: FormProfile;
}

export type FormProfilesSaveRes =
  | { ok: true; count: number; updatedAt: string }
  | { ok: false; error: string };

export interface FormProfilesDeleteReq {
  id: string;
}

export type FormProfilesDeleteRes =
  | { ok: true }
  | { ok: false; error: string };

export interface FormProfilesDuplicateReq {
  id: string;
}

export type FormProfilesDuplicateRes =
  | { ok: true; profile: FormProfile }
  | { ok: false; error: string };

export interface FormProfilesTestReq {
  profile: FormProfile;
  sampleValues?: Record<string, unknown>;
}

export type FormProfilesTestRes =
  | {
      ok: true;
      url: string;
      method: HttpMethod;
      headers: Record<string, string>;
      bodyPreview: string;
      notes?: string;
    }
  | { ok: false; error: string; details?: string };
