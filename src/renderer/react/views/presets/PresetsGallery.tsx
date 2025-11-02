import { FormEvent, useEffect, useMemo, useState } from "react";
import type { MediaPreset } from "../../../../shared/types/mediaPresets";
import type { ServiceClient, ServiceCategory } from "../../../../shared/types/registry";
import { useDockStore } from "../../store/useDockStore";
import { resolveAdapterId } from "../../../adapters/adapters";
import ApplyPresetDialog, {
  ApplyPresetResultFeedback
} from "../../components/ApplyPresetDialog";

type PresetKindFilter = "all" | "image" | "video";

interface PresetEditorState {
  id: string;
  title: string;
  kind: "image" | "video";
  prompt: string;
  negativePrompt: string;
  aspect: string;
  steps: string;
  guidance: string;
  seed: string;
  extrasJson: string;
  tagsInput: string;
  boundClients: string[];
  createdAt: string;
}

const createEmptyEditorState = (): PresetEditorState => {
  const now = new Date().toISOString();
  const randomId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return {
    id: randomId,
    title: "",
    kind: "image",
    prompt: "",
    negativePrompt: "",
    aspect: "",
    steps: "",
    guidance: "",
    seed: "",
    extrasJson: "",
    tagsInput: "",
    boundClients: [],
    createdAt: now
  };
};

const toEditorState = (preset: MediaPreset): PresetEditorState => ({
  id: preset.id,
  title: preset.title,
  kind: preset.kind,
  prompt: preset.prompt,
  negativePrompt: preset.negativePrompt || "",
  aspect: preset.params?.aspect || "",
  steps: preset.params?.steps !== undefined ? String(preset.params.steps) : "",
  guidance: preset.params?.guidance !== undefined ? String(preset.params.guidance) : "",
  seed: preset.params?.seed !== undefined ? String(preset.params.seed) : "",
  extrasJson: preset.params?.extras ? JSON.stringify(preset.params.extras, null, 2) : "",
  tagsInput: preset.tags.join(", "),
  boundClients: preset.boundClients || [],
  createdAt: preset.createdAt
});

const parseExtras = (value: string): Record<string, unknown> | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    throw new Error("Extras JSON must be an object");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to parse extras JSON");
  }
};

const editorStateToPreset = (state: PresetEditorState): MediaPreset => {
  const now = new Date().toISOString();
  const params: MediaPreset["params"] = {};
  if (state.aspect.trim()) {
    params.aspect = state.aspect.trim();
  }
  if (state.steps.trim()) {
    const numeric = Number(state.steps);
    if (Number.isFinite(numeric)) {
      params.steps = numeric;
    }
  }
  if (state.guidance.trim()) {
    const numeric = Number(state.guidance);
    if (Number.isFinite(numeric)) {
      params.guidance = numeric;
    }
  }
  if (state.seed.trim()) {
    const numeric = Number(state.seed);
    params.seed = Number.isFinite(numeric) ? numeric : state.seed.trim();
  }
  if (state.extrasJson.trim()) {
    params.extras = parseExtras(state.extrasJson);
  }
  const hasParams =
    params.aspect !== undefined ||
    params.steps !== undefined ||
    params.guidance !== undefined ||
    params.seed !== undefined ||
    params.extras !== undefined;
  const tags = state.tagsInput
    .split(",")
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter(Boolean);
  return {
    id: state.id,
    title: state.title.trim(),
    kind: state.kind,
    prompt: state.prompt,
    negativePrompt: state.negativePrompt.trim() || undefined,
    params: hasParams ? params : undefined,
    tags,
    boundClients: state.boundClients.length ? state.boundClients : undefined,
    createdAt: state.createdAt,
    updatedAt: now
  };
};

