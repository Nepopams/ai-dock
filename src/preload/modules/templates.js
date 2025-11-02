module.exports = function registerTemplates({
  contextBridge,
  safeInvoke,
  validateString,
  IPC
}) {
  const sanitizeTemplateVarsMeta = (varsMeta, index) => {
    if (!Array.isArray(varsMeta)) {
      return undefined;
    }
    const normalized = varsMeta
      .filter((item) => item && typeof item === "object" && typeof item.name === "string")
      .map((item, metaIndex) => {
        const name = validateString(item.name, `template[${index}].varsMeta[${metaIndex}].name`);
        const defaultValue =
          item.defaultValue === undefined || item.defaultValue === null
            ? undefined
            : String(item.defaultValue);
        return defaultValue !== undefined ? { name, defaultValue } : { name };
      });
    return normalized.length ? normalized : undefined;
  };

  const sanitizeTemplate = (template, index) => {
    if (!template || typeof template !== "object") {
      throw new Error(`template at index ${index} must be an object`);
    }
    const id = validateString(template.id, `template[${index}].id`);
    const title = validateString(template.title, `template[${index}].title`);
    const body = validateString(template.body, `template[${index}].body`);
    const createdAt = validateString(template.createdAt, `template[${index}].createdAt`);
    const updatedAt = validateString(template.updatedAt, `template[${index}].updatedAt`);
    const tags =
      Array.isArray(template.tags) && template.tags.every((tag) => typeof tag === "string")
        ? template.tags.map((tag) => tag.trim()).filter(Boolean)
        : [];
    const varsMeta = sanitizeTemplateVarsMeta(template.varsMeta, index);
    return {
      id,
      title,
      body,
      tags,
      createdAt,
      updatedAt,
      ...(varsMeta ? { varsMeta } : {})
    };
  };

  const sanitizeTemplatesPayload = (payload) => {
    const list = Array.isArray(payload?.templates) ? payload.templates : payload;
    if (!Array.isArray(list)) {
      throw new Error("templates must be an array");
    }
    return list.map((template, index) => sanitizeTemplate(template, index));
  };

  const sanitizeHistoryEntry = (entry) => {
    if (!entry || typeof entry !== "object") {
      throw new Error("history entry must be an object");
    }
    const id = validateString(entry.id, "history.id");
    const title = validateString(entry.title, "history.title");
    const renderedPreview = validateString(entry.renderedPreview, "history.renderedPreview");
    const action = entry.action === "insert_send" ? "insert_send" : "insert";
    const at = validateString(entry.at, "history.at");
    const targetTabIds = Array.isArray(entry.targetTabIds)
      ? entry.targetTabIds
          .map((value) => validateString(value, "history.targetTabIds"))
          .filter(Boolean)
      : [];
    const sanitized = {
      id,
      title,
      renderedPreview,
      targetTabIds,
      action,
      at
    };
    if (typeof entry.templateId === "string" && entry.templateId.trim()) {
      sanitized.templateId = entry.templateId.trim();
    }
    return sanitized;
  };

  contextBridge.exposeInMainWorld("templates", {
    list: () => safeInvoke(IPC.LIST),
    save: (payload) => {
      const templates = sanitizeTemplatesPayload(payload);
      return safeInvoke(IPC.SAVE, { templates });
    },
    export: () => safeInvoke(IPC.EXPORT),
    import: () => safeInvoke(IPC.IMPORT),
    history: {
      list: () => safeInvoke(IPC.HISTORY_LIST),
      append: (entry) =>
        safeInvoke(IPC.HISTORY_APPEND, { entry: sanitizeHistoryEntry(entry) }),
      clear: () => safeInvoke(IPC.HISTORY_CLEAR)
    }
  });
};
