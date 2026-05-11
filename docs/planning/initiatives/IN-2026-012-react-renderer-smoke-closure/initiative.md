# Initiative - IN-2026-012 React Renderer Smoke Closure

## Initiative ID
`IN-2026-012-react-renderer-smoke-closure`

## Title
React Renderer Smoke Closure

## Status
Done

## Owner
Human + Codex

## Goal
Record manual smoke-test evidence for the React renderer default path and close the pending manual smoke from IN-2026-009.

## User value
The project has file-backed evidence that the React default launch path can be used as the baseline before further legacy renderer retirement work.

## Problem
IN-2026-009 automated verification passed, but its delivery report stayed at CONDITIONAL GO because manual Electron smoke was pending.

## Success criteria
- Initiative artifacts exist.
- A docs-only workpack and prompt pack exist.
- `docs/architecture/react-renderer-smoke-report.md` exists.
- Human-provided manual smoke results are recorded.
- React default confidence is GO if critical smoke checks are PASS.
- Runtime/source/package/build files are not changed.
- Validators and scope checks pass.

## In scope
- Create initiative artifacts.
- Create docs-only workpack and prompt pack.
- Create smoke evidence report.
- Record closure status in delivery report and run-state.
- Add the smoke report to the source-of-truth index.

## Out of scope
- Runtime/build/package changes.
- Legacy archive, move, or deletion.
- ADR-003 changes.
- IN-2026-009 runtime changes.
- New automated tests.

## Constraints
- L2 docs/evidence autonomy.
- Runtime APPLY is forbidden.
- `package.json`, `package-lock.json`, `src/main/**`, `src/renderer/**`, `src/preload/**`, `src/shared/**`, Vite, scripts, and Electron builder files are forbidden.

## Strong human gate triggers
- Any required runtime/source/package/build file change.
- Any blocking FAIL in the provided manual smoke evidence.
- Any required ADR-003 or renderer strategy change.
- Any legacy deletion or fallback behavior change.

## Candidate epics
- E1: Manual smoke evidence capture.
- E2: Smoke closure report and initiative delivery.
- E3: Docs-only validation and runtime scope review.

## Risks
- Legacy fallback status was provided as `PASS / NOT TESTED`, so fallback smoke may remain a non-blocking follow-up before retirement work.
- Manual smoke evidence is human-provided and not automated coverage.
- The working tree contains a pre-existing `package-lock.json` modification unrelated to this initiative.

## Links
- `docs/architecture/react-renderer-smoke-report.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/renderer-retirement-plan.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `docs/planning/workpacks/WP-IN-2026-012-react-renderer-smoke-closure/workpack.md`
