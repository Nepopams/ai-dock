# PLAN Prompt - WP-IN-2026-003

MODE: PLAN ONLY.

## Task
Perform read-only analysis for AdapterBridge TypeScript parity.

## Required sources
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`
- `src/main/browserViews/adapterBridge.js`
- `src/main/browserViews/adapterBridge.ts`
- `src/main/ipc/bootstrap.js`
- `src/main/main.js`
- `package.json`
- `tsconfig.json`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle/delivery-report.md`

## Required PLAN answers
1. Is `adapterBridge.ts` used in the current runtime/build pipeline?
2. Are there tsconfig or package scripts that compile this file?
3. Is `adapterBridge.ts` source-of-truth, future source, stale counterpart, unused artifact, generated file, or legacy artifact?
4. Can only `adapterBridge.ts` be safely synchronized without runtime behavior change?
5. Are docs/index updates needed?
6. Is there any strong human gate?

## Expected output
Record PLAN summary, executor decision, proposed file changes, verification plan, risks, files consulted, and commands run.

## PLAN result - 2026-05-11

### PLAN summary
`adapterBridge.ts` is not used by the current Electron runtime path. `package.json` declares `src/main/main.js` as the app main entry; `src/main/ipc/bootstrap.js` requires `../browserViews/adapterBridge`, which resolves to `adapterBridge.js` in the current CommonJS runtime. `adapterBridge.js` already uses late-bound `getTabManager` and `bootstrap.js` already passes `{ getTabManager }`.

### Required answers
1. Is `adapterBridge.ts` used in the current runtime/build pipeline?
   No. No current runtime import path resolves to `adapterBridge.ts`.
2. Are there tsconfig or package scripts that compile this file?
   No. `tsconfig.json` includes only `src/renderer/react` and `src/types`; `package.json` has no `tsc` or main-process TypeScript build script. Existing scripts are Vite, preload build, Electron start/build, tests, and workflow validators.
3. What is the role of `adapterBridge.ts`?
   It is a stale maintained counterpart / parity artifact and plausible future source, not the current runtime source-of-truth. Because docs list `adapterBridge.ts/js` as BrowserView bridge ownership, it should be synchronized rather than ignored. It is not generated, and deletion would require a strong human gate.
4. Can only `adapterBridge.ts` be safely synchronized without runtime behavior change?
   Yes. The scoped change can update TypeScript signatures and helper types to match `adapterBridge.js` without changing `adapterBridge.js`, `bootstrap.js`, IPC channels, shared contracts, preload, renderer, package metadata, or runtime behavior.
5. Are docs/index updates needed?
   No. Existing `docs/_indexes/ipc-index.md` and `docs/architecture/service-catalog.md` already describe the AdapterBridge as `adapterBridge.ts/js` using late-bound `getTabManager`; synchronizing TS makes those docs accurate.
6. Is there any strong human gate?
   No. The PLAN does not require deletion, package/lockfile/dependency changes, build-pipeline or `tsconfig` changes, shared/preload/renderer changes, or IPC contract/channel/response-shape changes.

### Executor decision
Keep selected executor `ai-dock-main-process-executor`; keep secondary review lens `ai-dock-ipc-security-reviewer`.

### Proposed file changes
- Change `src/main/browserViews/adapterBridge.ts`.
- Update initiative/workpack run-state, queue, gates, and delivery report.
- Do not change `src/main/browserViews/adapterBridge.js`.
- Do not change `src/main/ipc/bootstrap.js`.
- Do not change docs indexes.

### Verification plan
- Re-run initiative and workpack validators.
- Run `npm test`.
- Run git status/diff checks.
- Run forbidden-path status check.
- Determine TS script availability from `package.json`; no existing TS check script exists.
- Run an ad hoc no-emit TypeScript validation if practical without package/script/config changes, and record the limitation.

### Risks
- `adapterBridge.ts` remains outside current configured TypeScript project, so parity depends on discipline until a future source-of-truth/build decision.
- Manual Electron smoke remains required for live BrowserView behavior.

### Files consulted
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`
- `src/main/browserViews/adapterBridge.js`
- `src/main/browserViews/adapterBridge.ts`
- `src/main/ipc/bootstrap.js`
- `src/main/main.js`
- `package.json`
- `tsconfig.json`
- `scripts/**` inventory
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle/delivery-report.md`

### Commands run
- `Get-Content -Raw <required files>`
- `Get-ChildItem -Recurse -Name scripts`
- `rg --files -g "tsconfig*.json"`
- `rg "adapterBridge" -n .`
- `rg "registerAdapterBridgeIpc|IPC_ADAPTER_EXEC|IPC_ADAPTER_PING" -n src tests docs .codex`
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-003-adapter-bridge-typescript-parity`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-003-adapter-bridge-typescript-parity/workpack.md`
