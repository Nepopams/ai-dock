# ST-DEV-002 Prompt - FIXPACK

РЕЖИМ: APPLY FIXPACK.

## Preconditions
- REVIEW Gate дал NO-GO.
- Must Fix list явно зафиксирован.
- Human Gate подтвердил fixpack scope, если требуется.

## Жёсткие правила
- Исправлять только Must Fix.
- Не делать дополнительных refactor improvements.
- Не менять forbidden files.
- Не добавлять dependencies.
- Не менять `package.json` / `package-lock.json`.
- Не менять preload, renderer или shared contracts без отдельного Human Gate.
- Stop-the-line при любом scope drift.

## Expected work
- Исправить только замечания Review Gate, связанные с ST-DEV-002.
- Сохранить AdapterBridge channel names и response shape.
- Сохранить getter/context lifecycle intent.
- Обновить docs только если Must Fix требует синхронизации.

## Verification
Выполнить релевантные команды из Review Gate, минимум:
- `npm run workflow:validate-workpack -- docs/planning/workpacks/ST-DEV-002-adapter-bridge-tabmanager-getter-lifecycle/workpack.md`
- `node --check src/main/ipc/bootstrap.js`
- `node --check src/main/browserViews/adapterBridge.js`
- `npm test`
- `git diff --name-status`
- `git status --short`

## Output
1. Must Fix addressed
2. Files consulted
3. Files changed
4. Commands run
5. Verification results
6. Runtime scope check
7. Remaining risks
8. Ready for Review Gate: yes/no
