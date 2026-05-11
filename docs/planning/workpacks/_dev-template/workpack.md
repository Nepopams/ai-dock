# Development Workpack Template

## Workpack ID
`ST-DEV-XXX`

## Title
Краткое название runtime-development задачи.

## Status
Draft / Planned / In Progress / Review / Done / Blocked

## Type
`runtime-development`

## Selected executor
- `ai-dock-...-executor`

## Primary skill
- `ai-dock-...-executor`

## Secondary executors
- `ai-dock-...-executor` (если требуется multi-layer handoff)

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- релевантные файлы runtime-слоя

## Goal
Что должно быть реализовано в runtime-коде.

## User value
Какую практическую ценность даёт изменение.

## Current architecture context
Краткий снимок текущего состояния, на которое влияет change.

## Affected modules
- `main`
- `preload`
- `shared`
- `renderer`
- `store`
- `docs`

## In scope
- ...

## Out of scope
- ...

## Allowed paths
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/**`
- `docs/**`

## Forbidden paths
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`
- `package-lock.json`

## Expected file changes
- `path/to/file-a`
- `path/to/file-b`

## IPC impact
`none` или описание изменений каналов/контрактов.

## Preload impact
`none` или описание изменения bridge/API.

## Renderer impact
`none` или описание UI/consumer impact.

## Store impact
`none` или описание изменения state/slices/selectors.

## Data/storage impact
`none` или описание формата данных, миграций, rollback.

## Security impact
- Влияние на sandbox/contextIsolation.
- Влияние на токены/секреты.
- Риски внешней навигации/IPC validation.

## Test strategy
- Unit tests:
- Integration tests:
- Smoke tests:
- Manual checks:

## Verification commands
- `npm test` (или таргетный набор)
- `npm run preload:build` (если применимо)
- `npm run workflow:status`

## Manual smoke checklist
- [ ] Базовый happy-path
- [ ] Error-path
- [ ] Abort/retry/timeout (если применимо)
- [ ] Security checks

## Docs/index updates required
- `docs/_indexes/ipc-index.md` (если IPC менялся)
- `docs/architecture/service-catalog.md` (если зона ответственности менялась)
- `README.md` (если изменился UX/операционные шаги)

## Rollback plan
Пошаговый безопасный откат runtime и docs изменений.

## Acceptance criteria
- [ ] Критерий 1
- [ ] Критерий 2

## Done criteria
- [ ] Соответствие DoD
- [ ] REVIEW Gate = GO

## Risks
- Риск + mitigation.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
