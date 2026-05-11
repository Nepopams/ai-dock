# WP-IN-2026-006 - Main TS Parity Audit

## Workpack ID
WP-IN-2026-006-main-ts-parity-audit

## Title
Main TS Parity Audit

## Status
Completed

## Owner
Human + Codex

## Mode
L2 architecture/docs analysis. Runtime APPLY is forbidden.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/executor-index.md`
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `package.json`
- `tsconfig.json`
- `src/main/**/*.js`
- `src/main/**/*.ts`
- `docs/architecture/service-catalog.md`
- `docs/_indexes/ipc-index.md`

## Goal
Classify every `src/main/**/*.ts` counterpart relative to its JavaScript runtime source-of-truth file and propose follow-up workpacks.

## User value
Future feature work can avoid treating non-runtime TS files as source-of-truth and can plan parity handling before n8n, Judge, provider, registry, and cross-history changes.

## In scope
- Read-only JS/TS inventory.
- Runtime reachability analysis from `src/main/main.js`.
- Classification table for all main TS files.
- Audit report creation.
- Source-of-truth index link update.
- Initiative/workpack/prompt-pack creation.

## Out of scope
- Runtime file edits.
- TS/JS synchronization.
- Deletion of TS counterparts.
- Build pipeline, package, tsconfig, dependency, or runtime import changes.

## Current architecture context
ADR-002 is Accepted. `package.json` uses `src/main/main.js` as Electron runtime entrypoint. `tsconfig.json` includes renderer/types only and excludes `src/main/**`. Current runtime reachability analysis found all 34 JS files under `src/main/**` reachable from `src/main/main.js`; no TS files are runtime-reachable or included by the current TypeScript config.

## Allowed files
- `docs/planning/initiatives/IN-2026-006-main-ts-parity-audit/**`
- `docs/planning/workpacks/WP-IN-2026-006-main-ts-parity-audit/**`
- `docs/architecture/main-ts-parity-audit.md`
- `docs/_indexes/source-of-truth.md`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
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
1. Read required governance, ADR, package, tsconfig, architecture, IPC index, and validator files.
2. Inventory all `src/main/**/*.js` and `src/main/**/*.ts` files.
3. Match JS/TS pairs and compute JS-only/TS-only counts.
4. Trace runtime JS reachability from `src/main/main.js`.
5. Classify each TS counterpart as wrapper, parity counterpart, stale counterpart, migration candidate, retirement candidate, parallel implementation, or unknown.
6. Write `docs/architecture/main-ts-parity-audit.md`.
7. Link the audit from `docs/_indexes/source-of-truth.md`.
8. Run validators and forbidden-path checks.

## Acceptance criteria
- Audit report exists.
- Classification table includes all 24 main TS files.
- Follow-up workpack proposals are listed.
- ADR-002 is respected.
- No forbidden runtime/config/package paths are changed.
- Initiative and workpack validators pass.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-006-main-ts-parity-audit`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-006-main-ts-parity-audit/workpack.md`
- `git diff --check`
- `git status --short -- src/main src/preload src/renderer src/shared package.json package-lock.json tsconfig.json vite.config.js scripts`

## Security impact
None. No runtime, IPC, preload, renderer, dependency, sandbox, contextIsolation, or secret-handling behavior changes.

## IPC impact
None. IPC files are read only for classification; no channels or contracts changed.

## Docs impact
Adds the architecture audit report and links it from the source-of-truth index.

## Rollback
Remove the IN-2026-006 initiative/workpack artifacts, remove `docs/architecture/main-ts-parity-audit.md`, and remove its source-of-truth index entry.

## Done criteria
- Docs-only diff matches allowed paths.
- Validators pass.
- Forbidden-path status check is clean.
- Delivery report includes risks and follow-ups.

## Risks
- Static classification can miss semantic drift.
- Wrapper type declarations can drift even when behavior delegates to JS.
- High-risk TS counterparts remain unresolved until separate workpacks.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
