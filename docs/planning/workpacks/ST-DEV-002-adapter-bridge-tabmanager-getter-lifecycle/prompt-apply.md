# ST-DEV-002 Prompt - APPLY

РЕЖИМ: APPLY.

## Preconditions
- PLAN approved.
- Human Gate пройден.
- Allowed files и forbidden files подтверждены.

## Execution
- Selected executor: `ai-dock-main-process-executor`.
- Secondary review/handoff: `ai-dock-ipc-security-reviewer`.
- Вносить minimal diff.
- Работать только в allowed files из workpack.
- Stop-the-line при любом scope drift.
- Не менять IPC channel names.
- Не менять preload API.
- Не менять renderer.
- Не менять shared contracts без отдельного Human Gate.
- Не менять `package.json` / `package-lock.json`.

## Required implementation intent
- Перевести `registerAdapterBridgeIpc(tabManager)` на `registerAdapterBridgeIpc({ getTabManager })`.
- Обновить `src/main/ipc/bootstrap.js`, чтобы он передавал getter.
- Обновить `src/main/browserViews/adapterBridge.js`, чтобы handler получал актуальный `tabManager` на каждый `adapter:exec`.
- Безопасно обработать отсутствие `tabManager`.
- Сохранить текущий AdapterBridge response shape.
- Обновить docs/indexes при необходимости.

## Verification
Выполнить:
- `npm run workflow:validate-workpack -- docs/planning/workpacks/ST-DEV-002-adapter-bridge-tabmanager-getter-lifecycle/workpack.md`
- `node --check src/main/ipc/bootstrap.js`
- `node --check src/main/browserViews/adapterBridge.js`
- `npm test`
- `git diff --name-status`

## Output
1. What changed
2. Files consulted
3. Files changed
4. Commands run
5. Verification results
6. IPC/preload impact
7. Runtime scope check
8. Risks
9. Follow-ups
