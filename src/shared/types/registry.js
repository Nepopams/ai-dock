const serviceCategories = ["chat", "code", "presentation", "image_video", "other"];

const isServiceCategory = (value) => typeof value === "string" && serviceCategories.includes(value);

const isServiceClient = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  if (typeof candidate.id !== "string" || !candidate.id.trim()) {
    return false;
  }
  if (typeof candidate.title !== "string" || !candidate.title.trim()) {
    return false;
  }
  if (!isServiceCategory(candidate.category)) {
    return false;
  }
  if (!Array.isArray(candidate.urlPatterns) || candidate.urlPatterns.some((pattern) => typeof pattern !== "string" || !pattern.trim())) {
    return false;
  }
  if (typeof candidate.adapterId !== "string" || !candidate.adapterId.trim()) {
    return false;
  }
  if (candidate.icon !== undefined && (typeof candidate.icon !== "string" || !candidate.icon.trim())) {
    return false;
  }
  if (typeof candidate.enabled !== "boolean") {
    return false;
  }
  if (candidate.meta !== undefined && (typeof candidate.meta !== "object" || Array.isArray(candidate.meta))) {
    return false;
  }
  return true;
};

const isRegistryFile = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  if (candidate.version !== 1) {
    return false;
  }
  if (typeof candidate.updatedAt !== "string" || !candidate.updatedAt.trim()) {
    return false;
  }
  if (!Array.isArray(candidate.clients) || candidate.clients.some((client) => !isServiceClient(client))) {
    return false;
  }
  return true;
};

module.exports = {
  serviceCategories,
  isServiceCategory,
  isServiceClient,
  isRegistryFile
};
