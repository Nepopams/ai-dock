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
    <div className="insert-prompt-overlay">
      <div className="insert-prompt-dialog">
        <header className="insert-prompt-header">
          <h2>Insert Prompt</h2>
          <button
            className="insert-prompt-close"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        {sortedTemplates.length === 0 ? (
          <div className="insert-prompt-empty">
            Нет шаблонов. Создайте шаблон на странице Prompt Templates.
          </div>
        ) : (
          <>
            <div className="insert-prompt-body">
              <div className="insert-prompt-sidebar">
                <label className="insert-prompt-field">
                  <span>
                    Template
                  </span>
                  <select
                    className="insert-prompt-input"
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
                <div className="insert-prompt-field">
                  <span>
                    Target tabs
                  </span>
                  <div className="insert-prompt-tabs-list">
                    {tabs.length === 0 ? (
                      <span className="text-xs text-slate-500">Нет открытых вкладок</span>
                    ) : (
                      tabs.map((tab) => (
                        <label key={tab.id} className="insert-prompt-tab-option">
                          <input
                            type="checkbox"
                            className="insert-prompt-checkbox"
                            checked={selectedTabIds.includes(tab.id)}
                            onChange={() => toggleTab(tab.id)}
                          />
                          <span>{tab.title || tab.id}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="insert-prompt-hint">
                    Если ничего не выбрать, будут использованы вкладки из основного выбора.
                  </p>
                </div>
              </div>
              <div className="insert-prompt-main">
                {variables.length > 0 && (
                  <div className="insert-prompt-card">
                    <span className="insert-prompt-section-label">
                      Variables
                    </span>
                    <div className="insert-prompt-variable-grid">
                      {variables.map((variable) => (
                        <label key={variable.name} className="insert-prompt-field">
                          <span>
                            {variable.name}
                          </span>
                          <input
                            type="text"
                            className="insert-prompt-input"
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
                <div className="insert-prompt-card insert-prompt-card--preview">
                  <span className="insert-prompt-section-label">
                    Preview
                  </span>
                  <pre className="insert-prompt-preview">
                    {renderedPreview || " "}
                  </pre>
                </div>
              </div>
            </div>
            <footer className="insert-prompt-footer">
              <div className="insert-prompt-meta">
                Последнее обновление шаблона:{" "}
                {selectedTemplate
                  ? new Date(selectedTemplate.updatedAt).toLocaleString()
                  : "—"}
              </div>
              <div className="insert-prompt-actions">
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
