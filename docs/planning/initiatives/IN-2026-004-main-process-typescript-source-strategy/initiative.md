# IN-2026-004 - Main Process TypeScript Source Strategy

## Initiative ID
`IN-2026-004-main-process-typescript-source-strategy`

## Title
Main Process TypeScript Source Strategy

## Status
Done

## Owner
Human + Codex

## Goal
Record an architecture strategy for JavaScript and TypeScript files under `src/main/**`, including current runtime source-of-truth, TypeScript counterpart status, dual-file policy, and future migration options.

## User value
Developers and Codex get clear rules for which main-process files to edit today, how to avoid JS/TS drift, and how to plan future TypeScript migration work without accidental runtime changes.

## Problem
`src/main/**` contains JavaScript runtime files and TypeScript counterparts. The current Electron runtime uses JavaScript (`package.json` main is `src/main/main.js`), `tsconfig.json` excludes `src/main/**`, and several `.ts` files are parallel counterparts or wrappers. This creates unclear ownership and drift risk, as seen in IN-2026-003 for `adapterBridge.ts`.

## Success criteria
- [x] Initiative artifacts exist and pass `validate-initiative`.
- [x] One planning workpack exists and passes `validate-workpack`.
- [x] Read-only inventory of `src/main/**/*.js` and `src/main/**/*.ts` is recorded.
- [x] Runtime source-of-truth is identified.
- [x] TypeScript counterpart status is classified.
- [x] Options A-D are analyzed.
- [x] Recommendation is recorded in the requested format.
- [x] ADR draft is created and linked from delivery report.
- [x] No runtime, package, lockfile, tsconfig, preload, renderer, shared, or script files are changed.

## In scope
- Create file-backed initiative artifacts.
- Create a docs-only planning workpack and prompt-pack.
- Read package, tsconfig, Vite, scripts, main/preload/shared inventory, service catalog, IPC index, and IN-2026-003 report.
- Inventory JS/TS files under `src/main/**`.
- Determine current runtime source-of-truth and TypeScript counterpart status.
- Analyze options and recommend a strategy.
- Create ADR draft.
- Update source-of-truth index only to link the ADR.

## Out of scope
- Migrating the main process to TypeScript.
- Deleting `.ts` files.
- Changing build pipeline, package scripts, dependencies, runtime imports, Electron entrypoint, or IPC contracts.
- Editing runtime code in `src/main/**`.
- Editing preload/shared/renderer contracts.

## Constraints
- Runtime APPLY is forbidden.
- Do not change `src/main/**`, except docs/analysis artifacts outside runtime folders.
- Do not change `src/preload/**`, `src/renderer/**`, or `src/shared/**`.
- Do not change `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`, or `scripts/**`.
- Do not add dependencies.
- Do not delete `.ts` files.
- Do not run build pipeline changes.

## Strong human gate triggers
- Any need to change `package.json`, `package-lock.json`, dependencies, `tsconfig.json`, or build pipeline.
- Any need to change runtime source files under `src/main/**`.
- Any recommendation requiring immediate deletion of files.
- Any recommendation requiring immediate migration of main process to TypeScript.
- Any IPC contract or preload/shared/renderer change.
- REVIEW Must Fix that expands scope beyond docs-only artifacts.

## Candidate epics
- Epic 1: Main-process JS/TS inventory and source-of-truth analysis.
- Epic 2: Options analysis and recommendation.
- Epic 3: ADR draft and docs-only source-of-truth link.
- Epic 4: Verification and REVIEW.

## Risks
- Current strategy records JS as source-of-truth, but TS counterparts can still drift until a follow-up parity-check or migration workpack exists.
- ADR is Proposed, so future runtime work still needs separate gated workpacks.
- Some TS files are thin wrappers while others are parallel implementations; treating all TS files identically would hide real risk.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `docs/planning/workpacks/WP-IN-2026-004-main-process-typescript-source-strategy/workpack.md`
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
