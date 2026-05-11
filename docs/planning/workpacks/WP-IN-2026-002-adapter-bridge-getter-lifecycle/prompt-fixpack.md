# FIXPACK Prompt - AdapterBridge Getter Lifecycle

## Назначение
Использовать только при REVIEW = NO-GO.

## Правила
- Исправлять только Must Fix.
- Не расширять scope.
- Не менять preload/renderer/shared/package/lockfile/dependencies.
- Не менять IPC channel names.
- Не менять AdapterBridge return shape.
- Сохранять selected executor `ai-dock-main-process-executor`.

## Allowed paths
- `src/main/browserViews/adapterBridge.js`
- `src/main/ipc/bootstrap.js`
- `docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle/**`
- `docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/**`

## Verification
- Re-run targeted failed command.
- Re-run `node --check` for changed runtime file.
- Re-run `git diff --check`.
- Re-run forbidden path scope check.

## Output
1. Fixed items.
2. Files consulted.
3. Files changed.
4. Commands run.
5. Remaining risks.
