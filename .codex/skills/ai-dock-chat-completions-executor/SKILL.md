---
name: ai-dock-chat-completions-executor
description: "Use for implementing scoped AI Dock Chat, completions profile, provider, and streaming changes under workpack guardrails."
---

# AI Dock Chat & Completions Executor Skill

## Purpose
Выполнять изменения в локальном Chat, Completions Profiles, providers и streaming-контурах с безопасным обращением с токенами.

## Зона ответственности
- chatBridge.
- Completions settings.
- OpenAI-compatible driver.
- Generic HTTP driver.
- Streaming SSE/NDJSON.
- AbortController.
- Retry/timeout.
- Conversation history.
- Profile validation.
- Safe token handling.

## Required inputs
- Утверждённый workpack с chat/completions scope.
- Acceptance criteria для happy/error/abort/timeout paths.
- Allowed/forbidden paths.
- План верификации stream cleanup.

## Allowed scope
- `src/main/services/chatBridge.*`
- `src/main/services/settings.*`
- `src/main/providers/**`
- `src/main/ipc/chat.*`, `src/main/ipc/completions.*`, связанные контракты в `src/shared/**` и preload-модули, если разрешено.

## Forbidden scope
- Вывод токенов в renderer/logs.
- Несогласованные изменения профилей без валидации.
- Scope creep в несвязанные фичи.

## Workflow
1. Подтвердить runtime scope и контуры затрагиваемых провайдеров.
2. Внести минимальный diff в chat/completions/streaming paths.
3. Проверить retry/timeout/abort и cleanup timers/listeners.
4. Проверить profile validation и history persistence impact.
5. Подготовить отчёт.

## Guardrails
- Токены остаются в main process.
- Renderer получает только masked metadata.
- Stream cleanup обязателен.
- Abort должен освобождать timers/listeners.

## Stop-the-line rule
Остановиться, если:
- требуется передавать секреты в renderer;
- не обеспечен cleanup для stream/abort;
- изменения выходят за границы workpack.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. IPC impact
5. Security impact
6. Commands run
7. Risks
