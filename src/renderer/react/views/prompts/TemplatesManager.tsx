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
        <p className="text-xs text-slate-400">
          Переменные не обнаружены. Используйте синтаксис вида {"{{name}}"} или {"{{name|default}}"}.
        </p>
      );
    }
    return (
      <div className="flex flex-wrap gap-2 text-xs text-slate-200">
        {variables.map((variable) => (
          <span
            key={variable.name}
            className="rounded bg-slate-700/60 px-2 py-1"
          >
            {variable.name}
            {variable.defaultValue ? ` = ${variable.defaultValue}` : ""}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Prompt Templates</h1>
          <p className="text-sm text-slate-400">
            Создавайте, редактируйте и экспортируйте шаблоны с переменными.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
      <section className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            className="w-full flex-1 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
            placeholder="Поиск по названию, тексту или тегам..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-full border px-3 py-1 text-xs ${
                tagFilter === null
                  ? "border-sky-500 bg-sky-500/10 text-sky-300"
                  : "border-slate-700 text-slate-300"
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
                  className={`rounded-full border px-3 py-1 text-xs ${
                    isActive
                      ? "border-sky-500 bg-sky-500/10 text-sky-300"
                      : "border-slate-700 text-slate-300"
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
          <div className="rounded border border-rose-500/60 bg-rose-900/20 px-4 py-3 text-sm text-rose-200">
            {templatesError}
          </div>
        )}
      </section>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {templatesLoading ? (
          <div className="mt-10 text-center text-sm text-slate-400">Загрузка шаблонов...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="mt-10 text-center text-sm text-slate-400">
            Шаблоны не найдены. Создайте новый шаблон, чтобы начать.
          </div>
        ) : (
          <table className="w-full table-fixed border-separate border-spacing-y-2 text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-1/4 px-3">Title</th>
                <th className="w-1/2 px-3">Tags</th>
                <th className="w-1/6 px-3">Updated</th>
                <th className="w-[120px] px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr
                  key={template.id}
                  className="rounded border border-slate-800 bg-slate-900/60 transition hover:border-sky-500/40"
                >
                  <td className="px-3 py-3 font-medium">{template.title}</td>
                  <td className="px-3 py-3">
                    {(template.tags || []).length ? (
                      <div className="flex flex-wrap gap-2">
                        {template.tags?.map((tag) => (
                          <span key={tag} className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Нет тегов</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-400">
                    {new Date(template.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-xs text-slate-300 underline-offset-2 hover:underline"
                        onClick={() => openEditor("edit", template)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-slate-300 underline-offset-2 hover:underline"
                        onClick={() => handleDuplicate(template)}
                      >
                        Duplicate
                      </button>
                      <button
                        className="text-xs text-rose-300 underline-offset-2 hover:underline"
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-xl">
            <form onSubmit={handleSaveTemplate}>
              <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <h2 className="text-base font-semibold">
                  {editor.mode === "edit" ? "Редактирование шаблона" : "Новый шаблон"}
                </h2>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-200"
                  onClick={closeEditor}
                >
                  ✕
                </button>
              </header>
              <div className="flex flex-col gap-4 px-5 py-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Title</span>
                  <input
                    type="text"
                    className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
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
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Body</span>
                  <textarea
                    className="h-48 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
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
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">
                    Tags (через запятую)
                  </span>
                  <input
                    type="text"
                    className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
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
              <footer className="flex items-center justify-end gap-3 border-t border-slate-800 px-5 py-4">
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
