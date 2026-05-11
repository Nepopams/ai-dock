# Workpack - WP-IN-2026-003 AdapterBridge TypeScript Parity

## Workpack ID
`WP-IN-2026-003-adapter-bridge-typescript-parity`

## Title
AdapterBridge TypeScript Parity

## Status
Done

## Owner
Human + Codex

## Mode
PLAN -> Gate Evaluation -> APPLY -> REVIEW under L3 scoped runtime autonomy.

## Type
`runtime-development`

## Selected executor
- `ai-dock-main-process-executor`

## Primary skill
- `ai-dock-main-process-executor`

## Secondary executors
- `ai-dock-ipc-security-reviewer`

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle/delivery-report.md`
- `src/main/browserViews/adapterBridge.js`
- `src/main/browserViews/adapterBridge.ts`
- `src/main/ipc/bootstrap.js`
- `src/main/main.js`
- `package.json`
- `tsconfig.json`

## Goal
Bring `src/main/browserViews/adapterBridge.ts` into parity with the late-bound `getTabManager` lifecycle already used by `src/main/browserViews/adapterBridge.js`, without changing runtime JavaScript behavior or IPC contracts.

## User value
Future BrowserView AdapterBridge work will not accidentally copy or import the stale direct-`tabManager` signature, reducing lifecycle drift and maintenance risk.

## In scope
- PLAN the runtime/build role of `adapterBridge.ts`.
- Classify `adapterBridge.ts` as source, future source, stale counterpart, unused artifact, generated file, or legacy artifact.
- If no strong gate, update only `src/main/browserViews/adapterBridge.ts`.
- Preserve channel names `IPC_ADAPTER_EXEC` and `IPC_ADAPTER_PING`.
- Preserve response shapes `{ ok: true, data }` and `{ ok: false, error, code }`.
- Run validation, tests, diff checks, and REVIEW.

## Out of scope
- Main process TypeScript migration.
- TypeScript build pipeline or `tsconfig` changes.
- Package scripts or dependency changes.
- Deleting `adapterBridge.ts`.
- Shared/preload/renderer changes.
- Runtime JavaScript behavior changes when JS is already correct.

## Current architecture context
`src/main/main.js` is the Electron main entry from `package.json`. It creates `TabManager`, stores it in module state, and passes `getTabManager` to `registerMainIpc`. `src/main/ipc/bootstrap.js` requires `../browserViews/adapterBridge` and calls `registerAdapterBridgeIpc({ getTabManager })`. In current Node/CommonJS resolution, that bootstrap import resolves to `src/main/browserViews/adapterBridge.js`. The JavaScript AdapterBridge already resolves the current TabManager through `getTabManager()` inside the `IPC_ADAPTER_EXEC` handler. The TypeScript counterpart still uses a direct `tabManager` parameter and is the scoped parity target for this workpack.

PLAN conclusion: `adapterBridge.ts` is not in the current runtime/build pipeline, because `package.json` starts from `src/main/main.js`, bootstrap imports the JavaScript AdapterBridge, `tsconfig.json` excludes `src/main/**`, and there is no package script that compiles main-process TypeScript. It is a stale maintained counterpart / parity artifact and plausible future source, not the current runtime source-of-truth. No docs/index update is needed after synchronizing it.

## Affected modules
- `main`
- `main/browserViews`
- `docs/planning`

## Allowed files
- `src/main/browserViews/adapterBridge.ts`
- `docs/planning/initiatives/IN-2026-003-adapter-bridge-typescript-parity/**`
- `docs/planning/workpacks/WP-IN-2026-003-adapter-bridge-typescript-parity/**`
- `docs/_indexes/ipc-index.md` only if PLAN confirms docs impact
- `docs/architecture/service-catalog.md` only if PLAN confirms docs impact

## Forbidden files
- `src/main/browserViews/adapterBridge.js` if PLAN confirms it is already correct
- `src/main/ipc/bootstrap.js` if PLAN confirms it is already correct
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
- `package.json`
- `package-lock.json`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Expected file changes
- `src/main/browserViews/adapterBridge.ts`
- Initiative/workpack artifacts in the allowed planning directories
- No docs index changes unless PLAN identifies docs impact

## Step-by-step plan
1. Read required governance, workflow, validators, runtime files, package scripts, TS config, scripts inventory, indexes, and IN-2026-002 delivery report.
2. Create initiative artifacts and this scoped workpack.
3. PLAN: answer the six required runtime/build/docs/gate questions.
4. Gate evaluation: proceed only if no strong human gate is triggered.
5. APPLY: update `adapterBridge.ts` to accept `{ getTabManager }`, resolve TabManager per `adapter:exec`, and preserve response/channel shapes.
6. Verify using the required validation, test, diff, and forbidden path checks.
7. REVIEW: confirm lifecycle parity, path discipline, response shape, channel names, and documentation impact.
8. Update run-state, queue, gates, prompt-pack, and delivery report.

## Acceptance criteria
- [x] PLAN confirms whether `adapterBridge.ts` is in current runtime/build.
- [x] PLAN confirms whether tsconfig/package scripts compile `adapterBridge.ts`.
- [x] PLAN classifies `adapterBridge.ts`.
- [x] No strong human gate is open.
- [x] `registerAdapterBridgeIpc` in `adapterBridge.ts` accepts `{ getTabManager }`.
- [x] `IPC_ADAPTER_EXEC` resolves TabManager through the getter on every handler call.
- [x] Missing TabManager returns the safe normalized failure shape.
- [x] `IPC_ADAPTER_EXEC` and `IPC_ADAPTER_PING` names are unchanged.
- [x] Success and failure response shapes are preserved.
- [x] Forbidden paths remain unchanged.
- [x] REVIEW verdict is GO or a bounded fixpack is completed.

## Test plan
- Run `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-003-adapter-bridge-typescript-parity`.
- Run `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-003-adapter-bridge-typescript-parity/workpack.md`.
- Run `npm test`.
- Run `git status --short`.
- Run `git diff --stat`.
- Run `git diff --check`.
- Run `git status --short -- src/preload src/renderer src/shared package.json package-lock.json`.
- Determine whether an existing TypeScript check command exists in `package.json`; if none exists, do not add one and record the limitation.
- If practical without config/package changes, run an ad hoc no-emit TypeScript validation for `adapterBridge.ts` and record the result.

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-003-adapter-bridge-typescript-parity`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-003-adapter-bridge-typescript-parity/workpack.md`
- `npm test`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/preload src/renderer src/shared package.json package-lock.json`
- TypeScript validation command only if available without package/script/build-pipeline changes.

## Security impact
- No change to sandbox, contextIsolation, nodeIntegration, external navigation, or preload bridge.
- No new IPC channels.
- Existing AdapterBridge function-source execution policy is preserved from the current implementation.
- Missing TabManager should return a normalized safe error response.

## IPC impact
No contract/channel impact. Existing channels `adapter:exec` and `adapter:ping` remain unchanged. The handler lifecycle pattern in the TypeScript counterpart is synchronized to the JavaScript runtime implementation.

## Docs impact
PLAN expected result: no docs/index update is needed if `adapterBridge.ts` is synchronized and existing docs already describe the bridge as `adapterBridge.ts/js` with late-bound `getTabManager`. If PLAN finds otherwise, update only the allowed docs paths or stop on gate.

## Rollback
Revert only the `src/main/browserViews/adapterBridge.ts` change and this initiative/workpack artifact set. No runtime JS rollback is expected because `adapterBridge.js` and `bootstrap.js` are forbidden if already correct.

## Done criteria
- [x] Workpack validator passes.
- [x] Initiative validator passes.
- [x] Required verification commands are run and recorded.
- [x] Forbidden path status check is clean.
- [x] REVIEW verdict is GO.
- [x] Delivery report records role of `adapterBridge.ts`, residual risks, and manual smoke status.

## Risks
- The TypeScript file may be excluded from current build config, so automated TS coverage may be limited.
- Maintaining JS and TS counterparts can drift again without a future source-of-truth decision.
- Manual Electron smoke is still required to prove live BrowserView execution paths.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
