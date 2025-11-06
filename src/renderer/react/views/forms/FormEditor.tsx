import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  BodyKind,
  FieldCheckbox,
  FieldFile,
  FieldNumber,
  FieldSelect,
  FieldSelectOption,
  FieldText,
  FieldTextarea,
  FormField,
  FormProfile,
  StreamMode
} from "../../../../shared/types/form";
import type { FormProfilesTestRes } from "../../../../shared/ipc/formProfiles.contracts";
import KeyValueEditor, { KeyValueItem } from "../../../components/KeyValueEditor";

type EditorTab = "profile" | "request" | "schema";

export interface FormEditorProps {
  profile: FormProfile | null;
  dirty: boolean;
  validationIssues: string[];
  sampleValues: Record<string, string>;
  testResult: FormProfilesTestRes | null | undefined;
  testing: boolean;
  onProfileChange: (profile: FormProfile) => void;
  onSave: () => Promise<boolean>;
  onCancel: () => void;
  onTest: (profile: FormProfile, sample: Record<string, unknown>) => Promise<void>;
  onSampleChange: (values: Record<string, string>) => void;
  onOpenRun?: (profile: FormProfile) => void;
}

const STREAM_OPTIONS: Array<{ value: StreamMode; label: string }> = [
  { value: "none", label: "None" },
  { value: "sse", label: "Server Sent Events" },
  { value: "ndjson", label: "NDJSON" }
];

const METHOD_OPTIONS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const BODY_KIND_LABEL: Record<BodyKind, string> = {
  json: "JSON",
  form: "Form-encoded",
  multipart: "Multipart (coming soon)",
  none: "No body"
};

