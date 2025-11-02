import { StateCreator } from "zustand";
import {
  TemplatesListResponse,
  TemplatesSaveResponse,
  TemplatesExportResponse,
  TemplatesImportResponse
} from "../../shared/ipc/templates.ipc";
import { PromptTemplate } from "../../shared/types/templates";

export interface TemplatesSlice {
  templates: PromptTemplate[];
  templatesLoading: boolean;
  templatesError: string | null;
}

export interface TemplatesSliceActions {
  fetchTemplates: () => Promise<void>;
  upsertTemplate: (template: PromptTemplate) => Promise<boolean>;
  removeTemplate: (templateId: string) => Promise<boolean>;
  saveTemplates: (templates: PromptTemplate[]) => Promise<boolean>;
  exportTemplates: () => Promise<string | null>;
  importTemplates: () => Promise<number | null>;
  searchTemplates: (query: string) => PromptTemplate[];
  filterTemplatesByTag: (tag: string) => PromptTemplate[];
}

const getTemplatesApi = () => window.templates;

const sortTemplates = (items: PromptTemplate[]): PromptTemplate[] => {
  return [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

const mapToPromptItems = (templates: PromptTemplate[]) => {
  return templates.map((template) => ({
    id: template.id,
    title: template.title,
    body: template.body,
    updatedAt: template.updatedAt
  }));
};

export const createTemplatesSlice = <
  T extends TemplatesSlice & { actions: TemplatesSliceActions }
>(
  set: StateCreator<T>["setState"],
  get: () => T
) => {
  const setState = (partial: Partial<TemplatesSlice>) => {
    set(partial as Partial<T>);
  };

  const getState = (): TemplatesSlice & { actions: TemplatesSliceActions } => {
    return get() as unknown as TemplatesSlice & { actions: TemplatesSliceActions };
  };

  const fetchTemplates = async () => {
    const api = getTemplatesApi();
    if (!api?.list) {
      setState({
        templatesLoading: false,
        templatesError: "Templates API unavailable"
      });
      return;
    }
    setState({ templatesLoading: true, templatesError: null });
    try {
      const response: TemplatesListResponse = await api.list();
      if (!response || response.ok === false || !Array.isArray(response.data)) {
        setState({
          templatesLoading: false,
          templatesError: response?.error || "Failed to load templates"
        });
        return;
      }
      const sorted = sortTemplates(response.data);
      set((state) => ({
        templates: sorted,
        templatesLoading: false,
        templatesError: null,
        prompts: mapToPromptItems(sorted)
      }) as Partial<T>);
    } catch (error) {
      setState({
        templatesLoading: false,
        templatesError: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const persistTemplates = async (templates: PromptTemplate[]): Promise<boolean> => {
    const api = getTemplatesApi();
    if (!api?.save) {
      setState({ templatesError: "Templates API unavailable" });
      return false;
    }
    try {
      const response: TemplatesSaveResponse = await api.save({ templates });
      if (!response || response.ok === false) {
        setState({ templatesError: response?.error || "Failed to save templates" });
        return false;
      }
      const sorted = sortTemplates(templates);
      set((state) => ({
        templates: sorted,
        templatesError: null,
        prompts: mapToPromptItems(sorted)
      }) as Partial<T>);
      return true;
    } catch (error) {
      setState({ templatesError: error instanceof Error ? error.message : String(error) });
      return false;
    }
  };

  const upsertTemplate = async (template: PromptTemplate): Promise<boolean> => {
    const current = getState().templates;
    const next = [...current];
    const index = next.findIndex((item) => item.id === template.id);
    if (index >= 0) {
      next[index] = template;
    } else {
      next.push(template);
    }
    return persistTemplates(next);
  };

  const removeTemplate = async (templateId: string): Promise<boolean> => {
    const current = getState().templates;
    const filtered = current.filter((item) => item.id !== templateId);
    return persistTemplates(filtered);
  };

  const saveTemplates = async (templates: PromptTemplate[]): Promise<boolean> => {
    return persistTemplates(templates);
  };

  const exportTemplates = async (): Promise<string | null> => {
    const api = getTemplatesApi();
    if (!api?.export) {
      setState({ templatesError: "Templates API unavailable" });
      return null;
    }
    try {
      const response: TemplatesExportResponse = await api.export();
      if (!response || response.ok === false) {
        setState({ templatesError: response?.error || "Failed to export templates" });
        return null;
      }
      return response.path || null;
    } catch (error) {
      setState({ templatesError: error instanceof Error ? error.message : String(error) });
      return null;
    }
  };

  const importTemplates = async (): Promise<number | null> => {
    const api = getTemplatesApi();
    if (!api?.import) {
      setState({ templatesError: "Templates API unavailable" });
      return null;
    }
    try {
      const response: TemplatesImportResponse = await api.import();
      if (!response || response.ok === false) {
        setState({ templatesError: response?.error || "Failed to import templates" });
        return null;
      }
      await fetchTemplates();
      return typeof response.count === "number" ? response.count : null;
    } catch (error) {
      setState({ templatesError: error instanceof Error ? error.message : String(error) });
      return null;
    }
  };

  const searchTemplates = (query: string): PromptTemplate[] => {
    const term = (query || "").trim().toLowerCase();
    if (!term) {
      return getState().templates;
    }
    return getState().templates.filter((template) => {
      return (
        template.title.toLowerCase().includes(term) ||
        template.body.toLowerCase().includes(term) ||
        template.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  };

  const filterTemplatesByTag = (tag: string): PromptTemplate[] => {
    const target = (tag || "").trim().toLowerCase();
    if (!target) {
      return getState().templates;
    }
    return getState().templates.filter((template) =>
      template.tags.some((candidate) => candidate.toLowerCase() === target)
    );
  };

  return {
    state: {
      templates: [],
      templatesLoading: false,
      templatesError: null
    } as TemplatesSlice,
    actions: {
      fetchTemplates,
      upsertTemplate,
      removeTemplate,
      saveTemplates,
      exportTemplates,
      importTemplates,
      searchTemplates,
      filterTemplatesByTag
    } as TemplatesSliceActions
  };
};
