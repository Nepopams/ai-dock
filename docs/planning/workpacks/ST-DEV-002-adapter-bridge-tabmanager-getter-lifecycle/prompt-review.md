# ST-DEV-002 Prompt - REVIEW

РЕЖИМ: REVIEW ONLY / READ ONLY.

## Checks
- Diff соответствует ST-DEV-002 workpack.
- Executor не вышел за allowed files.
- Forbidden files не изменены.
- `adapterBridge.js` больше не замыкает direct `tabManager`.
- `bootstrap.js` передаёт `getTabManager` в AdapterBridge registration.
- AdapterBridge получает актуальный `tabManager` на каждый `adapter:exec`.
- Missing `tabManager` path безопасен и сохраняет expected response shape.
- IPC channel names не изменены.
- Preload API, renderer и shared contracts не изменены.
- Security invariants сохранены.
- Tests/verification evidence достаточно.
- Docs/index updates синхронизированы.

## Verification
Выполнить read-only/safe checks:
- `git status --short`
- `git diff --name-status`
- `git diff --stat`
- `git diff --check`
- `npm run workflow:validate-workpack -- docs/planning/workpacks/ST-DEV-002-adapter-bridge-tabmanager-getter-lifecycle/workpack.md`
- `node --check src/main/ipc/bootstrap.js`
- `node --check src/main/browserViews/adapterBridge.js`
- `npm test`

## Output
1. Summary
2. Verdict: GO / NO-GO
3. Must Fix
4. Should Fix
5. Nice to have
6. Files consulted
7. Commands run
8. Verification results
9. Runtime scope check
10. Manual smoke still required: yes/no
11. Ready for merge: yes/no
