# Workpack: ST-DEV-001 — Executor Pilot IPC Modular Registration

## Workpack ID
`ST-DEV-001`

## Title
Пилот runtime-development модульной регистрации IPC в main process

## Status
Applied / Ready for Review

## Owner
- Executor: `ai-dock-main-process-executor`
- Secondary handoff: `ai-dock-preload-ipc-executor` только при изменении preload/shared contracts
- Human Gate owner: project maintainer

## Mode
`runtime-development APPLY`

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
- `src/main/browserViews/adapterBridge.*`
- `src/preload/index.ts`
- `src/preload/modules/**`
- `src/shared/ipc/**`

## Goal
Вынести регистрацию IPC из `src/main/main.js` в отдельный main-process bootstrap/registry слой без изменения IPC каналов, preload surface, renderer behavior и бизнес-логики handlers.

## User value
- Уменьшение связности `main.js`.
- Более безопасное и предсказуемое развитие IPC-слоя.
- Улучшение поддерживаемости и reviewability runtime-изменений.

## In scope
- Вынести shell-level IPC handlers из `src/main/main.js` в `src/main/ipc/shell.js`.
- Добавить `src/main/ipc/bootstrap.js` как единую точку регистрации main IPC.
- Сохранить существующие доменные `register*Ipc` вызовы и порядок регистрации.
- Сохранить существующие IPC channel names и внешний контракт.
- Обновить `docs/_indexes/ipc-index.md`.
- Обновить `docs/architecture/service-catalog.md`.
- Fixpack: восстановить `package-lock.json` из parent commit, чтобы forbidden file не входил в ST-DEV-001 reviewed diff.

## Out of scope
- Не добавлять новые IPC-каналы.
- Не менять renderer UI.
- Не менять preload surface.
- Не менять shared contracts.
- Не менять `package.json`.
- Не менять `package-lock.json`, кроме восстановления из parent commit в fixpack для удаления forbidden diff.
- Не менять бизнес-логику handlers.
- Не исправлять дополнительные adapter bridge или lifecycle issues вне Must Fix.

## Current architecture context
До APPLY регистрация IPC была смешанной: доменные handlers уже жили в `src/main/ipc/**`, но shell-level handlers и общий registration guard находились в `src/main/main.js`. После APPLY `main.js` создаёт окно и `TabManager`, затем передаёт контекст в `src/main/ipc/bootstrap.js`; shell-level handlers находятся в `src/main/ipc/shell.js`.

## Allowed files
- `src/main/main.js`
- `src/main/ipc/bootstrap.js`
- `src/main/ipc/shell.js`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/workpack.md`
- `package-lock.json` только для восстановления из parent commit в fixpack и удаления из reviewed diff

## Forbidden files
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
- `tests/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`
- `package.json`
- `package-lock.json` для любых dependency/install/generated lockfile изменений

## Step-by-step plan
1. PLAN: выполнить read-only аудит текущей IPC registration.
2. Human Gate: подтвердить main-process executor, allowed files и behavior-neutral scope.
3. APPLY: добавить `src/main/ipc/bootstrap.js`.
4. APPLY: перенести shell-level handlers из `main.js` в `src/main/ipc/shell.js`.
5. APPLY: заменить inline registration в `main.js` на вызов `registerMainIpc`.
6. APPLY: обновить IPC index и service catalog.
7. REVIEW: проверить path discipline, отсутствие новых каналов, сохранение security invariants и verification evidence.
8. FIXPACK: убрать forbidden `package-lock.json` из reviewed diff и привести workpack к validator-required структуре.

## Acceptance criteria
- [ ] `src/main/main.js` не содержит inline `ipcMain.handle` / `ipcMain.on` registrations.
- [ ] `src/main/ipc/bootstrap.js` содержит единый idempotent registration guard.
- [ ] `src/main/ipc/shell.js` содержит перенесённые shell-level IPC handlers без изменения channel names.
- [ ] `contextIsolation`, `sandbox`, `nodeIntegration: false` сохранены.
- [ ] `docs/_indexes/ipc-index.md` отражает bootstrap и shell IPC modules.
- [ ] `docs/architecture/service-catalog.md` отражает IPC bootstrap handoff.
- [ ] `package-lock.json` не входит в ST-DEV-001 reviewed diff.
- [ ] Workpack проходит `scripts/workflow/validate-workpack.mjs`.

## Test plan
- `npm run workflow:validate-workpack -- docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/workpack.md`
- `npm test`
- `git diff --name-status HEAD^ HEAD` или актуальная diff/status проверка для path discipline.
- `git status --short`
- Manual smoke после Review Gate: приложение стартует без ошибок IPC registration; основные IPC-потоки `chat`, `history`, `registry`, `templates`, `tabs`, `promptRouter` не деградировали.

## Security impact
- `contextIsolation` должен остаться включённым.
- `sandbox` должен остаться включённым.
- `nodeIntegration` должен остаться выключенным.
- Renderer не получает прямой Node-доступ.
- Новые IPC каналы не добавляются.
- Секреты/токены не выводятся в UI, logs или debug dumps.

## IPC impact
Behavior-neutral реорганизация registration layer. Существующие channel names, preload API и handler semantics должны остаться без изменений.

## Docs impact
- `docs/_indexes/ipc-index.md` обновляется для новой main IPC bootstrap/shell структуры.
- `docs/architecture/service-catalog.md` обновляется для IPC bootstrap handoff.
- `workpack.md` обновляется fixpack-ом для прохождения validator и синхронизации с фактическим APPLY.

## Rollback
- Откатить изменения `src/main/main.js`, `src/main/ipc/bootstrap.js`, `src/main/ipc/shell.js`.
- Откатить связанные updates в `docs/_indexes/ipc-index.md` и `docs/architecture/service-catalog.md`.
- Убедиться, что `package-lock.json` остаётся в версии parent commit для ST-DEV-001.
- Повторить targeted verification.

## Done criteria
- [ ] Runtime diff ограничен allowed files.
- [ ] Forbidden files не входят в reviewed diff.
- [ ] Workpack validation проходит.
- [ ] Tests проходят или причины невозможности зафиксированы.
- [ ] Review Gate получает GO или конкретный fixpack list.

## Risks
- Неполный manual smoke может пропустить runtime regression при window recreate или tab-manager dependent handlers.
- Scope creep при попытке одновременно нормализовать preload/shared contracts.
- Случайное повторное попадание generated/dependency файлов в reviewed diff.
- AdapterBridge getter/lifecycle issue не исправлялся в этом fixpack и должен рассматриваться отдельно при необходимости.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
