# AI Dock

AI Dock — десктопная оболочка на Electron, которая объединяет несколько AI‑ассистентов (ChatGPT, Claude, Яндекс Алиса, DeepSeek, UX Pilot и др.) в одном окне. Каждый сервис открывается в собственной вкладке BrowserView с изолированной сессией (`session.fromPartition`), поэтому логины и cookies не смешиваются.

## Основные возможности

- **Tabbed BrowserView Manager**  
  - Sidebar с кнопками сервисов (ChatGPT, Claude, Alisa, DeepSeek, UX Pilot).  
  - TabStrip с активными вкладками, быстрым переключением, закрытием и восстановлением состояния (`tabs.json` в `userData`).  
  - Поддержка Ctrl/колёсика: новые ссылки открываются во внутренних вкладках (TabManager `addTab`).  
  - Контекстное меню (Copy/Paste/Inspect) в каждой вкладке.

- **Prompt Router Bar**  
  - Единая текстовая область, мультиселектор агентов, чекбокс скрытия панели.  
  - Отправка промта сразу в несколько сервисов (через IPC `promptRouter:broadcast`).  
  - История последних 50 промтов (`prompts_history.json`), быстрый выбор из выпадающего списка.

- **Prompt Drawer (локальная библиотека)**  
  - Добавление, удаление и копирование промтов в буфер обмена.  
  - Данные хранятся в `prompts.json` (через `prompts:*` IPC).  
  - Drawer выезжает поверх BrowserView, ширина учитывается при расчёте `setDrawerInset`.

- **Export Chat to Markdown**  
  - Кнопка `Save Chat` в TabStrip вызывает `save-chat-md` IPC, который извлекает DOM активной вкладки и сохраняет Markdown с ролями (User/AI).

- **Безопасность**  
  - `contextIsolation`, `sandbox`, `nodeIntegration: false`.  
  - CSP (`default-src 'self'`).  
  - Все IPC-вызовы проходят через `preload` (валидация аргументов).  
  - BrowserWindow перехватывает `window.open` и открывает внешние ссылки через `shell.openExternal`.

- **Новый UI на React + Vite + Zustand**  
  - `src/renderer/react` содержит React-компоненты (Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast).  
  - Zustand store (`useDockStore`) синхронизируется с main-процессом через IPC и управляет состоянием вкладок, промтов, истории, тостов.

## Скрипты

```bash
# только Vite dev-server (для разработки UI)
npm run dev

# собрать React UI (dist в src/renderer/react/dist)
npm run build

# запустить legacy Electron UI
npm run electron:dev

# собрать Windows NSIS installer (legacy UI)
npm run electron:build

# Запуск Electron с новым React интерфейсом (Vite + Electron одновременно)
npm run dev:new-ui
```

> `dev:new-ui` использует флаг `AI_DOCK_REACT_UI=true`: main-процесс грузит `http://localhost:5173` в dev-режиме и `src/renderer/react/dist/index.html` в prod. Без флага приложение продолжит открывать legacy HTML/JS UI.

## Структура проекта

```
ai-dock/
├─ assets/                 # иконки приложения
├─ src/
│  ├─ main/                # main process, TabManager, stores, services
│  ├─ preload/             # contextBridge API (window.api, aiDock, promptRouter)
│  ├─ renderer/            # legacy HTML/CSS/JS UI (ещё доступен для отката)
│  └─ renderer/react/      # новый React + Vite UI
│     ├─ App.tsx
│     ├─ components/       # Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast
│     ├─ hooks/            # useTabsSync, usePromptsSync, usePromptRouterSync, useTopInsetSync
│     ├─ store/            # useDockStore (Zustand)
│     ├─ assets/icons/     # SVG иконки сервисов
│     └─ styles/global.css # стили, перенесённые из legacy index.css
├─ tsconfig.json
├─ vite.config.js
└─ README.md
```

## IPC контракт (preload)

- `tabs.createOrFocus(serviceId)` / `tabs.switch(tabId)` / `tabs.close(tabId)` / `tabs.list()`
- `prompts.list()` / `prompts.add({title, body})` / `prompts.remove(id)`
- `clipboard.copy(text)`
- `layout.setDrawer(width)` / `layout.setTopInset(height)`
- `promptRouter.getAgents()` / `promptRouter.broadcast({text, agents})` / `promptRouter.getHistory()` / `promptRouter.saveToHistory(text)`
- `aiDock.saveChatMarkdown()`

История промтов (`HistoryStore`) и сохранение вкладок (`store.js`) располагаются в `app.getPath("userData")`.

## Разработка UI на React

1. Включите флаг `AI_DOCK_REACT_UI=true`:
   ```bash
   npm run dev:new-ui
   ```
2. Vite запускает HMR на `http://localhost:5173`, Electron грузит этот адрес в BrowserWindow.
3. Любые изменения в `src/renderer/react/**` применяются мгновенно через HMR.

Если порт 5173 занят, освободите его (`npx kill-port 5173`) или измените `server.port` в `vite.config.js` и хост в `main.js`.

## Продакшн

1. `npm run build` — собирает React UI (dist).  
2. Запустите Electron с флагом `AI_DOCK_REACT_UI=true` или обновите `main.js`, чтобы всегда грузить React dist.  
3. `npm run electron:build` — создаёт NSIS installer (использует текущее состояние renderer; убедитесь, что React dist собран и флаг активирован).

## Дополнительно

- Prompt Router скрывается/показывается кнопкой «👁 Hide / 📤 Show», состояние сохраняется в `localStorage`.
- Drawer отступы и верхняя панель сообщают размеры в main через `layout.setDrawer` и `layout.setTopInset`, чтобы BrowserView занимал правильное пространство.
- UX Pilot добавлен как полноценный сервис (иконка и partition `persist:svc-uxpilot`), и появится в Sidebar/Prompt Router по умолчанию.
