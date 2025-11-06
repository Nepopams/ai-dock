import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import type {
  FieldCheckbox,
  FieldFile,
  FieldNumber,
  FieldSelect,
  FieldText,
  FieldTextarea,
  FormField,
  FormProfile,
  HttpMethod
} from "../../../../shared/types/form";
import {
  renderTemplate,
  sanitizePreview
} from "../../../../shared/utils/formRender.ts";
import type {
  RunPreview,
  RunRes,
  RunValues
} from "../../../../shared/ipc/formRunner.contracts";
import { useDockStore } from "../../store/useDockStore";

const SECRET_HEADER_PATTERN =
  /authorization|token|secret|key|signature|credential|password/i;

const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;
const DEFAULT_IDLE_TIMEOUT_MS = 30_000;
const DEFAULT_TOTAL_TIMEOUT_MS = 120_000;

type FieldValue = string | boolean;

type FieldErrorMap = Record<string, string>;

interface PreviewState {
  preview: RunPreview | null;
  error: string | null;
}

const redactHeaders = (headers?: Record<string, string>): Record<string, string> => {
  if (!headers) {
    return {};
  }
  return Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
    if (SECRET_HEADER_PATTERN.test(key)) {
      acc[key] = "***";
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const createInitialValues = (profile: FormProfile | null): Record<string, FieldValue> => {
  if (!profile) {
    return {};
  }
  const values: Record<string, FieldValue> = {};
  profile.schema.fields.forEach((field, index) => {
    const key = field.name?.trim();
    if (!key) {
      return;
    }
    switch (field.type) {
      case "checkbox": {
        const checkbox = field as FieldCheckbox;
        values[key] = checkbox.defaultValue ?? false;
        break;
      }
      case "number": {
        const numberField = field as FieldNumber;
        values[key] =
          numberField.defaultValue !== undefined ? String(numberField.defaultValue) : "";
        break;
      }
      case "select": {
        const selectField = field as FieldSelect;
        if (selectField.defaultValue) {
          values[key] = selectField.defaultValue;
        } else if (selectField.options.length > 0) {
          values[key] = selectField.options[0]?.value ?? "";
        } else {
          values[key] = "";
        }
        break;
      }
      case "textarea":
      case "text": {
        const textField = field as FieldText | FieldTextarea;
        values[key] = textField.defaultValue ?? "";
        break;
      }
      case "file": {
        values[key] = "";
        break;
      }
      default:
        values[key] = "";
    }
    if (!(key in values)) {
      values[key] = `value_${index}`;
    }
  });
  return values;
};

const coerceFieldValue = (
  field: FormField,
  raw: FieldValue | undefined,
  strict: boolean
): { value?: string | number | boolean; error?: string } => {
  const label = field.label || field.name;
  switch (field.type) {
    case "checkbox": {
      const checked = Boolean(raw);
      if (strict && field.required && !checked) {
        return {
          value: checked,
          error: `${label} must be checked`
        };
      }
      return { value: checked };
    }
    case "number": {
      const asString =
        typeof raw === "string" ? raw : typeof raw === "number" ? String(raw) : "";
      if (!asString.trim()) {
        if (strict && field.required) {
          return { error: `${label} is required` };
        }
        return { value: undefined };
      }
      const parsed = Number(asString);
      if (Number.isNaN(parsed)) {
        return { error: `${label} must be a number` };
      }
      const numberField = field as FieldNumber;
      if (strict && numberField.min !== undefined && parsed < numberField.min) {
        return { error: `${label} must be ≥ ${numberField.min}` };
      }
      if (strict && numberField.max !== undefined && parsed > numberField.max) {
        return { error: `${label} must be ≤ ${numberField.max}` };
      }
      return { value: parsed };
    }
    case "select": {
      const selectField = field as FieldSelect;
      const candidate = typeof raw === "string" ? raw : "";
      if (!candidate) {
        if (strict && field.required) {
          return { error: `${label} is required` };
        }
        return { value: undefined };
      }
      const allowed = selectField.options.map((option) => option.value);
      if (!allowed.includes(candidate)) {
        if (strict) {
          return { error: `${label} has an invalid value` };
        }
        return {
          value: selectField.defaultValue ?? selectField.options[0]?.value
        };
      }
      return { value: candidate };
    }
    case "textarea":
    case "text": {
      const textValue =
        typeof raw === "string" ? raw : raw === undefined || raw === null ? "" : String(raw);
      if (strict && field.required && !textValue.trim()) {
        return { error: `${label} is required` };
      }
      return { value: textValue };
    }
    case "file": {
      if (strict && field.required) {
        return { error: `${label}: file uploads will be supported in FC-06` };
      }
      return { value: undefined };
    }
    default:
      return { value: undefined };
  }
};

const prepareRunValues = (
  profile: FormProfile,
  values: Record<string, FieldValue>,
  strict: boolean
): { result: RunValues; errors: FieldErrorMap } => {
  const payload: RunValues = {};
  const errors: FieldErrorMap = {};

  profile.schema.fields.forEach((field) => {
    const key = field.name?.trim();
    if (!key) {
      return;
    }
    const { value, error } = coerceFieldValue(field, values[key], strict);
    if (error) {
      errors[key] = error;
    }
    if (value !== undefined) {
      payload[key] = value;
    }
  });

  return { result: payload, errors };
};

const buildPreview = (
  profile: FormProfile,
  values: Record<string, FieldValue>
): PreviewState => {
  try {
    const { result } = prepareRunValues(profile, values, false);
    const { url, result: rendered } = renderTemplate(profile.baseUrl, profile.template, result);
    const method = (profile.template.method ?? "GET") as HttpMethod;
    return {
      preview: {
        url,
        method,
        headers: redactHeaders(rendered.headers),
        bodyPreview: sanitizePreview(rendered.body)
      },
      error: null
    };
  } catch (error) {
    return {
      preview: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

const resolveFieldKey = (field: FormField): string => field.name?.trim() ?? field.id;

const FormRunView = () => {
  const activeLocalView = useDockStore((state) => state.activeLocalView);
  const formProfiles = useDockStore((state) => state.formProfiles);
  const formProfilesLoading = useDockStore((state) => state.formProfilesLoading);
  const formRunProfileId = useDockStore((state) => state.formRunProfileId ?? null);
  const formRunRunning = useDockStore((state) => state.formRunRunning);
  const formRunLast = useDockStore((state) => state.formRunLast);
  const formRunError = useDockStore((state) => state.formRunError);
  const formStreamById = useDockStore((state) => state.formStreamById);

  const fetchFormProfiles = useDockStore((state) => state.actions.fetchFormProfiles);
  const setFormRunProfile = useDockStore((state) => state.actions.setFormRunProfile);
  const runFormSync = useDockStore((state) => state.actions.runFormSync);
  const clearFormRun = useDockStore((state) => state.actions.clearFormRun);
  const startFormStream = useDockStore((state) => state.actions.startFormStream);
  const abortFormStream = useDockStore((state) => state.actions.abortFormStream);
  const focusLocalView = useDockStore((state) => state.actions.focusLocalView);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [connectTimeout, setConnectTimeout] = useState<string>(
    String(DEFAULT_CONNECT_TIMEOUT_MS)
  );
  const [idleTimeout, setIdleTimeout] = useState<string>(String(DEFAULT_IDLE_TIMEOUT_MS));
  const [totalTimeout, setTotalTimeout] = useState<string>(
    String(DEFAULT_TOTAL_TIMEOUT_MS)
  );
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const streamContainerRef = useRef<HTMLDivElement | null>(null);

  const activeStreamEntry = useMemo(
    () => (activeStreamId ? formStreamById[activeStreamId] : undefined),
    [activeStreamId, formStreamById]
  );
  const isStreamRunning = Boolean(activeStreamEntry?.running);
  const streamMode = profile?.stream ?? "none";
  const streamStatusLabel = activeStreamEntry?.status ?? (isStreamRunning ? "running" : "idle");
  const streamCharCount = activeStreamEntry?.text?.length ?? 0;
  const streamLastEvent = activeStreamEntry?.lastEventAt ? new Date(activeStreamEntry.lastEventAt).toLocaleTimeString() : null;

  const profile = useMemo<FormProfile | null>(() => {
    if (!formRunProfileId) {
      return null;
    }
    return formProfiles.find((item) => item.id === formRunProfileId) ?? null;
  }, [formProfiles, formRunProfileId]);

  useEffect(() => {
    if (!formProfiles.length) {
      void fetchFormProfiles();
    }
  }, [fetchFormProfiles, formProfiles.length]);

  useEffect(() => {
    if (
      activeLocalView === "formRun" &&
      (!formRunProfileId || !formProfiles.some((item) => item.id === formRunProfileId)) &&
      formProfiles.length > 0
    ) {
      setFormRunProfile(formProfiles[0].id);
    }
  }, [activeLocalView, formRunProfileId, formProfiles, setFormRunProfile]);

  useEffect(() => {
    setValues(createInitialValues(profile));
    setFieldErrors({});
    setValidationMessage(null);
    clearFormRun();
    setActiveStreamId(null);
    setStreamError(null);
    setStickToBottom(true);
  }, [profile, clearFormRun]);

  useEffect(() => {
    if (activeStreamEntry?.error) {
      setStreamError(activeStreamEntry.error);
    } else if (!activeStreamEntry) {
      setStreamError(null);
    }
  }, [activeStreamEntry]);

  const previewState = useMemo<PreviewState>(() => {
    if (!profile) {
      return {
        preview: null,
        error: null
      };
    }
    return buildPreview(profile, values);
  }, [profile, values]);

  useEffect(() => {
    if (!stickToBottom) {
      return;
    }
    const container = streamContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [stickToBottom, activeStreamEntry?.text]);

  const handleValueChange = (field: FormField, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const key = resolveFieldKey(field);
    if (!key) {
      return;
    }
    let nextValue: FieldValue;
    if (field.type === "checkbox") {
      nextValue = (event.target as HTMLInputElement).checked;
    } else {
      nextValue = event.target.value;
    }
    setValues((prev) => ({
      ...prev,
      [key]: nextValue
    }));
    setFieldErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setValidationMessage(null);
  };

  const handleStreamScroll = () => {
    const container = streamContainerRef.current;
    if (!container) {
      return;
    }
    const threshold = 48;
    const nearBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight) <= threshold;
    setStickToBottom(nearBottom);
  };

  const scrollStreamToLatest = () => {
    setStickToBottom(true);
  };

  const handleClear = () => {
    setValues(createInitialValues(profile));
    setFieldErrors({});
    setValidationMessage(null);
    clearFormRun();
    setActiveStreamId(null);
    setStreamError(null);
    setStickToBottom(true);
  };

  const parseTimeout = (input: string): number | undefined => {
    if (!input.trim()) {
      return undefined;
    }
    const parsed = Number(input);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return NaN;
    }
    return parsed;
  };

  const runRequest = async () => {
    if (!profile) {
      setValidationMessage("Select a form profile before running the request.");
      return;
    }

    const { result, errors } = prepareRunValues(profile, values, true);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setValidationMessage("Fix highlighted fields before running.");
      return;
    }

    const connectMs = parseTimeout(connectTimeout);
    if (Number.isNaN(connectMs)) {
      setValidationMessage("Connect timeout must be a non-negative number.");
      return;
    }
    const totalMs = parseTimeout(totalTimeout);
    if (Number.isNaN(totalMs)) {
      setValidationMessage("Total timeout must be a non-negative number.");
      return;
    }

    setValidationMessage(null);
    const response: RunRes | null = await runFormSync(
      { profileId: profile.id, values: result },
      {
        connectTimeoutMs: connectMs,
        totalTimeoutMs: totalMs
      }
    );
    if (!response) {
      setValidationMessage("Failed to execute request. See logs for details.");
      return;
    }
  };

  const runStreamRequest = async () => {
    if (!profile) {
      setValidationMessage("Select a form profile before running the request.");
      return;
    }
    const { result, errors } = prepareRunValues(profile, values, true);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setValidationMessage("Fix highlighted fields before running.");
      return;
    }

    const connectMs = parseTimeout(connectTimeout);
    if (Number.isNaN(connectMs)) {
      setValidationMessage("Connect timeout must be a non-negative number.");
      return;
    }
    const idleMs = parseTimeout(idleTimeout);
    if (Number.isNaN(idleMs)) {
      setValidationMessage("Idle timeout must be a non-negative number.");
      return;
    }
    const totalMs = parseTimeout(totalTimeout);
    if (Number.isNaN(totalMs)) {
      setValidationMessage("Total timeout must be a non-negative number.");
      return;
    }

    setValidationMessage(null);
    try {
      const requestId = await startFormStream({
        profileId: profile.id,
        values: result,
        connectTimeoutMs: connectMs,
        idleTimeoutMs: idleMs,
        totalTimeoutMs: totalMs
      });
      setActiveStreamId(requestId);
      setStreamError(null);
      setStickToBottom(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStreamError(message);
    }
  };

  const abortActiveStream = async () => {
    if (!activeStreamId) {
      return;
    }
    try {
      await abortFormStream(activeStreamId);
      setStickToBottom(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStreamError(message);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    if (!text) {
      return;
    }
    try {
      if (window.api?.clipboard) {
        await window.api.clipboard.copy(text);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      showToast?.(`${label} copied to clipboard`);
    } catch (error) {
      showToast?.(
        error instanceof Error ? error.message : `Unable to copy ${label.toLowerCase()}`
      );
    }
  };

  const handleBack = () => {
    void focusLocalView("formProfiles");
  };

  const renderField = (field: FormField) => {
    const key = resolveFieldKey(field);
    if (!key) {
      return null;
    }
    const error = fieldErrors[key];
    const commonLabel = (
      <label className="flex items-center justify-between text-sm font-medium text-slate-200">
        <span>
          {field.label}
          {field.required ? <span className="ml-1 text-rose-300">*</span> : null}
        </span>
        {field.help && <span className="text-xs font-normal text-slate-400">{field.help}</span>}
      </label>
    );

    const baseInputClass =
      "mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none";

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-1">
            {commonLabel}
            <input
              type="text"
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} ${error ? "border-rose-500" : ""}`}
            />
            {error && <p className="text-xs text-rose-300">{error}</p>}
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className="space-y-1">
            {commonLabel}
            <textarea
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} min-h-[120px] resize-y ${error ? "border-rose-500" : ""}`}
            />
            {error && <p className="text-xs text-rose-300">{error}</p>}
          </div>
        );
      case "number":
        return (
          <div key={field.id} className="space-y-1">
            {commonLabel}
            <input
              type="number"
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} ${error ? "border-rose-500" : ""}`}
              min={(field as FieldNumber).min}
              max={(field as FieldNumber).max}
              step={(field as FieldNumber).step ?? 1}
            />
            {error && <p className="text-xs text-rose-300">{error}</p>}
          </div>
        );
      case "select": {
        const fieldSelect = field as FieldSelect;
        return (
          <div key={field.id} className="space-y-1">
            {commonLabel}
            <select
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} ${error ? "border-rose-500" : ""}`}
            >
              {fieldSelect.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-xs text-rose-300">{error}</p>}
          </div>
        );
      }
      case "checkbox":
        return (
          <div key={field.id} className="flex items-center justify-between rounded border border-slate-700 bg-slate-900 px-3 py-2">
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={Boolean(values[key])}
                onChange={(event) => handleValueChange(field, event)}
                className="h-4 w-4 rounded border border-slate-600 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
              />
              <span>
                {field.label}
                {field.required ? <span className="ml-1 text-rose-300">*</span> : null}
              </span>
            </label>
            {field.help && <span className="text-xs text-slate-400">{field.help}</span>}
            {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
          </div>
        );
      case "file": {
        const fileField = field as FieldFile;
        return (
          <div key={field.id} className="space-y-1">
            {commonLabel}
            <div className="rounded border border-dashed border-slate-700 bg-slate-900 px-3 py-4 text-sm text-slate-400">
              File inputs will be supported in FC-06.
              {fileField.accept && (
                <div className="mt-1 text-xs text-slate-500">Accept: {fileField.accept}</div>
              )}
            </div>
            {error && <p className="text-xs text-rose-300">{error}</p>}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center gap-4 border-b border-slate-800 px-6 py-4">
        <button
          type="button"
          onClick={handleBack}
          className="rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-100">Form Runner (Sync)</h1>
          <p className="text-sm text-slate-400">
            Execute a form profile as a synchronous HTTP request. Streaming will arrive in FC-05.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <label className="text-sm text-slate-300">
            Profile
            <select
              value={formRunProfileId ?? ""}
              onChange={(event) => setFormRunProfile(event.target.value || null)}
              disabled={formProfilesLoading}
              className="ml-2 rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="" disabled>
                {formProfilesLoading ? "Loading…" : "Select profile"}
              </option>
              {formProfiles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <section className="flex w-[32rem] flex-col border-r border-slate-900">
          <div className="flex items-center justify-between border-b border-slate-900 px-6 py-3">
            <h2 className="text-sm font-semibold uppercase text-slate-300">
              Parameters
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <label className="flex items-center gap-1">
                Connect timeout (ms)
                <input
                  type="number"
                  value={connectTimeout}
                  onChange={(event) => setConnectTimeout(event.target.value)}
                  min={0}
                  className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-1">
                Idle timeout (ms)
                <input
                  type="number"
                  value={idleTimeout}
                  onChange={(event) => setIdleTimeout(event.target.value)}
                  min={0}
                  className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-1">
                Total timeout (ms)
                <input
                  type="number"
                  value={totalTimeout}
                  onChange={(event) => setTotalTimeout(event.target.value)}
                  min={0}
                  className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {validationMessage && (
              <div className="rounded border border-amber-600 bg-amber-900/40 px-3 py-2 text-sm text-amber-200">
                {validationMessage}
              </div>
            )}
            {formRunError && (
              <div className="rounded border border-rose-600 bg-rose-900/30 px-3 py-2 text-sm text-rose-200">
                {formRunError}
              </div>
            )}
            {!profile && !formProfilesLoading && (
          <div className="flex items-center justify-between border-t border-slate-900 px-6 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
              >
                Clear
              </button>
              {profile && streamMode !== "none" && (
                <button
                  type="button"
                  onClick={runStreamRequest}
                  disabled={isStreamRunning}
                  className={`rounded border px-4 py-2 text-sm font-medium ${
                    isStreamRunning
                      ? "cursor-not-allowed border-slate-700 text-slate-500"
                      : "border-indigo-600 text-indigo-200 hover:border-indigo-400 hover:text-indigo-100"
                  }`}
                >
                  Run (Stream)
                </button>
              )}
              {profile && streamMode !== "none" && (
                <button
                  type="button"
                  onClick={abortActiveStream}
                  disabled={!isStreamRunning}
                  className={`rounded border px-4 py-2 text-sm font-medium ${
                    !isStreamRunning
                      ? "cursor-not-allowed border-slate-700 text-slate-500"
                      : "border-rose-600 text-rose-200 hover:border-rose-500 hover:text-rose-100"
                  }`}
                >
                  Abort
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={runRequest}
              disabled={!profile || formRunRunning}
              className={`rounded px-4 py-2 text-sm font-medium ${
                !profile || formRunRunning
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {formRunRunning ? "Running�" : "Run"}
            </button>
          </div>
            <button
              type="button"
              onClick={runRequest}
              disabled={!profile || formRunRunning}
              className={`rounded px-4 py-2 text-sm font-medium ${
                !profile || formRunRunning
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {formRunRunning ? "Running…" : "Run"}
            </button>
          </div>
        </section>
        <section className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-slate-900 px-6 py-3">
            <h2 className="text-sm font-semibold uppercase text-slate-300">
              Request Preview
            </h2>
            {previewState.error && (
              <p className="mt-1 text-xs text-rose-300">{previewState.error}</p>
            )}
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 py-4 lg:grid-cols-2">
            <div className="space-y-3 rounded border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-xs font-semibold uppercase text-slate-400">
                Current Inputs
              </h3>
              {previewState.preview ? (
                <div className="space-y-2 text-sm text-slate-200">
                  <div>
                    <span className="font-semibold text-slate-300">Method:</span>{" "}
                    <span className="uppercase text-slate-100">
                      {previewState.preview.method}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">URL:</span>
                    <div className="mt-1 break-all rounded bg-slate-950/60 p-2 text-xs text-slate-100">
                      {previewState.preview.url || "—"}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Headers:</span>
                    {Object.keys(previewState.preview.headers).length ? (
                      <ul className="mt-1 space-y-1 text-xs text-slate-300">
                        {Object.entries(previewState.preview.headers).map(([name, value]) => (
                          <li key={name}>
                            <span className="font-semibold text-slate-200">{name}:</span>{" "}
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-xs text-slate-500">No headers</p>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Body preview:</span>
                    <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-slate-950/60 p-2 text-xs text-slate-300">
                      {previewState.preview.bodyPreview || "—"}
                    </pre>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(
                          {
                            url: previewState.preview?.url,
                            method: previewState.preview?.method,
                            headers: previewState.preview?.headers,
                            body: previewState.preview?.bodyPreview
                          },
                          null,
                          2
                        ),
                        "Preview"
                      )
                    }
                    className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-slate-500"
                  >
                    Copy preview JSON
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Preview will appear once inputs are set.</p>
              )}
            </div>
            <div className="space-y-3 rounded border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-xs font-semibold uppercase text-slate-400">
                Stream Output
              </h3>
              {streamMode === "none" ? (
                <p className="text-sm text-slate-400">Streaming is disabled for this profile.</p>
              ) : activeStreamEntry ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Status: <span className="text-slate-200">{streamStatusLabel}</span></span>
                    <span>Chars: <span className="text-slate-200">{streamCharCount}</span></span>
                  </div>
                  {streamError && (
                    <div className="rounded border border-rose-700 bg-rose-900/40 px-3 py-2 text-xs text-rose-200">
                      {streamError}
                    </div>
                  )}
                  <div
                    ref={streamContainerRef}
                    onScroll={handleStreamScroll}
                    className="max-h-64 overflow-y-auto rounded border border-slate-800 bg-slate-950/70 p-3 font-mono text-sm text-slate-100"
                  >
                    {activeStreamEntry.text ? (
                      <pre className="whitespace-pre-wrap leading-relaxed">{activeStreamEntry.text}</pre>
                    ) : (
                      <p className="text-xs text-slate-500">Waiting for chunks...</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Last event: {streamLastEvent ?? "-"}</span>
                    {!stickToBottom && (
                      <button
                        type="button"
                        onClick={scrollStreamToLatest}
                        className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
                      >
                        Scroll to latest
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeStreamEntry.text, "Stream text")}
                      disabled={!activeStreamEntry.text}
                      className={`rounded border px-3 py-1 text-xs ${activeStreamEntry.text ? "border-slate-700 text-slate-200 hover:border-slate-500" : "cursor-not-allowed border-slate-700 text-slate-500"}`}
                    >
                      Copy streamed text
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-slate-400">
                  {streamError && (
                    <div className="rounded border border-rose-700 bg-rose-900/40 px-3 py-2 text-xs text-rose-200">
                      {streamError}
                    </div>
                  )}
                  <p>Run the stream to see live tokens.</p>
                </div>
              )}
            </div>
            <div className="space-y-3 rounded border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-xs font-semibold uppercase text-slate-400">
                Last Response
              </h3>
              {formRunLast ? (
                formRunLast.ok ? (
                  <div className="space-y-2 text-sm text-slate-200">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          formRunLast.status >= 200 && formRunLast.status < 300
                            ? "bg-emerald-600/40 text-emerald-200"
                            : "bg-amber-600/30 text-amber-100"
                        }`}
                      >
                        {formRunLast.status} {formRunLast.statusText}
                      </span>
                      <span className="text-xs text-slate-400">
                        Latency: {formRunLast.latencyMs} ms
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Response headers:</span>
                      {Object.keys(formRunLast.headers).length ? (
                        <ul className="mt-1 max-h-32 space-y-1 overflow-auto text-xs text-slate-300">
                          {Object.entries(formRunLast.headers).map(([name, value]) => (
                            <li key={name}>
                              <span className="font-semibold text-slate-200">{name}:</span>{" "}
                              <span>{value}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500">No headers</p>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Body:</span>
                      {formRunLast.responseType === "json" && (
                        <pre className="mt-1 max-h-48 overflow-auto rounded bg-slate-950/60 p-2 text-xs text-slate-200">
                          {JSON.stringify(formRunLast.bodyJson, null, 2)}
                        </pre>
                      )}
                      {formRunLast.responseType === "text" && (
                        <textarea
                          readOnly
                          value={formRunLast.bodyText ?? ""}
                          className="mt-1 h-48 w-full resize-none rounded border border-slate-700 bg-slate-950/60 p-2 text-xs text-slate-200"
                        />
                      )}
                      {formRunLast.responseType === "empty" && (
                        <p className="mt-1 text-xs text-slate-400">No body returned.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {formRunLast.responseType !== "empty" && (
                        <button
                          type="button"
                          onClick={() =>
                            formRunLast.responseType === "json"
                              ? copyToClipboard(
                                  JSON.stringify(formRunLast.bodyJson, null, 2),
                                  "Response body"
                                )
                              : copyToClipboard(formRunLast.bodyText ?? "", "Response body")
                          }
                          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-slate-500"
                        >
                          Copy body
                        </button>
                      )}
                      {formRunLast.preview && (
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(formRunLast.preview, null, 2),
                              "Request preview"
                            )
                          }
                          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-slate-500"
                        >
                          Copy request
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-rose-200">
                    <div className="rounded border border-rose-700 bg-rose-950/70 px-3 py-2">
                      <div className="text-xs uppercase">Request failed</div>
                      <div className="text-sm font-semibold">{formRunLast.message}</div>
                      {formRunLast.details && (
                        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-rose-900/30 p-2 text-xs text-rose-100">
                          {formRunLast.details}
                        </pre>
                      )}
                    </div>
                    {formRunLast.preview && (
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(formRunLast.preview, null, 2),
                            "Failed request"
                          )
                        }
                        className="rounded border border-rose-700 px-3 py-1 text-xs text-rose-100 hover:border-rose-500"
                      >
                        Copy request snapshot
                      </button>
                    )}
                  </div>
                )
              ) : (
                <p className="text-sm text-slate-400">
                  Run the profile to see response details here.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormRunView;
