# WP-IN-2026-007 - Registry TS Counterpart Sync

## Workpack ID
WP-IN-2026-007-registry-ts-counterpart-sync

## Title
Registry TS Counterpart Sync

## Status
Completed

## Owner
Human + Codex

## Mode
L3 scoped parity APPLY for a non-runtime TypeScript counterpart.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `docs/architecture/main-ts-parity-audit.md`
- `src/main/services/registry.js`
- `src/main/services/registry.ts`
- `src/shared/types/registry.ts`
- `src/main/ipc/registry.ipc.js`
- `src/main/ipc/registry.ipc.ts`
- `package.json`
- `tsconfig.json`

## Goal
Remove stale drift in `src/main/services/registry.ts` by syncing it to the JS runtime export surface without changing runtime JS behavior.

## User value
The TypeScript registry counterpart becomes a reliable non-runtime reference artifact and no longer contradicts the JavaScript runtime source-of-truth.

## In scope
- Compare `registry.js` and `registry.ts` export surfaces.
- Convert `registry.ts` to a typed wrapper over `registry.js`.
- Preserve the current registry IPC and shared contracts.
- Update the main TS parity audit.
- Create initiative and prompt-pack artifacts.
- Run verification.

## Out of scope
- Editing `registry.js`.
- Editing registry IPC files.
- Editing shared contracts.
- Runtime behavior changes.
- Package, lockfile, tsconfig, build, script, dependency, preload, renderer, or full TS migration changes.

## Current architecture context
ADR-002 is Accepted: current `src/main/**` runtime source-of-truth is JavaScript. `registry.js` exports `getRegistryPath`, `loadRegistry`, `saveRegistry`, `clearRegistryCache`, `watchRegistry`, `stopRegistryWatcher`, `serviceCategories`, `isServiceCategory`, and `isServiceClient`. Before this workpack, `registry.ts` duplicated storage/watch behavior and missed the last three exports.

PLAN answers:
- Export surface difference: TS missed `serviceCategories`, `isServiceCategory`, and `isServiceClient`.
- Wrapper safety: safe; TS is non-runtime and can delegate to `registry.js`.
- Minimal sync if wrapper impossible: add the missing exports, but wrapper is possible and preferred.
- Shared types required: no changes required.
- Package/tsconfig/build required: no changes required.
- Strong gate: none triggered.
- Exact files allowed: `src/main/services/registry.ts`, `docs/architecture/main-ts-parity-audit.md`, and IN-2026-007 artifacts.
- Verification: workflow validators, `npm test`, targeted `tsc`, diff checks, forbidden-path status.

## Allowed files
- `src/main/services/registry.ts`
- `docs/architecture/main-ts-parity-audit.md`
- `docs/planning/initiatives/IN-2026-007-registry-ts-counterpart-sync/**`
- `docs/planning/workpacks/WP-IN-2026-007-registry-ts-counterpart-sync/**`

## Forbidden files
- `src/main/services/registry.js`
- `src/main/ipc/registry.ipc.js`
- `src/main/ipc/registry.ipc.ts`
- `src/shared/**`
- `src/preload/**`
- `src/renderer/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Read governance, ADR-002, parity audit, registry JS/TS, shared registry types, registry IPC, package, and tsconfig.
2. Compare export surfaces.
3. Convert `registry.ts` to a typed wrapper over `registry.js`.
4. Include typed exports for the complete JS runtime surface.
5. Update the parity audit classification from stale counterpart to wrapper.
6. Run validators, tests, targeted TypeScript check, diff checks, and forbidden-path status.
7. Review the diff against this workpack.

## Acceptance criteria
- `registry.ts` exports the full current JS surface.
- `registry.ts` delegates behavior to `registry.js`.
- `registry.js` remains unchanged.
- Registry IPC and shared contracts remain unchanged.
- Audit report no longer classifies `registry.ts` as stale.
- Validators and tests pass.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-007-registry-ts-counterpart-sync`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-007-registry-ts-counterpart-sync/workpack.md`
- `npm test`
- `npx tsc --noEmit --target ES2020 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --strict src/main/services/registry.ts`
- `git diff --check`
- `git status --short -- src/main/services/registry.js src/main/ipc/registry.ipc.js src/main/ipc/registry.ipc.ts src/shared src/preload src/renderer package.json package-lock.json tsconfig.json vite.config.js scripts`

## Security impact
None. No IPC, preload, renderer, shared contract, dependency, sandbox, contextIsolation, or runtime behavior changes.

## IPC impact
None. Registry IPC files and channel names are unchanged.

## Docs impact
Updates `docs/architecture/main-ts-parity-audit.md` to mark `registry.ts` as synced wrapper.

## Rollback
Revert `src/main/services/registry.ts`, `docs/architecture/main-ts-parity-audit.md`, and the IN-2026-007 initiative/workpack artifacts.

## Done criteria
- Diff is limited to allowed files.
- Verification passes.
- Forbidden-path status check is clean.
- Delivery report records follow-ups.

## Risks
- Future JS changes can reintroduce wrapper type drift.
- Targeted TypeScript check is not a replacement for a main-process TypeScript build pipeline.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