interface PresetEditorModalProps {
  open: boolean;
  state: PresetEditorState;
  services: Array<{ id: string; title: string }>;
  onChange: (next: PresetEditorState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const PresetEditorModal = ({
  open,
  state,
  services,
  onChange,
  onSubmit,
  onClose
}: PresetEditorModalProps) => {
  if (!open) {
    return null;
  }
  const toggleClient = (clientId: string) => {
    onChange({
      ...state,
      boundClients: state.boundClients.includes(clientId)
        ? state.boundClients.filter((id) => id !== clientId)
        : [...state.boundClients, clientId]
    });
  };
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <header className="modal-header">
          <h2>{state.title ? `Edit ${state.title}` : "New Media Preset"}</h2>
        </header>
        <form onSubmit={onSubmit} className="preset-form">
          <label>
            <span>Title</span>
            <input
              type="text"
              value={state.title}
              onChange={(event) => onChange({ ...state, title: event.target.value })}
              required
            />
          </label>
          <label>
            <span>Kind</span>
            <select
              value={state.kind}
              onChange={(event) =>
                onChange({ ...state, kind: event.target.value as PresetEditorState["kind"] })
              }
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label>
            <span>Prompt</span>
            <textarea
              value={state.prompt}
              rows={6}
              onChange={(event) => onChange({ ...state, prompt: event.target.value })}
              required
            />
          </label>
          <label>
            <span>Negative Prompt</span>
            <textarea
              value={state.negativePrompt}
              rows={4}
              onChange={(event) => onChange({ ...state, negativePrompt: event.target.value })}
            />
          </label>
          <div className="preset-params-grid">
            <label>
              <span>Aspect</span>
              <input
                type="text"
                value={state.aspect}
                onChange={(event) => onChange({ ...state, aspect: event.target.value })}
                placeholder="16:9"
              />
            </label>
            <label>
              <span>Steps</span>
              <input
                type="number"
                value={state.steps}
                onChange={(event) => onChange({ ...state, steps: event.target.value })}
                placeholder="30"
              />
            </label>
            <label>
              <span>Guidance</span>
              <input
                type="number"
                value={state.guidance}
                onChange={(event) => onChange({ ...state, guidance: event.target.value })}
                step="0.1"
                placeholder="7"
              />
            </label>
            <label>
              <span>Seed</span>
              <input
                type="text"
                value={state.seed}
                onChange={(event) => onChange({ ...state, seed: event.target.value })}
                placeholder="Randomized if empty"
              />
            </label>
          </div>
          <label>
            <span>Extras (JSON)</span>
            <textarea
              value={state.extrasJson}
              rows={4}
              onChange={(event) => onChange({ ...state, extrasJson: event.target.value })}
              placeholder='{"scheduler":"DPM++"}'
            />
          </label>
          <label>
            <span>Tags</span>
            <input
              type="text"
              value={state.tagsInput}
              onChange={(event) => onChange({ ...state, tagsInput: event.target.value })}
              placeholder="portrait, cinematic, neon"
            />
          </label>
          <fieldset className="preset-bound-clients">
            <legend>Bound Clients</legend>
            <div className="preset-bound-grid">
              {services.map((service) => {
                const checked = state.boundClients.includes(service.id);
                return (
                  <label key={service.id} className="preset-bound-option">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleClient(service.id)}
                    />
                    <span>{service.title}</span>
                  </label>
                );
              })}
              {!services.length && <span className="muted">No registry clients configured.</span>}
            </div>
          </fieldset>
          <footer className="modal-footer">
            <button type="button" className="pill-btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pill-btn">
              Save Preset
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

interface ImportPresetsDialogProps {
  open: boolean;
  busy: boolean;
  onSelect: (mode: "overwrite" | "copy") => void;
  onCancel: () => void;
}

const ImportPresetsDialog = ({ open, busy, onSelect, onCancel }: ImportPresetsDialogProps) => {
  if (!open) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <header className="modal-header">
          <h2>Import Media Presets</h2>
        </header>
        <section className="apply-preset-body">
          <p className="muted">
            How should conflicting presets (same ID) be handled?
          </p>
          <div className="import-options">
            <button
              type="button"
              className="pill-btn"
              disabled={busy}
              onClick={() => onSelect("overwrite")}
            >
              Overwrite existing
            </button>
            <button
              type="button"
              className="pill-btn ghost"
              disabled={busy}
              onClick={() => onSelect("copy")}
            >
              Create copies
            </button>
          </div>
        </section>
        <footer className="modal-footer">
          <button type="button" className="pill-btn ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

function PresetsGallery() {
  const presets = useDockStore((state) => state.mediaPresets);
  const loading = useDockStore((state) => state.mediaPresetsLoading);
  const error = useDockStore((state) => state.mediaPresetsError);
  const registryClients = useDockStore((state) => state.registryClients);
  const services = useDockStore((state) => state.services);
  const fetchPresets = useDockStore((state) => state.actions.fetchMediaPresets);
  const upsertPreset = useDockStore((state) => state.actions.upsertMediaPreset);
  const removePreset = useDockStore((state) => state.actions.removeMediaPreset);
  const applyMediaPreset = useDockStore((state) => state.actions.applyMediaPreset);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<PresetKindFilter>("all");
  const [tagFilter, setTagFilter] = useState<string>("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorState, setEditorState] = useState<PresetEditorState>(createEmptyEditorState);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyPreset, setApplyPreset] = useState<MediaPreset | null>(null);
  const [applySelectionSeed, setApplySelectionSeed] = useState<string[]>([]);
  const [applyBusy, setApplyBusy] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState<ApplyPresetResultFeedback | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importBusy, setImportBusy] = useState(false);

  const availableClients = useMemo<ServiceClient[]>(() => {
    if (registryClients.length) {
      return registryClients;
    }
    return services.map((service) => ({
      id: service.id,
      title: service.title,
      category: "other" as ServiceCategory,
      urlPatterns: [],
      adapterId: service.id,
      icon: undefined,
      enabled: true
    }));
  }, [registryClients, services]);

  const clientAdapterWarnings = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    availableClients.forEach((client) => {
      const resolved = resolveAdapterId(client.adapterId);
      if (!resolved) {
        map[client.id] = "Adapter not configured";
      }
    });
    return map;
  }, [availableClients]);

  const editorServices = useMemo(
    () => services.map((service) => ({ id: service.id, title: service.title })),
    [services]
  );

  const handleExportPresets = async () => {
    if (!window.mediaPresets?.export) {
      showToast("Media presets API unavailable");
      return;
    }
    try {
      const response = await window.mediaPresets.export();
      if (!response || response.ok === false) {
        showToast(response?.error || "Export failed");
        return;
      }
      showToast(`Exported ${response.count} preset${response.count === 1 ? "" : "s"}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error));
    }
  };

  const handleImportMode = async (mode: "overwrite" | "copy") => {
    if (!window.mediaPresets?.import) {
      showToast("Media presets API unavailable");
      return;
    }
    setImportBusy(true);
    try {
      const options =
        mode === "copy"
          ? { mergeById: false, duplicateStrategy: "copy" as const }
          : { mergeById: true };
      const response = await window.mediaPresets.import(options);
      if (!response || response.ok === false) {
        const message = response?.error || "Import failed";
        if (message !== "Import canceled by user") {
          showToast(message);
        }
        return;
      }
      await fetchPresets();
      const { added = 0, replaced = 0 } = response;
      const modeLabel = mode === "copy" ? "copied" : "overwritten";
      showToast(
        `Imported ${added} new preset${added === 1 ? "" : "s"}${
          replaced ? `, ${replaced} ${modeLabel}` : ""
        }`
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error));
    } finally {
      setImportBusy(false);
      setImportDialogOpen(false);
    }
  };

  useEffect(() => {
    void fetchPresets();
  }, [fetchPresets]);

  useEffect(() => {
    if (error) {
      showToast(error);
    }
  }, [error, showToast]);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    presets.forEach((preset) => preset.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [presets]);

  const filteredPresets = useMemo(() => {
    const term = search.trim().toLowerCase();
    const tag = tagFilter.trim().toLowerCase();
    return presets.filter((preset) => {
      if (kindFilter !== "all" && preset.kind !== kindFilter) {
        return false;
      }
      if (tag && !preset.tags.some((candidate) => candidate.toLowerCase() === tag)) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        preset.title.toLowerCase().includes(term) ||
        preset.prompt.toLowerCase().includes(term) ||
        preset.tags.some((candidate) => candidate.toLowerCase().includes(term))
      );
    });
  }, [presets, kindFilter, tagFilter, search]);

  const openEditor = (preset?: MediaPreset) => {
    if (preset) {
      setEditorState(toEditorState(preset));
    } else {
      setEditorState(createEmptyEditorState());
    }
    setEditorOpen(true);
  };

  const handleDuplicate = (preset: MediaPreset) => {
    const now = new Date().toISOString();
    const newId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    const duplicate: MediaPreset = {
      ...preset,
      id: newId,
      title: `${preset.title} (Copy)`,
      createdAt: now,
      updatedAt: now
    };
    void upsertPreset(duplicate).then((success) => {
      if (success) {
        showToast("Preset duplicated");
      }
    });
  };

  const handleDelete = (preset: MediaPreset) => {
    if (!window.confirm(`Delete preset "${preset.title}"?`)) {
      return;
    }
    void removePreset(preset.id).then((success) => {
      if (success) {
        showToast("Preset deleted");
      }
    });
  };

  const handleEditorSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editorState.title.trim()) {
      showToast("Title is required");
      return;
    }
    if (!editorState.prompt.trim()) {
      showToast("Prompt is required");
      return;
    }
    let preset: MediaPreset;
    try {
      preset = editorStateToPreset(editorState);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to parse preset");
      return;
    }
    const existing = presets.find((item) => item.id === preset.id);
    if (existing) {
      preset.createdAt = existing.createdAt;
    }
    const success = await upsertPreset(preset);
    if (success) {
      setEditorOpen(false);
      showToast(existing ? "Preset updated" : "Preset created");
    }
  };

  const openApplyDialog = (preset: MediaPreset) => {
    setApplyPreset(preset);
    setApplySelectionSeed(preset.boundClients || []);
    setApplyFeedback(null);
    setApplyOpen(true);
  };

  const handleApplySubmit = async ({
    clientIds,
    send
  }: {
    clientIds: string[];
    send: boolean;
  }) => {
    if (!applyPreset) {
      return;
    }
    setApplyBusy(true);
    try {
      const result = await applyMediaPreset({
        preset: applyPreset,
        clientIds,
        send
      });
      setApplyFeedback(result);
      if (result.applied > 0 && result.errors.length === 0) {
        showToast(
          send
            ? `Preset sent to ${result.applied} client${result.applied > 1 ? "s" : ""}`
            : `Preset inserted to ${result.applied} client${result.applied > 1 ? "s" : ""}`
        );
        setApplyOpen(false);
        setApplyPreset(null);
      } else if (result.applied > 0) {
        showToast(
          send
            ? "Preset sent with partial issues. Review warnings."
            : "Preset inserted with partial issues. Review warnings."
        );
      } else {
        showToast("Failed to apply preset. Review selection and warnings.");
      }
    } catch (applyError) {
      showToast(applyError instanceof Error ? applyError.message : String(applyError));
    } finally {
      setApplyBusy(false);
    }
  };

  const closeApplyDialog = () => {
    if (applyBusy) {
      return;
    }
    setApplyOpen(false);
    setApplyPreset(null);
    setApplyFeedback(null);
  };

  const defaultApplySelection = useMemo(() => {
    if (applySelectionSeed.length) {
      return applySelectionSeed;
    }
    return availableClients.map((client) => client.id);
  }, [applySelectionSeed, availableClients]);

  const renderPresetParams = (preset) => {
    const params = preset.params;
    if (!params) {
      return null;
    }
    const parts = [];
    if (params.aspect) {
      parts.push(`Aspect: ${params.aspect}`);
    }
    if (params.steps !== undefined) {
      parts.push(`Steps: ${params.steps}`);
    }
    if (params.guidance !== undefined) {
      parts.push(`Guidance: ${params.guidance}`);
    }
    if (params.seed !== undefined) {
      parts.push(`Seed: ${params.seed}`);
    }
    if (params.extras) {
      parts.push(`Extras: ${JSON.stringify(params.extras)}`);
    }
    if (!parts.length) {
      return null;
    }
    return <div className="preset-params-preview">{parts.join(" • ")}</div>;
  };

  return (
    <div className="presets-gallery">
      <header className="presets-toolbar">
        <div className="presets-search-group">
          <input
            type="search"
            value={search}
            placeholder="Search presets"
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value as PresetKindFilter)}>
            <option value="all">All kinds</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
            <option value="">All tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        <div className="presets-actions">
          <button type="button" className="pill-btn ghost" onClick={() => openEditor()}>
            New Preset
          </button>
          <button
            type="button"
            className="pill-btn ghost"
            onClick={() => setImportDialogOpen(true)}
            disabled={importBusy}
          >
            Import…
          </button>
          <button type="button" className="pill-btn ghost" onClick={handleExportPresets}>
            Export
          </button>
        </div>
      </header>
      {loading && <div className="presets-loading">Loading presets…</div>}
      {!loading && filteredPresets.length === 0 && (
        <div className="presets-empty">No presets match the current filters.</div>
      )}
      <section className="presets-grid">
        {filteredPresets.map((preset) => (
          <article key={preset.id} className="preset-card">
            <header className="preset-card-header">
              <h3>{preset.title}</h3>
              <span className={`preset-kind preset-kind--${preset.kind}`}>{preset.kind}</span>
            </header>
            <div className="preset-tags">
              {preset.tags.length ? (
                preset.tags.map((tag) => (
                  <span key={tag} className="preset-tag">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="preset-tag muted">No tags</span>
              )}
            </div>
            {renderPresetParams(preset)}
            <footer className="preset-card-actions">
              <button type="button" className="pill-btn ghost" onClick={() => openEditor(preset)}>
                Edit
              </button>
              <button type="button" className="pill-btn ghost" onClick={() => handleDuplicate(preset)}>
                Duplicate
              </button>
              <button type="button" className="pill-btn ghost" onClick={() => openApplyDialog(preset)}>
                Apply
              </button>
              <button type="button" className="pill-btn danger ghost" onClick={() => handleDelete(preset)}>
                Delete
              </button>
            </footer>
          </article>
        ))}
      </section>

      <ImportPresetsDialog
        open={importDialogOpen}
        busy={importBusy}
        onSelect={handleImportMode}
        onCancel={() => {
          if (!importBusy) {
            setImportDialogOpen(false);
          }
        }}
      />

      <PresetEditorModal
        open={editorOpen}
        state={editorState}
        services={editorServices}
        onChange={setEditorState}
        onSubmit={handleEditorSubmit}
        onClose={() => setEditorOpen(false)}
      />

      <ApplyPresetDialog
        open={applyOpen}
        preset={applyPreset}
        clients={availableClients}
        adapterWarnings={clientAdapterWarnings}
        defaultSelection={defaultApplySelection}
        applying={applyBusy}
        feedback={applyFeedback}
        onApply={handleApplySubmit}
        onClose={closeApplyDialog}
      />
    </div>
  );
}

export default PresetsGallery;
