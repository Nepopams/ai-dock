import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDockStore } from "../store/useDockStore";

interface HeaderRow {
  id: string;
  key: string;
  value: string;
}

interface UsagePathPayload {
  prompt_tokens?: string;
  completion_tokens?: string;
  total_tokens?: string;
}

interface GenericResponseSchemaPayload {
  mode: "stream" | "buffer";
  stream?: {
    framing: "sse" | "ndjson" | "lines";
    pathDelta?: string;
    pathFinish?: string;
    pathUsage?: UsagePathPayload;
  };
  buffer?: {
    pathText: string;
    pathFinish?: string;
    pathUsage?: UsagePathPayload;
  };
}

interface GenericConfigPayload {
  endpoint: string;
  method: "POST" | "GET";
  requestTemplate?: {
    headers?: Record<string, string>;
    body?: unknown;
  };
  responseSchema: GenericResponseSchemaPayload;
}

interface EditableGenericConfig {
  endpoint: string;
  method: "POST" | "GET";
  headers: HeaderRow[];
  bodyText: string;
  responseMode: "stream" | "buffer";
  streamFraming: "sse" | "ndjson" | "lines";
  streamPathDelta: string;
  streamPathFinish: string;
  streamUsagePrompt?: string;
  streamUsageCompletion?: string;
  streamUsageTotal?: string;
  bufferPathText: string;
  bufferPathFinish: string;
  bufferUsagePrompt?: string;
  bufferUsageCompletion?: string;
  bufferUsageTotal?: string;
}

interface EditableProfile {
  id: string;
  name: string;
  driver: "openai-compatible" | "generic-http";
  baseUrl: string;
  defaultModel: string;
  authScheme: "Bearer" | "Basic";
  tokenRef: string;
  hasToken: boolean;
  tokenInput: string;
  tokenChanged: boolean;
  headers: HeaderRow[];
  stream: boolean;
  timeoutMs?: number;
  generic: EditableGenericConfig;
}

interface CompletionsStatePayload {
  active: string;
  profiles: Array<{
    name: string;
    driver: "openai-compatible" | "generic-http";
    baseUrl: string;
    defaultModel: string;
    headers?: Record<string, string>;
    request?: {
      stream?: boolean;
      timeoutMs?: number;
    };
    auth?: {
      scheme: "Bearer" | "Basic";
      tokenRef?: string;
      hasToken?: boolean;
    };
    generic?: GenericConfigPayload;
  }>;
}

interface TestResult {
  success: boolean;
  message: string;
  preview?: string;
}

const createId = () =>
  globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `id_${Math.random().toString(36).slice(2)}`;

const headersToRows = (headers?: Record<string, string>): HeaderRow[] => {
  if (!headers || typeof headers !== "object") {
    return [];
  }
  return Object.entries(headers).map(([key, value]) => ({
    id: createId(),
    key,
    value
  }));
};

const rowsToHeaders = (rows: HeaderRow[]) => {
  const record: Record<string, string> = {};
  rows.forEach((row) => {
    const key = row.key.trim();
    const value = row.value.trim();
    if (key && value) {
      record[key] = value;
    }
  });
  return record;
};

