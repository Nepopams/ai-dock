import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDockStore } from "../../store/useDockStore";
import { AdapterSelectors } from "../../../adapters/IAgentAdapter";
import { resolveAdapterId } from "../../../adapters/adapters";
import { ServiceClient, ServiceRegistryFile } from "../../../../shared/types/registry.ts";

interface FormState {
  input: string;
  sendButton: string;
  messages: string;
  assistant: string;
  user: string;
}

interface HealthStatus {
  state: "idle" | "running" | "ok" | "error";
  message?: string;
}

const splitSelectors = (value: string): string[] => {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const formatSelectors = (items?: string[]): string => {
  return (items || []).join("\n");
};

const buildRegistryPayload = (clients: ServiceClient[]): ServiceRegistryFile => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  clients
});

const AdapterOverrides = () => {
  const registryClients = useDockStore((state) => state.registryClients);
  const registryLoading = useDockStore((state) => state.registryLoading);
  const registryError = useDockStore((state) => state.registryError);
  const tabs = useDockStore((state) => state.tabs);
  const adapterStateByTab = useDockStore((state) => state.adapterStateByTab);
  const saveRegistry = useDockStore((state) => state.actions.saveRegistry);
  const setAdapterOverride = useDockStore((state) => state.actions.setAdapterOverride);
  const healthCheckAdapter = useDockStore((state) => state.actions.healthCheckAdapter);
  const showToast = useDockStore((state) => state.actions.showToast);

  const servicesWithAdapters = useMemo(
    () => registryClients.filter((client) => resolveAdapterId(client.adapterId as string | undefined)),
    [registryClients]
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    servicesWithAdapters[0]?.id ?? null
  );

  useEffect(() => {
    if (selectedServiceId) {
      const exists = servicesWithAdapters.some((service) => service.id === selectedServiceId);
      if (!exists) {
        setSelectedServiceId(servicesWithAdapters[0]?.id ?? null);
      }
    } else if (servicesWithAdapters.length) {
      setSelectedServiceId(servicesWithAdapters[0].id);
    }
  }, [selectedServiceId, servicesWithAdapters]);

  const selectedService = servicesWithAdapters.find((client) => client.id === selectedServiceId) || null;

  const currentSelectors = useMemo(() => {
    if (!selectedService?.meta || typeof selectedService.meta !== "object") {
      return undefined;
    }
    const meta = selectedService.meta as { selectors?: Partial<AdapterSelectors> };
    return meta.selectors;
  }, [selectedService]);

  const [form, setForm] = useState<FormState>({
    input: "",
    sendButton: "",
    messages: "",
    assistant: "",
    user: ""
  });
  const [saving, setSaving] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({ state: "idle" });

  useEffect(() => {
    if (!selectedService) {
      setForm({
        input: "",
        sendButton: "",
        messages: "",
        assistant: "",
        user: ""
      });
      return;
    }
    const selectors = currentSelectors;
    setForm({
      input: formatSelectors(selectors?.input),
      sendButton: formatSelectors(selectors?.sendButton),
      messages: formatSelectors(selectors?.messages),
      assistant: formatSelectors(selectors?.assistantMessage),
      user: formatSelectors(selectors?.userMessage)
    });
    setHealthStatus({ state: "idle" });
  }, [selectedService, currentSelectors]);

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClear = () => {
    setForm({
      input: "",
      sendButton: "",
      messages: "",
      assistant: "",
      user: ""
    });
  };

  const handleResetToCurrent = () => {
    const selectors = currentSelectors;
    setForm({
      input: formatSelectors(selectors?.input),
      sendButton: formatSelectors(selectors?.sendButton),
      messages: formatSelectors(selectors?.messages),
      assistant: formatSelectors(selectors?.assistantMessage),
      user: formatSelectors(selectors?.userMessage)
    });
  };

  const buildFormSelectors = (): Partial<AdapterSelectors> => {
    const next: Partial<AdapterSelectors> = {};
    const input = splitSelectors(form.input);
    const sendButton = splitSelectors(form.sendButton);
    const messages = splitSelectors(form.messages);
    const assistant = splitSelectors(form.assistant);
    const user = splitSelectors(form.user);

    if (input.length) {
      next.input = input;
    }
    if (sendButton.length) {
      next.sendButton = sendButton;
    }
    if (messages.length) {
      next.messages = messages;
    }
    if (assistant.length) {
      next.assistantMessage = assistant;
    }
    if (user.length) {
      next.userMessage = user;
    }

    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedService) {
      return;
    }
    setSaving(true);
    try {
      const current = buildFormSelectors();
      const nextClients = registryClients.map((client) => {
        if (client.id !== selectedService.id) {
          return client;
        }
        const nextMeta = { ...(client.meta || {}) } as Record<string, unknown>;
        if (Object.keys(current).length) {
          nextMeta.selectors = current;
        } else {
          delete nextMeta.selectors;
        }
        const sanitizedMeta =
          Object.keys(nextMeta).length > 0 ? (nextMeta as ServiceClient["meta"]) : undefined;
        return { ...client, meta: sanitizedMeta };
      });

      const success = await saveRegistry(buildRegistryPayload(nextClients));
      if (success && selectedService.adapterId) {
        setAdapterOverride(selectedService.id, selectedService.adapterId as any, Object.keys(current).length ? current : undefined);
        showToast("Overrides saved");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleHealthCheck = async () => {
    if (!selectedService) {
      return;
    }
    setHealthStatus({ state: "running" });
    const result = await healthCheckAdapter(selectedService.id);
    if (result.ok) {
      setHealthStatus({ state: "ok", message: "Adapter ready. Input and messages detected." });
    } else {
      setHealthStatus({
        state: "error",
        message: result.details || "Health-check failed"
      });
    }
  };

  const selectedTabState = useMemo(() => {
    if (!selectedService) {
      return null;
    }
    const tab = tabs.find((item) => item.serviceId === selectedService.id);
    if (!tab) {
      return null;
    }
    return adapterStateByTab[tab.id];
  }, [adapterStateByTab, tabs, selectedService]);

  const hasOpenTab = useMemo(() => {
    if (!selectedService) {
      return false;
    }
    return tabs.some((tab) => tab.serviceId === selectedService.id);
  }, [tabs, selectedService]);

  if (!servicesWithAdapters.length) {
    return (
      <div className="adapter-overrides adapter-overrides--empty">
        <p>No services with configured adapters yet.</p>
      </div>
    );
  }

  return (
    <div className="adapter-overrides">
      <aside className="adapter-overrides__list">
        <h3>Services</h3>
        <ul>
          {servicesWithAdapters.map((service) => (
            <li key={service.id}>
              <button
                type="button"
                className={`adapter-overrides__list-item${service.id === selectedServiceId ? " active" : ""}`}
                onClick={() => setSelectedServiceId(service.id)}
              >
                <span>{service.title}</span>
                <span className="adapter-overrides__list-meta">{service.adapterId}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="adapter-overrides__editor">
        {selectedService ? (
          <form className="adapter-overrides__form" onSubmit={handleSubmit}>
            <header>
              <div>
                <h3>{selectedService.title}</h3>
                <p>Adapter: {selectedService.adapterId || "not configured"}</p>
              </div>
              <div className="adapter-overrides__actions">
                <button type="button" className="pill-btn ghost" onClick={handleResetToCurrent} disabled={saving}>
                  Reset
                </button>
                <button type="button" className="pill-btn ghost" onClick={handleClear} disabled={saving}>
                  Clear Overrides
                </button>
                <button type="submit" className="pill-btn" disabled={saving || registryLoading}>
                  {saving ? "SavingвЂ¦" : "Save Overrides"}
                </button>
              </div>
            </header>
            {registryError && <div className="adapter-overrides__error">{registryError}</div>}
            <div className="adapter-overrides__grid">
              <label>
                Input selectors
                <textarea
                  value={form.input}
                  onChange={(event) => handleFieldChange("input", event.target.value)}
                  placeholder="textarea.prompt-textarea"
                  rows={4}
                />
              </label>
              <label>
                Send button selectors
                <textarea
                  value={form.sendButton}
                  onChange={(event) => handleFieldChange("sendButton", event.target.value)}
                  placeholder="button[data-testid='send-button']"
                  rows={4}
                />
              </label>
              <label>
                Messages container selectors
                <textarea
                  value={form.messages}
                  onChange={(event) => handleFieldChange("messages", event.target.value)}
                  placeholder="[data-testid='chat-history']"
                  rows={4}
                />
              </label>
              <label>
                Assistant message selectors
                <textarea
                  value={form.assistant}
                  onChange={(event) => handleFieldChange("assistant", event.target.value)}
                  placeholder=".chat-message.assistant"
                  rows={4}
                />
              </label>
              <label>
                User message selectors
                <textarea
                  value={form.user}
                  onChange={(event) => handleFieldChange("user", event.target.value)}
                  placeholder=".chat-message.user"
                  rows={4}
                />
              </label>
            </div>
            <footer className="adapter-overrides__footer">
              <div className="adapter-overrides__health">
                <button
                  type="button"
                  className="pill-btn ghost"
                  onClick={handleHealthCheck}
                  disabled={!hasOpenTab || saving || healthStatus.state === "running" || registryLoading}
                >
                  {healthStatus.state === "running" ? "CheckingвЂ¦" : "Health-check"}
                </button>
                {!hasOpenTab && <span className="adapter-overrides__hint">Open a tab for this service to run health-check.</span>}
                {healthStatus.state === "ok" && (
                  <span className="adapter-overrides__health-ok">{healthStatus.message || "Selectors look good."}</span>
                )}
                {healthStatus.state === "error" && (
                  <span className="adapter-overrides__health-error">{healthStatus.message}</span>
                )}
              </div>
              {selectedTabState && (
                <div className="adapter-overrides__tab-state">
                  <span className="adapter-overrides__tab-title">
                    Active tab status: {selectedTabState.ready ? "ready" : "not ready"}
                  </span>
                  {selectedTabState.lastError && (
                    <span className="adapter-overrides__tab-error">Last error: {selectedTabState.lastError}</span>
                  )}
                </div>
              )}
            </footer>
          </form>
        ) : (
          <div className="adapter-overrides__empty">Select a service to edit overrides.</div>
        )}
      </section>
    </div>
  );
};

export default AdapterOverrides;




