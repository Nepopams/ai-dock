# AdapterBridge Getter Lifecycle

## Initiative ID
`IN-2026-002-adapter-bridge-getter-lifecycle`

## Title
AdapterBridge Getter Lifecycle

## Status
Done

## Owner
Human + Codex

## Goal
Проверить L3 scoped runtime autonomy на маленьком безопасном refactor: перевести AdapterBridge IPC registration с direct `tabManager` reference на late-bound `getTabManager` context.

## User value
AdapterBridge становится согласованным с bootstrap/context handoff стилем, уменьшается lifecycle-риск stale `TabManager`, сохраняется поведение текущих IPC каналов.

## Problem
После ST-DEV-001 main IPC registration вынесен в bootstrap layer. Runtime PLAN показал, что `src/main/browserViews/adapterBridge.js` уже использует `getTabManager`, а `src/main/ipc/bootstrap.js` уже передаёт `{ getTabManager }`, но bootstrap signature всё ещё принимает неиспользуемый direct `tabManager`. Это оставляет лишний lifecycle-facing параметр в registration context.

## Success criteria
- [x] Созданы file-backed initiative artifacts.
- [x] Создан один runtime-development workpack.
- [x] Создан prompt-pack для workpack.
- [x] PLAN подтвердил bounded runtime scope без strong gate.
- [x] APPLY выполнен только в allowed paths.
- [x] `adapterBridge.js` не замыкает direct `tabManager`.
- [x] `bootstrap.js` передаёт `getTabManager` в AdapterBridge registration и не принимает unused direct `tabManager`.
- [x] IPC channel names и return shape не изменены.
- [x] Validation, syntax checks, `npm test` и git checks выполнены.
- [x] REVIEW verdict записан в delivery report.

## In scope
- Создать initiative artifacts.
- Создать runtime-development workpack `WP-IN-2026-002-adapter-bridge-getter-lifecycle`.
- Создать prompt-pack для workpack.
- Выполнить PLAN / APPLY / REVIEW.
- Runtime allowed files:
  - `src/main/browserViews/adapterBridge.js`
  - `src/main/ipc/bootstrap.js`
- Обновить docs/indexes только если PLAN подтвердит необходимость.
- Обновить run-state, task-queue, gates и delivery-report.

## Out of scope
- Любые изменения `src/preload/**`.
- Любые изменения `src/renderer/**`.
- Любые изменения `src/shared/**`.
- Любые изменения `tests/**`, если PLAN отдельно не обоснует и не зафиксирует это как allowed path.
- Любые изменения `package.json` / `package-lock.json`.
- Добавление dependencies.
- Добавление новых IPC каналов.
- Изменение adapter execution contract.
- Изменение `TabManager` behavior.

## Constraints
- Runtime scope строго ограничен.
- Не менять preload, renderer и shared IPC contracts.
- Не менять IPC channel names.
- Не менять return shape `IPC_ADAPTER_EXEC` / `IPC_ADAPTER_PING`.
- Не запускать dev app автоматически, если это требует интерактивного окна.
- No giant APPLY.

## Strong human gate triggers
- Нужно менять package/package-lock/dependencies.
- Нужно менять preload/renderer/shared.
- Нужен новый IPC channel или изменение public IPC contract.
- Workpack/PLAN невалидны.
- Verification commands нельзя выполнить.
- APPLY требует path вне allowed files.
- REVIEW Must Fix требует расширения scope.

## Candidate epics
- Epic 1: Initiative and workpack setup - создать file-backed initiative/workpack/prompt-pack.
- Epic 2: Scoped runtime lifecycle cleanup - подтвердить late-bound context и убрать lingering direct `tabManager` reference из bootstrap signature.
- Epic 3: Verification and review - выполнить validators, syntax checks, tests, diff checks и delivery report.

## Risks
- Риск: `adapterBridge.ts` остаётся direct-tabManager counterpart, но не входит в allowed runtime scope и не используется `package.json` main entry.
  Mitigation: зафиксировать residual risk и не менять TS без отдельного gate.
- Риск: `npm test` может выявить unrelated failures.
  Mitigation: зафиксировать фактический вывод и REVIEW verdict по scope.
- Риск: manual Electron smoke не выполняется автоматически.
  Mitigation: добавить manual smoke checklist в delivery report.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/workpack.md`
