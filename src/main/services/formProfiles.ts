import { app } from "electron";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import {
  BodyKind,
  FormField,
  FormProfile,
  FormSchema,
  HttpMethod,
  RequestTemplate,
  StreamMode,
  isFormField,
  isFormProfile,
  isFormSchema
} from "../../shared/types/form";

const STORAGE_FILE = "form-profiles.json";
const VERSION = 1 as const;

type PersistedPayload = {
  version: typeof VERSION;
  updatedAt: string;
  profiles: unknown;
};

export const getFormProfilesPath = (): string =>
  path.join(app.getPath("userData"), STORAGE_FILE);

export const makeDefaults = (): FormProfile[] => {
  const now = new Date().toISOString();
  const defaults: unknown[] = [
    {
      id: "echo-json",
      label: "Echo JSON",
      baseUrl: "https://httpbin.org",
      template: {
        method: "POST",
        path: "/anything/{{endpoint|forms}}",
        headers: {
          "X-AI-Dock": "forms"
        },
        bodyKind: "json",
        body: {
          prompt: "{{prompt}}",
          temperature: "{{temperature|0.7}}"
        }
      },
      stream: "none",
      schema: {
        id: "echo-json-schema",
        title: "Echo JSON",
        description: "Send a JSON payload to httpbin.org and echo it back.",
        fields: [
          {
            id: "prompt",
            name: "prompt",
            label: "Prompt",
            type: "text",
            required: true
          },
          {
            id: "endpoint",
            name: "endpoint",
            label: "Endpoint",
            type: "text",
            defaultValue: "forms"
          },
          {
            id: "temperature",
            name: "temperature",
            label: "Temperature",
            type: "number",
            defaultValue: 0.7,
            min: 0,
            max: 2,
            step: 0.1
          }
        ]
      },
      createdAt: now,
      updatedAt: now
    },
    {
      id: "echo-get",
      label: "Echo GET",
      baseUrl: "https://httpbin.org",
      template: {
        method: "GET",
        path: "/get",
        query: {
          q: "{{q}}",
          tag: "{{tag|demo}}"
        },
        bodyKind: "none"
      },
      stream: "none",
      schema: {
        id: "echo-get-schema",
        title: "Echo GET",
        fields: [
          {
            id: "q",
            name: "q",
            label: "Query",
            type: "text",
            required: true
          },
          {
            id: "tag",
            name: "tag",
            label: "Tag",
            type: "text",
            defaultValue: "demo"
          }
        ]
      },
      createdAt: now,
      updatedAt: now
    }
  ];

  return defaults
    .map((item) =>
      normalizeProfile(item, {
        now,
        mode: "load"
      })
    )
    .filter((profile): profile is FormProfile => Boolean(profile));
};

export const loadFormProfiles = async (): Promise<{
  version: typeof VERSION;
  updatedAt: string;
  profiles: FormProfile[];
}> => {
  const filePath = getFormProfilesPath();
  const currentTime = new Date().toISOString();
  const payload = await readPayload(filePath);

  if (!payload) {
    const defaults = makeDefaults();
    await writeProfiles(filePath, defaults, currentTime);
    return {
      version: VERSION,
      updatedAt: currentTime,
      profiles: defaults
    };
  }

  const originalCount = Array.isArray(payload.profiles)
    ? payload.profiles.length
    : 0;
  const normalizedProfiles = Array.isArray(payload.profiles)
    ? payload.profiles
        .map((profile) =>
          normalizeProfile(profile, {
            now: currentTime,
            mode: "load"
          })
        )
        .filter((profile): profile is FormProfile => Boolean(profile))
    : [];

  const hadInvalid = normalizedProfiles.length !== originalCount;
  const finalProfiles =
    normalizedProfiles.length > 0 ? normalizedProfiles : makeDefaults();

  const updatedAt = isIsoString(payload.updatedAt)
    ? payload.updatedAt
    : currentTime;

  if (
    finalProfiles !== normalizedProfiles ||
    hadInvalid ||
    !isIsoString(payload.updatedAt)
  ) {
    await writeProfiles(filePath, finalProfiles, updatedAt);
  }

  return {
    version: VERSION,
    updatedAt,
    profiles: finalProfiles
  };
};

export const saveFormProfiles = async (
  updater: (
    current: FormProfile[]
  ) => FormProfile[] | Promise<FormProfile[]>
): Promise<{ updatedAt: string; count: number }> => {
  const filePath = getFormProfilesPath();
  const snapshot = await loadFormProfiles();
  const inputProfiles = await updater(cloneProfiles(snapshot.profiles));
  const now = new Date().toISOString();
  const existingById = new Map(snapshot.profiles.map((p) => [p.id, p]));

  const normalized = sanitizeProfileArray(inputProfiles, {
    now,
    existingById,
    mode: "write"
  });

  const finalProfiles = normalized.length > 0 ? normalized : makeDefaults();
  const { updatedAt } = await writeProfiles(filePath, finalProfiles, now);

  return {
    updatedAt,
    count: finalProfiles.length
  };
};

