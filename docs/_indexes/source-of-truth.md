# Source of Truth Map

Этот документ фиксирует, где искать «истину» по проекту VR AI Dock.

## Базовые источники
1. `README.md` — обзор продукта, запуск, основные сценарии.
2. `AGENTS.md` — операционные правила для Dock Agents.
3. `CODEX.md` — режимы PLAN/APPLY/REVIEW и рабочая дисциплина.

## Архитектурные источники
4. `docs/architecture/service-catalog.md` — каталог сервисов и модулей.
5. `docs/_indexes/ipc-index.md` — карта IPC/bridge/consumers.
6. `docs/_indexes/feature-index.md` — карта текущих и будущих фич.

## Планирование
7. `docs/planning/roadmap.md` — фазовый план развития.
8. `docs/planning/mvp.md` — границы MVP.
9. `docs/planning/workpacks/**` — source-of-truth для scoped изменений.
10. `docs/planning/initiatives/**` — source-of-truth для initiative-level orchestration, run-state и delivery reports.

## Правило при конфликте
При конфликте источников приоритет:
1) workpack текущей задачи,
2) initiative run-state/gates для orchestration state,
3) governance документы,
4) service/index docs,
5) README.

Конфликт обязан быть отмечен в отчёте REVIEW.

## Workpack layer references
11. `docs/planning/workpacks/_template/workpack.md` — шаблон для новых workpack.
12. `docs/planning/workpacks/ST-C0-001-ipc-registration-audit/workpack.md` — pilot-workpack для аудита IPC registration.

## Architecture decision records
21. `docs/architecture/decisions/**` - ADR/architecture decisions.
22. `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md` - Accepted strategy for `src/main/**` JS/TS source-of-truth.
23. `docs/architecture/main-ts-parity-audit.md` - Audit of `src/main/**/*.ts` counterparts against current JS runtime source-of-truth.
24. `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md` - Proposed strategy for React renderer default mode and legacy renderer fallback/retirement.

## Initiative layer references
13. `.codex/workflows/initiative-to-delivery.md` — полный workflow инициативы до delivery report.
14. `.codex/prompts/initiative-runner-template.md` — главный prompt запуска Initiative Runner.
15. `docs/planning/initiatives/_template/initiative.md` — шаблон инициативы.
16. `docs/planning/initiatives/_template/orchestration-plan.md` — шаблон orchestration plan.
17. `docs/planning/initiatives/_template/task-queue.md` — шаблон очереди workpack'ов.
18. `docs/planning/initiatives/_template/run-state.md` — шаблон file-backed состояния.
19. `docs/planning/initiatives/_template/gates.md` — шаблон журналов gates/decisions.
20. `docs/planning/initiatives/_template/delivery-report.md` — шаблон delivery report.
