import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDockStore } from "../../store/useDockStore";
import { serviceCategories, ServiceClient, ServiceRegistryFile } from "../../../../shared/types/registry.ts";

interface EditorState {
  id: string;
  title: string;
  category: string;
  adapterId: string;
  icon: string;
  urlText: string;
  enabled: boolean;
  metaText: string;
}

interface EditorErrors {
  id?: string;
  title?: string;
  category?: string;
  adapterId?: string;
  urlText?: string;
  metaText?: string;
}

const createEmptyEditorState = (): EditorState => ({
  id: "",
  title: "",
  category: serviceCategories[0],
  adapterId: "",
  icon: "",
  urlText: "",
  enabled: true,
  metaText: ""
});

const parseUrlPatterns = (input: string): string[] => {
  return input
    .split(/\r?\n|,/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
};

const parseMeta = (input: string): Record<string, unknown> | undefined => {
  const trimmed = input.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = JSON.parse(trimmed);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Meta must be a JSON object");
  }
  return parsed as Record<string, unknown>;
};

const buildRegistryPayload = (clients: ServiceClient[]): ServiceRegistryFile => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  clients
});

const ClientsAndCategories = () => {
  const registryClients = useDockStore((state) => state.registryClients);
  const registryLoading = useDockStore((state) => state.registryLoading);
  const registryError = useDockStore((state) => state.registryError);
  const { fetchRegistry, saveRegistry } = useDockStore((state) => state.actions);

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [errors, setErrors] = useState<EditorErrors>({});
  const [originalId, setOriginalId] = useState<string | null>(null);

  useEffect(() => {
    void fetchRegistry();
  }, [fetchRegistry]);

  const sortedClients = useMemo(() => {
    return [...registryClients].sort((a, b) => a.title.localeCompare(b.title));
  }, [registryClients]);

  const resetEditor = () => {
    setEditor(null);
    setErrors({});
    setOriginalId(null);
  };

  const handleAdd = () => {
    setEditor(createEmptyEditorState());
    setErrors({});
    setOriginalId(null);
  };

  const handleEdit = (client: ServiceClient) => {
    setEditor({
      id: client.id,
      title: client.title,
      category: client.category,
      adapterId: client.adapterId,
      icon: client.icon ?? "",
      urlText: client.urlPatterns.join("\n"),
      enabled: client.enabled,
      metaText: client.meta ? JSON.stringify(client.meta, null, 2) : ""
    });
    setErrors({});
    setOriginalId(client.id);
  };

  const validate = (state: EditorState, originalId?: string): { client?: ServiceClient; hasErrors: boolean } => {
    const nextErrors: EditorErrors = {};
    const trimmedId = state.id.trim();
    if (!trimmedId) {
      nextErrors.id = "ID is required";
    } else if (
      trimmedId !== originalId &&
      registryClients.some((client) => client.id === trimmedId)
    ) {
      nextErrors.id = "Client with this ID already exists";
    }

    const trimmedTitle = state.title.trim();
    if (!trimmedTitle) {
      nextErrors.title = "Title is required";
    }

    if (!serviceCategories.includes(state.category as any)) {
      nextErrors.category = "Select a valid category";
    }

    const trimmedAdapter = state.adapterId.trim();
    if (!trimmedAdapter) {
      nextErrors.adapterId = "Adapter ID is required";
    }

    const patterns = parseUrlPatterns(state.urlText);
    if (!patterns.length) {
      nextErrors.urlText = "Provide at least one URL pattern";
    }

    let meta: Record<string, unknown> | undefined;
    if (state.metaText.trim()) {
      try {
        meta = parseMeta(state.metaText);
      } catch (error) {
        nextErrors.metaText = error instanceof Error ? error.message : String(error);
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return { hasErrors: true };
    }

    const client: ServiceClient = {
      id: trimmedId,
      title: trimmedTitle,
      category: state.category as ServiceClient["category"],
      adapterId: trimmedAdapter,
      icon: state.icon.trim() || undefined,
      enabled: state.enabled,
      urlPatterns: patterns,
      meta
    };

    return { client, hasErrors: false };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) {
      return;
    }
    const originalId = registryClients.find((client) => client.id === editor.id)?.id;
    const validation = validate(editor, originalId ?? undefined);
    if (validation.hasErrors || !validation.client) {
      return;
    }

    const targetId = originalId ?? editor.id;
    const nextClients = registryClients
      .filter((client) => client.id !== targetId)
      .concat(validation.client)
      .sort((a, b) => a.title.localeCompare(b.title));

    const success = await saveRegistry(buildRegistryPayload(nextClients));
    if (success) {
      resetEditor();
    }
  };

  const handleDelete = async (client: ServiceClient) => {
    if (!window.confirm(`Delete client "${client.title}"?`)) {
      return;
    }
    const nextClients = registryClients.filter((item) => item.id !== client.id);
    const success = await saveRegistry(buildRegistryPayload(nextClients));
    if (success && editor?.id === client.id) {
      resetEditor();
    }
  };

  return (
    <div className="settings-clients">
      <header className="settings-clients__header">
        <div>
          <h2>Service Registry</h2>
          <p>Manage assistant integrations and their sidebar visibility.</p>
        </div>
        <button type="button" className="pill-btn" onClick={handleAdd} disabled={registryLoading}>
          Add Client
        </button>
      </header>
      {registryError && <div className="settings-error">{registryError}</div>}
      <div className="settings-clients__body">
        <section className="settings-clients__list">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Adapter</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sortedClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.title}</td>
                  <td>{client.category}</td>
                  <td>{client.adapterId}</td>
                  <td>{client.enabled ? "Enabled" : "Disabled"}</td>
                  <td className="settings-clients__actions">
                    <button type="button" className="pill-btn ghost" onClick={() => handleEdit(client)}>
                      Edit
                    </button>
                    <button type="button" className="pill-btn danger" onClick={() => handleDelete(client)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!sortedClients.length && (
                <tr>
                  <td colSpan={5} className="settings-empty">
                    {registryLoading ? "Loading clients..." : "No clients configured"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        <section className="settings-clients__editor">
          {editor ? (
            <form onSubmit={handleSubmit} className="settings-editor-form">
              <h3>{registryClients.some((client) => client.id === editor.id) ? "Edit Client" : "New Client"}</h3>
              <label>
                ID
                <input
                  type="text"
                  value={editor.id}
                  onChange={(event) => setEditor({ ...editor, id: event.target.value })}
                  required
                />
                {errors.id && <span className="settings-error-inline">{errors.id}</span>}
              </label>
              <label>
                Title
                <input
                  type="text"
                  value={editor.title}
                  onChange={(event) => setEditor({ ...editor, title: event.target.value })}
                  required
                />
                {errors.title && <span className="settings-error-inline">{errors.title}</span>}
              </label>
              <label>
                Category
                <select
                  value={editor.category}
                  onChange={(event) => setEditor({ ...editor, category: event.target.value })}
                >
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="settings-error-inline">{errors.category}</span>}
              </label>
              <label>
                Adapter ID
                <input
                  type="text"
                  value={editor.adapterId}
                  onChange={(event) => setEditor({ ...editor, adapterId: event.target.value })}
                  required
                />
                {errors.adapterId && <span className="settings-error-inline">{errors.adapterId}</span>}
              </label>
              <label>
                Icon (optional)
                <input
                  type="text"
                  value={editor.icon}
                  onChange={(event) => setEditor({ ...editor, icon: event.target.value })}
                />
              </label>
              <label>
                URL patterns
                <textarea
                  value={editor.urlText}
                  onChange={(event) => setEditor({ ...editor, urlText: event.target.value })}
                  placeholder="https://example.com/*"
                  rows={4}
                  required
                />
                {errors.urlText && <span className="settings-error-inline">{errors.urlText}</span>}
              </label>
              <label className="settings-checkbox">
                <input
                  type="checkbox"
                  checked={editor.enabled}
                  onChange={(event) => setEditor({ ...editor, enabled: event.target.checked })}
                />
                Enabled
              </label>
              <label>
                Meta (JSON, optional)
                <textarea
                  value={editor.metaText}
                  onChange={(event) => setEditor({ ...editor, metaText: event.target.value })}
                  placeholder={`{
  "key": "value"
}`}
                  rows={4}
                />
                {errors.metaText && <span className="settings-error-inline">{errors.metaText}</span>}
              </label>
              <div className="settings-editor-actions">
                <button type="button" className="pill-btn ghost" onClick={resetEditor}>
                  Cancel
                </button>
                <button type="submit" className="pill-btn" disabled={registryLoading}>
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="settings-editor-placeholder">
              <p>Select a client to edit or click "Add Client".</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClientsAndCategories;
