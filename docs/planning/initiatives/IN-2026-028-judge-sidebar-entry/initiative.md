# Initiative: IN-2026-028 Judge Sidebar Entry

## Initiative ID
`IN-2026-028-judge-sidebar-entry`

## Title
Judge Sidebar Entry

## Status
Completed

## Owner
Human + Codex

## Goal
Make the existing Judge/Compare view visible and directly reachable from the React sidebar.

## User value
Users can open Judge Comparison without first arriving there through another flow.

## Problem
`CompareView` is already rendered by `App.tsx` for `activeLocalView === "compare"`, but `Sidebar.tsx` does not expose a visible Judge entry.

## Success criteria
- [x] Initiative artifacts exist.
- [x] Workpack and prompt-pack exist.
- [x] Sidebar has a `Judge` entry with id `compare`.
- [x] Entry calls `focusLocalView("compare")`.
- [x] Existing sidebar entries are preserved.
- [x] No Judge runtime, IPC, preload, shared contract, package, or build script files are changed.
- [x] Required verification commands pass.

## In scope
- Add a minimal sidebar button for Judge/Compare.
- Use existing `focusLocalView("compare")`.
- Reuse an existing icon asset.
- Create initiative/workpack artifacts.

## Out of scope
- Judge runtime changes.
- IPC/preload/shared contract changes.
- CompareView redesign or Evaluation Studio.
- Preset picker, backend labeling, JSON validator changes.
- Package/dependency changes.

## Constraints
- Do not change `src/main/**`.
- Do not change `src/preload/**`.
- Do not change `src/shared/**`.
- Do not change `src/renderer/react/views/CompareView.tsx`.
- Do not change `src/renderer/store/**`.
- Do not change `package.json` or `package-lock.json`.
- Do not add icon assets unless strictly needed.

## Strong human gate triggers
- Need for runtime Judge changes.
- Need for IPC/preload/shared contract changes.
- Need for package/dependency changes.
- Need for Sidebar redesign.
- Need to edit files outside allowed paths.

## Candidate epics
- Epic 1: Initiative/workpack orchestration.
- Epic 2: Sidebar local view entry.
- Epic 3: Verification and delivery report.

## Risks
- Manual visual smoke remains pending.
- Reusing `infoIcon` is acceptable for a minimal entry but not a final Judge brand/icon decision.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-IN-2026-028-judge-sidebar-entry/workpack.md`
