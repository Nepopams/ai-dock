const isObject = (value) => typeof value === "object" && value !== null;

const isString = (value) => typeof value === "string";

const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

const isKind = (value) => value === "image" || value === "video";

const isParams = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (value.aspect !== undefined && !isString(value.aspect)) {
    return false;
  }
  if (value.steps !== undefined && !isNumber(value.steps)) {
    return false;
  }
  if (value.guidance !== undefined && !isNumber(value.guidance)) {
    return false;
  }
  if (value.seed !== undefined && !(isNumber(value.seed) || isString(value.seed))) {
    return false;
  }
  if (value.extras !== undefined && !isObject(value.extras)) {
    return false;
  }
  return true;
};

const isMediaPreset = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.id) || !isString(value.title) || !isKind(value.kind) || !isString(value.prompt)) {
    return false;
  }
  if (value.negativePrompt !== undefined && !isString(value.negativePrompt)) {
    return false;
  }
  if (value.params !== undefined && !isParams(value.params)) {
    return false;
  }
  if (!Array.isArray(value.tags) || value.tags.some((tag) => !isString(tag))) {
    return false;
  }
  if (
    value.boundClients !== undefined &&
    (!Array.isArray(value.boundClients) || value.boundClients.some((item) => !isString(item)))
  ) {
    return false;
  }
  if (!isString(value.createdAt) || !isString(value.updatedAt)) {
    return false;
  }
  return true;
};

module.exports = {
  isMediaPreset
};
