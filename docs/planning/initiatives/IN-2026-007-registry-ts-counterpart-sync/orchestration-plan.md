# Orchestration Plan - IN-2026-007

## Initiative summary
Resolve the stale TypeScript counterpart drift in `src/main/services/registry.ts` by converting it to a typed wrapper over the JavaScript runtime source-of-truth.

## Assumptions
- ADR-002 is Accepted and JavaScript remains the runtime source-of-truth.
- `registry.ts` is not included by the current runtime/build pipeline.
- A typed wrapper can safely mirror the JS export surface without changing runtime behavior.

## Selected delivery mode
L3 scoped parity APPLY for one non-runtime TypeScript counterpart.

## Epic breakdown
- PLAN: compare JS and TS export surfaces and evaluate gates.
- APPLY: update only `registry.ts`, audit docs, and initiative/workpack artifacts.
- REVIEW: verify no forbidden paths changed and checks pass.

## Sprint mapping
Architecture cleanup / pre-feature refactoring.

## Workpack queue
1. `WP-IN-2026-007-registry-ts-counterpart-sync` - current scoped parity workpack.

## Executor routing
- Selected executor: `ai-dock-main-process-executor`.
- Secondary review posture: `ai-dock-ipc-security-reviewer`.
- Affected module: main-process registry service TypeScript counterpart only.

## Gate plan
- Strong gate if `registry.js`, shared contracts, package metadata, lockfile, tsconfig, build scripts, IPC, preload, or renderer need changes.
- Strong gate if wrapper conversion requires runtime import changes.
- Soft gate: update parity audit to mark `registry.ts` synced.

## Verification strategy
- Validate initiative and workpack artifacts.
- Run `npm test`.
- Run targeted TypeScript check for `src/main/services/registry.ts` without changing package/tsconfig/build.
- Run `git diff --check`.
- Run forbidden-path scoped status.

## Risk register
- Type wrapper can drift again if JS export surface changes.
- The targeted TypeScript check is not a main-process build pipeline.
- Manual Electron smoke is not required because runtime JS files are unchanged.
