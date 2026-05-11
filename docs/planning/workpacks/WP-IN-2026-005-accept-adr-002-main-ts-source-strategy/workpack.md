# WP-IN-2026-005 - Accept ADR-002 Main Process TypeScript Source Strategy

## Workpack ID
WP-IN-2026-005-accept-adr-002-main-ts-source-strategy

## Title
Accept ADR-002 Main Process TypeScript Source Strategy

## Status
Completed

## Owner
Human + Codex

## Mode
L2 docs/governance PLAN/APPLY/REVIEW. Runtime APPLY is forbidden.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`

## Goal
Move ADR-002 from Proposed to Accepted so it becomes the active governance rule for main-process JS/TS source-of-truth.

## User value
Codex and human contributors can make future main-process changes with a clear rule: JavaScript files are the current runtime source-of-truth, and TypeScript counterparts are parity/reference artifacts until a separate migration is approved.

## In scope
- Confirm ADR-002 exists and is Proposed.
- Confirm accepting ADR-002 does not require runtime/build changes.
- Update ADR-002 status to Accepted.
- Update source-of-truth index wording to reflect accepted status.
- Create initiative/workpack/prompt-pack artifacts.
- Run validators and forbidden-path checks.

## Out of scope
- Runtime code changes.
- `src/main/**`, preload, renderer, shared, package, lockfile, tsconfig, Vite, scripts, dependency, or IPC changes.
- TypeScript migration.
- Deleting or editing main-process TypeScript counterparts.
- Running or implementing the parity audit.

## Current architecture context
ADR-002 records that `src/main/**/*.js` files are the current Electron main-process runtime source-of-truth. Main-process `.ts` files are not in the current runtime/build pipeline and are treated as non-runtime parity/reference artifacts. Human approval was given to accept the ADR before the next parity audit.

PLAN answers:
1. ADR-002 exists.
2. ADR-002 current status was Proposed.
3. Changing status to Accepted does not require runtime, build, package, tsconfig, script, dependency, or IPC changes.
4. Source-of-truth index referenced ADR-002 as Proposed and should be updated docs-only to Accepted.
5. No strong gate was triggered.

## Allowed files
- `docs/planning/initiatives/IN-2026-005-accept-adr-002-main-ts-source-strategy/**`
- `docs/planning/workpacks/WP-IN-2026-005-accept-adr-002-main-ts-source-strategy/**`
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
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
1. Read required governance, ADR, source-of-truth, and validator files.
2. Confirm ADR-002 status is Proposed and there is no governance conflict.
3. Create initiative artifacts and prompt-pack.
4. Change only the ADR status from Proposed to Accepted.
5. Update source-of-truth index wording from Proposed strategy to Accepted strategy.
6. Run validators and forbidden-path checks.
7. Record review and delivery report with next action.

## Acceptance criteria
- ADR-002 `## Status` is Accepted.
- ADR decision meaning is unchanged.
- Source-of-truth index reflects the accepted ADR status.
- Initiative and workpack validators pass.
- No forbidden runtime/config/package paths changed.
- Delivery report names IN-2026-006 Main TS Parity Audit as next action.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-005-accept-adr-002-main-ts-source-strategy`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-005-accept-adr-002-main-ts-source-strategy/workpack.md`
- `git diff --check`
- `git status --short -- src/main src/preload src/renderer src/shared package.json package-lock.json tsconfig.json vite.config.js scripts`

## Security impact
None. No runtime, preload, renderer, IPC, dependency, sandbox, contextIsolation, or secret-handling behavior changes.

## IPC impact
None. No IPC contracts, channels, preload bridge, or consumers changed.

## Docs impact
ADR-002 is accepted and the source-of-truth index is updated to reflect the accepted governance rule.

## Rollback
Revert the docs-only changes in this workpack: restore ADR-002 status to Proposed, restore source-of-truth index wording, and remove IN-2026-005 initiative/workpack artifacts.

## Done criteria
- Docs-only diff matches this workpack.
- Validators pass.
- Forbidden runtime/config path status check is clean.
- Delivery report is complete.

## Risks
- Acceptance can be misinterpreted as approving immediate TypeScript migration; ADR-002 explicitly keeps migration out of scope.
- TS parity drift remains until IN-2026-006.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
