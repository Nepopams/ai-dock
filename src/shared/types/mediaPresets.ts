export type MediaPresetKind = "image" | "video";

export interface MediaPresetParams {
  aspect?: string;
  steps?: number;
  guidance?: number;
  seed?: number | string;
  extras?: Record<string, unknown>;
}

export interface MediaPreset {
  id: string;
  title: string;
  kind: MediaPresetKind;
  prompt: string;
  negativePrompt?: string;
  params?: MediaPresetParams;
  tags: string[];
  boundClients?: string[];
  createdAt: string;
  updatedAt: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isKind = (value: unknown): value is MediaPresetKind =>
  value === "image" || value === "video";

const isParams = (value: unknown): value is MediaPresetParams => {
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

export const isMediaPreset = (value: unknown): value is MediaPreset => {
  if (!isObject(value)) {
    return false;
  }
  if (!isString(value.id) || !isString(value.title) || !isString(value.prompt)) {
    return false;
  }
  if (!isKind(value.kind)) {
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