const FIELD_TYPE_OPTIONS: Array<{ value: FormField["type"]; label: string }> = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "file", label: "File" }
];

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2)}`;
};

const createKeyValueItems = (record?: Record<string, string>): KeyValueItem[] =>
  Object.entries(record ?? {}).map(([key, value], index) => ({
    id: `${key || "row"}-${index}`,
    key,
    value
  }));

const itemsToRecord = (items: KeyValueItem[]): Record<string, string> =>
  items.reduce<Record<string, string>>((acc, item) => {
    const trimmed = item.key.trim();
    if (trimmed) {
      acc[trimmed] = item.value;
    }
    return acc;
  }, {});

const safeStringify = (value: unknown): string => {
  if (value === undefined || value === null || value === "") {
    return "{}";
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{}";
  }
};

const isFieldText = (field: FormField): field is FieldText => field.type === "text";
const isFieldTextarea = (field: FormField): field is FieldTextarea =>
  field.type === "textarea";
const isFieldNumber = (field: FormField): field is FieldNumber => field.type === "number";
const isFieldSelect = (field: FormField): field is FieldSelect => field.type === "select";
const isFieldCheckbox = (field: FormField): field is FieldCheckbox =>
  field.type === "checkbox";
const isFieldFile = (field: FormField): field is FieldFile => field.type === "file";

const normalizeOptions = (options: FieldSelectOption[]): FieldSelectOption[] =>
  options
    .map((option) => ({
      value: option.value.trim(),
      label: option.label
    }))
    .filter((option) => option.value);

const createField = (type: FormField["type"], index: number): FormField => {
  const name = `field_${index + 1}`;
  const label = `Field ${index + 1}`;
  switch (type) {
    case "textarea":
      return {
        id: createId("field"),
        type: "textarea",
        multiline: true,
        name,
        label,
        defaultValue: ""
      };
    case "number":
      return {
        id: createId("field"),
        type: "number",
        name,
        label,
        defaultValue: 0
      };
    case "select":
      return {
        id: createId("field"),
        type: "select",
        name,
        label,
        options: [
          { value: "option_a", label: "Option A" },
          { value: "option_b", label: "Option B" }
        ],
        defaultValue: "option_a"
      };
    case "checkbox":
      return {
        id: createId("field"),
        type: "checkbox",
        name,
        label,
        defaultValue: false
      };
    case "file":
      return {
        id: createId("field"),
        type: "file",
        name,
        label,
        accept: "",
        multiple: false
      };
    case "text":
    default:
      return {
        id: createId("field"),
        type: "text",
        name,
        label,
        defaultValue: "",
        multiline: false
      };
  }
};

const FormEditor = ({
  profile,
  dirty,
  validationIssues,
  sampleValues,
  testResult,
  testing,
  onProfileChange,
  onSave,
  onCancel,
  onTest,
  onSampleChange,
  onOpenRun
}: FormEditorProps) => {
  const [activeTab, setActiveTab] = useState<EditorTab>("profile");
  const [headers, setHeaders] = useState<KeyValueItem[]>([]);
  const [queryParams, setQueryParams] = useState<KeyValueItem[]>([]);
  const [formBody, setFormBody] = useState<KeyValueItem[]>([]);
  const [jsonBodyText, setJsonBodyText] = useState<string>("{}");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) {
      setHeaders([]);
      setQueryParams([]);
      setFormBody([]);
      setJsonBodyText("{}");
      setJsonError(null);
      setSelectedFieldId(null);
      return;
    }
    setHeaders(createKeyValueItems(profile.template.headers));
    setQueryParams(createKeyValueItems(profile.template.query));
    if (profile.template.bodyKind === "form") {
      const record =
        profile.template.body && typeof profile.template.body === "object"
          ? (profile.template.body as Record<string, string>)
          : {};
      setFormBody(createKeyValueItems(record));
    } else {
      setFormBody([]);
    }
    setJsonBodyText(safeStringify(profile.template.body));
    setJsonError(null);
    if (!profile.schema.fields.find((field) => field.id === selectedFieldId)) {
      setSelectedFieldId(profile.schema.fields[0]?.id ?? null);
    }
  }, [profile, selectedFieldId]);

  const updateProfile = useCallback(
    (mutator: (draft: FormProfile) => void) => {
      if (!profile) {
        return;
      }
      const draft = deepClone(profile);
      mutator(draft);
      onProfileChange(draft);
    },
    [profile, onProfileChange]
  );

  const changeHeaders = useCallback(
    (items: KeyValueItem[]) => {
      setHeaders(items);
      updateProfile((draft) => {
        const record = itemsToRecord(items);
        draft.template.headers = Object.keys(record).length ? record : undefined;
      });
    },
    [updateProfile]
  );

  const changeQuery = useCallback(
    (items: KeyValueItem[]) => {
      setQueryParams(items);
      updateProfile((draft) => {
        const record = itemsToRecord(items);
        draft.template.query = Object.keys(record).length ? record : undefined;
      });
    },
    [updateProfile]
  );

  const changeJsonBody = (value: string) => {
    setJsonBodyText(value);
    try {
      const parsed = value.trim() ? JSON.parse(value) : {};
      setJsonError(null);
      updateProfile((draft) => {
        draft.template.bodyKind = draft.template.bodyKind ?? "json";
        draft.template.body = parsed;
      });
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  const changeFormBody = (items: KeyValueItem[]) => {
    setFormBody(items);
    updateProfile((draft) => {
      const record = itemsToRecord(items);
      draft.template.body = Object.keys(record).length ? record : undefined;
      draft.template.bodyKind = "form";
    });
  };

  const changeBodyKind = (kind: BodyKind) => {
    updateProfile((draft) => {
      draft.template.bodyKind = kind;
      if (kind === "none") {
        draft.template.body = undefined;
      } else if (kind === "json") {
        const jsonObject =
          typeof draft.template.body === "object" && !Array.isArray(draft.template.body)
            ? draft.template.body
            : {};
        draft.template.body = jsonObject;
        setJsonBodyText(safeStringify(jsonObject));
        setJsonError(null);
      } else if (kind === "form") {
        const record =
          typeof draft.template.body === "object" && !Array.isArray(draft.template.body)
            ? (draft.template.body as Record<string, string>)
            : {};
        draft.template.body = record;
        setFormBody(createKeyValueItems(record));
      }
    });
  };

  const changeField = <K extends keyof FormField>(
    fieldId: string,
    key: K,
    value: FormField[K]
  ) => {
    updateProfile((draft) => {
      const index = draft.schema.fields.findIndex((field) => field.id === fieldId);
      if (index === -1) {
        return;
      }
      const field = draft.schema.fields[index];
      (field as FormField)[key] = value;
      if (field.type === "select" && key === "options") {
        field.options = normalizeOptions(field.options);
      }
    });
  };

  const changeSelectOptions = (fieldId: string, items: KeyValueItem[]) => {
    const options = normalizeOptions(
      items.map((item) => ({
        value: item.key.trim(),
        label: item.value
      }))
    );
    changeField(fieldId, "options", options);
  };

  const addField = (type: FormField["type"]) => {
    updateProfile((draft) => {
      const field = createField(type, draft.schema.fields.length);
      draft.schema.fields.push(field);
      setSelectedFieldId(field.id);
    });
  };

  const removeField = (fieldId: string) => {
    updateProfile((draft) => {
      draft.schema.fields = draft.schema.fields.filter((field) => field.id !== fieldId);
      if (selectedFieldId === fieldId) {
        setSelectedFieldId(draft.schema.fields[0]?.id ?? null);
      }
    });
  };

  const moveField = (fieldId: string, delta: number) => {
    updateProfile((draft) => {
      const index = draft.schema.fields.findIndex((field) => field.id === fieldId);
      if (index === -1) {
        return;
      }
      const target = index + delta;
      if (target < 0 || target >= draft.schema.fields.length) {
        return;
      }
      const [item] = draft.schema.fields.splice(index, 1);
      draft.schema.fields.splice(target, 0, item);
    });
  };

  const runSave = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  const runTest = async () => {
    if (!profile || dirty || testing) {
      return;
    }
    await onTest(profile, sampleValues);
  };

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center rounded border border-dashed border-slate-700 bg-slate-900 text-slate-400">
        Select or create a form profile to begin editing.
      </div>
    );
  }

  const selectedField =
    selectedFieldId && profile.schema.fields.find((field) => field.id === selectedFieldId);
  const bodyKind = profile.template.bodyKind ?? (profile.template.body ? "json" : "none");

  return (
    <div className="flex h-full gap-6">
      <div className="flex min-h-0 flex-1 flex-col rounded border border-slate-800 bg-slate-950">
        <div className="border-b border-slate-800">
          <nav className="flex gap-2 px-4 pt-3 text-sm">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
              Profile
            </TabButton>
            <TabButton active={activeTab === "request"} onClick={() => setActiveTab("request")}>
              Request Template
            </TabButton>
            <TabButton active={activeTab === "schema"} onClick={() => setActiveTab("schema")}>
              Schema
            </TabButton>
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === "profile" && (
            <ProfileTab
              profile={profile}
              streamMode={profile.stream ?? "none"}
              onChange={updateProfile}
            />
          )}
          {activeTab === "request" && (
            <RequestTab
              profile={profile}
              headers={headers}
              query={queryParams}
              bodyKind={bodyKind}
              jsonBody={jsonBodyText}
              jsonError={jsonError}
              formBody={formBody}
              onMethodChange={(value) =>
                updateProfile((draft) => {
                  draft.template.method = value as FormProfile["template"]["method"];
                })
              }
              onPathChange={(value) =>
                updateProfile((draft) => {
                  draft.template.path = value;
                })
              }
              onHeadersChange={changeHeaders}
              onQueryChange={changeQuery}
              onBodyKindChange={changeBodyKind}
              onJsonChange={changeJsonBody}
              onFormBodyChange={changeFormBody}
            />
          )}
          {activeTab === "schema" && (
            <SchemaTab
              profile={profile}
              selectedFieldId={selectedFieldId}
              selectedField={selectedField ?? null}
              onSelectField={setSelectedFieldId}
              onAddField={addField}
              onRemoveField={removeField}
              onMoveField={moveField}
              onFieldChange={changeField}
              onSelectOptionsChange={changeSelectOptions}
            />
          )}
        </div>
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 text-xs text-amber-400">
              {validationIssues.map((issue) => (
                <span key={issue}>- {issue}</span>
              ))}
              {jsonError && <span>- JSON body: {jsonError}</span>}
            </div>
            <div className="flex gap-2">
              {onOpenRun && profile && (
                <button
                  type="button"
                  onClick={() => onOpenRun(profile)}
                  disabled={
                    dirty ||
                    validationIssues.length > 0 ||
                    !!jsonError ||
                    saving
                  }
                  className={`rounded border px-4 py-2 text-sm ${
                    dirty || validationIssues.length > 0 || !!jsonError || saving
                      ? "cursor-not-allowed border-slate-700 text-slate-500"
                      : "border-indigo-600 text-indigo-200 hover:border-indigo-400 hover:text-indigo-100"
                  }`}
                >
                  Open Run...
                </button>
              )}
              <button
                type="button"
                onClick={onCancel}
                className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={runSave}
                disabled={saving || !dirty || validationIssues.length > 0 || !!jsonError}
                className={`rounded px-4 py-2 text-sm font-medium ${
                  saving || !dirty || validationIssues.length > 0 || !!jsonError
                    ? "cursor-not-allowed bg-slate-700 text-slate-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <PreviewPanel
        streamMode={profile.stream ?? "none"}
        sampleValues={sampleValues}
        testResult={testResult}
        dirty={dirty}
        testing={testing}
        onSampleChange={onSampleChange}
        onTest={runTest}
      />
    </div>
  );
};

