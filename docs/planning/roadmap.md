# Roadmap — VR AI Dock

## Phase 0: Codex Workflow Layer
- Внедрить governance/source-of-truth контур.
- Зафиксировать PLAN → Human Gate → APPLY → REVIEW.
- Создать workpack-first дисциплину.

## Phase 1: Web Adapters and Registry hardening
- Укрепить adapter-bridge boundaries.
- Нормализовать registry schema/validation/watch.
- Улучшить устойчивость BrowserView lifecycle.

## Phase 2: Chat/Completions hardening
- Устойчивые retry/timeout/abort сценарии.
- Стабилизация профилей и провайдеров.
- Улучшение diagnostics без утечки секретов.

## Phase 3: History Hub and Chat Exporter
- Расширить search/filter/ingest-потоки истории.
- Укрепить экспорт диалогов и связанных артефактов.
- Подготовить к cross-history use-cases.

## Phase 4: Judge LLM and cross-history
- Внедрить judge-пайплайны для сравнений ответов.
- Добавить cross-history корреляцию и review режимы.

## Phase 5: n8n Connector
- Спроектировать безопасный workflow connector.
- Добавить интеграцию через изолированные adapters/IPC.

## Phase 6: RAG Agent / VR Overlay
- Исследовать RAG Agent слой для контекстных сценариев.
- Оценить и прототипировать VR Overlay UX для Dock.
