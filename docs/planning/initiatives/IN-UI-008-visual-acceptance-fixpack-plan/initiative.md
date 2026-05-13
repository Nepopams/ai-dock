# IN-UI-008 Visual Acceptance and Fixpack Plan

## Initiative ID
`IN-UI-008-visual-acceptance-fixpack-plan`

## Title
UI v2 Visual Acceptance and Fixpack Plan

## Status
Delivered - acceptance pack prepared; manual screenshots pending.

## Owner
Human + Codex

## Goal
Create a visual acceptance control layer for the AI Dock UI v2 rollout before any further runtime UI changes.

## Problem
The UI v2 workpack chain passed automated build/test and path checks, but it did not produce a formal visual comparison between Pencil exports and the running Electron app. Numeric design PNG exports exist, canonical filenames were missing, and current app screenshots were not captured.

## User value
Human and Codex get a concrete, reviewable way to compare design targets against the actual app and create scoped fixpacks only for real visual gaps.

## Type
L2 docs/design/assets/planning APPLY. Runtime APPLY is forbidden.

## Constraints
- Do not change `src/**`.
- Do not change package, lockfile, config, script, build, or release files.
- Do not add dependencies or screenshot automation tooling.
- Do not create placeholder current screenshots.
- Do not perform UI runtime fixpacks in this initiative.
- Do not delete numeric PNG exports.

## In scope
- Create initiative artifacts.
- Create `WP-UI-008` workpack and prompt-pack.
- Copy numeric design PNG exports to canonical filenames when missing.
- Preserve numeric PNG exports.
- Create current screenshot capture folder and instructions.
- Create visual acceptance model, visual gap matrix, final smoke checklist, and fixpack backlog template.
- Update UI v2 roadmap, screen map, and index links.

## Out of scope
- Runtime CSS or React changes.
- Store, IPC, preload, main, shared, package, dependency, config, script, build, or release changes.
- Screenshot automation tooling.
- Visual fixpack implementation.
- Claiming visual acceptance without current screenshots.

## Success criteria
- Canonical PNG files exist for all available numeric exports.
- Numeric PNG files remain untouched.
- Current screenshot pack documents required manual screenshots.
- Visual acceptance docs and matrix template exist.
- Fixpack backlog uses bounded WP-UI-009 buckets.
- Validators pass.
- Forbidden runtime/package/config path check is clean.

## Candidate workpack
- `WP-UI-008-visual-acceptance-fixpack-plan`

## Strong human gate triggers
- Runtime APPLY is required.
- Package/config/script/dependency changes are required.
- Visual acceptance must be claimed without current screenshots.
- Screenshot automation tooling becomes required.
- A proposed fixpack cannot be scoped without Human visual evidence.

## Candidate epics
- UI v2 visual acceptance.
- UI v2 evidence-backed fixpack planning.

## Risks
- Visual acceptance remains incomplete until Human captures current screenshots.
- Manual screenshots can vary by app state and window size.
- Fixpack backlog must not become another broad restyle without evidence.

## Links
- Workpack: `docs/planning/workpacks/WP-UI-008-visual-acceptance-fixpack-plan/workpack.md`
- Design exports: `docs/design/ui-v2/exports/README.md`
- Current screenshots: `docs/design/ui-v2/current-screenshots/README.md`
- Visual acceptance: `docs/design/ui-v2/visual-acceptance.md`
- Visual gap matrix: `docs/design/ui-v2/visual-gap-matrix.md`
- Fixpack backlog: `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