export default FormEditor;

interface TabButtonProps {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}

const TabButton = ({ active, children, onClick }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-t px-3 py-2 transition ${
      active ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-100"
    }`}
  >
    {children}
  </button>
);

interface ProfileTabProps {
  profile: FormProfile;
  streamMode: StreamMode;
  onChange: (mutator: (draft: FormProfile) => void) => void;
}

const ProfileTab = ({ profile, streamMode, onChange }: ProfileTabProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-200">Label</label>
      <input
        type="text"
        value={profile.label}
        onChange={(event) =>
          onChange((draft) => {
            draft.label = event.target.value;
          })
        }
        className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-200">Base URL</label>
      <input
        type="text"
        value={profile.baseUrl}
        onChange={(event) =>
          onChange((draft) => {
            draft.baseUrl = event.target.value;
          })
        }
        placeholder="https://api.example.com"
        className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
      />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-slate-200">Stream mode</label>
        <select
          value={streamMode}
          onChange={(event) =>
            onChange((draft) => {
              draft.stream = event.target.value as StreamMode;
            })
          }
          className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        >
          {STREAM_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-200">
          API key reference
        </label>
        <input
          type="text"
          value={profile.auth?.apiKeyRef ?? ""}
          onChange={(event) =>
            onChange((draft) => {
              const value = event.target.value.trim();
              draft.auth = value ? { apiKeyRef: value } : undefined;
            })
          }
          placeholder="enc_xxxxx"
          className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">
          Reference stored via safeStorage. Секреты в UI не показываем.
        </p>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-200">Description</label>
      <textarea
        value={(profile.meta?.description as string | undefined) ?? ""}
        onChange={(event) =>
          onChange((draft) => {
            const value = event.target.value.trim();
            draft.meta = {
              ...(draft.meta ?? {}),
              description: value || undefined
            };
          })
        }
        rows={3}
        className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        placeholder="Short hint for teammates"
      />
    </div>
  </div>
);

interface RequestTabProps {
  profile: FormProfile;
  headers: KeyValueItem[];
  query: KeyValueItem[];
  bodyKind: BodyKind;
  jsonBody: string;
  jsonError: string | null;
  formBody: KeyValueItem[];
  onMethodChange: (value: string) => void;
  onPathChange: (value: string) => void;
  onHeadersChange: (items: KeyValueItem[]) => void;
  onQueryChange: (items: KeyValueItem[]) => void;
  onBodyKindChange: (kind: BodyKind) => void;
  onJsonChange: (value: string) => void;
  onFormBodyChange: (items: KeyValueItem[]) => void;
}

const RequestTab = ({
  profile,
  headers,
  query,
  bodyKind,
  jsonBody,
  jsonError,
  formBody,
  onMethodChange,
  onPathChange,
  onHeadersChange,
  onQueryChange,
  onBodyKindChange,
  onJsonChange,
  onFormBodyChange
}: RequestTabProps) => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-[120px_1fr]">
      <div>
        <label className="block text-sm font-medium text-slate-200">Method</label>
        <select
          value={profile.template.method}
          onChange={(event) => onMethodChange(event.target.value)}
          className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        >
          {METHOD_OPTIONS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-200">Path</label>
        <input
          type="text"
          value={profile.template.path}
          onChange={(event) => onPathChange(event.target.value)}
          placeholder="/v1/run/{{model}}"
          className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-200">Headers</label>
      <KeyValueEditor
        items={headers}
        onChange={onHeadersChange}
        addLabel="Add header"
        keyPlaceholder="Header"
        valuePlaceholder="Value"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-200">Query params</label>
      <KeyValueEditor
        items={query}
        onChange={onQueryChange}
        addLabel="Add param"
        keyPlaceholder="name"
        valuePlaceholder="value"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-slate-200">Body</label>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {(Object.keys(BODY_KIND_LABEL) as BodyKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => onBodyKindChange(kind)}
            className={`rounded px-3 py-1 ${
              bodyKind === kind
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {BODY_KIND_LABEL[kind]}
          </button>
        ))}
      </div>
      <div className="mt-3">
        {bodyKind === "json" && (
          <div>
            <textarea
              value={jsonBody}
              onChange={(event) => onJsonChange(event.target.value)}
              spellCheck={false}
              className="h-48 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
            {jsonError && <p className="mt-1 text-xs text-amber-400">{jsonError}</p>}
          </div>
        )}
        {bodyKind === "form" && (
          <KeyValueEditor
            items={formBody}
            onChange={onFormBodyChange}
            addLabel="Add field"
            keyPlaceholder="field"
            valuePlaceholder="value"
          />
        )}
        {bodyKind === "multipart" && (
          <p className="rounded border border-dashed border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
            Multipart support will be added in FC-06. Сейчас тело передаётся как есть.
          </p>
        )}
        {bodyKind === "none" && (
          <p className="rounded border border-dashed border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
            Тело запроса отсутствует.
          </p>
        )}
      </div>
    </div>
  </div>
);

