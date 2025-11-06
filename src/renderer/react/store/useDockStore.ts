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
import {
  AdapterStateSlice,
  AdapterStateActions,
  createAdapterStateSlice
} from "../../store/adapterStateSlice";
import {
  TemplatesSlice,
  TemplatesSliceActions,
  createTemplatesSlice
} from "../../store/templatesSlice";
import {
  MediaPresetsSlice,
  MediaPresetsActions,
  createMediaPresetsSlice
} from "../../store/mediaPresetsSlice";
import {
  FormProfilesSlice,
  FormProfilesActions,
  createFormProfilesSlice
} from "../../store/formProfilesSlice";
import {
  FormStreamSlice,
  FormStreamActions,
  createFormStreamSlice
} from "../../store/formStreamSlice";
import {
  FormRunSlice,
  FormRunActions,
  createFormRunSlice
} from "../../store/formRunSlice";
import {
  PromptHistorySlice,
  PromptHistoryActions,
  createPromptHistorySlice
} from "../../store/promptHistorySlice";
import {
  HistorySlice,
  HistoryActions,
  createHistorySlice
} from "../../store/historySlice";
import {
  JudgeSlice,
  JudgeActions,
  createJudgeSlice
} from "../../store/judgeSlice";
import { AdapterId, AdapterError } from "../../adapters/IAgentAdapter";
import { getAdapterById, resolveAdapterId } from "../../adapters/adapters";
import { extractVariables } from "../../../shared/utils/templateVars";
import { composeMediaPresetText } from "../../../shared/utils/mediaPresets";
import { PromptHistoryEntry, PromptTemplate } from "../../../shared/types/templates";
import { MediaPreset } from "../../../shared/types/mediaPresets";

declare global {
  interface Window {
    __AI_DOCK_HISTORY__?: {
      importLastFromAdapter: (payload: {
        tabId: string;
        adapterId: string;
        limit?: number;
      }) => Promise<{
        ok: boolean;
        adapterId?: AdapterId;
        clientId?: string;
        messages?: Array<{ role: "user" | "assistant"; text: string; ts?: string }>;
        title?: string;
        url?: string;
        error?: string;
        details?: string;
      }>;
      openInSource?: (payload: { clientId: string; tabId?: string; url?: string }) => Promise<boolean>;
    };
  }
}

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

interface PromptInsertionHistoryMeta {
  templateId?: string;
  title: string;
  renderedText: string;
}

interface PromptInsertionOptions {
  send?: boolean;
  text?: string;
  targetTabIds?: string[];
  historyMeta?: PromptInsertionHistoryMeta;
}

interface ApplyMediaPresetPayload {
  preset: MediaPreset;
  clientIds: string[];
  send: boolean;
}

export interface ApplyMediaPresetResult {
  applied: number;
  targetClients: string[];
  targetTabs: string[];
  warnings: Array<{ clientId: string; message: string }>;
  errors: Array<{ clientId?: string; message: string }>;
  text: string;
  send: boolean;
}

export interface CompareDraftAnswer {
  id: string;
  agentId: string;
  text: string;
  selected?: boolean;
}

export interface CompareDraft {
  requestId: string;
  question: string;
  answers: CompareDraftAnswer[];
  judgeProfileId?: string;
  rubric?: string;
}

interface ToastState {
  message: string;
  visible: boolean;
}

type LocalViewId =
  | "chat"
  | "completions"
  | "formProfiles"
  | "formRun"
  | "prompts"
  | "history"
  | "presets"
  | "compare"
  | null;

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
  setSelectedTabs: (tabIds: string[]) => void;
  insertPromptToTabs: (options?: PromptInsertionOptions) => Promise<void>;
  sendPrompt: () => Promise<void>;
  loadPromptHistory: () => Promise<void>;
  addPrompt: (input: { title: string; body: string }) => Promise<void>;
  removePrompt: (id: string) => Promise<void>;
  copyPrompt: (body: string, title?: string) => Promise<void>;
  saveChat: () => Promise<void>;
  hideToast: () => void;
  showToast: (message: string) => void;
  applyMediaPreset: (payload: ApplyMediaPresetPayload) => Promise<ApplyMediaPresetResult>;
  focusLocalView: (viewId: LocalViewId) => Promise<void>;
  prepareJudgeComparison: (payload: {
    question: string;
    answers: Array<{ agentId?: string; text: string; id?: string }>;
    judgeProfileId?: string;
    rubric?: string;
    requestId?: string;
  }) => Promise<void>;
  updateCompareDraft: (partial: Partial<CompareDraft>) => void;
};

