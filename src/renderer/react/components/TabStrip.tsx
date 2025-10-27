import { ForwardedRef, forwardRef } from "react";
import { useDockStore } from "../store/useDockStore";

const TabStrip = forwardRef<HTMLElement>((_props, ref) => {
  const tabs = useDockStore((state) => state.tabs);
  const activeTabId = useDockStore((state) => state.activeTabId);
  const switchTab = useDockStore((state) => state.actions.switchTab);
  const closeTab = useDockStore((state) => state.actions.closeTab);
  const saveChat = useDockStore((state) => state.actions.saveChat);

  return (
    <header id="tabstrip" ref={ref as ForwardedRef<HTMLElement>}>
      <div id="tabs">
        {tabs.length === 0 && <span className="tab-empty">Нет открытых вкладок</span>}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab${tab.id === activeTabId ? " active" : ""}`}
            onClick={() => {
              void switchTab(tab.id);
            }}
          >
            <span>{tab.title}</span>
            <button
              type="button"
              aria-label={`Close ${tab.title}`}
              onClick={(event) => {
                event.stopPropagation();
                void closeTab(tab.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="tabstrip-actions">
        <button
          id="btnSaveChat"
          className="pill-btn"
          onClick={() => {
            void saveChat();
          }}
        >
          Save Chat
        </button>
      </div>
    </header>
  );
});

export default TabStrip;
