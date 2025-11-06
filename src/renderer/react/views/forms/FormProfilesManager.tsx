import { useEffect, useMemo, useState } from "react";
import type { FormProfile } from "../../../../shared/types/form";
import type { FormProfilesTestRes } from "../../../../shared/ipc/formProfiles.contracts";
import { useDockStore } from "../../store/useDockStore";
import FormEditor from "./FormEditor";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { validateProfile } from "../../../store/formProfilesSlice";

const EMPTY_SAMPLE: Record<string, string> = {};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const createDraftProfile = (template?: FormProfile): FormProfile => {
  const now = new Date().toISOString();
  const base =
    template ??
    ({
      id: "template",
      label: "New Form Profile",
      baseUrl: "https://api.example.com",
      template: {
        method: "POST",
        path: "/v1/run/{{model}}",
        headers: {
          "Content-Type": "application/json"
        },
        query: {},
        body: {
          prompt: "{{prompt}}"
        },
        bodyKind: "json"
      },
      schema: {
        id: "schema",
        title: "Request",
        fields: [
          {
            id: "prompt",
            type: "text",
            name: "prompt",
            label: "Prompt",
            required: true,
            defaultValue: ""
          }
        ]
      },
      createdAt: now,
      updatedAt: now,
      stream: "none"
    } as FormProfile);

  return {
    ...clone(base),
    id: crypto.randomUUID(),
    label: "New Form Profile",
    createdAt: now,
    updatedAt: now
  };
};