export type DockActions = BaseActions &
  ChatSliceActions &
  RegistrySliceActions &
  AdapterStateActions &
  TemplatesSliceActions &
  FormProfilesActions &
  FormStreamActions &
  FormRunActions &
  MediaPresetsActions &
  HistoryActions &
  PromptHistoryActions &
  JudgeActions;

export interface DockState
  extends ChatSlice,
    RegistrySlice,
    AdapterStateSlice,
    TemplatesSlice,
    FormProfilesSlice,
    FormStreamSlice,
    FormRunSlice,
    MediaPresetsSlice,
    HistorySlice,
    PromptHistorySlice,
    JudgeSlice {
  services: ServiceMeta[];
  tabs: TabMeta[];
  prompts: PromptItem[];
  promptHistory: string[];
  selectedAgents: string[];
  selectedTabIds: string[];
  promptDraft: string;
  drawerOpen: boolean;
  promptPanelHidden: boolean;
  activeTabId: string | null;
  activeServiceId: string | null;
  activeLocalView: LocalViewId;
  compareDraft: CompareDraft | null;
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
  const adapterSlice = createAdapterStateSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const templatesSlice = createTemplatesSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const formProfilesSlice = createFormProfilesSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const formStreamSlice = createFormStreamSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const formRunSlice = createFormRunSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const mediaPresetsSlice = createMediaPresetsSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const promptHistorySlice = createPromptHistorySlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const historySlice = createHistorySlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );
  const judgeSlice = createJudgeSlice<DockState & { actions: DockActions }>(
    set,
    get as any
  );

  const baseState = {
    services: [] as ServiceMeta[],
    tabs: [] as TabMeta[],
    prompts: [] as PromptItem[],
    mediaPresets: [] as MediaPreset[],
    mediaPresetsLoading: false,
    mediaPresetsError: null,
    promptHistory: [] as string[],
    historyThreads: [] as HistorySlice["historyThreads"],
    historySelectedThreadId: null as HistorySlice["historySelectedThreadId"],
    historyThreadMessages: [] as HistorySlice["historyThreadMessages"],
    historyThreadTotal: 0 as HistorySlice["historyThreadTotal"],
    historyLoading: false as HistorySlice["historyLoading"],
    historyError: null as HistorySlice["historyError"],
    historySearchResult: null as HistorySlice["historySearchResult"],
    historyIngesting: false as HistorySlice["historyIngesting"],
    historyIngestError: null as HistorySlice["historyIngestError"],
    historyLastIngest: null as HistorySlice["historyLastIngest"],
    selectedAgents: [] as string[],
    selectedTabIds: [] as string[],
    promptDraft: "",
    drawerOpen: false,
    promptPanelHidden: getInitialPromptHidden(),
    activeTabId: null,
    activeServiceId: null,
    activeLocalView: null as LocalViewId,
    compareDraft: null as CompareDraft | null,
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
      const previousTabs = get().tabs;
      const removedTabIds = previousTabs
        .filter((prev) => !rawTabs.some((next: TabMeta) => next.id === prev.id))
        .map((tab) => tab.id);
      const active = rawTabs.find((tab: TabMeta) => tab.isActive);
      set((state) => ({
        tabs: rawTabs,
        activeTabId: active ? active.id : null,
        activeServiceId: active?.serviceId ?? null,
        activeLocalView: active ? null : state.activeLocalView,
        selectedTabIds: state.selectedTabIds.filter((id) => rawTabs.some((tab) => tab.id === id))
      }));
      removedTabIds.forEach((tabId) => {
        get().actions.clearAdapterState(tabId);
      });
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
      const fetchTemplates = get().actions.fetchTemplates;
      if (fetchTemplates) {
        await fetchTemplates();
      }
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
    setSelectedTabs: (tabIds) => {
      const unique = Array.from(new Set(tabIds.filter(Boolean)));
      set({ selectedTabIds: unique });
    },
    insertPromptToTabs: async (options) => {
      const rawText = options?.text ?? get().promptDraft;
      const text = (rawText || "").trim();
      if (!text) {
        get().actions.showToast("Enter prompt text before inserting.");
        return;
      }

      const send = Boolean(options?.send);
      const tabs = get().tabs;
      const preferred =
        Array.isArray(options?.targetTabIds) && options?.targetTabIds.length
          ? options.targetTabIds.filter(Boolean)
          : [];
      const selected = preferred.length
        ? preferred
        : get().selectedTabIds.length
          ? get().selectedTabIds
          : tabs.filter((tab) => tab.serviceId).map((tab) => tab.id);
      if (!selected.length) {
        get().actions.showToast("Select at least one target tab.");
        return;
      }

      const registryClients = get().registryClients || [];
      const insertResults = await Promise.all(
        selected.map(async (tabId) => {
          const tab = tabs.find((item) => item.id === tabId);
          if (!tab || !tab.serviceId) {
            get().actions.setAdapterError(tabId, "Tab is not bound to a service");
            return false;
          }
          const ready = await get().actions.checkAdapterReady(tabId, tab.serviceId);
          if (!ready) {
            return false;
          }
          const client = registryClients.find((item) => item.id === tab.serviceId);
          const adapterId = resolveAdapterId(client?.adapterId as string | undefined);
          if (!client || !adapterId) {
            get().actions.setAdapterError(tabId, "Adapter not configured");
            return false;
          }
          let adapter;
          try {
            adapter = getAdapterById(adapterId);
          } catch (error) {
            get().actions.setAdapterError(tabId, error instanceof Error ? error.message : String(error));
            return false;
          }
          try {
            await adapter.insert({ tabId }, text);
            if (send) {
              await adapter.send({ tabId });
              void adapter
                .readLastAnswer({ tabId })
                .catch((error) => console.warn("[adapter] readLastAnswer failed", error));
            }
            set((state) => ({
              adapterStateByTab: {
                ...state.adapterStateByTab,
                [tabId]: {
                  adapterId,
                  ready: true,
                  checking: false,
                  lastError: undefined,
                  lastCheckAt: new Date().toISOString()
                }
              }
            }));
            return true;
          } catch (error) {
            const message =
              error instanceof AdapterError
                ? `${error.code}: ${error.message}`
                : error instanceof Error
                  ? error.message
                  : String(error);
            get().actions.setAdapterError(tabId, message);
            return false;
          }
        })
      );
      const successCount = insertResults.filter(Boolean).length;
      if (!successCount) {
        get().actions.showToast("Prompt insertion failed for all selected tabs.");
        return;
      }

      if (options?.historyMeta) {
        const id =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2);
        const entry: PromptHistoryEntry = {
          id,
          templateId: options.historyMeta.templateId,
          title: options.historyMeta.title,
          renderedPreview: options.historyMeta.renderedText,
          targetTabIds: selected,
          action: send ? "insert_send" : "insert",
          at: new Date().toISOString()
        };
        const append = get().actions.appendPromptHistory;
        if (append) {
          await append(entry).catch((error) => {
            console.warn("[prompt-history] append failed", error);
          });
        }
      }
      get().actions.showToast(
        send ? "Prompt inserted and submitted" : "Prompt inserted"
      );
    },
    sendPrompt: async () => {
      if (!window.api?.promptRouter) {
        return;
      }
      const text = get().promptDraft.trim();
      if (!text) {
        get().actions.showToast("Enter prompt text before sending.");
        return;
      }

      const targetAgents = get().selectedAgents.length
        ? get().selectedAgents
        : get().services.map((svc) => svc.id);
      if (!targetAgents.length) {
        get().actions.showToast("No target agents available for this prompt.");
        return;
      }

      await window.api.promptRouter.broadcast({ text, agents: targetAgents });
      await window.api.promptRouter.saveToHistory(text);
      set({ promptDraft: "" });
      await get().actions.loadPromptHistory();
      get().actions.showToast("Prompt broadcast to selected agents.");
    },
    loadPromptHistory: async () => {
      const fetchHistory = get().actions.fetchPromptHistory;
      if (fetchHistory) {
        await fetchHistory();
      }
    },
    addPrompt: async (input) => {
      const upsert = get().actions.upsertTemplate;
      if (!upsert) {
        return;
      }
      const now = new Date().toISOString();
      const varsMeta = extractVariables(input.body).map((item) => ({
        name: item.name,
        defaultValue: item.defaultValue
      }));
      const createId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? () => crypto.randomUUID()
          : () => Math.random().toString(36).slice(2);
      const template: PromptTemplate = {
        id: createId(),
        title: input.title.trim(),
        body: input.body.trim(),
        tags: [] as string[],
        createdAt: now,
        updatedAt: now,
        ...(varsMeta.length ? { varsMeta } : {})
      };
      const saved = await upsert(template);
      if (saved) {
        get().actions.showToast("Template saved.");
      }

    },
    removePrompt: async (id) => {
      const remove = get().actions.removeTemplate;
      if (remove) {
        await remove(id);
      }
    },
    copyPrompt: async (body, title) => {
      if (!window.api?.clipboard) {
        return;
      }
      await window.api.clipboard.copy(body);
      get().actions.showToast(
        title ? `Copied "${title}" to clipboard.` : "Prompt copied to clipboard."
      );
    },
    saveChat: async () => {
      await window.aiDock?.saveChatMarkdown();
    },
    hideToast: () => set({ toast: { message: "", visible: false } }),
    showToast: (message: string) => set({ toast: { message, visible: true } }),
    applyMediaPreset: async ({ preset, clientIds, send }) => {
      const registryClients = get().registryClients || [];
      const selectedIds = (clientIds && clientIds.length ? clientIds : preset.boundClients || []).filter(Boolean);
      const uniqueClientIds = Array.from(new Set(selectedIds));
      const text = composeMediaPresetText(preset);
      const warnings: Array<{ clientId: string; message: string }> = [];
      const errors: Array<{ clientId?: string; message: string }> = [];

      if (!uniqueClientIds.length) {
        return {
          applied: 0,
          targetClients: [],
          targetTabs: [],
          warnings,
          errors: [{ message: "No clients selected" }],
          text,
          send
        };
      }

      uniqueClientIds.forEach((clientId) => {
        const client = registryClients.find((entry) => entry.id === clientId);
        if (!client) {
          warnings.push({ clientId, message: "Client not found in registry" });
          return;
        }
        const adapterId = resolveAdapterId(client.adapterId as string | undefined);
        if (!adapterId) {
          warnings.push({ clientId, message: "Adapter not configured" });
        }
      });

      if (!window.api?.tabs?.createOrFocus) {
        return {
          applied: 0,
          targetClients: uniqueClientIds,
          targetTabs: [],
          warnings,
          errors: [{ message: "Tabs API is unavailable" }],
          text,
          send
        };
      }

      for (const clientId of uniqueClientIds) {
        try {
          await window.api.tabs.createOrFocus(clientId);
        } catch (error) {
          errors.push({
            clientId,
            message: error instanceof Error ? error.message : String(error)
          });
        }
      }

      await get().actions.refreshTabs();
      const refreshedTabs = get().tabs;
      const targetTabIds = uniqueClientIds
        .map((clientId) => refreshedTabs.find((tab) => tab.serviceId === clientId)?.id)
        .filter((id): id is string => typeof id === "string" && id.trim().length > 0);

      if (!targetTabIds.length) {
        errors.push({ message: "No active tabs found for selected clients" });
        return {
          applied: 0,
          targetClients: uniqueClientIds,
          targetTabs: [],
          warnings,
          errors,
          text,
          send
        };
      }

      try {
        await get().actions.insertPromptToTabs({
          text,
          send,
          targetTabIds,
          historyMeta: {
            templateId: preset.id,
            title: preset.title,
            renderedText: text
          }
        });
      } catch (error) {
        errors.push({
          message: error instanceof Error ? error.message : String(error)
        });
      }

      return {
        applied: targetTabIds.length,
        targetClients: uniqueClientIds,
        targetTabs: targetTabIds,
        warnings,
        errors,
        text,
        send
      };
    },
    focusLocalView: async (viewId) => {
      if (viewId) {
        await window.api?.tabs.focusLocal();
      }
      set({ activeLocalView: viewId, activeTabId: null, activeServiceId: null });
    },
    prepareJudgeComparison: async (payload) => {
      const answers = Array.isArray(payload?.answers)
        ? payload.answers
            .map((answer) => ({
              agentId:
                typeof answer?.agentId === "string" && answer.agentId.trim()
                  ? answer.agentId.trim()
                  : "",
              text: typeof answer?.text === "string" ? answer.text : "",
              id:
                typeof answer?.id === "string" && answer.id.trim()
                  ? answer.id.trim()
                  : undefined
            }))
            .filter((answer) => answer.text.trim().length > 0)
        : [];
      if (answers.length < 2) {
        get().actions.showToast("Select at least two answers to compare");
        return;
      }
      const createId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? () => crypto.randomUUID()
          : () => Math.random().toString(36).slice(2);
      const question =
        typeof payload?.question === "string" ? payload.question : "";
      const requestId =
        typeof payload?.requestId === "string" && payload.requestId.trim()
          ? payload.requestId.trim()
          : createId();
      set((state) => ({
        compareDraft: {
          requestId,
          question,
          answers: answers.map((answer, index) => ({
            id: answer.id || `answer_${index + 1}`,
            agentId: answer.agentId || `answer_${index + 1}`,
            text: answer.text
          })),
          judgeProfileId: payload?.judgeProfileId,
          rubric: payload?.rubric
        }
      }));
      await get().actions.focusLocalView("compare");
    },
    updateCompareDraft: (partial) => {
      if (!partial) {
        return;
      }
      set((state) => {
        if (!state.compareDraft) {
          return {} as Partial<DockState>;
        }
        return {
          compareDraft: {
            ...state.compareDraft,
            ...partial,
            answers: Array.isArray(partial.answers)
              ? partial.answers
              : state.compareDraft.answers
          }
        } as Partial<DockState>;
      });
    }
  };

  return {
    ...baseState,
    ...chatSlice.state,
    ...registrySlice.state,
    ...adapterSlice.state,
    ...templatesSlice.state,
    ...formProfilesSlice.state,
    ...formStreamSlice.state,
    ...formRunSlice.state,
    ...mediaPresetsSlice.state,
    ...promptHistorySlice.state,
    ...historySlice.state,
    ...judgeSlice.state,
    actions: {
      ...baseActions,
      ...chatSlice.actions,
      ...registrySlice.actions,
      ...adapterSlice.actions,
      ...templatesSlice.actions,
      ...formProfilesSlice.actions,
      ...formStreamSlice.actions,
      ...formRunSlice.actions,
      ...mediaPresetsSlice.actions,
      ...promptHistorySlice.actions,
      ...historySlice.actions,
      ...judgeSlice.actions
    }
  } as DockState;
});

