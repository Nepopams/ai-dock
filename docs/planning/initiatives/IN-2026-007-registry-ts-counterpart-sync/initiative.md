# IN-2026-007 - Registry TS Counterpart Sync

## Initiative ID
IN-2026-007-registry-ts-counterpart-sync

## Title
Registry TS Counterpart Sync

## Status
Completed

## Owner
Human + Codex

## Goal
Synchronize `src/main/services/registry.ts` with the current JavaScript runtime source-of-truth `src/main/services/registry.js` without changing runtime behavior.

## User value
Codex and developers can use the TypeScript registry counterpart as a non-runtime reference artifact without stale export-surface drift.

## Problem
`registry.ts` duplicated storage/watch logic and missed the current JS runtime export surface: `serviceCategories`, `isServiceCategory`, and `isServiceClient`.

## Success criteria
- `registry.ts` exposes the same runtime export surface as `registry.js`.
- `registry.ts` delegates to `registry.js` as a typed wrapper and no longer duplicates storage/watch behavior.
- `registry.js`, IPC, shared contracts, package metadata, tsconfig, and build scripts are unchanged.
- `docs/architecture/main-ts-parity-audit.md` no longer classifies `registry.ts` as stale.
- Validators, tests, diff checks, forbidden-path checks, and targeted TypeScript check pass or record a limitation.

## In scope
- Create initiative artifacts.
- Create one scoped workpack and prompt-pack.
- Convert `src/main/services/registry.ts` to a typed wrapper over `registry.js`.
- Update the parity audit for `registry.ts`.
- Run verification and review.

## Out of scope
- Editing `src/main/services/registry.js`.
- Editing registry IPC files.
- Editing shared contracts.
- Runtime behavior changes.
- Package, lockfile, tsconfig, build, scripts, dependency, preload, renderer, or full TypeScript migration changes.

## Constraints
- Runtime JS behavior must not change.
- Allowed runtime-adjacent file change is limited to non-runtime `src/main/services/registry.ts`.
- No IPC channel names or contracts may change.
- No dependency or build pipeline changes.

## Strong human gate triggers
- Need to edit `registry.js`.
- Need to edit `src/shared/**`, registry IPC, preload, renderer, package metadata, lockfile, tsconfig, build config, scripts, or dependencies.
- Wrapper conversion requires runtime import changes.
- TypeScript verification requires changing the build pipeline.

## Candidate epics
- Registry TS export-surface sync.
- Main TS audit status update.
- Scoped verification and review.

## Risks
- `registry.ts` is still non-runtime; type drift can return if future JS changes skip TS counterpart handling.
- Targeted TypeScript check is local to this file and does not imply a main-process TS build exists.

## Links
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `docs/architecture/main-ts-parity-audit.md`
- `docs/planning/workpacks/WP-IN-2026-007-registry-ts-counterpart-sync/workpack.md`