const createGenericConfig = (payload?: GenericConfigPayload): EditableGenericConfig => {
  const body =
    payload && payload.requestTemplate && Object.prototype.hasOwnProperty.call(payload.requestTemplate, "body")
      ? payload.requestTemplate.body
      : undefined;
  const defaultBody = `{
  "model": "{{model}}",
  "messages": "{{messages[]}}",
  "stream": {{stream}},
  "temperature": "{{temperature}}",
  "max_tokens": "{{max_tokens}}"
}`;
  return {
    endpoint: payload?.endpoint || "/v1/chat",
    method: payload?.method === "GET" ? "GET" : "POST",
    headers: headersToRows(payload?.requestTemplate?.headers),
    bodyText: body !== undefined ? JSON.stringify(body, null, 2) : defaultBody,
    responseMode: payload?.responseSchema?.mode === "stream" ? "stream" : "buffer",
    streamFraming: payload?.responseSchema?.stream?.framing || "sse",
    streamPathDelta: payload?.responseSchema?.stream?.pathDelta || "choices[0].delta.content",
    streamPathFinish: payload?.responseSchema?.stream?.pathFinish || "choices[0].finish_reason",
    streamUsagePrompt: payload?.responseSchema?.stream?.pathUsage?.prompt_tokens,
    streamUsageCompletion: payload?.responseSchema?.stream?.pathUsage?.completion_tokens,
    streamUsageTotal: payload?.responseSchema?.stream?.pathUsage?.total_tokens,
    bufferPathText: payload?.responseSchema?.buffer?.pathText || "choices[0].message.content",
    bufferPathFinish: payload?.responseSchema?.buffer?.pathFinish || "choices[0].finish_reason",
    bufferUsagePrompt: payload?.responseSchema?.buffer?.pathUsage?.prompt_tokens,
    bufferUsageCompletion: payload?.responseSchema?.buffer?.pathUsage?.completion_tokens,
    bufferUsageTotal: payload?.responseSchema?.buffer?.pathUsage?.total_tokens
  };
};

const createUsageRecord = (
  prompt?: string,
  completion?: string,
  total?: string
): UsagePathPayload | undefined => {
  const next: UsagePathPayload = {};
  if (prompt?.trim()) {
    next.prompt_tokens = prompt.trim();
  }
  if (completion?.trim()) {
    next.completion_tokens = completion.trim();
  }
  if (total?.trim()) {
    next.total_tokens = total.trim();
  }
  return Object.keys(next).length ? next : undefined;
};

const createEditableProfile = (profile: CompletionsStatePayload["profiles"][number]): EditableProfile => ({
  id: profile.name,
  name: profile.name,
  driver: profile.driver,
  baseUrl: profile.baseUrl,
  defaultModel: profile.defaultModel,
  authScheme: profile.auth?.scheme || "Bearer",
  tokenRef: profile.auth?.tokenRef || "",
  hasToken: Boolean(profile.auth?.hasToken || profile.auth?.tokenRef),
  tokenInput: "",
  tokenChanged: false,
  headers: headersToRows(profile.headers),
  stream: profile.request?.stream !== false,
  timeoutMs: profile.request?.timeoutMs,
  generic: createGenericConfig(profile.generic)
});

const createEmptyProfile = (): EditableProfile => ({
  id: createId(),
  name: "new-profile",
  driver: "openai-compatible",
  baseUrl: "https://api.openai.com/v1",
  defaultModel: "gpt-4o-mini",
  authScheme: "Bearer",
  tokenRef: "",
  hasToken: false,
  tokenInput: "",
  tokenChanged: false,
  headers: [],
  stream: true,
  timeoutMs: 60000,
  generic: createGenericConfig()
});

const normalizeProfiles = (data?: CompletionsStatePayload) => {
  if (!data || !Array.isArray(data.profiles)) {
    const fallback = createEmptyProfile();
    return {
      active: fallback.name,
      profiles: [fallback]
    };
  }
  const profiles = data.profiles.map(createEditableProfile);
  if (!profiles.length) {
    profiles.push(createEmptyProfile());
  }
  const active = profiles.find((profile) => profile.name === data.active)?.name || profiles[0].name;
  return { active, profiles };
};

const CompletionsSettings = () => {
  const focusLocalView = useDockStore((state) => state.actions.focusLocalView);
  const showToast = useDockStore((state) => state.actions.showToast);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<EditableProfile[]>([]);
  const [activeName, setActiveName] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [testStatus, setTestStatus] = useState<Record<string, TestResult | undefined>>({});
  const [testingProfile, setTestingProfile] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedId) || profiles[0],
    [profiles, selectedId]
  );

  useEffect(() => {
    void loadProfiles();
  }, []);

  const loadProfiles = async () => {
    if (!window.completions) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = (await window.completions.getProfiles()) as CompletionsStatePayload;
      applyServerState(data);
      setTestStatus({});
    } catch (error) {
      console.error("Failed to load completions profiles", error);
      showToast("Failed to load completions profiles");
    } finally {
      setLoading(false);
    }
  };

