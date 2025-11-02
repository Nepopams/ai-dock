module.exports = function registerMediaPresets({
  contextBridge,
  safeInvoke,
  validateString,
  ensureRequestId,
  IPC
}) {
  const clonePlainObject = (value) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    return JSON.parse(JSON.stringify(value));
  };

  const sanitizeMediaPresetParams = (params) => {
    if (!params || typeof params !== "object") {
      return undefined;
    }
    const sanitized = {};
    if (typeof params.aspect === "string" && params.aspect.trim()) {
      sanitized.aspect = params.aspect.trim();
    }
    if (params.steps !== undefined) {
      const numeric = Number(params.steps);
      if (Number.isFinite(numeric)) {
        sanitized.steps = numeric;
      }
    }
    if (params.guidance !== undefined) {
      const numeric = Number(params.guidance);
      if (Number.isFinite(numeric)) {
        sanitized.guidance = numeric;
      }
    }
    if (params.seed !== undefined) {
      const numeric = Number(params.seed);
      if (Number.isFinite(numeric)) {
        sanitized.seed = numeric;
      } else if (typeof params.seed === "string" && params.seed.trim()) {
        sanitized.seed = params.seed.trim();
      }
    }
    if (params.extras && typeof params.extras === "object" && !Array.isArray(params.extras)) {
      sanitized.extras = clonePlainObject(params.extras);
    }
    return Object.keys(sanitized).length ? sanitized : undefined;
  };

  const sanitizeMediaPreset = (preset, index = 0) => {
    if (!preset || typeof preset !== "object") {
      throw new Error(`preset at index ${index} must be an object`);
    }
    const id =
      typeof preset.id === "string" && preset.id.trim()
        ? preset.id.trim()
        : ensureRequestId(preset.id);
    const title = validateString(preset.title, `preset[${id}].title`);
    const kind = preset.kind === "video" ? "video" : "image";
    const prompt = validateString(preset.prompt, `preset[${id}].prompt`);
    const negativePrompt =
      typeof preset.negativePrompt === "string" && preset.negativePrompt.trim()
        ? preset.negativePrompt.trim()
        : undefined;
    const params = sanitizeMediaPresetParams(preset.params);
    const tags = Array.isArray(preset.tags)
      ? preset.tags
          .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
          .filter(Boolean)
      : [];
    const boundClients = Array.isArray(preset.boundClients)
      ? preset.boundClients
          .map((client) => (typeof client === "string" ? client.trim() : ""))
          .filter(Boolean)
      : undefined;
    const createdAt =
      typeof preset.createdAt === "string" && preset.createdAt.trim()
        ? preset.createdAt.trim()
        : new Date().toISOString();
    const updatedAt =
      typeof preset.updatedAt === "string" && preset.updatedAt.trim()
        ? preset.updatedAt.trim()
        : new Date().toISOString();
    return {
      id,
      title,
      kind,
      prompt,
      negativePrompt,
      params,
      tags,
      boundClients,
      createdAt,
      updatedAt
    };
  };

  const sanitizeMediaPresetArray = (payload) => {
    if (!Array.isArray(payload)) {
      throw new Error("mediaPresets payload must be an array");
    }
    return payload.map((entry, index) => sanitizeMediaPreset(entry, index));
  };

  const sanitizeMediaPresetsImportOptions = (options) => {
    if (!options || typeof options !== "object") {
      return {};
    }
    const payload = {};
    if (typeof options.filePath === "string" && options.filePath.trim()) {
      payload.filePath = options.filePath.trim();
    }
    if (typeof options.mergeById === "boolean") {
      payload.mergeById = options.mergeById;
    }
    if (
      typeof options.duplicateStrategy === "string" &&
      (options.duplicateStrategy === "overwrite" || options.duplicateStrategy === "copy")
    ) {
      payload.duplicateStrategy = options.duplicateStrategy;
    }
    return payload;
  };

  contextBridge.exposeInMainWorld("mediaPresets", {
    list: () => safeInvoke(IPC.LIST),
    save: (presets) => {
      const sanitized = sanitizeMediaPresetArray(presets);
      return safeInvoke(IPC.SAVE, sanitized);
    },
    export: (filePath) => {
      const payload =
        typeof filePath === "string" && filePath.trim() ? { filePath: filePath.trim() } : undefined;
      return safeInvoke(IPC.EXPORT, payload);
    },
    import: (options) => safeInvoke(IPC.IMPORT, sanitizeMediaPresetsImportOptions(options))
  });
};
