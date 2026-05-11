# Workpack: ST-DEV-001 — Executor Pilot IPC Modular Registration

## Workpack ID
`ST-DEV-001`

## Title
Пилот runtime-development подготовки к модульной регистрации IPC в main process

## Status
Draft (готов к PLAN)

## Type
`runtime-development`

## Selected executor
- `ai-dock-main-process-executor`

## Primary skill
- `ai-dock-main-process-executor`

## Secondary executors
- `ai-dock-preload-ipc-executor`

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `src/main/main.js`
- `src/main/ipc/**`
- `src/preload/index.ts`
- `src/preload/modules/**`
- `src/shared/ipc/**`

## Goal
Подготовить будущую runtime-задачу, которая вынесет регистрацию IPC из `main.js` в отдельный bootstrap/registry слой без изменения текущего поведения.

## User value
- Уменьшение связности `main.js`.
- Более безопасное и предсказуемое развитие IPC-слоя.
- Улучшение поддерживаемости и reviewability runtime-изменений.

## Current architecture context
Регистрация IPC в значительной степени централизована в `main.js` и доменных register-модулях. Нужен поэтапный перенос в модульный bootstrap/registry при сохранении совместимости.

## Affected modules
- `main`
- `preload`
- `shared`
- `docs`

## In scope
- Подготовка runtime-development workpack + prompt-pack.
- Проектирование структуры будущего IPC bootstrap/registry.
- Планирование последовательности main → preload/shared синхронизации.

## Out of scope
- Не менять текущее IPC поведение.
- Не добавлять новые IPC каналы.
- Не менять UI/renderer.
- Не выполнять IPC modularization в рамках этого шага.

## Allowed paths
### Текущий шаг (подготовка)
- `docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/**`
- `docs/planning/workpacks/_dev-template/**`
- `docs/_indexes/executor-index.md`
- `CODEX.md`

### Будущая реализация (proposal)
- `src/main/main.js`
- `src/main/ipc/**`
- `src/main/browserViews/adapterBridge.*`
- `src/preload/index.ts`
- `src/preload/modules/**`
- `src/shared/ipc/**`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`

## Forbidden paths
- `src/renderer/**`
- `tests/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`
- `package-lock.json`

## Expected file changes
- `src/main/main.js` (future)
- `src/main/ipc/**` (future)
- `src/preload/index.ts` (future)
- `src/preload/modules/**` (future)
- `src/shared/ipc/**` (future)
- `docs/_indexes/ipc-index.md` (future)

## IPC impact
Планируется реорганизация registration layer без изменения каналов и внешнего поведения.

## Preload impact
Только синхронизация registration wiring/контрактов при необходимости, без расширения surface вне workpack.

## Renderer impact
`none` (не планируется).

## Store impact
`none` (не планируется).

## Data/storage impact
`none` (формат данных не меняется).

## Security impact
- Сохранить `contextIsolation`/`sandbox` инварианты.
- Не вводить ad-hoc IPC.
- Не раскрывать секреты в logs/UI.

## Test strategy
- Runtime verification будет таргетной по IPC registration.
- Сверка shared/preload/main цепочки.
- Проверка отсутствия regressions в channel wiring.

## Verification commands
- `npm run workflow:status`
- `npm run workflow:validate-workpack docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/workpack.md`
- `npm test` (в future APPLY)
- `npm run preload:build` (в future APPLY)

## Manual smoke checklist
- [ ] Приложение стартует без ошибок IPC registration.
- [ ] Основные IPC-потоки (chat/history/registry/templates) не деградировали.
- [ ] Нет изменений behavior относительно baseline.
- [ ] Нет forbidden-path изменений.

## Docs/index updates required
- `docs/_indexes/ipc-index.md` (future APPLY)
- `docs/architecture/service-catalog.md` (future APPLY)
- `docs/_indexes/executor-index.md` (если меняется routing ownership)

## Rollback plan
- Откатить runtime-diff в `main/preload/shared` до baseline commit.
- Откатить связанные docs/index updates.
- Повторить targeted verification.

## Acceptance criteria
- [ ] Выбран selected executor и secondary executor.
- [ ] Явно указаны affected modules.
- [ ] Зафиксированы future allowed/forbidden paths.
- [ ] Подготовлен verification и smoke план.

## Done criteria
- [ ] Workpack готов к отдельному PLAN.
- [ ] Human Gate подтверждает готовность к future APPLY.

## Risks
- Недооценка неявных зависимостей в registration wiring.
- Scope creep при попытке изменить контракты вместо registration слоя.
- Риск regressions без поэтапной миграции.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
