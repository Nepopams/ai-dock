# Executor Routing Guide

## Цель
Этот документ определяет, как Orchestrator выбирает исполнителя (executor subagent) для APPLY-задач и как управлять multi-layer изменениями.

## Как выбирать исполнителя
1. Прочитать workpack и выделить affected modules.
2. Проверить allowed/forbidden paths.
3. Выбрать primary executor по доминирующему модулю.
4. Для cross-layer задач определить последовательность handoff.

## Executor Selection Matrix
- Main process → `main-process-implementer` / skill `ai-dock-main-process-executor`.
- Preload/IPC → `preload-ipc-implementer` / skill `ai-dock-preload-ipc-executor`.
- Shared contracts → `preload-ipc-implementer` / skill `ai-dock-preload-ipc-executor`.
- Renderer UI → `renderer-ui-implementer` / skill `ai-dock-renderer-react-executor`.
- Zustand store → `state-store-implementer` / skill `ai-dock-zustand-state-executor`.
- Chat/Completions → `chat-completions-implementer` / skill `ai-dock-chat-completions-executor`.
- Web adapters → `web-adapter-implementer` / skill `ai-dock-web-adapter-executor`.
- History/Export → `history-exporter-implementer` / skill `ai-dock-history-exporter-executor`.
- n8n integration → `n8n-integration-implementer` / skill `ai-dock-n8n-integration-executor`.
- Tests → `test-qa-implementer` / skill `ai-dock-test-qa-executor`.
- Release/Build → `release-build-implementer` / skill `ai-dock-release-build-executor`.
- Security → `security-hardening-implementer` / skill `ai-dock-security-hardening-executor`.

## Что делать при multi-layer task
- Если затронуто более одного runtime-слоя, задача разбивается на последовательные sub-workpacks.
- Каждый sub-workpack назначается отдельному executor.
- Для каждого шага обязателен handoff и отдельная верификация.

## Multi-layer task policy
- Если затронуто более одного runtime-слоя, задача разбивается на последовательные sub-workpacks.
- Каждый sub-workpack назначается отдельному executor.
- Единый giant APPLY для multi-layer high-risk задач запрещён.

## Когда использовать sequential executors
- IPC contract changes: сначала preload-ipc, затем main-process, затем renderer (если требуется consumer update).
- Chat provider changes: chat-completions + test-qa + security-hardening (по риску).
- Release pipeline changes: release-build + test-qa.

## Когда запрещён single giant APPLY
- Изменяются одновременно `main + preload + shared + renderer`.
- Есть security-sensitive и data-format migrations в одной задаче.
- Нет детального rollback по каждому слою.

## Как разбивать большую задачу
1. Разделить по слоям/модулям.
2. Для каждого слоя зафиксировать отдельные AC и verification.
3. Назначить executor и handoff partner.
4. Выполнить REVIEW после каждого крупного шага.

## Конфликт allowed paths
- Если executor требует путь вне allow-list: stop-the-line.
- Вернуться на Human Gate и обновить workpack.
- Без обновлённого allow-list APPLY запрещён.
