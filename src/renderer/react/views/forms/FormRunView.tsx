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

  const profile = useMemo<FormProfile | null>(() => {
    if (!formRunProfileId) {
      return null;
    }
    return formProfiles.find((item) => item.id === formRunProfileId) ?? null;
  }, [formProfiles, formRunProfileId]);

  const activeStreamEntry = useMemo(
    () => (activeStreamId ? formStreamById[activeStreamId] : undefined),
    [activeStreamId, formStreamById]
  );
  const isStreamRunning = Boolean(activeStreamEntry?.running);
  const streamMode = profile?.stream ?? "none";
  const streamStatusLabel = activeStreamEntry?.status ?? (isStreamRunning ? "running" : "idle");
  const streamCharCount = activeStreamEntry?.text?.length ?? 0;
  const streamLastEvent = activeStreamEntry?.lastEventAt ? new Date(activeStreamEntry.lastEventAt).toLocaleTimeString() : null;

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
      <label className="form-runner-field-label">
        <span>
          {field.label}
          {field.required ? <span className="form-runner-required">*</span> : null}
        </span>
        {field.help && <span className="form-runner-field-help">{field.help}</span>}
      </label>
    );

    const baseInputClass = "form-runner-input";

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="form-runner-field">
            {commonLabel}
            <input
              type="text"
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} ${error ? "form-runner-input--error" : ""}`}
            />
            {error && <p className="form-runner-field-error">{error}</p>}
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className="form-runner-field">
            {commonLabel}
            <textarea
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} form-runner-textarea ${error ? "form-runner-input--error" : ""}`}
            />
            {error && <p className="form-runner-field-error">{error}</p>}
          </div>
        );
      case "number":
        return (
          <div key={field.id} className="form-runner-field">
            {commonLabel}
            <input
              type="number"
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} ${error ? "form-runner-input--error" : ""}`}
              min={(field as FieldNumber).min}
              max={(field as FieldNumber).max}
              step={(field as FieldNumber).step ?? 1}
            />
            {error && <p className="form-runner-field-error">{error}</p>}
          </div>
        );
      case "select": {
        const fieldSelect = field as FieldSelect;
        return (
          <div key={field.id} className="form-runner-field">
            {commonLabel}
            <select
              value={typeof values[key] === "string" ? (values[key] as string) : ""}
              onChange={(event) => handleValueChange(field, event)}
              className={`${baseInputClass} ${error ? "form-runner-input--error" : ""}`}
            >
              {fieldSelect.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="form-runner-field-error">{error}</p>}
          </div>
        );
      }
      case "checkbox":
        return (
          <div key={field.id} className="form-runner-field form-runner-field--checkbox">
            <label className="form-runner-checkbox-label">
              <input
                type="checkbox"
                checked={Boolean(values[key])}
                onChange={(event) => handleValueChange(field, event)}
                className="form-runner-checkbox"
              />
              <span>
                {field.label}
                {field.required ? <span className="form-runner-required">*</span> : null}
              </span>
            </label>
            {field.help && <span className="form-runner-field-help">{field.help}</span>}
            {error && <p className="form-runner-field-error">{error}</p>}
          </div>
        );
      case "file": {
        const fileField = field as FieldFile;
        return (
          <div key={field.id} className="form-runner-field">
            {commonLabel}
            <div className="form-runner-file-placeholder">
              File inputs will be supported in FC-06.
              {fileField.accept && (
                <div className="form-runner-field-help">Accept: {fileField.accept}</div>
              )}
            </div>
            {error && <p className="form-runner-field-error">{error}</p>}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="form-runner-view">
      <header className="form-runner-header">
        <button
          type="button"
          onClick={handleBack}
          className="form-runner-button form-runner-button--ghost"
        >
          Back
        </button>
        <div className="form-runner-title">
          <h1>Form Runner</h1>
          <p>
            Run a selected Form Profile against a configured endpoint and inspect the request/response.
          </p>
        </div>
        <div className="form-runner-profile-select">
          <label>
            Profile
            <select
              value={formRunProfileId ?? ""}
              onChange={(event) => setFormRunProfile(event.target.value || null)}
              disabled={formProfilesLoading}
              className="form-runner-select"
            >
              <option value="" disabled>
                {formProfilesLoading ? "Loading..." : "Select profile"}
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
      <div className="form-runner-body">
        <section className="form-runner-parameters">
          <div className="form-runner-panel-header">
            <h2>Generated form</h2>
            <div className="form-runner-timeouts">
              <label className="form-runner-timeout-control">
                <span>Connect</span>
                <input
                  type="number"
                  value={connectTimeout}
                  onChange={(event) => setConnectTimeout(event.target.value)}
                  min={0}
                  className="form-runner-timeout-input"
                />
              </label>
              <label className="form-runner-timeout-control">
                <span>Idle</span>
                <input
                  type="number"
                  value={idleTimeout}
                  onChange={(event) => setIdleTimeout(event.target.value)}
                  min={0}
                  className="form-runner-timeout-input"
                />
              </label>
              <label className="form-runner-timeout-control">
                <span>Total</span>
                <input
                  type="number"
                  value={totalTimeout}
                  onChange={(event) => setTotalTimeout(event.target.value)}
                  min={0}
                  className="form-runner-timeout-input"
                />
              </label>
            </div>
          </div>
          <div className="form-runner-panel-scroll">
            {validationMessage && (
              <div className="form-runner-alert form-runner-alert--warning">
                {validationMessage}
              </div>
            )}
            {formRunError && (
              <div className="form-runner-alert form-runner-alert--error">
                {formRunError}
              </div>
            )}
            {!profile && !formProfilesLoading && (
              <div className="form-runner-empty">
                Select a profile to start running a form.
              </div>
            )}
            {profile && (
              <div className="form-runner-field-list">
                {profile.schema.fields.map((field) => renderField(field))}
              </div>
            )}
          </div>
          <div className="form-runner-actions">
            <div className="form-runner-actions-group">
              <button
                type="button"
                onClick={handleClear}
                className="form-runner-button"
              >
                Clear
              </button>
              {profile && streamMode !== "none" && (
                <button
                  type="button"
                  onClick={runStreamRequest}
                  disabled={isStreamRunning}
                  className="form-runner-button form-runner-button--secondary"
                >
                  Run (Stream)
                </button>
              )}
              {profile && streamMode !== "none" && (
                <button
                  type="button"
                  onClick={abortActiveStream}
                  disabled={!isStreamRunning}
                  className="form-runner-button form-runner-button--danger"
                >
                  Abort
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={runRequest}
              disabled={!profile || formRunRunning}
              className="form-runner-button form-runner-button--primary"
            >
              {formRunRunning ? "Running..." : "Run"}
            </button>
          </div>
        </section>
        <section className="form-runner-preview">
          <div className="form-runner-panel-header">
            <h2>Request preview</h2>
            {previewState.error && (
              <p className="form-runner-field-error">{previewState.error}</p>
            )}
          </div>
          <div className="form-runner-preview-grid">
            <div className="form-runner-card">
              <h3>
                Current Inputs
              </h3>
              {previewState.preview ? (
                <div className="form-runner-card-content">
                  <div>
                    <span className="form-runner-label">Method:</span>{" "}
                    <span className="form-runner-method">
                      {previewState.preview.method}
                    </span>
                  </div>
                  <div>
                    <span className="form-runner-label">URL:</span>
                    <div className="form-runner-code form-runner-code--url">
                      {previewState.preview.url || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="form-runner-label">Headers:</span>
                    {Object.keys(previewState.preview.headers).length ? (
                      <ul className="form-runner-list">
                        {Object.entries(previewState.preview.headers).map(([name, value]) => (
                          <li key={name}>
                            <span className="form-runner-label">{name}:</span>{" "}
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="form-runner-muted">No headers</p>
                    )}
                  </div>
                  <div>
                    <span className="form-runner-label">Body preview:</span>
                    <pre className="form-runner-code form-runner-code--block">
                      {previewState.preview.bodyPreview || "-"}
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
                    className="form-runner-button form-runner-button--small"
                  >
                    Copy preview JSON
                  </button>
                </div>
              ) : (
                <p className="form-runner-muted">Preview will appear once inputs are set.</p>
              )}
            </div>
            <div className="form-runner-card form-runner-stream">
              <h3>
                Stream Output
              </h3>
              {streamMode === "none" ? (
                <p className="form-runner-muted">Streaming is disabled for this profile.</p>
              ) : activeStreamEntry ? (
                <div className="form-runner-card-content">
                  <div className="form-runner-meta-row">
                    <span>Status: <span>{streamStatusLabel}</span></span>
                    <span>Chars: <span>{streamCharCount}</span></span>
                  </div>
                  {streamError && (
                    <div className="form-runner-alert form-runner-alert--error">
                      {streamError}
                    </div>
                  )}
                  <div
                    ref={streamContainerRef}
                    onScroll={handleStreamScroll}
                    className="form-runner-stream-viewport"
                  >
                    {activeStreamEntry.text ? (
                      <pre>{activeStreamEntry.text}</pre>
                    ) : (
                      <p className="form-runner-muted">Waiting for chunks...</p>
                    )}
                  </div>
                  <div className="form-runner-meta-row">
                    <span>Last event: {streamLastEvent ?? "-"}</span>
                    {!stickToBottom && (
                      <button
                        type="button"
                        onClick={scrollStreamToLatest}
                        className="form-runner-button form-runner-button--small"
                      >
                        Scroll to latest
                      </button>
                    )}
                  </div>
                  <div className="form-runner-actions-group">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeStreamEntry.text, "Stream text")}
                      disabled={!activeStreamEntry.text}
                      className="form-runner-button form-runner-button--small"
                    >
                      Copy streamed text
                    </button>
                  </div>
                </div>
              ) : (
                <div className="form-runner-card-content">
                  {streamError && (
                    <div className="form-runner-alert form-runner-alert--error">
                      {streamError}
                    </div>
                  )}
                  <p className="form-runner-muted">Run the stream to see live tokens.</p>
                </div>
              )}
            </div>
            <div className="form-runner-card form-runner-response">
              <h3>
                Last Response
              </h3>
              {formRunLast ? (
                formRunLast.ok ? (
                  <div className="form-runner-card-content">
                    <div className="form-runner-meta-row form-runner-meta-row--start">
                      <span
                        className={`form-runner-status ${
                          formRunLast.status >= 200 && formRunLast.status < 300
                            ? "form-runner-status--ready"
                            : "form-runner-status--warning"
                        }`}
                      >
                        {formRunLast.status} {formRunLast.statusText}
                      </span>
                      <span>
                        Latency: {formRunLast.latencyMs} ms
                      </span>
                    </div>
                    <div>
                      <span className="form-runner-label">Response headers:</span>
                      {Object.keys(formRunLast.headers).length ? (
                        <ul className="form-runner-list form-runner-list--scroll">
                          {Object.entries(formRunLast.headers).map(([name, value]) => (
                            <li key={name}>
                              <span className="form-runner-label">{name}:</span>{" "}
                              <span>{value}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="form-runner-muted">No headers</p>
                      )}
                    </div>
                    <div>
                      <span className="form-runner-label">Body:</span>
                      {formRunLast.responseType === "json" && (
                        <pre className="form-runner-code form-runner-code--block">
                          {JSON.stringify(formRunLast.bodyJson, null, 2)}
                        </pre>
                      )}
                      {formRunLast.responseType === "text" && (
                        <textarea
                          readOnly
                          value={formRunLast.bodyText ?? ""}
                          className="form-runner-response-text"
                        />
                      )}
                      {formRunLast.responseType === "empty" && (
                        <p className="form-runner-muted">No body returned.</p>
                      )}
                    </div>
                    <div className="form-runner-actions-group">
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
                          className="form-runner-button form-runner-button--small"
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
                          className="form-runner-button form-runner-button--small"
                        >
                          Copy request
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="form-runner-card-content form-runner-card-content--error">
                    <div className="form-runner-alert form-runner-alert--error">
                      <div className="form-runner-alert-kicker">Request failed</div>
                      <div>{formRunLast.message}</div>
                      {formRunLast.details && (
                        <pre className="form-runner-code form-runner-code--block">
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
                        className="form-runner-button form-runner-button--danger form-runner-button--small"
                      >
                        Copy request snapshot
                      </button>
                    )}
                  </div>
                )
              ) : (
                <p className="form-runner-muted">
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
