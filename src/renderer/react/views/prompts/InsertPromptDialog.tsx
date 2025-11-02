import { useEffect, useMemo, useState } from "react";
import { PromptTemplate } from "../../../../shared/types/templates";
import { renderTemplate, extractVariables } from "../../../../shared/utils/templateVars";
import { TabMeta } from "../../store/useDockStore";

interface InsertPromptDialogProps {
  open: boolean;
  templates: PromptTemplate[];
  tabs: TabMeta[];
  defaultTabIds: string[];
  onSubmit: (payload: {
    template: PromptTemplate;
    values: Record<string, string>;
    targetTabIds: string[];
    send: boolean;
  }) => Promise<void>;
  onClose: () => void;
}

const dedupeVariables = (template: PromptTemplate): Array<{ name: string; defaultValue?: string }> => {
  const declared = Array.isArray(template.varsMeta) ? template.varsMeta : [];
  const extracted = extractVariables(template.body);
  const map = new Map<string, { name: string; defaultValue?: string }>();
  [...declared, ...extracted].forEach((entry) => {
    if (!map.has(entry.name)) {
      map.set(entry.name, entry);
    }
  });
  return Array.from(map.values());
};

const buildInitialValues = (template: PromptTemplate): Record<string, string> => {
  const variables = dedupeVariables(template);
  return variables.reduce<Record<string, string>>((acc, variable) => {
    if (variable.defaultValue !== undefined) {
      acc[variable.name] = variable.defaultValue;
    } else {
      acc[variable.name] = "";
    }
    return acc;
  }, {});
};

const sortTemplates = (templates: PromptTemplate[]) => {
  return [...templates].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

const InsertPromptDialog = ({
  open,
  templates,
  tabs,
  defaultTabIds,
  onSubmit,
  onClose
}: InsertPromptDialogProps) => {
  const sortedTemplates = useMemo(() => sortTemplates(templates), [templates]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [selectedTabIds, setSelectedTabIds] = useState<string[]>(defaultTabIds);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (sortedTemplates.length === 0) {
      setSelectedTemplateId("");
      setVariableValues({});
      return;
    }
    const nextTemplateId = selectedTemplateId && sortedTemplates.some((tpl) => tpl.id === selectedTemplateId)
      ? selectedTemplateId
      : sortedTemplates[0].id;
    setSelectedTemplateId(nextTemplateId);
    const template = sortedTemplates.find((tpl) => tpl.id === nextTemplateId);
    if (template) {
      setVariableValues(buildInitialValues(template));
    }
  }, [open, sortedTemplates, selectedTemplateId]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!selectedTabIds.length && defaultTabIds.length) {
      setSelectedTabIds(defaultTabIds);
    }
  }, [open, defaultTabIds, selectedTabIds.length]);

  const selectedTemplate = useMemo(() => {
    return sortedTemplates.find((template) => template.id === selectedTemplateId) ?? null;
  }, [selectedTemplateId, sortedTemplates]);

  const variables = useMemo(() => {
    return selectedTemplate ? dedupeVariables(selectedTemplate) : [];
  }, [selectedTemplate]);

  const renderedPreview = useMemo(() => {
    if (!selectedTemplate) {
      return "";
    }
    try {
      return renderTemplate(selectedTemplate.body, variableValues);
    } catch (error) {
      console.warn("[prompt-template] render failed", error);
      return selectedTemplate.body;
    }
  }, [selectedTemplate, variableValues]);

  const toggleTab = (tabId: string) => {
    setSelectedTabIds((current) => {
      if (current.includes(tabId)) {
        return current.filter((id) => id !== tabId);
      }
      return [...current, tabId];
    });
  };

  const handleSubmit = async (send: boolean) => {
    if (!selectedTemplate) {
      return;
    }
    const targetIds = selectedTabIds.length ? selectedTabIds : defaultTabIds;
    if (!targetIds.length) {
      alert("Нет выбранных вкладок для вставки");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        template: selectedTemplate,
        values: variableValues,
        targetTabIds: targetIds,
        send
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-100">Insert Prompt</h2>
          <button
            className="rounded px-3 py-1 text-sm text-slate-400 hover:text-slate-100"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        {sortedTemplates.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">
            Нет шаблонов. Создайте шаблон на странице Prompt Templates.
          </div>
        ) : (
          <>
            <div className="grid gap-6 border-b border-slate-800 px-6 py-4 md:grid-cols-[280px_1fr]">
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    Template
                  </span>
                  <select
                    className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
                    value={selectedTemplateId}
                    onChange={(event) => {
                      const nextId = event.target.value;
                      setSelectedTemplateId(nextId);
                      const template = sortedTemplates.find((tpl) => tpl.id === nextId);
                      if (template) {
                        setVariableValues(buildInitialValues(template));
                      }
                    }}
                  >
                    {sortedTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <span className="block text-xs uppercase tracking-wide text-slate-500">
                    Target tabs
                  </span>
                  <div className="mt-2 flex max-h-44 flex-col gap-2 overflow-y-auto rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
                    {tabs.length === 0 ? (
                      <span className="text-xs text-slate-500">Нет открытых вкладок</span>
                    ) : (
                      tabs.map((tab) => (
                        <label key={tab.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="accent-sky-500"
                            checked={selectedTabIds.includes(tab.id)}
                            onChange={() => toggleTab(tab.id)}
                          />
                          <span className="text-slate-200">{tab.title || tab.id}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Если ничего не выбрать, будут использованы вкладки из основного выбора.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {variables.length > 0 && (
                  <div className="rounded border border-slate-800 bg-slate-900/50 p-4">
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Variables
                    </span>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {variables.map((variable) => (
                        <label key={variable.name} className="flex flex-col gap-1 text-xs text-slate-200">
                          <span className="font-medium text-slate-300">
                            {variable.name}
                          </span>
                          <input
                            type="text"
                            className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
                            value={variableValues[variable.name] ?? ""}
                            onChange={(event) =>
                              setVariableValues((current) => ({
                                ...current,
                                [variable.name]: event.target.value
                              }))
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex-1 rounded border border-slate-800 bg-slate-900/40 p-4">
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    Preview
                  </span>
                  <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words rounded bg-slate-950/60 p-3 text-sm text-slate-100">
                    {renderedPreview || " "}
                  </pre>
                </div>
              </div>
            </div>
            <footer className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-slate-500">
                Последнее обновление шаблона:{" "}
                {selectedTemplate
                  ? new Date(selectedTemplate.updatedAt).toLocaleString()
                  : "—"}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || !selectedTemplate}
                >
                  Insert
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting || !selectedTemplate}
                >
                  Insert + Send
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default InsertPromptDialog;
