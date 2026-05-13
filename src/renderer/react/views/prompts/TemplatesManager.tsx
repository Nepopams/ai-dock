import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDockStore } from "../../store/useDockStore";
import { PromptTemplate } from "../../../../shared/types/templates";
import { extractVariables } from "../../../../shared/utils/templateVars";

type EditorMode = "create" | "edit";

interface TemplateEditorState {
  mode: EditorMode;
  template: PromptTemplate | null;
  title: string;
  body: string;
  tagsText: string;
}

const createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const parseTags = (text: string): string[] => {
  return text
    .split(/[,\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
};

const formatTags = (tags: string[]): string => {
  return tags.join(", ");
};

const dedupeVariables = (body: string) => {
  const variables = extractVariables(body);
  const map = new Map<string, { name: string; defaultValue?: string }>();
  variables.forEach((entry) => {
    if (!map.has(entry.name)) {
      map.set(entry.name, entry);
    }
  });
  return Array.from(map.values());
};

function TemplatesManager() {
  const templates = useDockStore((state) => state.templates);
  const templatesLoading = useDockStore((state) => state.templatesLoading);
  const templatesError = useDockStore((state) => state.templatesError);
  const fetchTemplates = useDockStore((state) => state.actions.fetchTemplates);
  const upsertTemplate = useDockStore((state) => state.actions.upsertTemplate);
  const removeTemplate = useDockStore((state) => state.actions.removeTemplate);
  const exportTemplates = useDockStore((state) => state.actions.exportTemplates);
  const importTemplates = useDockStore((state) => state.actions.importTemplates);
  const showToast = useDockStore((state) => state.actions.showToast);

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [editor, setEditor] = useState<TemplateEditorState | null>(null);

  useEffect(() => {
    if (fetchTemplates) {
      void fetchTemplates();
    }
  }, [fetchTemplates]);

  const normalizedSearch = search.trim().toLowerCase();

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    templates.forEach((template) => {
      (template.tags || []).forEach((tag) => {
        if (tag) {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        !normalizedSearch ||
        template.title.toLowerCase().includes(normalizedSearch) ||
        template.body.toLowerCase().includes(normalizedSearch) ||
        (template.tags || []).some((tag) => tag.toLowerCase().includes(normalizedSearch));
      const matchesTag =
        !tagFilter ||
        (template.tags || []).some((tag) => tag.toLowerCase() === tagFilter.toLowerCase());
      return matchesSearch && matchesTag;
    });
  }, [templates, normalizedSearch, tagFilter]);

  const openEditor = (mode: EditorMode, template?: PromptTemplate) => {
    if (mode === "edit" && !template) {
      return;
    }
    setEditor({
      mode,
      template: template ?? null,
      title: template?.title ?? "",
      body: template?.body ?? "",
      tagsText: template ? formatTags(template.tags ?? []) : ""
    });
  };

  const closeEditor = () => setEditor(null);

  const handleSaveTemplate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor || !upsertTemplate) {
      return;
    }
    const title = editor.title.trim();
    const body = editor.body.trim();
    if (!title || !body) {
      showToast("Заполните название и текст шаблона");
      return;
    }
    const now = new Date().toISOString();
    const tags = parseTags(editor.tagsText);
    const varsMeta = dedupeVariables(body);

    const template: PromptTemplate = editor.template
      ? {
          ...editor.template,
          title,
          body,
          tags,
          updatedAt: now,
          ...(varsMeta.length ? { varsMeta } : { varsMeta: undefined })
        }
      : {
          id: createId(),
          title,
          body,
          tags,
          createdAt: now,
          updatedAt: now,
          ...(varsMeta.length ? { varsMeta } : {})
        };

    const saved = await upsertTemplate(template);
    if (saved) {
      showToast(editor.mode === "edit" ? "Шаблон обновлён" : "Шаблон создан");
      closeEditor();
    }
  };

  const handleDuplicate = async (template: PromptTemplate) => {
    if (!upsertTemplate) {
      return;
    }
    const now = new Date().toISOString();
    const duplicate: PromptTemplate = {
      ...template,
      id: createId(),
      title: `${template.title} Copy`,
      createdAt: now,
      updatedAt: now
    };
    await upsertTemplate(duplicate);
    showToast("Копия шаблона создана");
  };

  const handleDelete = async (template: PromptTemplate) => {
    if (!removeTemplate) {
      return;
    }
    const confirmed = window.confirm(`Удалить шаблон "${template.title}"?`);
    if (!confirmed) {
      return;
    }
    await removeTemplate(template.id);
    showToast("Шаблон удалён");
  };

  const handleExport = async () => {
    if (!exportTemplates) {
      return;
    }
    const path = await exportTemplates();
    if (path) {
      showToast(`Экспортировано в ${path}`);
    }
  };

  const handleImport = async () => {
    if (!importTemplates) {
      return;
    }
    const count = await importTemplates();
    if (typeof count === "number") {
      showToast(`Импортировано шаблонов: ${count}`);
    }
  };

  const renderVariablesHint = () => {
    const previewBody = editor?.body ?? "";
    if (!previewBody.trim()) {
      return null;
    }
    const variables = dedupeVariables(previewBody);
    if (!variables.length) {
      return (
        <p className="prompt-template-variable-hint">
          Переменные не обнаружены. Используйте синтаксис вида {"{{name}}"} или {"{{name|default}}"}.
        </p>
      );
    }
    return (
      <div className="prompt-template-variable-list">
        {variables.map((variable) => (
          <span
            key={variable.name}
            className="prompt-template-variable-chip"
          >
            {variable.name}
            {variable.defaultValue ? ` = ${variable.defaultValue}` : ""}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="prompt-templates-view">
      <header className="prompt-templates-header">
        <div className="prompt-templates-title">
          <h1>Prompt Templates</h1>
          <p>
            Создавайте, редактируйте и экспортируйте шаблоны с переменными.
          </p>
        </div>
        <div className="prompt-templates-actions">
          <button className="pill-btn ghost" onClick={handleImport}>
            Import
          </button>
          <button className="pill-btn ghost" onClick={handleExport}>
            Export
          </button>
          <button className="pill-btn" onClick={() => openEditor("create")}>
            New Template
          </button>
        </div>
      </header>
      <section className="prompt-templates-controls">
        <div className="prompt-templates-filter-row">
          <input
            type="search"
            className="prompt-templates-search"
            placeholder="Поиск по названию, тексту или тегам..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="prompt-templates-tag-filter">
            <button
              className={`prompt-templates-tag-button ${
                tagFilter === null
                  ? "prompt-templates-tag-button--active"
                  : ""
              }`}
              onClick={() => setTagFilter(null)}
            >
              All tags
            </button>
            {allTags.map((tag) => {
              const isActive = tagFilter === tag;
              return (
                <button
                  key={tag}
                  className={`prompt-templates-tag-button ${
                    isActive
                      ? "prompt-templates-tag-button--active"
                      : ""
                  }`}
                  onClick={() => setTagFilter(isActive ? null : tag)}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
        {templatesError && (
          <div className="prompt-templates-alert prompt-templates-alert--error">
            {templatesError}
          </div>
        )}
      </section>
      <div className="prompt-templates-content">
        {templatesLoading ? (
          <div className="mt-10 text-center text-sm text-slate-400">Загрузка шаблонов...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="prompt-templates-empty">
            Шаблоны не найдены. Создайте новый шаблон, чтобы начать.
          </div>
        ) : (
          <table className="prompt-templates-table">
            <thead>
              <tr>
                <th className="prompt-templates-table-title">Title</th>
                <th>Tags</th>
                <th className="prompt-templates-table-updated">Updated</th>
                <th className="prompt-templates-table-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr
                  key={template.id}
                  className="prompt-template-row"
                >
                  <td className="prompt-template-title-cell">{template.title}</td>
                  <td>
                    {(template.tags || []).length ? (
                      <div className="prompt-template-tags">
                        {template.tags?.map((tag) => (
                          <span key={tag} className="prompt-template-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Нет тегов</span>
                    )}
                  </td>
                  <td className="prompt-template-date">
                    {new Date(template.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <div className="prompt-template-row-actions">
                      <button
                        className="prompt-template-action"
                        onClick={() => openEditor("edit", template)}
                      >
                        Edit
                      </button>
                      <button
                        className="prompt-template-action"
                        onClick={() => handleDuplicate(template)}
                      >
                        Duplicate
                      </button>
                      <button
                        className="prompt-template-action prompt-template-action--danger"
                        onClick={() => handleDelete(template)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editor && (
        <div className="prompt-template-modal-overlay">
          <div className="prompt-template-modal">
            <form onSubmit={handleSaveTemplate}>
              <header className="prompt-template-modal-header">
                <h2>
                  {editor.mode === "edit" ? "Редактирование шаблона" : "Новый шаблон"}
                </h2>
                <button
                  type="button"
                  className="prompt-template-modal-close"
                  onClick={closeEditor}
                >
                  ✕
                </button>
              </header>
              <div className="prompt-template-modal-body">
                <label className="prompt-template-field">
                  <span>Title</span>
                  <input
                    type="text"
                    className="prompt-template-input"
                    value={editor.title}
                    onChange={(event) =>
                      setEditor((prev) =>
                        prev
                          ? {
                              ...prev,
                              title: event.target.value
                            }
                          : prev
                      )
                    }
                    required
                    maxLength={160}
                  />
                </label>
                <label className="prompt-template-field">
                  <span>Body</span>
                  <textarea
                    className="prompt-template-textarea prompt-template-textarea--body"
                    value={editor.body}
                    onChange={(event) =>
                      setEditor((prev) =>
                        prev
                          ? {
                              ...prev,
                              body: event.target.value
                            }
                          : prev
                      )
                    }
                    required
                  />
                  {renderVariablesHint()}
                </label>
                <label className="prompt-template-field">
                  <span>
                    Tags (через запятую)
                  </span>
                  <input
                    type="text"
                    className="prompt-template-input"
                    value={editor.tagsText}
                    onChange={(event) =>
                      setEditor((prev) =>
                        prev
                          ? {
                              ...prev,
                              tagsText: event.target.value
                            }
                          : prev
                      )
                    }
                    placeholder="research, ux, summary"
                  />
                </label>
              </div>
              <footer className="prompt-template-modal-footer">
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={closeEditor}
                >
                  Cancel
                </button>
                <button type="submit" className="pill-btn">
                  {editor.mode === "edit" ? "Save changes" : "Create template"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplatesManager;