export const upsertProfile = async (profile: FormProfile): Promise<FormProfile> => {
  let savedProfile: FormProfile | null = null;
  await saveFormProfiles((current) => {
    const now = new Date().toISOString();
    const existing = current.find((item) => item.id === profile.id);
    const normalized = normalizeProfile(profile, {
      now,
      mode: "write",
      existing
    });
    if (!normalized) {
      throw new Error("Invalid form profile");
    }

    savedProfile = normalized;
    if (existing) {
      return current.map((item) => (item.id === normalized.id ? normalized : item));
    }
    return [...current, normalized];
  });

  if (!savedProfile) {
    throw new Error("Failed to upsert profile");
  }

  return savedProfile;
};

export const deleteProfile = async (id: string): Promise<boolean> => {
  let removed = false;
  await saveFormProfiles((current) => {
    const filtered = current.filter((profile) => {
      if (profile.id === id) {
        removed = true;
        return false;
      }
      return true;
    });
    return filtered;
  });
  return removed;
};

export const duplicateProfile = async (id: string): Promise<FormProfile> => {
  let duplicated: FormProfile | null = null;
  await saveFormProfiles((current) => {
    const source = current.find((profile) => profile.id === id);
    if (!source) {
      throw new Error(`Profile "${id}" not found`);
    }
    const now = new Date().toISOString();
    const copyLabel = source.label.endsWith(" (copy)")
      ? `${source.label}`
      : `${source.label} (copy)`;
    const candidate: FormProfile = {
      ...cloneProfile(source),
      id: randomUUID(),
      label: copyLabel,
      createdAt: now,
      updatedAt: now
    };

    const normalized = normalizeProfile(candidate, {
      now,
      mode: "write"
    });
    if (!normalized) {
      throw new Error("Failed to duplicate profile");
    }
    duplicated = normalized;
    return [...current, normalized];
  });

  if (!duplicated) {
    throw new Error(`Unable to duplicate profile "${id}"`);
  }

  return duplicated;
};

const readPayload = async (
  filePath: string
): Promise<PersistedPayload | null> => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as PersistedPayload;
    if (parsed && parsed.version === VERSION && Array.isArray(parsed.profiles)) {
      return parsed;
    }
    return null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    console.warn("[formProfiles] failed to read storage", error);
    return null;
  }
};

