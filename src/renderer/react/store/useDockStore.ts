import { create } from "zustand";
import {
  ChatSlice,
  ChatSliceActions,
  createChatSlice
} from "./chatSlice";
import {
  RegistrySlice,
  RegistrySliceActions,
  createRegistrySlice
} from "../../store/registrySlice";

export interface ServiceMeta {
  id: string;
  title: string;
}

export interface TabMeta {
  id: string;
  title: string;
  serviceId: string | null;
  isActive?: boolean;
}

export interface PromptItem {
  id: string;
  title: string;
  body: string;
  updatedAt?: string;
}

interface ToastState {
  message: string;
  visible: boolean;
}

type LocalViewId = "chat" | "completions" | null;

type BaseActions = {
  loadServices: () => Promise<void>;
  refreshTabs: () => Promise<void>;
  selectService: (serviceId: string) => Promise<void>;
  switchTab: (tabId: string) => Promise<void>;
  closeTab: (tabId: string) => Promise<void>;
  loadPrompts: () => Promise<void>;
  toggleDrawer: (force?: boolean) => Promise<void>;
  togglePromptPanel: () => void;
  setPromptDraft: (text: string) => void;
  setSelectedAgents: (agents: string[]) => void;
  sendPrompt: () => Promise<void>;
  loadPromptHistory: () => Promise<void>;
  addPrompt: (input: { title: string; body: string }) => Promise<void>;
  removePrompt: (id: string) => Promise<void>;
  copyPrompt: (body: string, title?: string) => Promise<void>;
  saveChat: () => Promise<void>;
  hideToast: () => void;
  showToast: (message: string) => void;
  focusLocalView: (viewId: LocalViewId) => Promise<void>;
};

export type DockActions = BaseActions & ChatSliceActions & RegistrySliceActions;

export interface DockState extends ChatSlice, RegistrySlice {
  services: ServiceMeta[];
  tabs: TabMeta[];
  prompts: PromptItem[];
  promptHistory: string[];
  selectedAgents: string[];
  promptDraft: string;
  drawerOpen: boolean;
  promptPanelHidden: boolean;
  activeTabId: string | null;
  activeServiceId: string | null;
  activeLocalView: LocalViewId;
  toast: ToastState;
  actions: DockActions;
}

const getInitialPromptHidden = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem("promptHidden") === "true";
};

export const useDockStore = create<DockState>((set, get) => {
  const chatSlice = createChatSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const registrySlice = createRegistrySlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );

  const baseState = {
    services: [] as ServiceMeta[],
    tabs: [] as TabMeta[],
    prompts: [] as PromptItem[],
    promptHistory: [] as string[],
    selectedAgents: [] as string[],
    promptDraft: "",
    drawerOpen: false,
    promptPanelHidden: getInitialPromptHidden(),
    activeTabId: null,
    activeServiceId: null,
    activeLocalView: null as LocalViewId,
    toast: { message: "", visible: false }
  };

  const baseActions: BaseActions = {
    loadServices: async () => {
      if (!window.api?.promptRouter) {
        return;
      }
      const services = await window.api.promptRouter.getAgents();
      set((state) => ({
        services,
        selectedAgents: state.selectedAgents.length ? state.selectedAgents : services.map((svc: ServiceMeta) => svc.id)
      }));
    },
    refreshTabs: async () => {
      if (!window.api?.tabs) {
        return;
      }
      const rawTabs = await window.api.tabs.list();
      const active = rawTabs.find((tab: TabMeta) => tab.isActive);
      set((state) => ({
        tabs: rawTabs,
        activeTabId: active ? active.id : null,
        activeServiceId: active?.serviceId ?? null,
        activeLocalView: active ? null : state.activeLocalView
      }));
    },
    selectService: async (serviceId) => {
      if (!window.api?.tabs) {
        return;
      }
      await window.api.tabs.createOrFocus(serviceId);
      await get().actions.refreshTabs();
    },
    switchTab: async (tabId) => {
      if (!window.api?.tabs) {
        return;
      }
      await window.api.tabs.switch(tabId);
      set({ activeLocalView: null });
      await get().actions.refreshTabs();
    },
    closeTab: async (tabId) => {
      if (!window.api?.tabs) {
        return;
      }
      await window.api.tabs.close(tabId);
      await get().actions.refreshTabs();
    },
    loadPrompts: async () => {
      if (!window.api?.prompts) {
        return;
      }
      const prompts = await window.api.prompts.list();
      set({ prompts });
    },
    toggleDrawer: async (force) => {
      const open = typeof force === "boolean" ? force : !get().drawerOpen;
      set({ drawerOpen: open });
      if (window.api?.layout) {
        await window.api.layout.setDrawer(open ? 320 : 0);
      }
      if (open) {
        await get().actions.loadPrompts();
      }
    },
    togglePromptPanel: () => {
      set((state) => {
        const hidden = !state.promptPanelHidden;
        if (typeof window !== "undefined") {
          localStorage.setItem("promptHidden", hidden ? "true" : "false");
        }
        return { promptPanelHidden: hidden };
      });
    },
    setPromptDraft: (text) => {
      set({ promptDraft: text });
    },
    setSelectedAgents: (agents) => {
      set({ selectedAgents: agents });
    },
    sendPrompt: async () => {
      if (!window.api?.promptRouter) {
        return;
      }
      const text = get().promptDraft.trim();
      if (!text) {
        get().actions.showToast("Введите промт");
        return;
      }
      const targetAgents = get().selectedAgents.length
        ? get().selectedAgents
        : get().services.map((svc) => svc.id);
      if (!targetAgents.length) {
        get().actions.showToast("Нет выбранных агентов");
        return;
      }
      await window.api.promptRouter.broadcast({ text, agents: targetAgents });
      await window.api.promptRouter.saveToHistory(text);
      set({ promptDraft: "" });
      await get().actions.loadPromptHistory();
      get().actions.showToast("Промт отправлен");
    },
    loadPromptHistory: async () => {
      if (!window.api?.promptRouter) {
        return;
      }
      const history = await window.api.promptRouter.getHistory();
      set({ promptHistory: history });
    },
    addPrompt: async (input) => {
      if (!window.api?.prompts) {
        return;
      }
      await window.api.prompts.add(input);
      await get().actions.loadPrompts();
      get().actions.showToast("Промт сохранён");
    },
    removePrompt: async (id) => {
      if (!window.api?.prompts) {
        return;
      }
      await window.api.prompts.remove(id);
      await get().actions.loadPrompts();
    },
    copyPrompt: async (body, title) => {
      if (!window.api?.clipboard) {
        return;
      }
      await window.api.clipboard.copy(body);
      get().actions.showToast(title ? `Промт "${title}" скопирован` : "Скопировано");
    },
    saveChat: async () => {
      await window.aiDock?.saveChatMarkdown();
    },
    hideToast: () => set({ toast: { message: "", visible: false } }),
    showToast: (message: string) => set({ toast: { message, visible: true } }),
    focusLocalView: async (viewId) => {
      if (viewId) {
        await window.api?.tabs.focusLocal();
      }
      set({ activeLocalView: viewId, activeTabId: null, activeServiceId: null });
    }
  };

  return {
    ...baseState,
    ...chatSlice.state,
    ...registrySlice.state,
    actions: {
      ...baseActions,
      ...chatSlice.actions,
      ...registrySlice.actions
    }
  } as DockState;
});






