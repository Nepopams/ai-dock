export type FieldBase = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  help?: string;
};

export type FieldText = FieldBase & {
  type: "text";
  defaultValue?: string;
  multiline?: false;
};

export type FieldTextarea = FieldBase & {
  type: "textarea";
  defaultValue?: string;
  multiline: true;
};

export type FieldNumber = FieldBase & {
  type: "number";
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
};

export type FieldSelectOption = {
  value: string;
  label: string;
};

export type FieldSelect = FieldBase & {
  type: "select";
  defaultValue?: string;
  options: FieldSelectOption[];
};

export type FieldCheckbox = FieldBase & {
  type: "checkbox";
  defaultValue?: boolean;
};

export type FieldFile = FieldBase & {
  type: "file";
  accept?: string;
  multiple?: boolean;
};

export type FormField =
  | FieldText
  | FieldTextarea
  | FieldNumber
  | FieldSelect
  | FieldCheckbox
  | FieldFile;

export type FormSchema = {
  id: string;
  title: string;
  fields: FormField[];
  description?: string;
  tags?: string[];
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type BodyKind = "json" | "form" | "multipart" | "none";

export type RequestTemplate = {
  path: string;
  method: HttpMethod;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
  bodyKind?: BodyKind;
};

export type StreamMode = "none" | "sse" | "ndjson";

export type AuthRef = {
  apiKeyRef?: string;
};

export type FormProfile = {
  id: string;
  label: string;
  baseUrl: string;
  template: RequestTemplate;
  auth?: AuthRef;
  stream?: StreamMode;
  schema: FormSchema;
  createdAt: string;
  updatedAt: string;
  meta?: Record<string, unknown>;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isRecordOfStrings = (input: unknown): input is Record<string, string> => {
  if (!isObject(input)) {
    return false;
  }

  return Object.entries(input).every(
    ([key, val]) => typeof key === "string" && typeof val === "string"
  );
};

export const isFormField = (value: unknown): value is FormField => {
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

  const typedValue = value as {
    type?: unknown;
    multiline?: unknown;
    options?: unknown;
  };

  switch (typedValue.type) {
    case "text":
      return (
        typedValue.multiline === undefined ||
        typedValue.multiline === false
      );
    case "textarea":
      return typedValue.multiline === true;
    case "number":
      return true;
    case "select":
      return (
        Array.isArray(typedValue.options) &&
        typedValue.options.every(
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

export const isFormSchema = (value: unknown): value is FormSchema => {
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

export const isRequestTemplate = (value: unknown): value is RequestTemplate => {
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
    value.bodyKind !== "json" &&
    value.bodyKind !== "form" &&
    value.bodyKind !== "multipart" &&
    value.bodyKind !== "none"
  ) {
    return false;
  }

  return true;
};

export const isFormProfile = (value: unknown): value is FormProfile => {
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
    value.stream !== "none" &&
    value.stream !== "sse" &&
    value.stream !== "ndjson"
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
