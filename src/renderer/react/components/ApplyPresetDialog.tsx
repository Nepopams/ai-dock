import { useEffect, useMemo, useState } from "react";
import type { MediaPreset } from "../../../shared/types/mediaPresets";
import type { ServiceClient } from "../../../shared/types/registry";
import { composeMediaPresetText } from "../../../shared/utils/mediaPresets";

export interface ApplyPresetResultFeedback {
  applied: number;
  targetClients: string[];
  targetTabs: string[];
  warnings: Array<{ clientId: string; message: string }>;
  errors: Array<{ clientId?: string; message: string }>;
  text: string;
  send: boolean;
}

interface ApplyPresetDialogProps {
  open: boolean;
  preset: MediaPreset | null;
  clients: ServiceClient[];
  adapterWarnings: Record<string, string | undefined>;
  defaultSelection: string[];
  applying: boolean;
  feedback: ApplyPresetResultFeedback | null;
  onApply: (payload: { clientIds: string[]; send: boolean }) => Promise<void>;
  onClose: () => void;
}

const formatClientTitle = (client: ServiceClient): string => client.title || client.id;

const buildPreview = (preset: MediaPreset | null): string => {
  if (!preset) {
    return "";
  }
  return composeMediaPresetText(preset);
};

const ApplyPresetDialog = ({
  open,
  preset,
  clients,
  adapterWarnings,
  defaultSelection,
  applying,
  feedback,
  onApply,
  onClose
}: ApplyPresetDialogProps) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const unique = Array.from(new Set(defaultSelection));
      setSelectedClients(unique);
    }
  }, [defaultSelection, open]);

  if (!open || !preset) {
    return null;
  }

  const preview = useMemo(() => buildPreview(preset), [preset]);

  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) => {
      if (prev.includes(clientId)) {
        return prev.filter((id) => id !== clientId);
      }
      return [...prev, clientId];
    });
  };

  const handleApply = (send: boolean) => {
    if (!selectedClients.length) {
      return;
    }
    void onApply({ clientIds: selectedClients, send });
  };

  const hasSelection = selectedClients.length > 0;

  const feedbackMessages = useMemo(() => {
    if (!feedback) {
      return null;
    }
    const warningMessages = feedback.warnings.map((warn) => ({
      type: "warning" as const,
      clientId: warn.clientId,
      message: warn.message
    }));
    const errorMessages = feedback.errors.map((err) => ({
      type: "error" as const,
      clientId: err.clientId,
      message: err.message
    }));
    return [...warningMessages, ...errorMessages];
  }, [feedback]);

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <header className="modal-header">
          <h2>Apply “{preset.title}”</h2>
        </header>
        <section className="apply-preset-body">
          <div className="apply-columns">
            <div className="apply-clients">
              <h3>Target Clients</h3>
              <div className="apply-clients-list">
                {clients.length === 0 && (
                  <div className="muted">No registry clients are configured.</div>
                )}
                {clients.map((client) => {
                  const warning = adapterWarnings[client.id];
                  const checked = selectedClients.includes(client.id);
                  return (
                    <label key={client.id} className="preset-bound-option apply-client-option">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleClient(client.id)}
                      />
                      <div className="apply-client-meta">
                        <span className="apply-client-title">{formatClientTitle(client)}</span>
                        {warning && <span className="apply-client-warning">{warning}</span>}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="apply-preview">
              <h3>Preview</h3>
              <textarea value={preview} readOnly rows={12} />
            </div>
          </div>
          <div className="apply-feedback">
            {!hasSelection && <span className="apply-feedback-warning">Select at least one client.</span>}
            {feedbackMessages && feedbackMessages.length > 0 && (
              <ul className="apply-feedback-list">
                {feedbackMessages.map((item, index) => (
                  <li key={`${item.type}-${item.clientId ?? "global"}-${index}`} className={`apply-feedback-${item.type}`}>
                    {item.clientId ? `[${item.clientId}] ` : ""}
                    {item.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <footer className="modal-footer apply-footer">
          <button type="button" className="pill-btn ghost" onClick={onClose} disabled={applying}>
            Close
          </button>
          <div className="apply-actions">
            <button
              type="button"
              className="pill-btn ghost"
              onClick={() => handleApply(false)}
              disabled={!hasSelection || applying}
            >
              Insert
            </button>
            <button
              type="button"
              className="pill-btn"
              onClick={() => handleApply(true)}
              disabled={!hasSelection || applying}
            >
              Insert &amp; Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ApplyPresetDialog;
