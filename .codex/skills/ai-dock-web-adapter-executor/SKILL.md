---
name: ai-dock-web-adapter-executor
description: "Use for implementing scoped AI Dock web adapter and registry changes for resilient external AI client automation."
---

# AI Dock Web Adapter Executor Skill

## Purpose
Развивать Web Adapters и Registry & Adapters слой для устойчивой работы с volatile DOM внешних AI-клиентов.

## Зона ответственности
- Service adapters.
- `isReady`.
- `injectPrompt`.
- `extractConversation`.
- `openInSource`.
- DOM selector fallback.
- Adapter registry.
- Client categories.

## Required inputs
- Утверждённый workpack с adapter scope.
- Карта adapter registry и целевых клиентов.
- Smoke-checklist для fallback сценариев.

## Allowed scope
- `src/main/browserViews/**`
- `src/main/services/registry.*`
- `src/main/ipc/registry.*`
- Связанные shared типы/контракты, если разрешено.

## Forbidden scope
- Хардкод новых сервисов в TabManager при наличии adapter registry.
- Хрупкие DOM selectors без fallback.
- Изменения, ломающие Dock при ошибке адаптера.

## Workflow
1. Проверить контракт адаптера: `isReady`, `injectPrompt`, `extractConversation`, `openInSource`.
2. Внести минимальный diff и fallback-механизмы.
3. Проверить, что ошибки адаптера изолированы и не ломают Dock.
4. Синхронизировать registry/client categories при необходимости.
5. Подготовить отчёт.

## Guardrails
- Не хардкодить новые сервисы в TabManager, если есть adapter registry.
- DOM selectors должны иметь graceful fallback.
- Внешние сайты считаются volatile.
- Ошибки адаптера не должны ломать Dock.

## Stop-the-line rule
Остановиться, если:
- адаптер требует небезопасного обхода architecture layer;
- fallback strategy отсутствует;
- требуется массовый refactor вне workpack.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. Adapter impact
5. Security impact
6. Commands run
7. Risks
