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

## Design handoff references
- `docs/design/ui-v2/**` - AI Dock UI v2 design handoff pack for Pencil source/reference handling, PNG export inventory, design tokens, implementation notes, screen map, and UI workpack roadmap.
- `docs/design/ui-v2/design-tokens.md` - UI v2 token inventory for future runtime mapping into existing renderer styles.
- `docs/design/ui-v2/screen-map.md` - mapping between Pencil frames, PNG exports, current React views/files, and target UI workpacks.
- `docs/design/ui-v2/visual-acceptance.md` - UI v2 visual acceptance model, evidence requirements, and GO/NO-GO criteria.
- `docs/design/ui-v2/visual-gap-matrix.md` - screen-by-screen design-vs-current screenshot comparison matrix for scoped fixpack decisions.
- `docs/design/ui-v2/current-screenshots/README.md` - manual screenshot capture instructions and required current screenshot filenames.

## Workpack layer references
11. `docs/planning/workpacks/_template/workpack.md` — шаблон для новых workpack.
12. `docs/planning/workpacks/ST-C0-001-ipc-registration-audit/workpack.md` — pilot-workpack для аудита IPC registration.

## Architecture decision records
21. `docs/architecture/decisions/**` - ADR/architecture decisions.
22. `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md` - Accepted strategy for `src/main/**` JS/TS source-of-truth.
23. `docs/architecture/main-ts-parity-audit.md` - Audit of `src/main/**/*.ts` counterparts against current JS runtime source-of-truth.
24. `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md` - Accepted strategy for React renderer default mode and legacy renderer fallback/retirement.
25. `docs/architecture/renderer-retirement-plan.md` - Planning report for legacy renderer retirement, ownership classification, and staged follow-up workpacks.
26. `docs/architecture/react-renderer-smoke-report.md` - Human-provided manual smoke evidence closing React renderer default confidence after IN-2026-009.
27. `docs/architecture/non-react-renderer-support-ownership.md` - Ownership audit for top-level non-React renderer support modules used by React.
28. `docs/architecture/decisions/ADR-004-renderer-support-namespace-strategy.md` - Proposed namespace strategy for active renderer support modules.
29. `docs/architecture/judge-mode-evaluation-studio.md` - Product/architecture report for Judge Mode as Evaluation Studio.
30. `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md` - Proposed target architecture for Judge Mode / Evaluation Studio.

## Capability epic references
31. `docs/planning/epics/**` - source-of-truth for capability-level delivery maps that span multiple related workpacks.
32. `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/**` - epic source-of-truth for Judge Mode / Evaluation Studio MVP.
33. `docs/planning/sprints/**` - optional release/delivery slice planning layer, not required for every workpack.

## QA references
34. `docs/qa/judge-mvp-automated-coverage.md` - Judge MVP automated coverage inventory.
35. `docs/qa/judge-mvp-smoke-suite.md` - Judge MVP manual smoke suite.
36. `docs/qa/judge-mvp-smoke-evidence-template.md` - Judge MVP smoke evidence capture template.
37. `docs/qa/judge-mvp-release-confidence.md` - Judge MVP release confidence GO/NO-GO checklist.

## Initiative layer references
13. `.codex/workflows/initiative-to-delivery.md` — полный workflow инициативы до delivery report.
14. `.codex/prompts/initiative-runner-template.md` — главный prompt запуска Initiative Runner.
15. `docs/planning/initiatives/_template/initiative.md` — шаблон инициативы.
16. `docs/planning/initiatives/_template/orchestration-plan.md` — шаблон orchestration plan.
17. `docs/planning/initiatives/_template/task-queue.md` — шаблон очереди workpack'ов.
18. `docs/planning/initiatives/_template/run-state.md` — шаблон file-backed состояния.
19. `docs/planning/initiatives/_template/gates.md` — шаблон журналов gates/decisions.
20. `docs/planning/initiatives/_template/delivery-report.md` — шаблон delivery report.
