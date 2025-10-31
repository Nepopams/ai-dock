export interface TemplateVariableMeta {
  name: string;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  varsMeta?: TemplateVariableMeta[];
}

export type PromptHistoryAction = "insert" | "insert_send";

export interface PromptHistoryEntry {
  id: string;
  templateId?: string;
  title: string;
  renderedPreview: string;
  targetTabIds: string[];
  action: PromptHistoryAction;
  at: string;
}

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const isTemplateVariableMeta = (value: unknown): value is TemplateVariableMeta => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as TemplateVariableMeta;
  return typeof candidate.name === "string" && (!candidate.defaultValue || typeof candidate.defaultValue === "string");
};

export const isPromptTemplate = (value: unknown): value is PromptTemplate => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as PromptTemplate;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.body === "string" &&
    isStringArray(candidate.tags || []) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    (candidate.varsMeta === undefined ||
      (Array.isArray(candidate.varsMeta) && candidate.varsMeta.every(isTemplateVariableMeta)))
  );
};

export const isPromptHistoryEntry = (value: unknown): value is PromptHistoryEntry => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as PromptHistoryEntry;
  const templateIdValid =
    candidate.templateId === undefined || candidate.templateId === null || typeof candidate.templateId === "string";
  return (
    typeof candidate.id === "string" &&
    templateIdValid &&
    typeof candidate.title === "string" &&
    typeof candidate.renderedPreview === "string" &&
    isStringArray(candidate.targetTabIds) &&
    (candidate.action === "insert" || candidate.action === "insert_send") &&
    typeof candidate.at === "string"
  );
};
