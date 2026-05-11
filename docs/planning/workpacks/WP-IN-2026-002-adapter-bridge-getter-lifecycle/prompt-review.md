# REVIEW Prompt - AdapterBridge Getter Lifecycle

## Режим
REVIEW ONLY по смыслу. Записывать verdict можно в initiative docs because they are delivery artifacts.

## Checklist
1. `adapterBridge.js` больше не замыкает direct `tabManager`.
2. `bootstrap.js` передаёт `getTabManager` в AdapterBridge registration.
3. `registerMainIpc` не принимает unused direct `tabManager` in bootstrap.
4. `IPC_ADAPTER_EXEC` and `IPC_ADAPTER_PING` names unchanged.
5. Return shape unchanged:
   - `{ ok: true, data }`
   - `{ ok: false, error, code }`
6. Forbidden paths unchanged:
   - `src/preload/**`
   - `src/renderer/**`
   - `src/shared/**`
   - `package.json`
   - `package-lock.json`
7. `npm test` result recorded.
8. Workpack and initiative validation pass.
9. Manual smoke checklist present.

## Expected verdict
GO if verification passes and diff stays within allowed paths.

NO-GO if:
- forbidden paths changed;
- IPC public contract changed;
- syntax/tests fail due scoped change;
- runtime APPLY exits allowed files.

## Output
1. Summary.
2. Must fix.
3. Should fix.
4. Nice to have.
5. Tests.
6. GO/NO-GO.
7. Files consulted.
8. Commands run.