const deriveHistoryTitle = (
  messages: Array<{ role: "user" | "assistant"; text: string }>,
  fallback?: string | null
): string | undefined => {
  const candidate =
    messages.find((item) => item.role === "user")?.text ||
    messages.find((item) => item.role === "assistant")?.text ||
    fallback ||
    "";
  const compact = String(candidate).replace(/\s+/g, " ").trim();
  if (!compact) {
    return undefined;
  }
  return compact.length > 80 ? `${compact.slice(0, 77)}...` : compact;
};

const ensureHistoryBridge = () => {
  if (typeof window === "undefined") {
    return;
  }
  const importLastFromAdapter = async (payload: {
    tabId: string;
    adapterId: string;
    limit?: number;
  }) => {
    if (!payload || typeof payload !== "object") {
      return { ok: false, error: "Invalid payload" as const };
    }
    const tabId = String(payload.tabId || "").trim();
    const adapterRaw = String(payload.adapterId || "").trim();
    if (!tabId) {
      return { ok: false, error: "tabId is required" as const };
    }
    if (!adapterRaw) {
      return { ok: false, error: "adapterId is required" as const };
    }
    const resolved = resolveAdapterId(adapterRaw);
    if (!resolved) {
      return { ok: false, error: `Unsupported adapter: ${adapterRaw}` as const };
    }
    let adapter;
    try {
      adapter = getAdapterById(resolved);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, error: message as const };
    }
    const limit = Number.isFinite(payload.limit) ? Math.max(1, Math.min(50, Number(payload.limit))) : 10;
    try {
      let history =
        typeof adapter.exportHistory === "function"
          ? await adapter.exportHistory({ tabId }, limit)
          : null;
      if (!history || !Array.isArray(history) || !history.length) {
        const text = await adapter.readLastAnswer({ tabId });
        history = text
          ? [
              {
                role: "assistant" as const,
                text,
                ts: new Date().toISOString()
              }
            ]
          : [];
      }
      const messages = history
        .map((entry) => ({
          role: entry.role === "assistant" ? "assistant" : "user",
          text: String(entry.text || ""),
          ts: entry.ts
        }))
        .filter((entry) => entry.text.trim().length > 0);
      if (!messages.length) {
        return { ok: false, error: "Adapter returned empty history" as const };
      }
      let clientId: string | undefined;
      let titleHint: string | undefined;
      if (window.api?.tabs?.list) {
        try {
          const tabs = await window.api.tabs.list();
          if (Array.isArray(tabs)) {
            const tab = tabs.find((item) => item.id === tabId);
            if (tab) {
              if (typeof tab.serviceId === "string" && tab.serviceId.trim()) {
                clientId = tab.serviceId.trim();
              }
              if (typeof tab.title === "string" && tab.title.trim()) {
                titleHint = tab.title.trim();
              }
            }
          }
        } catch (error) {
          console.warn("[history] failed to list tabs for ingest", error);
        }
      }
      const title = deriveHistoryTitle(messages, titleHint);
      return {
        ok: true as const,
        adapterId: resolved,
        clientId: clientId || resolved,
        messages,
        title
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, error: message as const };
    }
  };

  const openInSource = async (payload: { clientId?: string; tabId?: string; url?: string }) => {
    if (!payload || typeof payload !== "object") {
      return false;
    }
    const tabId = typeof payload.tabId === "string" ? payload.tabId.trim() : "";
    const clientId = typeof payload.clientId === "string" ? payload.clientId.trim() : "";
    if (tabId && window.api?.tabs?.switch) {
      try {
        await window.api.tabs.switch(tabId);
        return true;
      } catch (error) {
        console.warn("[history] failed to focus tab by id", error);
      }
    }
    if (clientId && window.api?.tabs?.createOrFocus) {
      try {
        await window.api.tabs.createOrFocus(clientId);
        return true;
      } catch (error) {
        console.warn("[history] failed to focus tab by client id", error);
      }
    }
    if (payload.url && typeof payload.url === "string") {
      try {
        window.open(payload.url, "_blank", "noopener");
        return true;
      } catch (error) {
        console.warn("[history] failed to open fallback url", error);
      }
    }
    return false;
  };

  const root = window.__AI_DOCK_HISTORY__ || {};
  root.importLastFromAdapter = importLastFromAdapter;
  root.openInSource = openInSource;
  window.__AI_DOCK_HISTORY__ = root;
};

