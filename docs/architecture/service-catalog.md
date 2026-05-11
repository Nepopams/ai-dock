# Service Catalog — VR AI Dock

## 1) Main process
- **Responsibility:** lifecycle приложения, BrowserWindow, IPC bootstrap handoff, orchestration сервисов.
- **Owned files:** `src/main/main.js`, `src/main/ipc/**`, `src/main/services/**`, `src/main/tabManager.js`.
- **IPC dependencies:** `src/main/ipc/bootstrap.js`, shell-level IPC handlers, все доменные IPC handlers + adapter bridge.
- **Data storage:** state/store и файловые хранилища (history/registry/settings, где применимо).
- **Test/smoke expectations:** smoke сценарии запуска IPC + безопасная навигация + отсутствие утечек при закрытии вкладок.

## 2) Preload
- **Responsibility:** безопасный bridge API (contextBridge + validated ipcRenderer invoke/on).
- **Owned files:** `src/preload/index.ts`, `src/preload/modules/**`, `src/preload/utils/**`.
- **IPC dependencies:** shared IPC contracts + main channels.
- **Data storage:** не хранит бизнес-данные как source-of-truth; проксирует вызовы.
- **Test/smoke expectations:** корректная экспозиция API, отсутствие прямого Node surface в renderer.

## 3) Renderer React/Vite
- **Responsibility:** UI/UX, пользовательские сценарии, визуализация состояния.
- **Owned files:** `src/renderer/react/**`, legacy/aux files в `src/renderer/**`.
- **IPC dependencies:** только через preload namespaces.
- **Data storage:** локальный UI-state + Zustand state.
- **Test/smoke expectations:** базовые view flows, error states, loading states.

## 4) Zustand store
- **Responsibility:** централизованный state для chat, registry, history, prompts, forms, presets, judge.
- **Owned files:** `src/renderer/react/store/useDockStore.ts`, `src/renderer/store/*Slice.ts`.
- **IPC dependencies:** методы preload API, вызываемые из actions/slices.
- **Data storage:** in-memory state + синхронизация с main через IPC.
- **Test/smoke expectations:** корректные state transitions, отсутствие скрытых cross-slice side effects.

## 5) BrowserView / TabManager
- **Responsibility:** управление web-клиентами и вкладками BrowserView/WebContents.
- **Owned files:** `src/main/tabManager.js`, `src/main/browserViews/adapterBridge.ts/js`.
- **IPC dependencies:** adapter bridge channels.
- **Data storage:** runtime state вкладок + persisted tab metadata (если применяется).
- **Test/smoke expectations:** create/switch/close tab, cleanup, safe external navigation.

## 6) chatBridge
- **Responsibility:** отправка/обработка chat-запросов к провайдерам, обработка стриминга/ответов.
- **Owned files:** `src/main/services/chatBridge.js`, `src/main/ipc/chat.js`.
- **IPC dependencies:** chat-related channels (needs verification для полного списка).
- **Data storage:** transient request/response state, возможная запись в history.
- **Test/smoke expectations:** happy path + abort/retry/error path.

## 7) history store
- **Responsibility:** хранение/поиск/выгрузка диалоговой истории и ingest.
- **Owned files:** `src/main/historyStore.js`, `src/main/services/historyStore.*`, `src/main/storage/historyFs.*`, `src/main/ipc/history.ipc.*`.
- **IPC dependencies:** history channels + ingest hooks.
- **Data storage:** файловое/локальное хранилище истории.
- **Test/smoke expectations:** add/list/search/messages, стабильность формата данных.

## 8) settings / completions
- **Responsibility:** управление профилями completions и настройками провайдеров.
- **Owned files:** `src/main/ipc/completions.js`, `src/main/services/settings.*`, provider-модули в `src/main/providers/**`.
- **IPC dependencies:** completions channels.
- **Data storage:** profiles/settings storage в main-слое.
- **Test/smoke expectations:** CRUD профилей, валидация, test-profile path.

## 9) registry
- **Responsibility:** каталог клиентов/категорий/адаптеров и их включение/отключение.
- **Owned files:** `src/main/services/registry.*`, `src/main/ipc/registry.ipc.*`, shared registry types/contracts.
- **IPC dependencies:** registry:list/save/watch channels.
- **Data storage:** registry file store.
- **Test/smoke expectations:** list/save/watch и устойчивость к невалидным данным.

## 10) prompt utilities
- **Responsibility:** шаблоны/переменные/prompts и история вставок.
- **Owned files:** `src/main/ipc/templates.ipc.*`, `src/shared/utils/templateVars.*`, renderer prompts views/components.
- **IPC dependencies:** templates list/save/import/export/history channels.
- **Data storage:** template storage + prompt history.
- **Test/smoke expectations:** render templates, variables extraction, history append/clear.

## 11) exporter
- **Responsibility:** экспорт артефактов (включая judge outputs).
- **Owned files:** `src/main/services/exporter.*`, `src/main/ipc/export.ipc.*`, preload exporter module.
- **IPC dependencies:** export channels (md/json и др.).
- **Data storage:** файлы экспорта на диске.
- **Test/smoke expectations:** корректный формат экспорта, безопасные file dialogs/paths.

## 12) Workflow Layer (docs-first)
- **Responsibility:** governance, workpacks, process discipline PLAN→APPLY→REVIEW.
- **Owned files:** `AGENTS.md`, `CODEX.md`, `docs/_governance/**`, `docs/_indexes/**`, `.codex/**`, `docs/planning/**`.
- **IPC dependencies:** нет прямых.
- **Data storage:** markdown docs в репозитории.
- **Test/smoke expectations:** читаемость документов, консистентность ссылок/правил, соблюдение path guardrails.
