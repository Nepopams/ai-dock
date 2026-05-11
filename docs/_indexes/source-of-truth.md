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

## Правило при конфликте
При конфликте источников приоритет:
1) workpack текущей задачи,
2) governance документы,
3) service/index docs,
4) README.

Конфликт обязан быть отмечен в отчёте REVIEW.

## Workpack layer references
10. `docs/planning/workpacks/_template/workpack.md` — шаблон для новых workpack.
11. `docs/planning/workpacks/ST-C0-001-ipc-registration-audit/workpack.md` — pilot-workpack для аудита IPC registration.
