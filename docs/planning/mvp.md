# MVP Boundaries — VR AI Dock

## Что уже есть (по репозиторию)
- Electron shell + React/Vite UI + Zustand store.
- BrowserView/WebContents tabs для web-клиентов.
- Локальный Chat.
- Completions Profiles.
- Form Runner (sync/stream).
- History Hub.
- Registry & Adapters.
- Prompt Drawer / Prompt Router.
- Базовые export/judge/media-preset контуры.

## Что считать MVP для Dock
MVP считается достигнутым, когда:
1. Пользователь может стабильно работать с вкладками AI-клиентов.
2. Локальный Chat и Completions Profiles работают end-to-end.
3. History Hub фиксирует и находит ключевые диалоги.
4. Form Runner покрывает базовые sync/stream сценарии.
5. Registry & Adapters позволяют подключать и конфигурировать клиентов.

## Next-phase (после MVP)
- Усиление exporter и cross-history сценариев.
- Judge LLM для сравнений/оценок.
- Workflow/n8n orchestration.
- RAG Agent и VR Overlay направления.

## Out-of-scope для текущего bootstrap
- Любые runtime-рефакторинги без отдельного workpack.
- Новые зависимости без обоснования.
- Изменения security boundary без отдельного gate.
