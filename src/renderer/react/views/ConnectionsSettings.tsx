import { useState } from "react";
import CompletionsSettings from "./CompletionsSettings";
import ClientsAndCategories from "./settings/ClientsAndCategories";
import AdapterOverrides from "./settings/AdapterOverrides";

type ConnectionsTab = "profiles" | "registry" | "adapters";

const tabs: Array<{ id: ConnectionsTab; label: string }> = [
  { id: "profiles", label: "Completion Profiles" },
  { id: "registry", label: "Service Registry" },
  { id: "adapters", label: "Adapter Overrides" }
];

const ConnectionsSettings = () => {
  const [activeTab, setActiveTab] = useState<ConnectionsTab>("profiles");

  return (
    <div className="connections-settings">
      <div className="connections-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`pill-btn connections-tab${activeTab === tab.id ? " active" : ""}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="connections-panel">
        {activeTab === "profiles" && <CompletionsSettings />}
        {activeTab === "registry" && <ClientsAndCategories />}
        {activeTab === "adapters" && <AdapterOverrides />}
      </div>
    </div>
  );
};

export default ConnectionsSettings;


