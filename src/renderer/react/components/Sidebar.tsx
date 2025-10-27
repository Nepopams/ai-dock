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

const serviceIcons: Record<string, string> = {
  chatgpt: gptIcon,
  claude: claudeIcon,
  alisa: alisaIcon,
  deepseek: deepseekIcon,
  uxpilot: uxpilotIcon
};

function Sidebar() {
  const services = useDockStore((state) => state.services);
  const activeServiceId = useDockStore((state) => state.activeServiceId);
  const activeLocalView = useDockStore((state) => state.activeLocalView);
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
      id: "connections",
      label: "Connections",
      icon: connectionsIcon,
      onClick: () => {
        void focusLocalView("completions");
      }
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
          {(services.length
            ? services
            : [
                { id: "chatgpt", title: "ChatGPT" },
                { id: "claude", title: "Claude" },
                { id: "alisa", title: "Alisa" },
                { id: "deepseek", title: "DeepSeek" },
                { id: "uxpilot", title: "UX Pilot" }
              ]
          ).map((service) => {
            const icon = serviceIcons[service.id] || logoIcon;
            const isActive = activeServiceId === service.id;
            return (
              <button
                key={service.id}
                className={`sidebar-btn${isActive ? " active" : ""}`}
                title={service.title}
                onClick={() => {
                  void selectService(service.id);
                }}
              >
                <img src={icon} alt={`${service.title} icon`} />
                <span>{service.title}</span>
              </button>
            );
          })}
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
