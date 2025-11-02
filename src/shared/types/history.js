const isObject = (value) => typeof value === "object" && value !== null;

const isString = (value) => typeof value === "string";

const isMessageRole = (value) => value === "user" || value === "assistant";

const isMessage = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.id) || !isString(value.threadId) || !isString(value.agentId)) {
    return false;
  }
  if (!isMessageRole(value.role)) {
    return false;
  }
  if (!isString(value.text) || !isString(value.ts)) {
    return false;
  }
  if (value.source) {
    if (!isObject(value.source) || !isString(value.source.clientId)) {
      return false;
    }
    if (value.source.url !== undefined && !isString(value.source.url)) {
      return false;
    }
  }
  if (value.meta !== undefined && !isObject(value.meta)) {
    return false;
  }
  return true;
};

const isThread = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.id) || !isString(value.createdAt)) {
    return false;
  }
  if (value.title !== undefined && !isString(value.title)) {
    return false;
  }
  if (value.tags !== undefined) {
    if (!Array.isArray(value.tags) || value.tags.some((tag) => !isString(tag))) {
      return false;
    }
  }
  return true;
};

module.exports = {
  isMessage,
  isThread
};
