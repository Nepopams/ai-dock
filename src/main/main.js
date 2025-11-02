const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");
const { app, BrowserWindow, ipcMain, shell, clipboard, dialog } = require("electron");
const TabManager = require("./tabManager");
const services = require("./services");
const { getState, setState } = require("./store");
const { HistoryStore } = require("./historyStore");
const { randomUUID } = require("crypto");
const { registerChatIpc } = require("./ipc/chat");
const { registerCompletionsIpc } = require("./ipc/completions");
const { registerRegistryIpc } = require("./ipc/registry.ipc");
const { registerJudgeIpc } = require("./ipc/judge.ipc");
const { registerExportIpc } = require("./ipc/export.ipc");
const { registerHistoryIpc } = require("./ipc/history.ipc");
const { registerTemplatesIpc } = require("./ipc/templates.ipc");
const { registerMediaPresetsIpc } = require("./ipc/mediaPresets.ipc");
const { registerAdapterBridgeIpc } = require("./browserViews/adapterBridge");

let mainWindow;
let tabManager;
let ipcRegistered = false;
const isDev = !app.isPackaged;

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

const getRendererUrl = () => {
  const useViteUi = process.env.AI_DOCK_REACT_UI === "true";
  if (isDev && useViteUi) {
    return "http://localhost:5173";
  }
  if (useViteUi) {
    return path.join(__dirname, "..", "renderer", "react", "dist", "index.html");
  }
  return path.join(__dirname, "..", "renderer", "index.html");
};

