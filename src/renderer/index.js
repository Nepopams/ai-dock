import { renderTabs } from "./tabs.js";
import { PromptsDrawer } from "./prompts.js";

const tabsContainer = document.getElementById("tabs");
const serviceButtons = document.querySelectorAll(".sidebar-btn[data-service]");
const promptsButton = document.querySelector('.sidebar-btn[data-action="prompts"]');
const settingsButton = document.querySelector('.sidebar-btn[data-action="settings"]');
const aboutButton = document.querySelector('.sidebar-btn[data-action="about"]');
const exitButton = document.querySelector('.sidebar-btn[data-action="exit"]');
const drawerEl = document.getElementById("promptsDrawer");
const closeBtn = document.getElementById("promptsClose");
const toastEl = document.getElementById("toast");
const saveChatButton = document.getElementById("btnSaveChat");
const promptInput = document.getElementById("prompt-input");
const agentSelect = document.getElementById("prompt-agents");
const sendButton = document.getElementById("prompt-send");
const historySelect = document.getElementById("prompt-history");
const promptRouterContainer = document.getElementById("prompt-router-container");

let drawerOpen = false;
let toastTimeout;
let availableAgents = [];

const promptsDrawer = new PromptsDrawer({
  drawerEl,
  listEl: document.getElementById("promptList"),
  formEl: document.getElementById("promptForm"),
  titleInput: document.getElementById("promptTitle"),
  bodyInput: document.getElementById("promptBody"),
  onPromptUsed: (title) => {
    showToast(`Prompt "${title}" copied`);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await refreshTabs();
  await promptsDrawer.init();
  await initPromptRouter();
  await updateTopInset();
});

window.addEventListener("resize", () => {
  updateTopInset();
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const serviceId = button.dataset.service;
    await window.api.tabs.createOrFocus(serviceId);
    await refreshTabs();
  });
});

promptsButton?.addEventListener("click", () => setDrawerState(!drawerOpen));
closeBtn.addEventListener("click", () => setDrawerState(false));

settingsButton?.addEventListener("click", () => showToast("Settings coming soon"));
aboutButton?.addEventListener("click", () => showToast("AI Dock v1.0.0"));
exitButton?.addEventListener("click", () => window.close());
saveChatButton?.addEventListener("click", () => window.aiDock?.saveChatMarkdown());
sendButton?.addEventListener("click", () => handlePromptSend());
promptInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    handlePromptSend();
  }
});

historySelect?.addEventListener("change", (event) => {
  if (event.target.value) {
    promptInput.value = event.target.value;
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawerOpen) {
    setDrawerState(false);
  }
});

async function refreshTabs() {
  const tabs = await window.api.tabs.list();
  renderTabs(tabs, {
    container: tabsContainer,
    onSelect: async (tabId) => {
      await window.api.tabs.switch(tabId);
      await refreshTabs();
    },
    onClose: async (tabId) => {
      await window.api.tabs.close(tabId);
      await refreshTabs();
    }
  });
  updateSidebarState(tabs);
}

function updateSidebarState(tabs) {
  const active = tabs.find((tab) => tab.isActive);
  serviceButtons.forEach((button) => {
    button.classList.toggle("active", Boolean(active && button.dataset.service === active.serviceId));
  });
}

async function setDrawerState(open) {
  drawerOpen = open;
  drawerEl.classList.toggle("visible", open);
  drawerEl.setAttribute("aria-hidden", String(!open));
  promptsButton?.classList.toggle("active", open);
  await window.api.layout.setDrawer(0);
  if (open) {
    await promptsDrawer.refresh();
  }
}

async function initPromptRouter() {
  if (!window.api?.promptRouter || !agentSelect) {
    return;
  }
  try {
    availableAgents = await window.api.promptRouter.getAgents();
    agentSelect.innerHTML = "";
    availableAgents.forEach((agent) => {
      const option = document.createElement("option");
      option.value = agent.id;
      option.textContent = agent.title;
      option.selected = true;
      agentSelect.appendChild(option);
    });
    await refreshPromptHistory();
  } catch (error) {
    console.error("Failed to init prompt router", error);
  }
}

async function refreshPromptHistory() {
  if (!historySelect || !window.api?.promptRouter) {
    return;
  }
  const history = await window.api.promptRouter.getHistory();
  historySelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "📜 История промтов";
  historySelect.appendChild(placeholder);
  history.forEach((prompt) => {
    const option = document.createElement("option");
    option.value = prompt;
    option.textContent = prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt;
    historySelect.appendChild(option);
  });
}

async function handlePromptSend() {
  if (!promptInput || !window.api?.promptRouter) {
    return;
  }
  const text = promptInput.value.trim();
  if (!text) {
    return;
  }
  const agents = getSelectedAgents();
  if (!agents.length) {
    showToast("Choose at least one agent");
    return;
  }
  await window.api.promptRouter.broadcast({ text, agents });
  await window.api.promptRouter.saveToHistory(text);
  await refreshPromptHistory();
  promptInput.value = "";
  historySelect.value = "";
  showToast("Prompt routed");
}

function getSelectedAgents() {
  if (!agentSelect) {
    return [];
  }
  const selected = Array.from(agentSelect.selectedOptions || []).map((option) => option.value);
  if (selected.length) {
    return selected;
  }
  return availableAgents.map((agent) => agent.id);
}

async function updateTopInset() {
  const tabstripEl = document.getElementById("tabstrip");
  const tabstripHeight = tabstripEl?.offsetHeight || 0;
  const routerHeight = promptRouterContainer?.offsetHeight || 0;
  const total = tabstripHeight + routerHeight;
  document.documentElement.style.setProperty("--top-inset", `${total}px`);
  await window.api.layout.setTopInset(total);
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.classList.add("visible");
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("visible");
    toastEl.classList.add("hidden");
  }, 2200);
}