interface SchemaTabProps {
  profile: FormProfile;
  selectedFieldId: string | null;
  selectedField: FormField | null;
  onSelectField: (id: string | null) => void;
  onAddField: (type: FormField["type"]) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (id: string, delta: number) => void;
  onFieldChange: <K extends keyof FormField>(id: string, key: K, value: FormField[K]) => void;
  onSelectOptionsChange: (id: string, items: KeyValueItem[]) => void;
}

const SchemaTab = ({
  profile,
  selectedFieldId,
  selectedField,
  onSelectField,
  onAddField,
  onRemoveField,
  onMoveField,
  onFieldChange,
  onSelectOptionsChange
}: SchemaTabProps) => {
  const selectOptions = useMemo<KeyValueItem[]>(() => {
    if (!selectedField || !isFieldSelect(selectedField)) {
      return [];
    }
    return selectedField.options.map((option, index) => ({
      id: `${option.value || "option"}-${index}`,
      key: option.value,
      value: option.label
    }));
  }, [selectedField]);

  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <div className="space-y-4 rounded border border-slate-800 bg-slate-900 p-3">
        <div className="space-y-2">
          {profile.schema.fields.map((field, index) => {
            const isActive = field.id === selectedFieldId;
            return (
              <div
                key={field.id}
                className={`rounded border px-3 py-2 text-sm ${
                  isActive
                    ? "border-indigo-500 bg-slate-800 text-slate-100"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => onSelectField(field.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{field.label || field.name}</span>
                    <span className="text-xs uppercase text-slate-400">{field.type}</span>
                  </div>
                  <div className="text-xs text-slate-500">{field.name}</div>
                </button>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => onMoveField(field.id, -1)}
                      disabled={index === 0}
                      className="rounded border border-slate-700 px-2 py-1 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveField(field.id, 1)}
                      disabled={index === profile.schema.fields.length - 1}
                      className="rounded border border-slate-700 px-2 py-1 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ▼
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveField(field.id)}
                    className="rounded border border-slate-700 px-2 py-1 text-rose-400 hover:border-rose-500 hover:text-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          <div className="rounded border border-dashed border-slate-700 bg-slate-900 p-3 text-sm">
            <label className="block text-xs font-semibold uppercase text-slate-400">
              Add field
            </label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {FIELD_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onAddField(option.value)}
                  className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-indigo-200"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded border border-slate-800 bg-slate-900 p-4">
        {selectedField ? (
          <FieldEditor
            field={selectedField}
            onChange={onFieldChange}
            selectOptions={selectOptions}
            onSelectOptionsChange={onSelectOptionsChange}
          />
        ) : (
          <p className="text-sm text-slate-400">
            Select a field on the left, then tune its attributes here.
          </p>
        )}
      </div>
    </div>
  );
};

interface FieldEditorProps {
  field: FormField;
  onChange: <K extends keyof FormField>(id: string, key: K, value: FormField[K]) => void;
  selectOptions: KeyValueItem[];
  onSelectOptionsChange: (id: string, items: KeyValueItem[]) => void;
}

const FieldEditor = ({
  field,
  onChange,
  selectOptions,
  onSelectOptionsChange
}: FieldEditorProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400">
            Name
          </label>
          <input
            type="text"
            value={field.name}
            onChange={(event) => onChange(field.id, "name", event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(event) => onChange(field.id, "label", event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={Boolean(field.required)}
            onChange={(event) => onChange(field.id, "required", event.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
          />
          Required
        </label>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400">
            Help text
          </label>
          <input
            type="text"
            value={field.help ?? ""}
            onChange={(event) => onChange(field.id, "help", event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            placeholder="Displayed below the input"
          />
        </div>
      </div>
      {isFieldText(field) && (
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400">
            Default value
          </label>
          <input
            type="text"
            value={field.defaultValue ?? ""}
            onChange={(event) => onChange(field.id, "defaultValue", event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}
      {isFieldTextarea(field) && (
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400">
            Default value
          </label>
          <textarea
            rows={4}
            value={field.defaultValue ?? ""}
            onChange={(event) => onChange(field.id, "defaultValue", event.target.value)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}
      {isFieldNumber(field) && (
        <div className="grid gap-4 md:grid-cols-4">
          <NumberInput
            label="Default"
            value={
              typeof field.defaultValue === "number" ? field.defaultValue : undefined
            }
            onChange={(value) => onChange(field.id, "defaultValue", value as number | undefined)}
          />
          <NumberInput
            label="Min"
            value={field.min}
            onChange={(value) => onChange(field.id, "min", value as number | undefined)}
          />
          <NumberInput
            label="Max"
            value={field.max}
            onChange={(value) => onChange(field.id, "max", value as number | undefined)}
          />
          <NumberInput
            label="Step"
            value={field.step}
            onChange={(value) => onChange(field.id, "step", value as number | undefined)}
          />
        </div>
      )}
      {isFieldSelect(field) && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase text-slate-400">
            Options
          </label>
          <KeyValueEditor
            items={selectOptions}
            onChange={(items) => onSelectOptionsChange(field.id, items)}
            keyPlaceholder="value"
            valuePlaceholder="label"
            addLabel="Add option"
          />
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400">
              Default value
            </label>
            <input
              type="text"
              value={field.defaultValue ?? ""}
              onChange={(event) => onChange(field.id, "defaultValue", event.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}
      {isFieldCheckbox(field) && (
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={Boolean(field.defaultValue)}
            onChange={(event) => onChange(field.id, "defaultValue", event.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
          />
          Checked by default
        </label>
      )}
      {isFieldFile(field) && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400">
              Accept (MIME types)
            </label>
            <input
              type="text"
              value={field.accept ?? ""}
              onChange={(event) => onChange(field.id, "accept", event.target.value)}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
              placeholder="image/png, image/jpeg"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={Boolean(field.multiple)}
              onChange={(event) => onChange(field.id, "multiple", event.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            Allow multiple files
          </label>
        </div>
      )}
    </div>
  );
};

interface NumberInputProps {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
}

const NumberInput = ({ label, value, onChange }: NumberInputProps) => (
  <div>
    <label className="block text-xs font-semibold uppercase text-slate-400">{label}</label>
    <input
      type="number"
      value={value ?? ""}
      onChange={(event) => {
        const raw = event.target.value;
        onChange(raw === "" ? undefined : Number(raw));
      }}
      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
    />
  </div>
);

interface PreviewPanelProps {
  streamMode: StreamMode;
  sampleValues: Record<string, string>;
  testResult: FormProfilesTestRes | null | undefined;
  dirty: boolean;
  testing: boolean;
  onSampleChange: (values: Record<string, string>) => void;
  onTest: () => void;
}

const PreviewPanel = ({
  streamMode,
  sampleValues,
  testResult,
  dirty,
  testing,
  onSampleChange,
  onTest
}: PreviewPanelProps) => {
  const items = useMemo<KeyValueItem[]>(
    () =>
      Object.entries(sampleValues).map(([key, value], index) => ({
        id: `${key || "sample"}-${index}`,
        key,
        value
      })),
    [sampleValues]
  );

  const changeSamples = (pairs: KeyValueItem[]) => {
    onSampleChange(itemsToRecord(pairs));
  };

  return (
    <aside className="flex w-96 flex-col rounded border border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-200">Preview & Test</h2>
        <p className="text-xs text-slate-400">
          Dry-run без сети. Stream mode:{" "}
          <span className="uppercase text-slate-100">{streamMode}</span>
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-400">
            Sample values
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Эти значения подставляются вместо {{variable}} в шаблоне.
          </p>
          <KeyValueEditor
            items={items}
            onChange={changeSamples}
            addLabel="Add sample"
            keyPlaceholder="variable"
            valuePlaceholder="value"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={onTest}
            disabled={testing || dirty}
            className={`w-full rounded px-4 py-2 text-sm font-medium ${
              testing || dirty
                ? "cursor-not-allowed bg-slate-700 text-slate-400"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {testing ? "Running..." : dirty ? "Save changes to test" : "Run Test"}
          </button>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
          {testResult ? (
            testResult.ok ? (
              <div className="space-y-2">
                <div className="text-xs uppercase text-emerald-400">Dry-run OK</div>
                <div>
                  <span className="font-semibold">URL:</span>{" "}
                  <span className="break-all text-slate-100">{testResult.url}</span>
                </div>
                <div>
                  <span className="font-semibold">Method:</span>{" "}
                  <span className="uppercase text-slate-100">{testResult.method}</span>
                </div>
                {testResult.headers && Object.keys(testResult.headers).length > 0 && (
                  <div>
                    <span className="font-semibold">Headers:</span>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">
                      {Object.entries(testResult.headers).map(([name, value]) => (
                        <li key={name}>
                          <span className="font-semibold text-slate-200">{name}:</span>{" "}
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {testResult.bodyPreview && (
                  <div>
                    <span className="font-semibold">Body preview:</span>
                    <pre className="mt-1 max-h-44 overflow-auto whitespace-pre-wrap rounded bg-slate-950/60 p-2 text-xs text-slate-300">
                      {testResult.bodyPreview}
                    </pre>
                  </div>
                )}
                {testResult.notes && (
                  <div className="text-xs text-slate-400">{testResult.notes}</div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs uppercase text-rose-400">Dry-run failed</div>
                <div className="text-sm text-slate-200">{testResult.error}</div>
                {testResult.details && (
                  <pre className="max-h-44 overflow-auto whitespace-pre-wrap rounded bg-slate-950/60 p-2 text-xs text-rose-300">
                    {testResult.details}
                  </pre>
                )}
              </div>
            )
          ) : (
            <p className="text-xs text-slate-400">
              Сохраните профиль и запустите тест, чтобы увидеть собранный запрос.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
