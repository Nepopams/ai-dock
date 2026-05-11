# IN-2026-009 React Renderer Default Switch

## Initiative ID
IN-2026-009-react-renderer-default-switch

## Title
React Renderer Default Switch

## Status
Complete

## Owner
Human + Codex

## Goal
Make the React renderer the default VR AI Dock UI for development, start, and build scenarios while keeping the legacy plain renderer available only as an explicit fallback.

## User value
Developers and Codex have one clear primary Dock launch path and are less likely to validate the stale legacy UI.

## Problem
`dev:new-ui` and `AI_DOCK_REACT_UI=true` are transition artifacts. `npm start` and packaging can still resolve the legacy renderer or fail to guarantee a fresh React dist, which creates verification ambiguity.

## Success criteria
- `src/main/main.js` defaults to React renderer.
- Legacy renderer is selected only through an explicit fallback flag.
- `package.json` exposes `dev:app` as the full React dev app script.
- `dev:new-ui` remains as a compatibility alias.
- `electron:build` builds preload and React renderer before packaging.
- `package-lock.json`, dependencies, preload/shared/IPC contracts, and React components are unchanged.
- Validators, tests, build, preload build, and git scope checks pass or are reported.

## In scope
- Initiative artifacts.
- One scoped runtime/build workpack and prompt pack.
- Minimal `main.js` renderer selection change.
- Minimal `package.json` script change.
- Docs updates for run commands and service catalog.
- Verification and delivery report.

## Out of scope
- Deleting legacy renderer.
- Rewriting legacy UI.
- Changing React component behavior.
- IPC/preload/shared contract changes.
- Dependency additions.
- TypeScript migration.

## Constraints
- Do not add dependencies.
- Do not change `package-lock.json`.
- Do not change `src/preload/**`.
- Do not change `src/shared/**`.
- Do not change `src/renderer/react/**`.
- Do not change legacy renderer source files.
- Do not change IPC contracts.

## Strong human gate triggers
- Need to add a dependency.
- Need to change `package-lock.json`.
- Need to delete legacy renderer.
- Need to change preload/shared/IPC contracts.
- Production React build path cannot be determined safely.

## Candidate epics
- React renderer default runtime selection.
- Dev/start/build script cleanup.
- Manual smoke checklist for React default and legacy fallback.
- Future legacy renderer retirement.

## Risks
- `dev:app` still relies on concurrent Vite and Electron startup timing because no wait dependency may be added.
- Manual Electron smoke is still required because automated commands do not open an interactive app window.
- Existing uncommitted IN-2026-008 docs are present in the worktree and should be reviewed alongside this initiative.

## Links
- ADR: `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- Workpack: `docs/planning/workpacks/WP-IN-2026-009-react-renderer-default-switch/workpack.md`
- Run-state: `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/run-state.md`
