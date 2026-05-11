# IN-2026-006 - Main TS Parity Audit

## Initiative ID
IN-2026-006-main-ts-parity-audit

## Title
Main TS Parity Audit

## Status
Completed

## Owner
Human + Codex

## Goal
Create a complete audit report for all `src/main/**/*.ts` counterparts against the current JavaScript runtime source-of-truth.

## User value
Codex and developers can tell which main-process TS files are wrappers, parity counterparts, stale, migration candidates, or retirement candidates before n8n, Judge, and cross-history work.

## Problem
ADR-002 accepts JavaScript as the current `src/main/**` runtime source-of-truth. TypeScript counterparts can drift and can be mistaken for runtime source unless their status is documented.

## Success criteria
- Initiative artifacts exist and validate.
- One analysis workpack and prompt-pack exist and validate.
- `docs/architecture/main-ts-parity-audit.md` covers every `src/main/**/*.ts` file.
- Follow-up workpack proposals are recorded.
- No runtime, package, lockfile, tsconfig, build, scripts, preload, renderer, shared, or IPC contracts are changed.

## In scope
- Read-only inventory of JS/TS pairs in `src/main/**`.
- Classification of all 24 main-process TS counterparts.
- Audit report creation.
- Source-of-truth index link to the audit report.
- Delivery report and verification.

## Out of scope
- Runtime code changes.
- Synchronizing TS or JS files.
- Deleting TS counterparts.
- TypeScript migration.
- Build pipeline, package scripts, dependency, or runtime import changes.

## Constraints
- Runtime APPLY is forbidden.
- Do not change `src/main/**`, `src/preload/**`, `src/renderer/**`, or `src/shared/**`.
- Do not change `package.json`, lockfile, `tsconfig.json`, Vite config, or scripts.
- Do not add dependencies.

## Strong human gate triggers
- Any runtime or build change is needed.
- Any package, lockfile, tsconfig, script, dependency, IPC, preload, shared, or renderer change is needed.
- Audit requires immediate file deletion or immediate main-process TypeScript migration.

## Candidate epics
- Main TS inventory and runtime reachability.
- Counterpart classification and drift risk analysis.
- Follow-up workpack proposal map.

## Risks
- Classification is static and docs-only; it does not prove behavioral equivalence.
- Wrapper type surfaces can still drift from JS behavior.
- Stale TS files remain in the tree until separate follow-up workpacks resolve them.

## Links
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `docs/architecture/main-ts-parity-audit.md`
- `docs/planning/workpacks/WP-IN-2026-006-main-ts-parity-audit/workpack.md`