const updateProfile = (id: string, updater: (profile: EditableProfile) => EditableProfile) => {
  setProfiles((current) => current.map((profile) => (profile.id === id ? updater(profile) : profile)));
  setDirty(true);
};

const updateGenericConfig = (
  id: string,
  updater: (generic: EditableGenericConfig) => EditableGenericConfig
) => {
  updateProfile(id, (profile) => ({
    ...profile,
    generic: updater(profile.generic ?? createGenericConfig())
  }));
};

const setProfileDriver = (profileId: string, driver: "openai-compatible" | "generic-http") => {
  updateProfile(profileId, (profile) => {
    if (profile.driver === driver) {
      return profile;
    }
    if (driver === "generic-http") {
      return {
        ...profile,
        driver,
        generic: profile.generic ?? createGenericConfig(),
        stream: profile.stream
      };
    }
    return {
      ...profile,
      driver,
      authScheme: profile.authScheme || "Bearer",
      hasToken: Boolean(profile.tokenRef)
    };
  });
};

const handleAddProfile = () => {
  const newProfile = createEmptyProfile();
  newProfile.name = `profile-${profiles.length + 1}`;
  setProfiles((current) => [...current, newProfile]);
  setSelectedId(newProfile.id);
    setDirty(true);
  };

  const handleRemoveProfile = (id: string) => {
    setProfiles((current) => {
      if (current.length <= 1) {
        showToast("At least one profile is required");
        return current;
      }
      const removed = current.find((profile) => profile.id === id);
      const filtered = current.filter((profile) => profile.id !== id);
      const nextSelected = filtered[0];
      setSelectedId(nextSelected?.id || null);
      if (removed && activeName === removed.name) {
        setActiveName(nextSelected?.name || "");
      }
      setDirty(true);
      return filtered;
    });
  };

  const serializeState = (): CompletionsStatePayload => {
    const payloadProfiles = profiles.map((profile) => {
      const name = profile.name.trim();
      if (!name) {
        throw new Error("Profile name is required");
      }
      const headersRecord = rowsToHeaders(profile.headers);
      const baseUrl = profile.baseUrl.trim() || "https://api.openai.com/v1";
      const defaultModel = profile.defaultModel.trim() || "gpt-4o-mini";
      const requestConfig: CompletionsStatePayload["profiles"][number]["request"] = {};
      if (typeof profile.stream === "boolean") {
        requestConfig.stream = profile.stream;
      }
      if (typeof profile.timeoutMs === "number" && profile.timeoutMs > 0) {
        requestConfig.timeoutMs = profile.timeoutMs;
      }
      const headers = Object.keys(headersRecord).length ? headersRecord : undefined;
      const request = Object.keys(requestConfig).length ? requestConfig : undefined;

      const trimmedToken = profile.tokenInput.trim();
      let tokenRef = profile.tokenRef;
      let auth: Record<string, unknown> | undefined;
      if (profile.driver === "openai-compatible") {
        if (profile.tokenChanged && !trimmedToken) {
          tokenRef = "";
        }
        auth = {
          scheme: profile.authScheme,
          tokenRef
        };
        if (profile.tokenChanged && trimmedToken) {
          auth.token = trimmedToken;
        }
      } else {
        if (profile.tokenChanged) {
          if (trimmedToken) {
            auth = {
              scheme: profile.authScheme,
              token: trimmedToken,
              tokenRef
            };
          } else {
            tokenRef = "";
            auth = {
              scheme: profile.authScheme,
              tokenRef: ""
            };
          }
        } else if (profile.tokenRef) {
          auth = {
            scheme: profile.authScheme,
            tokenRef: profile.tokenRef
          };
        }
      }

      const genericState = profile.generic ?? createGenericConfig();
      let generic: GenericConfigPayload | undefined;
      if (profile.driver === "generic-http") {
        const genericHeaders = rowsToHeaders(genericState.headers);
        const trimmedBody = genericState.bodyText.trim();
        let parsedBody: unknown | undefined;
        if (trimmedBody) {
          try {
            parsedBody = JSON.parse(trimmedBody);
          } catch (error) {
            throw new Error(`Profile "${name}": generic request body must be valid JSON`);
          }
        }
        const streamUsage = createUsageRecord(
          genericState.streamUsagePrompt,
          genericState.streamUsageCompletion,
          genericState.streamUsageTotal
        );
        const bufferUsage = createUsageRecord(
          genericState.bufferUsagePrompt,
          genericState.bufferUsageCompletion,
          genericState.bufferUsageTotal
        );
        generic = {
          endpoint: genericState.endpoint || "/v1/chat",
          method: genericState.method,
          requestTemplate: {
            headers: Object.keys(genericHeaders).length ? genericHeaders : undefined,
            ...(parsedBody !== undefined ? { body: parsedBody } : {})
          },
          responseSchema: {
            mode: genericState.responseMode,
            stream:
              genericState.responseMode === "stream"
                ? {
                    framing: genericState.streamFraming,
                    pathDelta: genericState.streamPathDelta || undefined,
                    pathFinish: genericState.streamPathFinish || undefined,
                    pathUsage: streamUsage
                  }
                : undefined,
            buffer: {
              pathText: genericState.bufferPathText || "choices[0].message.content",
              pathFinish: genericState.bufferPathFinish || undefined,
              pathUsage: bufferUsage
            }
          }
        };
      }

      return {
        name,
        driver: profile.driver,
        baseUrl,
        defaultModel,
        headers,
        request,
        ...(auth ? { auth } : {}),
        ...(generic ? { generic } : {})
      };
    });

    return {
      active: activeName,
      profiles: payloadProfiles
    };
  };

  const applyServerState = (state: CompletionsStatePayload, preferredName?: string) => {
    const normalized = normalizeProfiles(state);
    setProfiles(
      normalized.profiles.map((profile) => ({
        ...profile,
        tokenInput: "",
        tokenChanged: false
      }))
    );
    setActiveName(normalized.active);
    setSelectedId((id) => {
      if (preferredName) {
        const matchByName = normalized.profiles.find((profile) => profile.name === preferredName);
        if (matchByName) {
          return matchByName.id;
        }
      }
      const exists = id ? normalized.profiles.find((profile) => profile.id === id) : undefined;
      return exists ? id : normalized.profiles[0]?.id || null;
    });
    setDirty(false);
  };

  const handleSave = async (): Promise<boolean> => {
    if (!window.completions) {
      return false;
    }
    setSaving(true);
    try {
      const payload = serializeState();
      const result = (await window.completions.saveProfiles(payload)) as CompletionsStatePayload;
      applyServerState(result, selectedProfile?.name);
      showToast("Profiles saved");
      return true;
    } catch (error) {
      console.error("Failed to save profiles", error);
      const message = error instanceof Error && error.message ? error.message : "Failed to save profiles";
      showToast(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSetActiveProfile = async (profile: EditableProfile) => {
    if (!window.completions) {
      return;
    }
    const trimmedName = profile.name.trim();
    if (!trimmedName) {
      showToast("Profile name is required");
      return;
    }
    if (activating === profile.id) {
      return;
    }
    if (!dirty && activeName === trimmedName) {
      return;
    }
    setActivating(profile.id);
    try {
      const saved = await ensureSaved();
      if (!saved) {
        return;
      }
      const nextState = (await window.completions.setActive(trimmedName)) as CompletionsStatePayload;
      applyServerState(nextState, trimmedName);
      showToast(`Active profile: ${trimmedName}`);
    } catch (error) {
      console.error("Failed to set active profile", error);
      showToast("Failed to set active profile");
    } finally {
      setActivating(null);
    }
  };

  const ensureSaved = async (): Promise<boolean> => {
    if (dirty) {
      return handleSave();
    }
    return true;
  };

  const handleTestConnection = async (profile: EditableProfile) => {
    if (!window.completions) {
      return;
    }
    const saved = await ensureSaved();
    if (!saved) {
      return;
    }
    setTestingProfile(profile.name);
    setTestStatus((current) => ({
      ...current,
      [profile.name]: { success: false, message: "Testing..." }
    }));
    try {
      const result = await window.completions.testProfile(profile.name);
      if (result.success) {
        const preview = result.preview ? `Preview: ${result.preview}` : "Connection successful";
        setTestStatus((current) => ({
          ...current,
          [profile.name]: { success: true, message: preview }
        }));
        showToast("Connection successful");
      } else {
        const message = result.message || "Connection failed";
        setTestStatus((current) => ({
          ...current,
          [profile.name]: { success: false, message }
        }));
        showToast(message);
      }
    } catch (error) {
      console.error("Failed to test connection", error);
      setTestStatus((current) => ({
        ...current,
        [profile.name]: { success: false, message: "Test failed" }
      }));
      showToast("Test failed");
    } finally {
      setTestingProfile(null);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void handleSave();
  };

  const onHeaderChange = (profileId: string, headerId: string, field: "key" | "value", value: string) => {
    updateProfile(profileId, (profile) => ({
      ...profile,
      headers: profile.headers.map((header) =>
        header.id === headerId
          ? {
              ...header,
              [field]: value
            }
          : header
      )
    }));
  };

  const onGenericHeaderChange = (
    profileId: string,
    headerId: string,
    field: "key" | "value",
    value: string
  ) => {
    updateGenericConfig(profileId, (generic) => ({
      ...generic,
      headers: generic.headers.map((header) =>
        header.id === headerId
          ? {
              ...header,
              [field]: value
            }
          : header
      )
    }));
  };

  const addHeaderRow = (profileId: string) => {
    updateProfile(profileId, (profile) => ({
      ...profile,
      headers: [...profile.headers, { id: createId(), key: "", value: "" }]
    }));
  };

  const addGenericHeaderRow = (profileId: string) => {
    updateGenericConfig(profileId, (generic) => ({
      ...generic,
      headers: [...generic.headers, { id: createId(), key: "", value: "" }]
    }));
  };

  const removeHeaderRow = (profileId: string, headerId: string) => {
    updateProfile(profileId, (profile) => ({
      ...profile,
      headers: profile.headers.filter((header) => header.id !== headerId)
    }));
  };

  const removeGenericHeaderRow = (profileId: string, headerId: string) => {
    updateGenericConfig(profileId, (generic) => ({
      ...generic,
      headers: generic.headers.filter((header) => header.id !== headerId)
    }));
  };

  const clearToken = (profileId: string) => {
    updateProfile(profileId, (profile) => ({
      ...profile,
      tokenRef: "",
      hasToken: false,
      tokenInput: "",
      tokenChanged: true
    }));
  };

  useEffect(() => {
    if (!selectedId && profiles.length) {
      setSelectedId(profiles[0].id);
    }
  }, [profiles, selectedId]);

  const selectedTest = selectedProfile ? testStatus[selectedProfile.name] : undefined;
  const isActiveSelectedProfile = selectedProfile ? activeName === selectedProfile.name : false;
  const setActiveButtonLabel =
    activating === selectedProfile?.id
      ? "Setting..."
      : isActiveSelectedProfile
      ? "Active"
      : "Set Active";
  const setActiveDisabled =
    activating === selectedProfile?.id || saving || (!dirty && isActiveSelectedProfile);

  const renderGenericSection = () => {
    if (!selectedProfile || selectedProfile.driver !== "generic-http") {
      return null;
    }
    const generic = selectedProfile.generic;
    const handleGenericChange = (patch: Partial<EditableGenericConfig>) => {
      updateGenericConfig(selectedProfile.id, (current) => ({
        ...current,
        ...patch
      }));
    };
    const renderStreamUsageInputs = () => (
      <div className="form-grid">
        <label>
          Usage prompt path
          <input
            type="text"
            value={generic.streamUsagePrompt ?? ""}
            onChange={(event) =>
              handleGenericChange({ streamUsagePrompt: event.target.value || undefined })
            }
            placeholder="eg. usage.prompt_tokens"
          />
        </label>
        <label>
          Usage completion path
          <input
            type="text"
            value={generic.streamUsageCompletion ?? ""}
            onChange={(event) =>
              handleGenericChange({ streamUsageCompletion: event.target.value || undefined })
            }
            placeholder="eg. usage.completion_tokens"
          />
        </label>
        <label>
          Usage total path
          <input
            type="text"
            value={generic.streamUsageTotal ?? ""}
            onChange={(event) =>
              handleGenericChange({ streamUsageTotal: event.target.value || undefined })
            }
            placeholder="eg. usage.total_tokens"
          />
        </label>
      </div>
    );

    const renderBufferUsageInputs = () => (
      <div className="form-grid">
        <label>
          Usage prompt path
          <input
            type="text"
            value={generic.bufferUsagePrompt ?? ""}
            onChange={(event) =>
              handleGenericChange({ bufferUsagePrompt: event.target.value || undefined })
            }
            placeholder="eg. usage.prompt_tokens"
          />
        </label>
        <label>
          Usage completion path
          <input
            type="text"
            value={generic.bufferUsageCompletion ?? ""}
            onChange={(event) =>
              handleGenericChange({ bufferUsageCompletion: event.target.value || undefined })
            }
            placeholder="eg. usage.completion_tokens"
          />
        </label>
        <label>
          Usage total path
          <input
            type="text"
            value={generic.bufferUsageTotal ?? ""}
            onChange={(event) =>
              handleGenericChange({ bufferUsageTotal: event.target.value || undefined })
            }
            placeholder="eg. usage.total_tokens"
          />
        </label>
      </div>
    );

    return (
      <div className="completions-generic">
        <h4>Generic HTTP Configuration</h4>
        <div className="form-grid">
          <label>
            Endpoint
            <input
              type="text"
              value={generic.endpoint}
              onChange={(event) => handleGenericChange({ endpoint: event.target.value })}
              placeholder="/v1/chat"
              required
            />
          </label>
          <label>
            Method
            <select
              value={generic.method}
              onChange={(event) =>
                handleGenericChange({ method: (event.target.value as "POST" | "GET") || "POST" })
              }
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </label>
        </div>
        <div className="completions-headers">
          <div className="completions-headers-title">
            <span>Request Headers</span>
            <button
              type="button"
              className="pill-btn ghost"
              onClick={() => addGenericHeaderRow(selectedProfile.id)}
            >
              Add Header
            </button>
          </div>
          <div className="completions-headers-list">
            {generic.headers.length === 0 && (
              <div className="completions-headers-empty">No custom headers</div>
            )}
            {generic.headers.map((header) => (
              <div key={header.id} className="completions-header-row">
                <input
                  type="text"
                  placeholder="Header"
                  value={header.key}
                  onChange={(event) =>
                    onGenericHeaderChange(selectedProfile.id, header.id, "key", event.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={header.value}
                  onChange={(event) =>
                    onGenericHeaderChange(selectedProfile.id, header.id, "value", event.target.value)
                  }
                />
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => removeGenericHeaderRow(selectedProfile.id, header.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <label>
          Request body template (JSON)
          <textarea
            value={generic.bodyText}
            onChange={(event) => handleGenericChange({ bodyText: event.target.value })}
            rows={6}
            placeholder='{"model":"{{model}}","messages":"{{messages[]}}","stream":{{stream}}}'
          />
        </label>
        <div className="form-grid">
          <label>
            Response mode
            <select
              value={generic.responseMode}
              onChange={(event) =>
                handleGenericChange({
                  responseMode: (event.target.value as "stream" | "buffer") || "stream"
                })
              }
            >
              <option value="stream">Stream</option>
              <option value="buffer">Buffer</option>
            </select>
          </label>
          {generic.responseMode === "stream" && (
            <label>
              Stream framing
              <select
                value={generic.streamFraming}
                onChange={(event) =>
                  handleGenericChange({
                    streamFraming:
                      (event.target.value as "sse" | "ndjson" | "lines") || generic.streamFraming
                  })
                }
              >
                <option value="sse">Server-Sent Events</option>
                <option value="ndjson">NDJSON</option>
                <option value="lines">Line delimited</option>
              </select>
            </label>
          )}
        </div>
        {generic.responseMode === "stream" ? (
          <>
            <div className="form-grid">
              <label>
                Delta path
                <input
                  type="text"
                  value={generic.streamPathDelta}
                  onChange={(event) =>
                    handleGenericChange({ streamPathDelta: event.target.value })
                  }
                  placeholder="choices[0].delta.content"
                />
              </label>
              <label>
                Finish reason path
                <input
                  type="text"
                  value={generic.streamPathFinish}
                  onChange={(event) =>
                    handleGenericChange({ streamPathFinish: event.target.value })
                  }
                  placeholder="choices[0].finish_reason"
                />
              </label>
            </div>
            {renderStreamUsageInputs()}
          </>
        ) : (
          <>
            <div className="form-grid">
              <label>
                Text path
                <input
                  type="text"
                  value={generic.bufferPathText}
                  onChange={(event) =>
                    handleGenericChange({ bufferPathText: event.target.value })
                  }
                  placeholder="choices[0].message.content"
                />
              </label>
              <label>
                Finish reason path
                <input
                  type="text"
                  value={generic.bufferPathFinish}
                  onChange={(event) =>
                    handleGenericChange({ bufferPathFinish: event.target.value })
                  }
                  placeholder="choices[0].finish_reason"
                />
              </label>
            </div>
            {renderBufferUsageInputs()}
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="chat-shell">
        <div className="completions-view">
          <div className="completions-empty">Loading completions settings...</div>
        </div>
      </div>
    );
  }

  if (!selectedProfile) {
    return (
      <div className="chat-shell">
        <div className="completions-view">
          <div className="completions-empty">No profiles available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-shell">
      <div className="completions-view">
        <aside className="completions-sidebar">
          <div className="completions-sidebar-header">
            <h2>Connections</h2>
            <button className="pill-btn" onClick={handleAddProfile} type="button">
              New Profile
            </button>
          </div>
          <div className="completions-list">
            {profiles.map((profile) => {
              const isActiveProfile = activeName === profile.name;
              const isSelected = selectedProfile.id === profile.id;
              return (
                <button
                  key={profile.id}
                  className={`completions-list-item${isSelected ? " selected" : ""}`}
                  onClick={() => setSelectedId(profile.id)}
                  type="button"
                >
                  <div className="completions-list-info">
                    <span className="completions-list-name">{profile.name}</span>
                    <span className="completions-list-meta">
                      {profile.driver === "generic-http" ? "Generic HTTP" : "OpenAI"}
                    </span>
                  </div>
                  {isActiveProfile && <span className="completions-list-badge">Active</span>}
                </button>
              );
            })}
          </div>
        </aside>
        <section className="completions-editor">
          <header className="completions-editor-header">
            <div>
              <h3>{selectedProfile.name}</h3>
              <p>{selectedProfile.driver === "openai-compatible" ? "Standard OpenAI-compatible /v1/chat/completions endpoint." : "Generic HTTP driver with templated payloads for custom providers."}</p>
            </div>
            <div className="completions-editor-actions">
              <button
                type="button"
                className={`pill-btn${isActiveSelectedProfile ? " active" : ""}`}
                onClick={() => {
                  void handleSetActiveProfile(selectedProfile);
                }}
                disabled={setActiveDisabled}
              >
                {setActiveButtonLabel}
              </button>
              <button
                type="button"
                className="pill-btn danger"
                onClick={() => handleRemoveProfile(selectedProfile.id)}
              >
                Delete
              </button>
            </div>
          </header>
          <form className="completions-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Profile Name
                <input
                  type="text"
                  value={selectedProfile.name}
                  onChange={(event) =>
                    updateProfile(selectedProfile.id, (profile) => ({
                      ...profile,
                      name: event.target.value.trim() || "default"
                    }))
                  }
                  required
                />
              </label>
              <label>
                Provider Type
                <select
                  value={selectedProfile.driver}
                  onChange={(event) =>
                    setProfileDriver(
                      selectedProfile.id,
                      (event.target.value as "openai-compatible" | "generic-http") || "openai-compatible"
                    )
                  }
                >
                  <option value="openai-compatible">OpenAI-compatible</option>
                  <option value="generic-http">Generic HTTP</option>
                </select>
              </label>
              <label>
                Base URL
                <input
                  type="text"
                  value={selectedProfile.baseUrl}
                  onChange={(event) =>
                    updateProfile(selectedProfile.id, (profile) => ({
                      ...profile,
                      baseUrl: event.target.value
                    }))
                  }
                  required
                />
              </label>
              <label>
                Default Model
                <input
                  type="text"
                  value={selectedProfile.defaultModel}
                  onChange={(event) =>
                    updateProfile(selectedProfile.id, (profile) => ({
                      ...profile,
                      defaultModel: event.target.value
                    }))
                  }
                  required
                />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Auth Scheme
                <select
                  value={selectedProfile.authScheme}
                  onChange={(event) =>
                    updateProfile(selectedProfile.id, (profile) => ({
                      ...profile,
                      authScheme: event.target.value as "Bearer" | "Basic"
                    }))
                  }
                >
                  <option value="Bearer">Bearer</option>
                  <option value="Basic">Basic</option>
                </select>
              </label>
              <label>
                API Token
                <input
                  type="password"
                  placeholder={selectedProfile.hasToken ? "Stored securely" : "Paste API token"}
                  value={selectedProfile.tokenInput}
                  onChange={(event) =>
                    updateProfile(selectedProfile.id, (profile) => ({
                      ...profile,
                      tokenInput: event.target.value,
                      tokenChanged: true
                    }))
                  }
                />
              </label>
              <label>
                Timeout (ms)
                <input
                  type="number"
                  min={0}
                  value={selectedProfile.timeoutMs ?? ""}
                  onChange={(event) =>
                    updateProfile(selectedProfile.id, (profile) => ({
                      ...profile,
                      timeoutMs: event.target.value ? Number(event.target.value) : undefined
                    }))
                  }
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedProfile.stream}
                  onChange={(event) =>
                    updateProfile(selectedProfile.id, (profile) => ({
                      ...profile,
                      stream: event.target.checked
                    }))
                  }
                />
                Stream responses
              </label>
              {selectedProfile.hasToken && (
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => clearToken(selectedProfile.id)}
                  disabled={!selectedProfile.hasToken}
                >
                  Clear Token
                </button>
              )}
            </div>
            <div className="completions-headers">
              <div className="completions-headers-title">
                <span>Custom Headers</span>
                <button type="button" className="pill-btn ghost" onClick={() => addHeaderRow(selectedProfile.id)}>
                  Add Header
                </button>
              </div>
              <div className="completions-headers-list">
                {selectedProfile.headers.length === 0 && (
                  <div className="completions-headers-empty">No custom headers</div>
                )}
                {selectedProfile.headers.map((header) => (
                  <div key={header.id} className="completions-header-row">
                    <input
                      type="text"
                      placeholder="Header"
                      value={header.key}
                      onChange={(event) => onHeaderChange(selectedProfile.id, header.id, "key", event.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={header.value}
                      onChange={(event) => onHeaderChange(selectedProfile.id, header.id, "value", event.target.value)}
                    />
                    <button
                      type="button"
                      className="pill-btn ghost"
                      onClick={() => removeHeaderRow(selectedProfile.id, header.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {renderGenericSection()}
            {selectedTest && (
              <div className={`completions-test-status${selectedTest.success ? " success" : " error"}`}>
                {selectedTest.message}
              </div>
            )}
            <div className="completions-footer">
              <div className="completions-footer-left">
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => {
                    void focusLocalView("chat");
                  }}
                >
                  Back to Chat
                </button>
              </div>
              <div className="completions-footer-actions">
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={() => handleTestConnection(selectedProfile)}
                  disabled={testingProfile === selectedProfile.name}
                >
                  {testingProfile === selectedProfile.name ? "Testing..." : "Test Connection"}
                </button>
                <button type="submit" className="pill-btn" disabled={saving}>
                  {saving ? "Saving..." : dirty ? "Save Changes" : "Saved"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CompletionsSettings;







