# Initiative - IN-2026-014 Non-React Renderer Support Ownership Audit

## Initiative ID
`IN-2026-014-non-react-renderer-support-ownership-audit`

## Title
Non-React Renderer Support Ownership Audit

## Status
Done

## Owner
Human + Codex

## Goal
Create an accurate ownership map for top-level renderer support modules so legacy renderer retirement does not remove active React dependencies.

## User value
Developers and Codex get explicit rules for what to keep, what to migrate under a future namespace, what is migration residue, and what requires a separate gated retirement workpack.

## Problem
After the React renderer became the default UI, `src/renderer/**` still contains a legacy plain renderer entrypoint and top-level support modules outside `src/renderer/react/**`. Some top-level modules are active React dependencies, so deleting everything outside `src/renderer/react/**` would break the app.

## Success criteria
- [x] Initiative artifacts are file-backed under `docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit/`.
- [x] Workpack and prompt-pack are created under `docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/`.
- [x] Architecture report exists at `docs/architecture/non-react-renderer-support-ownership.md`.
- [x] Top-level `store/**`, `adapters/**`, `components/**`, and `utils/**` are inventoried and classified.
- [x] Dependency/reference map covers React usage, legacy usage, main/preload usage, and test usage where found.
- [x] Follow-up workpacks IN-2026-017 through IN-2026-022 are proposed.
- [x] Runtime/source/package/build files are not changed.

## In scope
- Create initiative artifacts.
- Create one planning workpack and prompt-pack.
- Perform read-only inventory of top-level renderer support modules.
- Build dependency/reference map between React and top-level support modules.
- Classify each file or small group.
- Recommend keep, migrate under React, move to shared renderer namespace, investigate, or retire later.
- Create `docs/architecture/non-react-renderer-support-ownership.md`.
- Update `docs/_indexes/source-of-truth.md` only to add the report link.

## Out of scope
- Runtime APPLY.
- File moves.
- File deletion.
- Import changes.
- Vite alias changes.
- TypeScript config changes.
- Package scripts or dependency metadata changes.
- Legacy entrypoint deletion.

## Constraints
- Allowed files:
  - `docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit/**`
  - `docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/**`
  - `docs/architecture/non-react-renderer-support-ownership.md`
  - `docs/_indexes/source-of-truth.md` only for the report link
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
- No dependencies may be added.
- No runtime/source/package/build files may be modified.

## Strong human gate triggers
- Any need to change runtime files.
- Any need to change imports, path aliases, package metadata, Vite config, TypeScript config, scripts, or lockfile.
- Any proposed source deletion or file move.
- Any security invariant, preload/IPC boundary, data format, or dependency impact.
- Any audit finding that demands immediate deletion or movement rather than a future gated workpack.

## Candidate epics
- Epic 1: Inventory and dependency mapping for top-level non-React renderer support modules.
- Epic 2: Ownership classification and architecture report.
- Epic 3: Future namespace and cleanup workpack queue.

## Risks
- Top-level active support modules can still be mistaken for legacy in future work.
- `selectorHeuristics.js` is easy to misclassify because React adapter runtime uses the TS version while tests import the JS version.
- Legacy icons are not purely renderer-local because `src/main/services.js` references a top-level icon path.
- Existing dirty worktree changes can appear in aggregate status/diff output.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `docs/architecture/non-react-renderer-support-ownership.md`
