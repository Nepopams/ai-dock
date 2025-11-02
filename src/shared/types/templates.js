const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");

const isTemplateVariableMeta = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const { name, defaultValue } = value;
  return (
    typeof name === "string" &&
    (defaultValue === undefined ||
      defaultValue === null ||
      typeof defaultValue === "string")
  );
};

const isPromptTemplate = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.body === "string" &&
    isStringArray(candidate.tags || []) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    (candidate.varsMeta === undefined ||
      (Array.isArray(candidate.varsMeta) &&
        candidate.varsMeta.every(isTemplateVariableMeta)))
  );
};

const isPromptHistoryEntry = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  const templateIdValid =
    candidate.templateId === undefined ||
    candidate.templateId === null ||
    typeof candidate.templateId === "string";
  return (
    typeof candidate.id === "string" &&
    templateIdValid &&
    typeof candidate.title === "string" &&
    typeof candidate.renderedPreview === "string" &&
    isStringArray(candidate.targetTabIds || []) &&
    (candidate.action === "insert" || candidate.action === "insert_send") &&
    typeof candidate.at === "string"
  );
};

module.exports = {
  isPromptTemplate,
  isPromptHistoryEntry
};
