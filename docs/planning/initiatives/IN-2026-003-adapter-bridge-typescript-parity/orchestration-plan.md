# Orchestration Plan - IN-2026-003

## Initiative summary
IN-2026-003 addresses drift between `src/main/browserViews/adapterBridge.js` and `src/main/browserViews/adapterBridge.ts`. The expected result is a single scoped workpack that either synchronizes the TypeScript counterpart to the late-bound `getTabManager` lifecycle or records a strong gate if synchronization would require broader architectural decisions.

## Assumptions
- Safe assumption: `package.json` `main` points to `src/main/main.js`, so the Electron runtime starts from JavaScript.
- Safe assumption: `src/main/ipc/bootstrap.js` requires `../browserViews/adapterBridge`, which resolves to `adapterBridge.js` in the current Node/CommonJS runtime.
- Safe assumption: `adapterBridge.ts` is a maintained parity/future-source artifact rather than the current runtime source-of-truth, unless PLAN discovers otherwise.
- Blocking assumption: deleting `adapterBridge.ts`, changing build scripts, or changing `tsconfig.json` requires a strong human gate.

## Selected delivery mode
Runtime single-layer, main process BrowserView AdapterBridge parity.

## Epic breakdown
- Epic ID: `E-IN-2026-003-1`
  Title: AdapterBridge TypeScript parity.
  Scope: Inspect runtime/build role, update `adapterBridge.ts` if safe, verify, and review.
  Risk profile: Low to medium. Runtime JS behavior should remain unchanged; risk is future drift in TS counterpart.
  Success criteria: PLAN answers required role questions; APPLY changes only allowed files; REVIEW = GO.

## Sprint mapping
- Sprint / slice: Runtime Initiative Runner pilot / architecture cleanup.
- Workpack candidates: `WP-IN-2026-003-adapter-bridge-typescript-parity`.
- Dependencies: IN-2026-002 delivery report and current AdapterBridge runtime files.
- Exit criteria: Workpack done, validation passed, tests run or limitations recorded, delivery report complete.

## Workpack queue
- Workpack ID: `WP-IN-2026-003-adapter-bridge-typescript-parity`
  Type: Runtime single-layer.
  Purpose: Synchronize `adapterBridge.ts` to the getter lifecycle without changing runtime JS behavior.
  Dependency: No open dependency after reading IN-2026-002 and runtime/build context.
  Expected status: Planning, then Applying if no strong gate.

## Executor routing
- Workpack ID: `WP-IN-2026-003-adapter-bridge-typescript-parity`
  Selected executor: `ai-dock-main-process-executor`
  Primary skill: `ai-dock-main-process-executor`
  Secondary executors: `ai-dock-ipc-security-reviewer`
  Rationale: The owned runtime area is `src/main/browserViews/**`; the security reviewer focus is IPC shape/channel preservation.

## Gate plan
- Soft gates: artifact naming, single-workpack decomposition, docs-index no-op if PLAN confirms no docs impact.
- Strong human gates: package/lockfile/dependency change, build pipeline or tsconfig change, TypeScript file deletion, shared/preload/renderer change, IPC contract/channel/response shape change, or runtime source-of-truth expansion.
- Gate owner: Human for strong gates; Codex may pass soft gates under L3 autonomy.
- Expected decision point: after PLAN, before APPLY.

## Verification strategy
- Docs/workflow validation: `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-003-adapter-bridge-typescript-parity`
- Workpack validation: `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-003-adapter-bridge-typescript-parity/workpack.md`
- Runtime tests: `npm test`
- TypeScript check: determine whether `package.json` has an existing TS check command. If not, do not add one; use available read-only/syntax-oriented checks and record limitation.
- Smoke/manual QA: live Electron AdapterBridge ping/exec, missing tab, and missing TabManager paths remain manual unless an existing automated smoke exists.
- Commands: include git scope checks and diff checks from the workpack.

## Risk register
- Risk: `adapterBridge.ts` is not currently compiled by the main process build.
  Impact: Automated TS parity may be less enforceable.
  Mitigation: Record role and residual risk in delivery report; keep change scoped.
  Owner: Codex.
  Status: Monitoring.
- Risk: Accidental forbidden path drift.
  Impact: Strong gate or NO-GO.
  Mitigation: Run `git status --short -- src/preload src/renderer src/shared package.json package-lock.json`.
  Owner: Codex.
  Status: Monitoring.