const FormProfilesManager = () => {
  const {
    formProfiles,
    formProfilesLoading,
    formProfilesError,
    formProfilesFilter,
    formProfilesSelectedId,
    formProfilesLastTest
  } = useDockStore((state) => ({
    formProfiles: state.formProfiles,
    formProfilesLoading: state.formProfilesLoading,
    formProfilesError: state.formProfilesError,
    formProfilesFilter: state.formProfilesFilter,
    formProfilesSelectedId: state.formProfilesSelectedId,
    formProfilesLastTest: state.formProfilesLastTest
  }));

  const actions = useDockStore((state) => state.actions);

  const [editingProfile, setEditingProfile] = useState<FormProfile | null>(null);
  const [snapshotProfile, setSnapshotProfile] = useState<FormProfile | null>(null);
  const [sampleValues, setSampleValues] = useState<Record<string, string>>(EMPTY_SAMPLE);
  const [testResult, setTestResult] = useState<FormProfilesTestRes | null | undefined>(null);
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);
  const [confirmUnsaved, setConfirmUnsaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    void actions.fetchFormProfiles();
  }, [actions]);

  useEffect(() => {
    if (!formProfilesSelectedId) {
      setEditingProfile(null);
      setSnapshotProfile(null);
      setSampleValues(EMPTY_SAMPLE);
      return;
    }
    const existing = formProfiles.find((profile) => profile.id === formProfilesSelectedId);
    if (!existing) {
      return;
    }
    setEditingProfile(clone(existing));
    setSnapshotProfile(clone(existing));
    setSampleValues(deriveSampleValues(existing));
    setTestResult(null);
  }, [formProfiles, formProfilesSelectedId]);

  useEffect(() => {
    if (formProfilesLastTest) {
      setTestResult(formProfilesLastTest);
    }
  }, [formProfilesLastTest]);

  useEffect(() => {
    if (!editingProfile) {
      return;
    }
    setSampleValues((prev) => {
      const next = { ...prev };
      editingProfile.schema.fields.forEach((field) => {
        const key = field.name.trim();
        if (!key) {
          return;
        }
        if (!(key in next) && typeof field.defaultValue === "string") {
          next[key] = field.defaultValue;
        }
      });
      return next;
    });
  }, [editingProfile?.schema.fields, editingProfile]);

  const dirty = useMemo(() => {
    if (!editingProfile) {
      return false;
    }
    if (!snapshotProfile) {
      return true;
    }
    return JSON.stringify(editingProfile) !== JSON.stringify(snapshotProfile);
  }, [editingProfile, snapshotProfile]);

  const validationIssues = useMemo(() => {
    if (!editingProfile) {
      return [];
    }
    const result = validateProfile(editingProfile);
    return result.ok ? [] : result.issues;
  }, [editingProfile]);

  const filteredProfiles = useMemo(() => {
    const base = [...formProfiles];
    if (
      editingProfile &&
      !base.some((profile) => profile.id === editingProfile.id) &&
      !snapshotProfile
    ) {
      base.push(editingProfile);
    }
    const query = formProfilesFilter.trim().toLowerCase();
    const sorted = base.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    if (!query) {
      return sorted;
    }
    return sorted.filter((profile) => {
      const haystack = `${profile.label} ${profile.id}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [formProfiles, editingProfile, snapshotProfile, formProfilesFilter]);

  const handleSelect = (id: string) => {
    if (formProfilesSelectedId === id) {
      return;
    }
    if (dirty) {
      setPendingSelection(id);
      setConfirmUnsaved(true);
      return;
    }
    actions.selectFormProfile(id);
  };

  const handleConfirmUnsaved = (shouldDiscard: boolean) => {
    setConfirmUnsaved(false);
    if (!shouldDiscard || !pendingSelection) {
      setPendingSelection(null);
      return;
    }
    if (pendingSelection === "new") {
      const draft = createDraftProfile(formProfiles[0]);
      setEditingProfile(draft);
      setSnapshotProfile(null);
      setSampleValues(deriveSampleValues(draft));
      setTestResult(null);
      actions.selectFormProfile(draft.id);
      setPendingSelection(null);
      return;
    }
    actions.selectFormProfile(pendingSelection);
    setPendingSelection(null);
  };

  const handleNew = () => {
    if (dirty) {
      setPendingSelection("new");
      setConfirmUnsaved(true);
      return;
    }
    const draft = createDraftProfile(formProfiles[0]);
    setEditingProfile(draft);
    setSnapshotProfile(null);
    setSampleValues(deriveSampleValues(draft));
    setTestResult(null);
    actions.selectFormProfile(draft.id);
  };

  const handleDuplicate = async () => {
    if (!formProfilesSelectedId) {
      return;
    }
    const duplicate = await actions.duplicateFormProfile(formProfilesSelectedId);
    if (duplicate) {
      setEditingProfile(clone(duplicate));
      setSnapshotProfile(clone(duplicate));
      setSampleValues(deriveSampleValues(duplicate));
      setTestResult(null);
    }
  };

  const handleDelete = async () => {
    if (!formProfilesSelectedId) {
      return;
    }
    setConfirmDelete(false);
    const success = await actions.removeFormProfile(formProfilesSelectedId);
    if (success) {
      setEditingProfile(null);
      setSnapshotProfile(null);
      setSampleValues(EMPTY_SAMPLE);
      setTestResult(null);
    }
  };

  const handleSave = async () => {
    if (!editingProfile) {
      return false;
    }
    const validation = validateProfile(editingProfile);
    if (validation.ok === false) {
      return false;
    }
    editingProfile.updatedAt = new Date().toISOString();
    if (!snapshotProfile) {
      editingProfile.createdAt = editingProfile.updatedAt;
    }
    const success = await actions.upsertFormProfile(editingProfile);
    if (success) {
      setSnapshotProfile(clone(editingProfile));
    }
    return success;
  };

  const handleCancel = () => {
    if (!snapshotProfile) {
      setEditingProfile(null);
      setSampleValues(EMPTY_SAMPLE);
      setTestResult(null);
      actions.selectFormProfile(undefined);
      return;
    }
    setEditingProfile(clone(snapshotProfile));
    setSampleValues(deriveSampleValues(snapshotProfile));
    setTestResult(null);
  };

  const handleProfileChange = (profile: FormProfile) => {
    setEditingProfile(profile);
  };

  const handleTest = async (profile: FormProfile, sample: Record<string, unknown>) => {
    setIsTesting(true);
    try {
      await actions.testFormProfile(profile, sample);
    } finally {
      setIsTesting(false);
    }
  };

  const handleOpenRun = () => {
    if (!editingProfile || dirty) {
      return;
    }
    actions.setFormRunProfile(editingProfile.id);
    actions.clearFormRun();
    void actions.focusLocalView("formRun");
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-800 bg-slate-950 px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-100">Form Profiles</h1>
        <div className="flex-1" />
        <input
          type="search"
          value={formProfilesFilter}
          onChange={(event) => actions.setFormProfilesFilter(event.target.value)}
          placeholder="Search by label or id"
          className="w-56 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleNew}
          className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          New
        </button>
        <button
          type="button"
          onClick={handleDuplicate}
          disabled={!formProfilesSelectedId}
          className="rounded border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Duplicate
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={!formProfilesSelectedId}
          className="rounded border border-rose-600 px-3 py-2 text-sm text-rose-300 hover:border-rose-500 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => actions.fetchFormProfiles()}
          className="rounded border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-slate-400"
        >
          Refresh
        </button>
      </header>
      {formProfilesError && (
        <div className="border-b border-amber-600 bg-amber-900/30 px-6 py-2 text-sm text-amber-300">
          {formProfilesError}
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-slate-800 bg-slate-950">
          {formProfilesLoading ? (
            <p className="px-4 py-3 text-sm text-slate-400">Loading profiles…</p>
          ) : filteredProfiles.length ? (
            <ul className="max-h-full overflow-y-auto">
              {filteredProfiles.map((profile) => {
                const isActive = profile.id === formProfilesSelectedId;
                return (
                  <li key={profile.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(profile.id)}
                      className={`w-full border-b border-slate-800 px-4 py-3 text-left text-sm transition ${
                        isActive
                          ? "bg-slate-800 text-slate-100"
                          : "text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <div className="font-medium">{profile.label}</div>
                      <div className="text-xs text-slate-400">{profile.baseUrl}</div>
                      <div className="text-xs text-slate-500">{profile.updatedAt}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-sm text-slate-400">
              No profiles found. Create a new one to get started.
            </div>
          )}
        </aside>
        <main className="flex flex-1 flex-col">
          <div className="flex-1">
            <FormEditor
              profile={editingProfile}
              dirty={dirty}
              validationIssues={validationIssues}
              sampleValues={sampleValues}
              testResult={testResult}
              testing={isTesting}
              onProfileChange={handleProfileChange}
              onSave={handleSave}
              onCancel={handleCancel}
              onTest={handleTest}
              onSampleChange={setSampleValues}
              onOpenRun={handleOpenRun}
            />
          </div>
        </main>
      </div>
      <ConfirmDialog
        open={confirmUnsaved}
        title="Discard unsaved changes?"
        message="You have unsaved changes. Switch profile and discard them?"
        confirmLabel="Discard"
        cancelLabel="Stay"
        onConfirm={() => handleConfirmUnsaved(true)}
        onCancel={() => handleConfirmUnsaved(false)}
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete form profile?"
        message="This action cannot be undone. Delete the selected profile?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

export default FormProfilesManager;

const deriveSampleValues = (profile: FormProfile): Record<string, string> => {
  const samples: Record<string, string> = {};
  profile.schema.fields.forEach((field) => {
    if (field.name && typeof field.defaultValue === "string") {
      samples[field.name] = field.defaultValue;
    }
  });
  return samples;
};