const resolvePreloadPath = () => {
  if (process.env.AI_DOCK_PRELOAD_PATH) {
    return process.env.AI_DOCK_PRELOAD_PATH;
  }
  const bundled = path.join(__dirname, "..", "preload", "preload.dist.js");
  if (fsSync.existsSync(bundled)) {
    return bundled;
  }
  if (isDev) {
    console.warn(
      `[preload] bundled file not found at ${bundled}. ` +
        "Run `npm run preload:build` or start dev via `npm run dev:new-ui`."
    );
  }
  throw new Error(
    `Preload bundle is missing (expected at ${bundled}). ` +
      "Set AI_DOCK_PRELOAD_PATH or run the preload build step."
  );
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "AI Dock",
    backgroundColor: "#0f1115",
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: resolvePreloadPath(),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      additionalArguments: []
    }
  });

  if (!isDev) {
    mainWindow.removeMenu();
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  const rendererEntry = getRendererUrl();
  if (rendererEntry.startsWith("http")) {
    mainWindow.loadURL(rendererEntry);
  } else {
    mainWindow.loadFile(rendererEntry);
  }

  tabManager = new TabManager(mainWindow);
  mainWindow.tabManager = tabManager;
  tabManager.restore(services);
  if (!tabManager.list().length) {
    tabManager.createOrFocus(services.chatgpt);
  }

  mainWindow.on("close", () => {
    if (tabManager) {
      tabManager.persist();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    tabManager = null;
  });

  registerIpc(tabManager);
};

const readPrompts = () => {
  const prompts = getState("prompts", []);
  return Array.isArray(prompts) ? prompts : [];
};

const writePrompts = (prompts) => {
  setState("prompts", prompts);
  return prompts;
};

const registerIpc = (tabManagerInstance) => {
  if (ipcRegistered) {
    return;
  }
  ipcRegistered = true;
  registerChatIpc();
  registerCompletionsIpc();
  registerRegistryIpc();
  registerJudgeIpc();
  registerExportIpc();
  registerHistoryIpc();
  registerTemplatesIpc();
  registerMediaPresetsIpc();
  if (tabManagerInstance) {
    registerAdapterBridgeIpc(tabManagerInstance);
  }

  ipcMain.handle("tabs:createOrFocus", (_event, serviceId) => {
    const service = services[serviceId];
    if (!service) {
      throw new Error("Unknown service");
    }
    tabManager.createOrFocus(service);
    return tabManager.list();
  });

  ipcMain.handle("tabs:close", (_event, tabId) => {
    tabManager.close(tabId);
    return tabManager.list();
  });

  ipcMain.handle("tabs:switch", (_event, tabId) => {
    tabManager.focus(tabId);
    return tabManager.list();
  });

  ipcMain.handle("tabs:list", () => {
    return tabManager.list();
  });

  ipcMain.handle("tabs:focusLocal", () => {
    tabManager.focusNone();
    return true;
  });

  ipcMain.handle("prompts:list", () => {
    return readPrompts();
  });

  ipcMain.handle("prompts:add", (_event, { title, body }) => {
    const prompts = readPrompts();
    const prompt = {
      id: randomUUID(),
      title,
      body,
      updatedAt: new Date().toISOString()
    };
    prompts.push(prompt);
    writePrompts(prompts);
    return prompts;
  });

  ipcMain.handle("prompts:remove", (_event, id) => {
    const prompts = readPrompts().filter((prompt) => prompt.id !== id);
    writePrompts(prompts);
    return prompts;
  });

  ipcMain.handle("clipboard:copy", (_event, text) => {
    clipboard.writeText(text);
    return true;
  });

  ipcMain.handle("layout:setDrawer", (_event, width) => {
    if (tabManager) {
      tabManager.setDrawerInset(Math.max(0, Number(width) || 0));
    }
    return true;
  });

  ipcMain.handle("layout:setTopInset", (_event, height) => {
    if (tabManager) {
      const numeric = Math.max(0, Number(height) || tabManager.tabStripHeight);
      tabManager.setTopInset(numeric);
    }
    return true;
  });

  ipcMain.handle("promptRouter:getAgents", () => {
    return Object.values(services).map((service) => ({
      id: service.id,
      title: service.title
    }));
  });

  ipcMain.handle("promptRouter:broadcast", (_event, payload) => {
    if (!payload || typeof payload.text !== "string") {
      return false;
    }
    const agents = Array.isArray(payload.agents) && payload.agents.length ? payload.agents : [];
    tabManager?.broadcastPrompt(payload.text, agents);
    return true;
  });

  ipcMain.handle("promptRouter:history:list", () => {
    return HistoryStore.load();
  });

  ipcMain.handle("promptRouter:history:add", (_event, text) => {
    return HistoryStore.save(text);
  });

  ipcMain.handle("save-chat-md", async (event) => {
    if (!tabManager) {
      return null;
    }

    const activeView = tabManager.getActiveView();
    if (!activeView) {
      await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender) || mainWindow, {
        type: "info",
        message: "Could not find messages in the current chat."
      });
      return null;
    }

    const currentUrl = activeView.webContents.getURL() || "";
    let service = "unknown";
    if (currentUrl.includes("chat.openai.com")) {
      service = "chatgpt";
    } else if (currentUrl.includes("claude.ai")) {
      service = "claude";
    } else if (currentUrl.includes("alice") || currentUrl.includes("dialogs.yandex")) {
      service = "alisa";
    } else if (currentUrl.includes("deepseek.com")) {
      service = "deepseek";
    }

    const scriptByService = {
      chatgpt: `
        Array.from(document.querySelectorAll('[data-message-author-role]')).map(node => ({
          role: node.dataset.messageAuthorRole || 'assistant',
          text: (node.innerText || '').trim()
        }));
      `,
      claude: `
        Array.from(document.querySelectorAll('.message')).map(el => ({
          role: el.classList.contains('assistant') ? 'assistant' : 'user',
          text: (el.innerText || '').trim()
        }));
      `,
      alisa: `
        Array.from(document.querySelectorAll('.dialog__message')).map(el => ({
          role: el.classList.contains('bot') ? 'alisa' : 'user',
          text: (el.innerText || '').trim()
        }));
      `,
      deepseek: `
        Array.from(document.querySelectorAll('.chat-message')).map(el => ({
          role: (el.querySelector('.role')?.innerText || 'assistant').trim(),
          text: (el.querySelector('.text')?.innerText || '').trim()
        }));
      `
    };

    const script = scriptByService[service] || scriptByService.chatgpt;
    let messages = [];
    try {
      messages = await activeView.webContents.executeJavaScript(script, true);
    } catch (error) {
      console.error("[AI Dock] Failed to extract chat messages:", error);
    }

    if (!messages || !messages.length) {
      await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender) || mainWindow, {
        type: "info",
        message: "No messages were detected in the current chat."
      });
      return null;
    }

    const safeServiceName = service.charAt(0).toUpperCase() + service.slice(1);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const markdownChunks = [
      `# ${safeServiceName} Conversation`,
      `*Saved at ${timestamp}*`,
      ""
    ];

    messages.forEach((message) => {
      const roleLabel =
        message.role === "user"
          ? "User"
          : message.role === "assistant"
            ? "AI"
            : message.role || "AI";
      const body = (message.text || "").replace(/\n/g, "\n> ");
      markdownChunks.push(`**${roleLabel}:**\n> ${body}\n`);
    });

    const markdown = markdownChunks.join("\n");
    const targetWindow = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    const { canceled, filePath } = await dialog.showSaveDialog(targetWindow, {
      title: `Save ${safeServiceName} chat`,
      defaultPath: `${service}-conversation-${timestamp}.md`,
      filters: [{ name: "Markdown", extensions: ["md"] }]
    });

    if (!canceled && filePath) {
      await fs.writeFile(filePath, markdown, "utf8");
      console.log(`[AI Dock] Saved ${service} chat to ${filePath}`);
    }

    return filePath || null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("will-quit", () => {
  if (tabManager) {
    tabManager.persist();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});









