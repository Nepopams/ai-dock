import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDockStore } from "../store/useDockStore";

interface HeaderRow {
  id: string;
  key: string;
  value: string;
}

interface EditableProfile {
  id: string;
  name: string;
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
}

interface CompletionsStatePayload {
  active: string;
  profiles: Array<{
    name: string;
    driver: "openai-compatible";
    baseUrl: string;
    defaultModel: string;
    headers?: Record<string, string>;
    request?: {
      stream?: boolean;
      timeoutMs?: number;
    };
    auth: {
      scheme: "Bearer" | "Basic";
      tokenRef: string;
      hasToken: boolean;
    };
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

const createEditableProfile = (profile: CompletionsStatePayload["profiles"][number]): EditableProfile => ({
  id: profile.name,
  name: profile.name,
  baseUrl: profile.baseUrl,
  defaultModel: profile.defaultModel,
  authScheme: profile.auth.scheme,
  tokenRef: profile.auth.tokenRef,
  hasToken: profile.auth.hasToken,
  tokenInput: "",
  tokenChanged: false,
  headers: headersToRows(profile.headers),
  stream: profile.request?.stream !== false,
  timeoutMs: profile.request?.timeoutMs
});

const createEmptyProfile = (): EditableProfile => ({
  id: createId(),
  name: "new-profile",
  baseUrl: "https://api.openai.com/v1",
  defaultModel: "gpt-4o-mini",
  authScheme: "Bearer",
  tokenRef: "",
  hasToken: false,
  tokenInput: "",
  tokenChanged: false,
  headers: [],
  stream: true,
  timeoutMs: 60000
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
      const headersRecord = rowsToHeaders(profile.headers);
      const requestConfig: CompletionsStatePayload["profiles"][number]["request"] = {};
      if (typeof profile.stream === "boolean") {
        requestConfig.stream = profile.stream;
      }
      if (typeof profile.timeoutMs === "number" && profile.timeoutMs > 0) {
        requestConfig.timeoutMs = profile.timeoutMs;
      }
      const trimmedToken = profile.tokenInput.trim();
      let tokenRef = profile.tokenRef;
      if (profile.tokenChanged && !trimmedToken) {
        tokenRef = "";
      }
      const auth: Record<string, unknown> = {
        scheme: profile.authScheme,
        tokenRef
      };
      if (profile.tokenChanged) {
        auth.token = trimmedToken;
      }
      const headers = Object.keys(headersRecord).length ? headersRecord : undefined;
      const request = Object.keys(requestConfig).length ? requestConfig : undefined;
      return {
        name: profile.name,
        driver: "openai-compatible" as const,
        baseUrl: profile.baseUrl,
        defaultModel: profile.defaultModel,
        headers,
        request,
        auth
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
      showToast("Failed to save profiles");
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

  const addHeaderRow = (profileId: string) => {
    updateProfile(profileId, (profile) => ({
      ...profile,
      headers: [...profile.headers, { id: createId(), key: "", value: "" }]
    }));
  };

  const removeHeaderRow = (profileId: string, headerId: string) => {
    updateProfile(profileId, (profile) => ({
      ...profile,
      headers: profile.headers.filter((header) => header.id !== headerId)
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
                  <span className="completions-list-name">{profile.name}</span>
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
              <p>Configure an OpenAI-compatible completion profile.</p>
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
            </div>
            <div className="form-grid">
              <label>
                API Token
                <input
                  type="password"
                  placeholder={selectedProfile.hasToken ? "Stored securely" : "Enter token"}
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
              <button
                type="button"
                className="pill-btn ghost"
                onClick={() => clearToken(selectedProfile.id)}
                disabled={!selectedProfile.hasToken && !selectedProfile.tokenInput}
              >
                Clear Token
              </button>
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




