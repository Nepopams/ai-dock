const isObject = (value) => typeof value === "object" && value !== null;

const isRecordOfStrings = (input) => {
  if (!isObject(input)) {
    return false;
  }
  return Object.entries(input).every(
    ([key, val]) => typeof key === "string" && typeof val === "string"
  );
};

const isFormField = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.label !== "string"
  ) {
    return false;
  }

  const type = value.type;
  switch (type) {
    case "text":
      return value.multiline === undefined || value.multiline === false;
    case "textarea":
      return value.multiline === true;
    case "number":
      return true;
    case "select":
      return (
        Array.isArray(value.options) &&
        value.options.every(
          (option) =>
            isObject(option) &&
            typeof option.value === "string" &&
            typeof option.label === "string"
        )
      );
    case "checkbox":
      return true;
    case "file":
      return true;
    default:
      return false;
  }
};

const isFormSchema = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (typeof value.id !== "string" || typeof value.title !== "string") {
    return false;
  }
  if (!Array.isArray(value.fields)) {
    return false;
  }
  return value.fields.every((field) => isFormField(field));
};

const isRequestTemplate = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (typeof value.path !== "string" || typeof value.method !== "string") {
    return false;
  }
  if (value.query && !isRecordOfStrings(value.query)) {
    return false;
  }
  if (value.headers && !isRecordOfStrings(value.headers)) {
    return false;
  }
  if (
    value.bodyKind &&
    !["json", "form", "multipart", "none"].includes(value.bodyKind)
  ) {
    return false;
  }
  return true;
};

const isFormProfile = (value) => {
  if (!isObject(value)) {
    return false;
  }
  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    typeof value.baseUrl !== "string" ||
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string"
  ) {
    return false;
  }
  if (!isRequestTemplate(value.template)) {
    return false;
  }
  if (!isFormSchema(value.schema)) {
    return false;
  }
  if (
    value.stream &&
    !["none", "sse", "ndjson"].includes(value.stream)
  ) {
    return false;
  }
  if (value.auth) {
    if (!isObject(value.auth)) {
      return false;
    }
    if (
      "apiKeyRef" in value.auth &&
      value.auth.apiKeyRef !== undefined &&
      typeof value.auth.apiKeyRef !== "string"
    ) {
      return false;
    }
  }
  return true;
};

module.exports = {
  isFormField,
  isFormSchema,
  isRequestTemplate,
  isFormProfile
};
