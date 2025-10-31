import { useMemo } from "react";
import { useDockStore } from "../store/useDockStore";
import logoIcon from "../assets/icons/logo.svg";
import gptIcon from "../assets/icons/gpt.svg";
import claudeIcon from "../assets/icons/claude.svg";
import alisaIcon from "../assets/icons/alisa.svg";
import deepseekIcon from "../assets/icons/deepseek.svg";
import uxpilotIcon from "../assets/icons/uxpilot.svg";
import promptsIcon from "../assets/icons/prompts.svg";
import infoIcon from "../assets/icons/info.svg";
import exitIcon from "../assets/icons/exit.svg";
import chatIcon from "../assets/icons/chat.svg";
import connectionsIcon from "../assets/icons/connections.svg";
import { serviceCategories, ServiceCategory, ServiceClient } from "../../../shared/types/registry.ts";

const builtinIconMap: Record<string, string> = {
  chatgpt: gptIcon,
  claude: claudeIcon,
  alisa: alisaIcon,
  deepseek: deepseekIcon,
  uxpilot: uxpilotIcon
};

const fallbackClients: ServiceClient[] = [
  {
    id: "chatgpt",
    title: "ChatGPT",
    category: "chat",
    urlPatterns: [],
    adapterId: "openai.chatgpt",
    icon: "builtin:chatgpt",
    enabled: true
  },
  {
    id: "claude",
    title: "Claude",
    category: "chat",
    urlPatterns: [],
    adapterId: "anthropic.claude",
    icon: "builtin:claude",
    enabled: true
  },
  {
    id: "deepseek",
    title: "DeepSeek",
    category: "chat",
    urlPatterns: [],
    adapterId: "deepseek.chat",
    icon: "builtin:deepseek",
    enabled: true
  }
];

const categoryLabels: Record<ServiceCategory, string> = {
  chat: "Chat",
  code: "Code",
  presentation: "Presentation",
  image_video: "Images & Video",
  other: "Other"
};

function Sidebar() {
  const registryClients = useDockStore((state) => state.registryClients);
  const activeServiceId = useDockStore((state) => state.activeServiceId);
  const activeLocalView = useDockStore((state) => state.activeLocalView);

  const groupedClients = useMemo(() => {
    const enabled = registryClients.filter((client) => client.enabled);
    const source = enabled.length ? enabled : fallbackClients;
    const map = new Map<ServiceCategory, ServiceClient[]>();
    source.forEach((client) => {
      const bucket = map.get(client.category) ?? [];
      bucket.push(client);
      map.set(client.category as ServiceCategory, bucket);
    });
    return serviceCategories
      .map((category) => ({
        category,
        clients: (map.get(category) ?? []).slice().sort((a, b) => a.title.localeCompare(b.title))
      }))
      .filter((group) => group.clients.length > 0);
  }, [registryClients]);

  const resolveIcon = (client: ServiceClient): string => {
    if (client.icon) {
      if (client.icon.startsWith("builtin:")) {
        const builtinKey = client.icon.slice("builtin:".length);
        return builtinIconMap[builtinKey] || builtinIconMap[client.id] || logoIcon;
      }
      return client.icon;
    }
    return builtinIconMap[client.id] || logoIcon;
  };

  const selectService = useDockStore((state) => state.actions.selectService);
  const toggleDrawer = useDockStore((state) => state.actions.toggleDrawer);
  const showToast = useDockStore((state) => state.actions.showToast);
  const focusLocalView = useDockStore((state) => state.actions.focusLocalView);

  const bottomButtons = [
    {
      id: "prompts",
      label: "Prompts",
      icon: promptsIcon,
      onClick: () => void toggleDrawer(true)
    },
    {
      id: "about",
      label: "About",
      icon: infoIcon,
      onClick: () => showToast("AI Dock v1.0.0")
    },
    {
      id: "exit",
      label: "Exit",
      icon: exitIcon,
      onClick: () => window.close()
    }
  ];

  const localViews = [
    {
      id: "chat",
      label: "Chat",
      icon: chatIcon,
      isActive: activeLocalView === "chat",
      onClick: () => {
        void focusLocalView("chat");
      }
    },
    {
      id: "completions",
      label: "Connections",
      icon: connectionsIcon,
      isActive: activeLocalView === "completions",
      onClick: () => {
        void focusLocalView("completions");
      }
    }
  ];

  return (
    <aside id="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <img src={logoIcon} alt="AI Dock logo" />
          <span>AI Dock</span>
        </div>
        <div className="sidebar-local">
          {localViews.map((item) => (
            <button
              key={item.id}
              className={`sidebar-btn${item.isActive ? " active" : ""}`}
              title={item.label}
              onClick={item.onClick}
            >
              <img src={item.icon} alt={`${item.label} icon`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-services">
          {groupedClients.map(({ category, clients }) => (
            <div key={category} className="sidebar-category">
              <span className="sidebar-category-label">{categoryLabels[category]}</span>
              {clients.map((client) => {
                const iconSource = resolveIcon(client);
                const isActive = activeServiceId === client.id;
                return (
                  <button
                    key={client.id}
                    className={`sidebar-btn${isActive ? " active" : ""}`}
                    title={client.title}
                    onClick={() => {
                      void selectService(client.id);
                    }}
                  >
                    <img src={iconSource} alt={`${client.title} icon`} />
                    <span>{client.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-divider"></div>
      <div className="sidebar-bottom">
        {bottomButtons.map((button) => (
          <button
            key={button.id}
            className="sidebar-btn"
            title={button.label}
            onClick={button.onClick}
          >
            <img src={button.icon} alt={`${button.label} icon`} />
            <span>{button.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;





