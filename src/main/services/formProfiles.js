const { app } = require("electron");
const { randomUUID } = require("crypto");
const path = require("path");
const fs = require("fs/promises");
const {
  isFormField,
  isFormProfile,
  isFormSchema
} = require("../../shared/types/form.js");

const STORAGE_FILE = "form-profiles.json";
const VERSION = 1;

const getFormProfilesPath = () =>
  path.join(app.getPath("userData"), STORAGE_FILE);

const makeDefaults = () => {
  const now = new Date().toISOString();
  const defaults = [
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
    .filter(Boolean);
};

const loadFormProfiles = async () => {
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
        .filter(Boolean)
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

const saveFormProfiles = async (updater) => {
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

const upsertProfile = async (profile) => {
  let savedProfile = null;
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

const deleteProfile = async (id) => {
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

const duplicateProfile = async (id) => {
  let duplicated = null;
  await saveFormProfiles((current) => {
    const source = current.find((profile) => profile.id === id);
    if (!source) {
      throw new Error(`Profile "${id}" not found`);
    }
    const now = new Date().toISOString();
    const copyLabel = source.label.endsWith(" (copy)")
      ? `${source.label}`
      : `${source.label} (copy)`;
    const candidate = {
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

const readPayload = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === VERSION && Array.isArray(parsed.profiles)) {
      return parsed;
    }
    return null;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    console.warn("[formProfiles] failed to read storage", error);
    return null;
  }
};

const writeProfiles = async (filePath, profiles, updatedAt) => {
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

const sanitizeProfileArray = (profiles, options) =>
  profiles
    .map((profile) =>
      normalizeProfile(profile, {
        now: options.now,
        mode: options.mode,
        existing: options.existingById.get(profile.id)
      })
    )
    .filter(Boolean);

const normalizeProfile = (value, options) => {
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
      ? coalesceIso(cloned.createdAt, options.existing && options.existing.createdAt, options.now)
      : coalesceIso(
          options.existing && options.existing.createdAt,
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

const normalizeTemplate = (template) => {
  if (!template) {
    return null;
  }

  const method = sanitizeMethod(template.method);
  if (!method) {
    return null;
  }

  const pathValue =
    typeof template.path === "string" ? template.path.trim() : "";
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

const sanitizeBodyKind = (kind) => {
  if (kind === undefined) {
    return undefined;
  }
  return ["json", "form", "multipart", "none"].includes(String(kind))
    ? kind
    : "json";
};

const sanitizeMethod = (method) => {
  const normalized =
    typeof method === "string" ? method.trim().toUpperCase() : "";
  const allowed = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  return allowed.includes(normalized) ? normalized : null;
};

const sanitizeRecord = (record) => {
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

const normalizeSchema = (schema, fallbackTitle) => {
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

const sanitizeFields = (fields) => {
  const seen = new Set();
  const result = [];

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

const normalizeStream = (stream) => {
  const value = typeof stream === "string" ? stream.trim() : "";
  return value === "sse" || value === "ndjson" ? value : "none";
};

const normalizeAuth = (auth) => {
  if (!auth || typeof auth !== "object") {
    return undefined;
  }
  const apiKeyRef =
    typeof auth.apiKeyRef === "string" && auth.apiKeyRef.trim()
      ? auth.apiKeyRef.trim()
      : undefined;
  return apiKeyRef ? { apiKeyRef } : undefined;
};

const normalizeMeta = (meta) => {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return undefined;
  }
  return { ...meta };
};

const cloneProfile = (profile) =>
  JSON.parse(JSON.stringify(profile));

const cloneProfiles = (profiles) =>
  profiles.map((profile) => cloneProfile(profile));

const cloneUnknown = (value) =>
  value === undefined ? value : JSON.parse(JSON.stringify(value));

const sanitizeId = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
};

const sanitizeLabel = (value, fallback) => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
};

const sanitizeUrl = (value) => {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/\/+$/, "");
};

const isIsoString = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  const date = Date.parse(value);
  return !Number.isNaN(date);
};

const coalesceIso = (...values) => {
  for (const value of values) {
    if (value && isIsoString(value)) {
      return value;
    }
  }
  return new Date().toISOString();
};

const logInvalid = (value, reason) => {
  const id =
    (value &&
      typeof value === "object" &&
      "id" in value &&
      typeof value.id === "string" &&
      value.id) ||
    "<unknown>";
  console.warn(`[formProfiles] skipped profile "${id}": ${reason}`);
};

module.exports = {
  getFormProfilesPath,
  loadFormProfiles,
  saveFormProfiles,
  upsertProfile,
  deleteProfile,
  duplicateProfile,
  makeDefaults
};
