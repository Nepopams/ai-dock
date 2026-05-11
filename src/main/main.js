const path = require("path");
const fsSync = require("fs");
const v8 = require("v8");
const { app, BrowserWindow, shell } = require("electron");
const TabManager = require("./tabManager");
const services = require("./services");
const { registerMainIpc } = require("./ipc/bootstrap");

let mainWindow;
let tabManager;
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

const SNAPSHOT_THRESHOLD =
  Number(process.env.AI_DOCK_SNAPSHOT_THRESHOLD_MB || 1200) * 1024 * 1024;
const SNAPSHOT_COOLDOWN_MS = 60_000;
let lastSnapshotTs = 0;
let snapshotIndex = 0;

const logMemory = () => {
  const heap = process.memoryUsage();
  console.log(
    `[mem] rss=${Math.round(heap.rss / 1024 / 1024)}MB ` +
      `heapTotal=${Math.round(heap.heapTotal / 1024 / 1024)}MB ` +
      `heapUsed=${Math.round(heap.heapUsed / 1024 / 1024)}MB`
  );

  if (
    heap.heapUsed > SNAPSHOT_THRESHOLD &&
    Date.now() - lastSnapshotTs > SNAPSHOT_COOLDOWN_MS
  ) {
    try {
      const snapshotName = `heap-main-${Date.now()}-${snapshotIndex++}.heapsnapshot`;
      const targetPath = path.join(app.getPath("userData"), snapshotName);
      v8.writeHeapSnapshot(targetPath);
      lastSnapshotTs = Date.now();
      console.log(`[mem] heap snapshot saved to ${targetPath}`);
    } catch (error) {
      console.error("[mem] failed to write heap snapshot", error);
    }
  }
};

setInterval(logMemory, 10_000).unref();

const createWindow = () => {
  const skipAutoTabs = process.env.AI_DOCK_SKIP_AUTOTABS === "1";
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
  if (!skipAutoTabs && !tabManager.list().length && services?.chatgpt) {
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

  registerMainIpc({
    tabManager,
    getMainWindow: () => mainWindow,
    getTabManager: () => tabManager
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









const logTabDiagnostics = () => {
  if (!tabManager) {
    return;
  }
  try {
    const diagnostics = tabManager.getDiagnostics();
    console.log(
      `[tabs] total=${diagnostics.totalTabs} active=${diagnostics.activeTabId ?? "none"} ` +
        `alive=${diagnostics.aliveViews} disposables=${diagnostics.totalDisposables} ` +
        `destroyed=${diagnostics.destroyedViews}`
    );
  } catch (error) {
    console.warn("[tabs] failed to collect diagnostics", error);
  }
};

setInterval(logTabDiagnostics, 15_000).unref();
