# Initiative - IN-2026-017 Renderer Support Namespace Strategy

## Initiative ID
`IN-2026-017-renderer-support-namespace-strategy`

## Title
Renderer Support Namespace Strategy

## Status
Done

## Owner
Human + Codex

## Goal
Fix the namespace strategy for active renderer support modules so future workpacks know where store slices, adapters, shared components, and renderer utilities should live.

## User value
Developers and Codex get a clear rule for whether top-level renderer support modules stay in place, move to `src/renderer/shared/**`, move to `src/renderer/react/shared/**`, or split by ownership later.

## Problem
After the React default switch, active support modules remain outside `src/renderer/react/**`. They are not legacy, but their current location can confuse legacy retirement and new feature planning.

## Success criteria
- [x] Initiative artifacts exist.
- [x] Workpack and prompt-pack exist.
- [x] ADR-004 exists as a Proposed architecture decision draft.
- [x] Current namespace snapshot is documented.
- [x] Options A-D are evaluated.
- [x] Recommendation does not require immediate migration.
- [x] Follow-up workpacks are proposed.
- [x] Source-of-truth index links ADR-004.
- [x] Runtime/source/package/build files are not changed by this initiative.

## In scope
- Create initiative artifacts.
- Create one planning workpack and prompt-pack.
- Perform read-only analysis of namespace options.
- Create ADR-004 renderer support namespace strategy draft.
- Recommend the current strategy and future target-state candidates.
- Propose follow-up workpacks.
- Update source-of-truth index with the ADR link.

## Out of scope
- Runtime code changes.
- `src/renderer/**` changes.
- Import updates.
- File moves.
- File deletion.
- Vite alias changes.
- TypeScript config changes.
- `package.json` or `package-lock.json` changes.
- Dependency changes.
- React UI or legacy fallback changes.

## Constraints
- Allowed files:
  - `docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy/**`
  - `docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/**`
  - `docs/architecture/decisions/**`
  - `docs/_indexes/source-of-truth.md` only for the ADR link
  - `docs/architecture/non-react-renderer-support-ownership.md` only for a short ADR link if needed
- Forbidden files:
  - `src/main/**`
  - `src/renderer/**`
  - `src/preload/**`
  - `src/shared/**`
  - `package.json`
  - `package-lock.json`
  - `tsconfig.json`
  - `vite.config.*`
  - `scripts/**`
  - `electron-builder.yml`
  - `node_modules/**`
  - `dist/**`
  - `build/**`
  - `release/**`

## Strong human gate triggers
- Any required runtime/source edit.
- Any required import/path move.
- Any required Vite, TypeScript, package, script, or lockfile change.
- Any dependency addition.
- Any recommendation that requires immediate migration instead of planning.
- Any source deletion.
- Any IPC/preload/security boundary change.

## Candidate epics
- Epic 1: Current namespace snapshot.
- Epic 2: Options A-D analysis.
- Epic 3: ADR-004 and source-of-truth indexing.
- Epic 4: Follow-up migration/preflight workpack queue.

## Risks
- Future work can still confuse top-level support with legacy if it ignores ADR-004.
- Deferring migration preserves some namespace ambiguity.
- Moving later may cost more if support modules grow.
- Existing `package-lock.json` remains dirty from outside this initiative.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `docs/architecture/decisions/ADR-004-renderer-support-namespace-strategy.md`
