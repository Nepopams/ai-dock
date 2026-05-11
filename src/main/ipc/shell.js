const fs = require("fs/promises");
const { BrowserWindow, clipboard, dialog, ipcMain } = require("electron");
const { randomUUID } = require("crypto");
const services = require("../services");
const { getState, setState } = require("../store");
const { HistoryStore } = require("../historyStore");
const { loadRegistry } = require("../services/registry");

const readPrompts = () => {
  const prompts = getState("prompts", []);
  return Array.isArray(prompts) ? prompts : [];
};

const writePrompts = (prompts) => {
  setState("prompts", prompts);
  return prompts;
};

const pickMetaString = (meta, keys) => {
  if (!meta || typeof meta !== "object") {
    return null;
  }
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
};

const normalizeUrl = (candidate) => {
  if (typeof candidate !== "string") {
    return null;
  }
  let url = candidate.trim();
  if (!url) {
    return null;
  }
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
};

const deriveUrlFromClient = (client) => {
  const metaUrl = pickMetaString(client.meta, ["defaultUrl", "startUrl", "homeUrl"]);
  if (metaUrl) {
    const normalizedMeta = normalizeUrl(metaUrl);
    if (normalizedMeta) {
      return normalizedMeta;
    }
  }
  const pattern = Array.isArray(client.urlPatterns)
    ? client.urlPatterns.find((entry) => typeof entry === "string" && entry.includes("http"))
    : null;
  if (pattern) {
    const stripped = pattern.replace(/\*.*$/, "").trim();
    const normalizedPattern = normalizeUrl(stripped);
    if (normalizedPattern) {
      return normalizedPattern.endsWith("/") ? normalizedPattern : `${normalizedPattern}/`;
    }
  }
  return null;
};

const derivePartitionFromClient = (client) => {
  const metaPartition = pickMetaString(client.meta, ["partition", "sessionPartition"]);
  if (metaPartition) {
    return metaPartition;
  }
  return `persist:svc-${client.id}`;
};

const resolveServiceById = async (serviceId) => {
  const staticService = services[serviceId];
  if (staticService) {
    return staticService;
  }

  try {
    const registry = await loadRegistry();
    const client = registry.clients.find((entry) => entry.id === serviceId);
    if (!client || client.enabled === false) {
      return null;
    }
    const resolvedUrl = deriveUrlFromClient(client);
    if (!resolvedUrl) {
      console.warn(`[tabs] unable to determine launch url for service "${serviceId}"`);
      return null;
    }
    return {
      id: client.id,
      title: client.title,
      url: resolvedUrl,
      partition: derivePartitionFromClient(client)
    };
  } catch (error) {
    console.warn(`[tabs] failed to resolve service "${serviceId}" from registry`, error);
    return null;
  }
};

const registerShellIpc = ({ getMainWindow, getTabManager }) => {
  ipcMain.handle("tabs:createOrFocus", async (_event, serviceId) => {
    const service = await resolveServiceById(serviceId);
    if (!service) {
      throw new Error("Unknown service");
    }
    const tabManager = getTabManager();
    tabManager.createOrFocus(service);
    return tabManager.list();
  });

  ipcMain.handle("tabs:close", (_event, tabId) => {
    const tabManager = getTabManager();
    tabManager.close(tabId);
    return tabManager.list();
  });

  ipcMain.handle("tabs:switch", (_event, tabId) => {
    const tabManager = getTabManager();
    tabManager.focus(tabId);
    return tabManager.list();
  });

  ipcMain.handle("tabs:list", () => {
    return getTabManager().list();
  });

  ipcMain.handle("tabs:focusLocal", () => {
    getTabManager().focusNone();
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
    const tabManager = getTabManager();
    if (tabManager) {
      tabManager.setDrawerInset(Math.max(0, Number(width) || 0));
    }
    return true;
  });

  ipcMain.handle("layout:setTopInset", (_event, height) => {
    const tabManager = getTabManager();
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
    getTabManager()?.broadcastPrompt(payload.text, agents);
    return true;
  });

  ipcMain.handle("promptRouter:history:list", () => {
    return HistoryStore.load();
  });

  ipcMain.handle("promptRouter:history:add", (_event, text) => {
    return HistoryStore.save(text);
  });

  ipcMain.handle("save-chat-md", async (event) => {
    const tabManager = getTabManager();
    if (!tabManager) {
      return null;
    }

    const activeView = tabManager.getActiveView();
    if (!activeView) {
      await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender) || getMainWindow(), {
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
      service = services.alice ? "alice" : "alisa";
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
      alice: `
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
      await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender) || getMainWindow(), {
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
    const targetWindow = BrowserWindow.fromWebContents(event.sender) || getMainWindow();
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

module.exports = {
  registerShellIpc
};
