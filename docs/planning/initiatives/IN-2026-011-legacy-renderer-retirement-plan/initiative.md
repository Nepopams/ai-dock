# Initiative - IN-2026-011 Legacy Renderer Retirement Plan

## Initiative ID
`IN-2026-011-legacy-renderer-retirement-plan`

## Title
Legacy Renderer Retirement Plan

## Status
Done

## Owner
Human + Codex

## Goal
Create a safe plan to retire the legacy plain renderer from active development after the React renderer became the default UI.

## User value
Developers and Codex can tell which renderer files are legacy, which are React-owned, which are shared renderer support, and which require a separate migration before deletion.

## Problem
The repository still contains the legacy plain renderer plus non-React support modules under `src/renderer/**`. React is now default, but deleting legacy without ownership mapping could break shared support, fallback behavior, or service/icon references.

## Success criteria
- Initiative artifacts exist.
- A planning workpack and prompt pack exist.
- `docs/architecture/renderer-retirement-plan.md` exists.
- Renderer inventory and ownership classification cover all renderer groups.
- Retirement options and recommendation are documented.
- Follow-up workpacks are proposed.
- Runtime/source/package/build files are not changed.
- Validators and scope checks pass.

## In scope
- Create initiative artifacts.
- Create planning workpack and prompt pack.
- Perform read-only `src/renderer/**` inventory.
- Classify renderer files and groups.
- Form a retirement roadmap.
- Add the architecture report to the source-of-truth index.

## Out of scope
- Deleting files.
- Changing runtime code.
- Changing `package.json` or `package-lock.json`.
- Changing `src/main/main.js`.
- Changing renderer source.
- Changing build scripts, Vite config, preload, shared, or IPC contracts.
- Adding dependencies.

## Constraints
- L2 architecture/docs autonomy.
- Runtime APPLY is forbidden.
- Deletion is forbidden.
- Strong gate if runtime/package/build/main changes are needed.

## Strong human gate triggers
- Any required change under `src/main/**`.
- Any required change under `src/renderer/**`.
- Any required change under `src/preload/**` or `src/shared/**`.
- Any package/build/Vite/script change.
- Immediate legacy deletion.
- Any ADR-003 change required by findings.

## Candidate epics
- E1: Renderer inventory and ownership classification.
- E2: Legacy retirement options and roadmap.
- E3: Follow-up workpack queue.

## Risks
- Existing uncommitted docs and `package-lock.json` changes pre-date this initiative.
- Some generated React dist files are present on disk but not tracked.
- `src/main/services.js` references one legacy icon, so icon deletion needs a later gated workpack.

## Links
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/renderer-retirement-plan.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `docs/planning/workpacks/WP-IN-2026-011-legacy-renderer-retirement-plan/workpack.md`
