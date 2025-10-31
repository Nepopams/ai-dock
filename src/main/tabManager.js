const { BrowserView, session, shell, Menu } = require("electron");
const { randomUUID } = require("crypto");
const { getState, setState } = require("./store");

class TabManager {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.tabs = [];
    this.activeTabId = null;
    this.sidebarWidth = 72;
    this.tabStripHeight = 44;
    this.topInset = this.tabStripHeight;
    this.extraLeftOffset = 0;

    this.mainWindow.on("resize", () => this.updateBounds());
    this.mainWindow.on("maximize", () => this.updateBounds());
    this.mainWindow.on("unmaximize", () => this.updateBounds());
  }

  createOrFocus(service) {
    const existing = this.tabs.find((tab) => tab.serviceId === service.id);
    if (existing) {
      this.focus(existing.id);
      return existing;
    }
    return this.#createTab({
      id: service.id,
      serviceId: service.id,
      title: service.title,
      url: service.url,
      partition: service.partition,
      focus: true
    });
  }

  addTab(url, options = {}) {
    const partition = options.partition || `persist:auto`;
    const tabId = options.id || randomUUID();
    const title = this.#deriveTitle(url);
    console.log(`[AI Dock] Spawning new tab: ${url}`);
    return this.#createTab({
      id: tabId,
      serviceId: null,
      title,
      url,
      partition,
      focus: true
    });
  }

  focus(tabId) {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (!tab) {
      return null;
    }

    if (this.activeTabId && this.activeTabId !== tabId) {
      const activeTab = this.tabs.find((t) => t.id === this.activeTabId);
      if (activeTab) {
        this.mainWindow.removeBrowserView(activeTab.view);
      }
    }

    this.activeTabId = tabId;
    this.mainWindow.setBrowserView(tab.view);
    this.updateBounds();
    return tab;
  }

  close(tabId) {
    const index = this.tabs.findIndex((t) => t.id === tabId);
    if (index === -1) {
      return;
    }

    const [tab] = this.tabs.splice(index, 1);
    if (tab.view && !tab.view.webContents.isDestroyed()) {
      try {
        this.mainWindow.removeBrowserView(tab.view);
      } catch (error) {
        // ignore removal errors
      }
      tab.view.webContents.destroy();
    }

    if (this.activeTabId === tabId) {
      const nextTab = this.tabs[index] || this.tabs[index - 1] || this.tabs[0];
      if (nextTab) {
        this.focus(nextTab.id);
      } else {
        this.activeTabId = null;
      }
    }
  }

  list() {
    return this.tabs.map((tab) => ({
      id: tab.id,
      serviceId: tab.serviceId,
      title: tab.title,
      isActive: tab.id === this.activeTabId
    }));
  }

  getActiveView() {
    const active = this.tabs.find((tab) => tab.id === this.activeTabId);
    return active ? active.view : null;
  }

  getView(tabId) {
    const tab = this.tabs.find((entry) => entry.id === tabId);
    if (!tab) {
      return null;
    }
    return tab.view || null;
  }

  persist() {
    const serviceTabs = this.tabs.filter((tab) => Boolean(tab.serviceId));
    const payload = {
      serviceOrder: serviceTabs.map((tab) => tab.serviceId),
      activeServiceId: serviceTabs.find((tab) => tab.id === this.activeTabId)?.serviceId || null
    };
    setState("tabs", payload);
  }

  restore(servicesRegistry) {
    const state = getState("tabs", null);
    if (!state || !Array.isArray(state.serviceOrder)) {
      return;
    }

    state.serviceOrder.forEach((serviceId) => {
      const service = servicesRegistry[serviceId];
      if (service) {
        this.#createTab({
          id: service.id,
          serviceId: service.id,
          title: service.title,
          url: service.url,
          partition: service.partition,
          focus: false
        });
      }
    });

    if (state.activeServiceId) {
      const target = this.tabs.find((tab) => tab.serviceId === state.activeServiceId);
      if (target) {
        this.focus(target.id);
        return;
      }
    }

    if (this.tabs.length) {
      this.focus(this.tabs[0].id);
    }
  }

  updateBounds() {
    const tab = this.tabs.find((t) => t.id === this.activeTabId);
    if (!tab) {
      return;
    }
    const { width, height } = this.mainWindow.getContentBounds();
    const offsetX = this.sidebarWidth + this.extraLeftOffset;
    const offsetY = this.topInset;
    tab.view.setBounds({
      x: offsetX,
      y: offsetY,
      width: Math.max(0, width - offsetX),
      height: Math.max(0, height - offsetY)
    });
    tab.view.setAutoResize({ width: true, height: true });
  }

  focusNone() {
    if (this.activeTabId) {
      const active = this.tabs.find((tab) => tab.id === this.activeTabId);
      if (active && active.view && !active.view.webContents.isDestroyed()) {
        try {
          this.mainWindow.removeBrowserView(active.view);
        } catch {
          // ignore removal errors
        }
      }
    }
    this.activeTabId = null;
  }

  setDrawerInset(pixels) {
    this.extraLeftOffset = Math.max(0, Number.isFinite(pixels) ? pixels : 0);
    this.updateBounds();
  }

  setTopInset(pixels) {
    const numeric = Number.isFinite(pixels) ? pixels : this.tabStripHeight;
    this.topInset = Math.max(this.tabStripHeight, numeric);
    this.updateBounds();
  }

  broadcastPrompt(text, agentIds = []) {
    if (!text || !agentIds || !agentIds.length) {
      return;
    }
    const payload = String(text);
    agentIds.forEach((agentId) => {
      const target = this.tabs.find((tab) => tab.serviceId === agentId);
      if (!target || !target.view || target.view.webContents.isDestroyed()) {
        return;
      }
      const script = this.#buildPromptInjectionScript(agentId, payload);
      target.view.webContents
        .executeJavaScript(script, true)
        .catch((error) => console.warn(`[AI Dock] Prompt inject failed for ${agentId}`, error));
    });
  }

  #createTab(options) {
    const {
      id,
      serviceId = null,
      title,
      url,
      partition,
      focus = true
    } = options;

    const partitionName = partition || "persist:auto";
    const partitionSession = session.fromPartition(partitionName);
    const view = new BrowserView({
      webPreferences: {
        session: partitionSession,
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false
      }
    });

    const tabRecord = {
      id,
      serviceId,
      title: title || this.#deriveTitle(url),
      url,
      partition: partitionName,
      view
    };

    this.tabs.push(tabRecord);
    this.#wireViewEvents(tabRecord);
    view.webContents.loadURL(url);

    if (focus) {
      this.focus(id);
    }

    return tabRecord;
  }

  #wireViewEvents(tab) {
    const { view } = tab;
    view.webContents.setWindowOpenHandler((details) => this.#handleWindowOpen(tab, details));
    view.webContents.on("context-menu", (event, params) => this.#handleContextMenu(tab, params));
    view.webContents.on("page-title-updated", (_event, pageTitle) => {
      tab.title = pageTitle || this.#deriveTitle(tab.url);
    });
    view.webContents.on("did-navigate", (_event, targetUrl) => {
      tab.url = targetUrl;
    });
  }

  #buildPromptInjectionScript(agentId, text) {
    const payload = JSON.stringify(text);
    const selectorMap = {
      chatgpt: ["textarea[data-id='root']", "[contenteditable='true']"],
      claude: ["textarea[placeholder*='Message']", "textarea"],
      alisa: ["textarea", "input[type='text']"],
      deepseek: [".prompt-textarea textarea", ".prompt-input textarea", "textarea"]
    };

    const selectors = selectorMap[agentId] || ["textarea", "input[type='text']", "[contenteditable='true']"];

    return `
      (function() {
        const selectors = ${JSON.stringify(selectors)};
        const text = ${payload};
        const setValue = (node) => {
          if (!node) return false;
          if (node.tagName === "TEXTAREA" || node.tagName === "INPUT") {
            node.focus();
            node.value = text;
            node.dispatchEvent(new Event("input", { bubbles: true }));
            return true;
          }
          if (node.getAttribute && node.getAttribute("contenteditable") === "true") {
            node.focus();
            node.innerHTML = text.replace(/\\n/g, "<br>");
            node.dispatchEvent(new Event("input", { bubbles: true }));
            return true;
          }
          return false;
        };
        for (const selector of selectors) {
          const node = document.querySelector(selector);
          if (setValue(node)) {
            return true;
          }
        }
        return false;
      })();
    `;
  }

  #handleWindowOpen(tab, details) {
    const targetUrl = details.url;
    if (!targetUrl) {
      return { action: "deny" };
    }

    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        this.addTab(targetUrl, { partition: tab.partition });
      } else {
        shell.openExternal(targetUrl);
      }
    } catch (error) {
      shell.openExternal(targetUrl);
    }

    return { action: "deny" };
  }

  #deriveTitle(targetUrl) {
    try {
      const parsed = new URL(targetUrl);
      return parsed.host || targetUrl;
    } catch (error) {
      return targetUrl;
    }
  }

  #handleContextMenu(tab, params) {
    const template = [];
    if (params.isEditable) {
      template.push(
        { role: "cut", label: "Cut" },
        { role: "copy", label: "Copy" },
        { role: "paste", label: "Paste" }
      );
    } else {
      template.push({ role: "copy", label: "Copy" });
    }

    template.push({ type: "separator" });
    template.push({
      label: "Inspect Element",
      click: () => {
        if (tab.view && !tab.view.webContents.isDestroyed()) {
          tab.view.webContents.openDevTools({ mode: "detach" });
        }
      }
    });

    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: this.mainWindow });
  }
}

module.exports = TabManager;
