# Validate Initiative Runner Pipeline

## Initiative ID
`IN-2026-001-validate-initiative-runner`

## Title
Validate Initiative Runner Pipeline

## Status
Done

## Owner
Human + Codex

## Goal
Проверить, что новый Initiative Runner может автономно создать file-backed initiative artifacts, workpack queue, один docs-only workpack, выполнить docs-only delivery loop и сформировать delivery report.

## User value
Пользователь может дать инициативу верхнего уровня, а Codex сам ведёт decomposition, queue, workpack, prompt-pack и отчётность без ручного копирования `prompt-plan.md` / `prompt-apply.md`.

## Problem
Текущий pipeline уже поддерживает workpack inner loop, но нужен smoke pilot, который доказывает, что outer loop от инициативы до delivery report работает автономно для docs/workflow scope.

## Success criteria
- [x] Созданы file-backed initiative artifacts.
- [x] Создан один docs-only workpack.
- [x] Создан prompt-pack для workpack.
- [x] Workpack прошёл PLAN / APPLY / REVIEW loop без strong human gate.
- [x] Обновлены `run-state.md`, `task-queue.md`, `gates.md`, `delivery-report.md`.
- [x] Выполнены validation commands и результаты записаны в delivery report.

## In scope
- Создать initiative artifacts в `docs/planning/initiatives/IN-2026-001-validate-initiative-runner/**`.
- Создать docs-only workpack в `docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/**`.
- Создать `prompt-plan.md`, `prompt-apply.md`, `prompt-review.md`, `prompt-fixpack.md`.
- Зафиксировать PLAN/APPLY/REVIEW loop в file-backed состоянии.
- Выполнить validation commands.

## Out of scope
- Любые runtime-изменения.
- Изменения `src/main/**`, `src/preload/**`, `src/renderer/**`, `src/shared/**`.
- Изменения `package.json` и `package-lock.json`.
- Добавление dependencies.
- Любой n8n/Judge/History функционал.

## Constraints
- Только docs/workflow изменения.
- Runtime-код не менять.
- Package metadata и lockfile не менять.
- Новые зависимости не добавлять.
- Soft gates можно закрывать автономно.
- Strong gates требуют остановки.

## Strong human gate triggers
- Требуется runtime, dependency, package/lockfile, security policy или изменение forbidden paths.
- Нужен APPLY за пределами docs/workflow allowed paths.
- Workpack не проходит DoR.
- Verification commands нельзя выполнить безопасно.
- REVIEW Must Fix требует изменения scope.

## Candidate epics
- Epic 1: Initiative artifact smoke - создать полный набор file-backed initiative artifacts.
- Epic 2: Workpack inner loop smoke - создать docs-only workpack и prompt-pack.
- Epic 3: Validation and delivery report - выполнить validation commands, review и merge recommendation.

## Risks
- Риск: smoke pilot проверяет только docs/workflow автономность, не runtime L3.
  Mitigation: явно указать runtime out of scope и merge recommendation только для L2.
- Риск: validators проверяют структуру, а не семантическую полноту.
  Mitigation: delivery report фиксирует residual risk и next action для будущего runtime pilot.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-IN-2026-001-initiative-runner-smoke/workpack.md`