const writeProfiles = async (
  filePath: string,
  profiles: FormProfile[],
  updatedAt: string
) => {
  const payload = JSON.stringify(
    {
      version: VERSION,
      updatedAt,
      profiles
    },
    null,
    2
  );
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.tmp`;
  await fs.writeFile(tempPath, `${payload}\n`, "utf8");
  await fs.rename(tempPath, filePath);
  return { updatedAt };
};

type NormalizeMode = "load" | "write";

interface NormalizeOptions {
  now: string;
  mode: NormalizeMode;
  existing?: FormProfile;
}

const sanitizeProfileArray = (
  profiles: FormProfile[],
  options: {
    now: string;
    existingById: Map<string, FormProfile>;
    mode: NormalizeMode;
  }
): FormProfile[] =>
  profiles
    .map((profile) =>
      normalizeProfile(profile, {
        now: options.now,
        mode: options.mode,
        existing: options.existingById.get(profile.id)
      })
    )
    .filter((profile): profile is FormProfile => Boolean(profile));

const normalizeProfile = (
  value: unknown,
  options: NormalizeOptions
): FormProfile | null => {
  if (!isFormProfile(value)) {
    logInvalid(value, "structure mismatch");
    return null;
  }

  const cloned = cloneProfile(value);

  const id = sanitizeId(cloned.id);
  if (!id) {
    logInvalid(value, "missing id");
    return null;
  }

  const label = sanitizeLabel(cloned.label, id);
  const baseUrl = sanitizeUrl(cloned.baseUrl);
  if (!baseUrl) {
    logInvalid(value, "invalid baseUrl");
    return null;
  }

  const template = normalizeTemplate(cloned.template);
  if (!template) {
    logInvalid(value, "invalid request template");
    return null;
  }

  const schema = normalizeSchema(cloned.schema, label);
  if (!schema) {
    logInvalid(value, "invalid form schema");
    return null;
  }

  const streamMode = normalizeStream(cloned.stream);
  const auth = normalizeAuth(cloned.auth);
  const meta = normalizeMeta(cloned.meta);

  const createdAt =
    options.mode === "load"
      ? coalesceIso(cloned.createdAt, options.existing?.createdAt, options.now)
      : coalesceIso(
          options.existing?.createdAt,
          cloned.createdAt,
          options.now
        );

  const updatedAt =
    options.mode === "load"
      ? coalesceIso(cloned.updatedAt, createdAt, options.now)
      : options.now;

  return {
    id,
    label,
    baseUrl,
    template,
    auth,
    stream: streamMode,
    schema,
    createdAt,
    updatedAt,
    meta
  };
};

const normalizeTemplate = (
  template: RequestTemplate
): RequestTemplate | null => {
  if (!template) {
    return null;
  }

  const method = sanitizeMethod(template.method);
  if (!method) {
    return null;
  }

  const pathValue = typeof template.path === "string" ? template.path.trim() : "";
  if (!pathValue) {
    return null;
  }

  const bodyKind = sanitizeBodyKind(template.bodyKind);

  return {
    method,
    path: pathValue,
    query: sanitizeRecord(template.query),
    headers: sanitizeRecord(template.headers),
    body: cloneUnknown(template.body),
    bodyKind
  };
};

const sanitizeBodyKind = (kind: unknown): BodyKind | undefined => {
  if (kind === undefined) {
    return undefined;
  }
  return ["json", "form", "multipart", "none"].includes(String(kind))
    ? (kind as BodyKind)
    : "json";
};

const sanitizeMethod = (method: unknown): HttpMethod | null => {
  const normalized =
    typeof method === "string" ? method.trim().toUpperCase() : "";
  const allowed: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  return allowed.includes(normalized as HttpMethod)
    ? (normalized as HttpMethod)
    : null;
};

const sanitizeRecord = (
  record: Record<string, string> | undefined
): Record<string, string> | undefined => {
  if (!record || typeof record !== "object") {
    return undefined;
  }
  const entries = Object.entries(record).filter(
    ([key, value]) =>
      typeof key === "string" &&
      key.trim() &&
      typeof value === "string"
  );
  if (!entries.length) {
    return undefined;
  }
  return Object.fromEntries(
    entries.map(([key, value]) => [key.trim(), value])
  );
};

const normalizeSchema = (
  schema: FormSchema,
  fallbackTitle: string
): FormSchema | null => {
  if (!isFormSchema(schema)) {
    return null;
  }

  const id = sanitizeId(schema.id) || `schema-${randomUUID()}`;
  const title =
    typeof schema.title === "string" && schema.title.trim()
      ? schema.title.trim()
      : fallbackTitle;

  const fields = sanitizeFields(schema.fields);
  if (!fields.length) {
    return null;
  }

  const description =
    typeof schema.description === "string" && schema.description.trim()
      ? schema.description.trim()
      : undefined;

  const tags = Array.isArray(schema.tags)
    ? Array.from(
        new Set(
          schema.tags
            .map((tag) =>
              typeof tag === "string" ? tag.trim() : String(tag ?? "")
            )
            .filter(Boolean)
        )
      )
    : undefined;

  return {
    id,
    title,
    fields,
    description,
    tags
  };
};

const sanitizeFields = (fields: FormField[]): FormField[] => {
  const seen = new Set<string>();
  const result: FormField[] = [];

  for (const field of fields) {
    if (!isFormField(field)) {
      continue;
    }
    const name = field.name.trim();
    if (!name || seen.has(name)) {
      continue;
    }
    seen.add(name);
    result.push({
      ...field,
      id: sanitizeId(field.id) || name,
      name,
      label: sanitizeLabel(field.label, name)
    });
  }

  return result;
};

const normalizeStream = (stream: unknown): StreamMode => {
  const value = typeof stream === "string" ? stream.trim() : "";
  return value === "sse" || value === "ndjson" ? value : "none";
};

const normalizeAuth = (
  auth: FormProfile["auth"]
): FormProfile["auth"] | undefined => {
  if (!auth || typeof auth !== "object") {
    return undefined;
  }
  const apiKeyRef =
    typeof auth.apiKeyRef === "string" && auth.apiKeyRef.trim()
      ? auth.apiKeyRef.trim()
      : undefined;
  return apiKeyRef ? { apiKeyRef } : undefined;
};

const normalizeMeta = (meta: unknown): Record<string, unknown> | undefined => {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return undefined;
  }
  return { ...meta };
};

const cloneProfile = (profile: FormProfile): FormProfile =>
  JSON.parse(JSON.stringify(profile)) as FormProfile;

const cloneProfiles = (profiles: FormProfile[]): FormProfile[] =>
  profiles.map((profile) => cloneProfile(profile));

const cloneUnknown = <T>(value: T): T =>
  value === undefined ? value : JSON.parse(JSON.stringify(value));

const sanitizeId = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
};

const sanitizeLabel = (value: unknown, fallback: string): string => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
};

const sanitizeUrl = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/\/+$/, "");
};

const isIsoString = (value: unknown): value is string => {
  if (typeof value !== "string") {
    return false;
  }
  const date = Date.parse(value);
  return !Number.isNaN(date);
};

const coalesceIso = (
  ...values: Array<string | undefined>
): string => {
  for (const value of values) {
    if (value && isIsoString(value)) {
      return value;
    }
  }
  return new Date().toISOString();
};

const logInvalid = (value: unknown, reason: string) => {
  const id =
    (typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof (value as { id?: unknown }).id === "string" &&
      (value as { id: string }).id) ||
    "<unknown>";
  console.warn(`[formProfiles] skipped profile "${id}": ${reason}`);
};

export default {
  getFormProfilesPath,
  loadFormProfiles,
  saveFormProfiles,
  upsertProfile,
  deleteProfile,
  duplicateProfile,
  makeDefaults
};
