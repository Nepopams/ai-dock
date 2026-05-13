# IN-UI-010 Visual Gap Auto-Triage

## Initiative ID
`IN-UI-010-visual-gap-auto-triage`

## Title
UI v2 Visual Gap Auto-Triage

## Status
Delivered - docs/design triage completed; runtime APPLY not performed.

## Owner
Human + Codex

## Goal
Fill the UI v2 visual gap matrix and produce evidence-backed root-cause and fixpack planning from canonical Pencil PNG exports, current Electron screenshots, prior delivery reports, and current React code ownership.

## Problem
Previous UI v2 workpacks passed automated checks but did not prove visual fidelity. Current screenshots show large differences from the Pencil targets, so the rollout needs evidence-backed triage before more runtime fixes.

## User value
The user gets a concrete diagnosis of why UI v2 did not visibly apply and which scoped runtime fixpacks should run next.

## Type
L2 visual QA / design triage / docs APPLY. Runtime APPLY is forbidden.

## Constraints
- Do not change `src/**`.
- Do not change package, lock, config, script, build, or release files.
- Do not apply runtime UI fixes.
- Do not add dependencies or screenshot automation.
- Do not mark visual GO when composition is visibly different.
- Stop if image inspection is unavailable.

## In scope
- Create initiative artifacts and `WP-UI-010` prompt-pack.
- Inspect design/current screenshots where present.
- Inspect code ownership and prior delivery/changed-file evidence.
- Update `visual-gap-matrix.md`.
- Create visual triage, runtime root cause, and fixpack sequence docs.
- Update fixpack backlog and roadmap.

## Out of scope
- Runtime CSS, React, store, IPC, preload, main, shared, package, dependency, or config changes.
- Visual diff tooling or screenshot automation.
- Runtime fixpacks.

## Success criteria
- Image inspection availability is stated.
- Visual gap matrix has no TBD for screens with screenshots.
- Missing screenshots are explicitly marked.
- Root-cause report explains why previous workpacks missed visible design fidelity.
- Fixpack sequence identifies concrete owner files and first recommended runtime fixpack.
- Validators and docs-only forbidden-path checks pass.

## Candidate workpack
- `WP-UI-010-visual-gap-auto-triage`

## Strong human gate triggers
- Image inspection is unavailable.
- Current screenshots are insufficient for every requested verdict.
- Runtime code changes become necessary.
- Any required change would touch forbidden paths.

## Candidate epics
- UI v2 visual acceptance.
- UI v2 runtime fixpack planning.

## Risks
- Triage does not fix UI by itself.
- Empty-state screenshots can understate or misstate populated-screen fidelity.
- History Hub still needs a current screenshot before visual verdict.

## Links
- Workpack: `docs/planning/workpacks/WP-UI-010-visual-gap-auto-triage/workpack.md`
- Matrix: `docs/design/ui-v2/visual-gap-matrix.md`
- Triage report: `docs/design/ui-v2/ui-v2-visual-triage-report.md`
- Root cause: `docs/design/ui-v2/ui-v2-runtime-root-cause.md`
- Fixpack sequence: `docs/design/ui-v2/ui-v2-fixpack-sequence.md`
