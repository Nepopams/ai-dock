# APPLY Prompt - WP-IN-2026-003

MODE: APPLY.

## Preconditions
- Workpack is valid.
- PLAN answers required questions.
- Gate evaluation finds no strong human gate.
- Current queue item is `WP-IN-2026-003-adapter-bridge-typescript-parity`.

## Executor
- Selected executor: `ai-dock-main-process-executor`
- Secondary review lens: `ai-dock-ipc-security-reviewer`

## Allowed changes
- `src/main/browserViews/adapterBridge.ts`
- This initiative/workpack artifact directory.

## Runtime implementation requirements
- Change `registerAdapterBridgeIpc` to accept context object `{ getTabManager }`.
- Resolve the current TabManager through the getter inside each `IPC_ADAPTER_EXEC` handler call.
- If the getter is missing or returns no TabManager, return the existing safe failure shape through error normalization.
- Preserve `IPC_ADAPTER_EXEC` and `IPC_ADAPTER_PING`.
- Preserve success shape `{ ok: true, data }`.
- Preserve failure shape `{ ok: false, error, code }`.
- Do not change `adapterBridge.js`, `bootstrap.js`, shared, preload, renderer, package metadata, or lockfile.

## Verification
Run the workpack verification commands and record results in run-state and delivery report.

## APPLY result - 2026-05-11

### What changed
- `src/main/browserViews/adapterBridge.ts` now uses a context object with `getTabManager`.
- `IPC_ADAPTER_EXEC` resolves the current TabManager through the getter on each handler invocation.
- Missing or unavailable TabManager is normalized through `createAdapterBridgeError("TAB_MANAGER_UNAVAILABLE", "TAB_MANAGER_UNAVAILABLE")` and the existing catch response shape.
- Direct `TabManager` type import was removed and replaced with a minimal structural `AdapterBridgeTabManager` type.

### Files changed
- `src/main/browserViews/adapterBridge.ts`
- Initiative/workpack run-state artifacts.

### Scope notes
- `src/main/browserViews/adapterBridge.js` unchanged.
- `src/main/ipc/bootstrap.js` unchanged.
- `src/preload/**`, `src/renderer/**`, `src/shared/**`, `package.json`, and `package-lock.json` unchanged.

### Verification
Pending at APPLY completion; next phase is QA/verification.