ensureHistoryBridge();







if (typeof window !== "undefined") {
  const registryApi = window.registry;
  if (registryApi?.watch) {
    if (!(window as unknown as Record<string, unknown>).__registryWatchCleanup) {
      const cleanup = registryApi.watch(() => {
        const actions = useDockStore.getState().actions;
        if (actions?.applyRegistryChange) {
          void actions.applyRegistryChange();
        }
      });
      (window as unknown as Record<string, unknown>).__registryWatchCleanup = cleanup;
      window.addEventListener("beforeunload", () => {
        const storedCleanup = (window as unknown as Record<string, unknown>).__registryWatchCleanup;
        if (typeof storedCleanup === "function") {
          storedCleanup();
        }
        delete (window as unknown as Record<string, unknown>).__registryWatchCleanup;
      });
    }
    const actions = useDockStore.getState().actions;
    if (actions?.fetchRegistry) {
      void actions.fetchRegistry();
    }
  }
}

if (typeof window !== "undefined") {
  const actions = useDockStore.getState().actions;
  if (actions?.fetchTemplates) {
    void actions.fetchTemplates();
  }
  if (actions?.fetchFormProfiles) {
    void actions.fetchFormProfiles();
  }
  if (actions?.fetchMediaPresets) {
    void actions.fetchMediaPresets();
  }
  if (actions?.fetchPromptHistory) {
    void actions.fetchPromptHistory();
  }
}

if (typeof window !== "undefined") {
  const judgeApi = window.judge;
  if (judgeApi?.onProgress) {
    const root = window as unknown as Record<string, unknown>;
    if (!root.__judgeProgressCleanup) {
      const cleanup = judgeApi.onProgress((event) => {
        const actions = useDockStore.getState().actions;
        if (actions?.handleJudgeProgress) {
          actions.handleJudgeProgress(event);
        }
      });
      root.__judgeProgressCleanup = cleanup;
      window.addEventListener("beforeunload", () => {
        const storedCleanup = (window as unknown as Record<string, unknown>).__judgeProgressCleanup;
        if (typeof storedCleanup === "function") {
          storedCleanup();
        }
        delete (window as unknown as Record<string, unknown>).__judgeProgressCleanup;
      });
    }
  }
}




























