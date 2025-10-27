export {};

declare global {
  interface Window {
    api?: {
      tabs: {
        createOrFocus: (serviceId: string) => Promise<void>;
        switch: (tabId: string) => Promise<void>;
        close: (tabId: string) => Promise<void>;
        list: () => Promise<any>;
      };
      prompts: {
        list: () => Promise<any>;
        add: (input: { title: string; body: string }) => Promise<any>;
        remove: (id: string) => Promise<any>;
      };
      clipboard: {
        copy: (text: string) => Promise<void>;
      };
      layout: {
        setDrawer: (width: number) => Promise<void>;
        setTopInset: (height: number) => Promise<void>;
      };
      promptRouter: {
        getAgents: () => Promise<any>;
        broadcast: (payload: { text: string; agents: string[] }) => Promise<void>;
        getHistory: () => Promise<string[]>;
        saveToHistory: (text: string) => Promise<void>;
      };
    };
    aiDock?: {
      saveChatMarkdown: () => Promise<void>;
    };
  }
}
