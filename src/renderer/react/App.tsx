import { useRef } from "react";
import Sidebar from "./components/Sidebar";
import TabStrip from "./components/TabStrip";
import PromptRouter from "./components/PromptRouter";
import PromptDrawer from "./components/PromptDrawer";
import Toast from "./components/Toast";
import "./styles/global.css";
import { useTabsSync } from "./hooks/useTabsSync";
import { usePromptsSync } from "./hooks/usePromptsSync";
import { usePromptRouterSync } from "./hooks/usePromptRouterSync";
import { useTopInsetSync } from "./hooks/useTopInsetSync";
import ChatView from "./views/ChatView";
import ConnectionsSettings from "./views/ConnectionsSettings";
import { useDockStore } from "./store/useDockStore";

function App() {
  const routerRef = useRef<HTMLDivElement | null>(null);
  const tabstripRef = useRef<HTMLElement | null>(null);
  const activeLocalView = useDockStore((state) => state.activeLocalView);

  useTabsSync();
  usePromptsSync();
  usePromptRouterSync();
  useTopInsetSync(routerRef, tabstripRef);

  return (
    <div id="app">
      <Sidebar />
      <PromptRouter ref={routerRef} />
      <TabStrip ref={tabstripRef} />
      <main id="content">
        {activeLocalView === "chat" && <ChatView />}
        {activeLocalView === "completions" && <ConnectionsSettings />}
        <PromptDrawer />
        <Toast />
      </main>
    </div>
  );
}

export default App;
