# Initiative: IN-2026-031 Judge Evaluation Studio Epic Setup

## Initiative ID
`IN-2026-031-judge-evaluation-studio-epic-setup`

## Title
Judge Evaluation Studio Epic Setup

## Status
Done

## Owner
Human + Codex

## Goal
Create `EP-JUDGE-001` as the file-backed epic container for Judge Mode / Evaluation Studio MVP and connect completed foundation workpacks to the next bounded roadmap step.

## User value
Human reviewers and Codex can see what is already done, what belongs to the MVP, what is deferred, and why `WP-JUDGE-006 Evaluation Studio UI Shell` must remain a separate workpack instead of a giant APPLY.

## Problem
Judge Mode has grown from a small CompareView enhancement into a capability-level Evaluation Studio direction. Foundation workpacks already exist, but there was no epic-level source of truth tying architecture, foundation layers, entry point, UI shell, history/export, tests, research, and future n8n integration together.

## Success criteria
- [x] Initiative artifacts exist and validate.
- [x] Docs/governance workpack and prompt-pack exist and validate.
- [x] `EP-JUDGE-001-evaluation-studio-mvp` exists with `epic.md`, `roadmap.md`, and `workpack-map.md`.
- [x] Completed Judge foundation workpacks are linked to delivery reports.
- [x] `WP-JUDGE-006 Evaluation Studio UI Shell` is marked as Next and not implemented.
- [x] Sprint layer is documented as optional, with no new Judge sprint folder required.
- [x] Runtime, package, build, and script files are unchanged by this initiative.

## In scope
- Create IN-2026-031 initiative artifacts.
- Create `WP-IN-2026-031-judge-evaluation-studio-epic-setup` docs/governance workpack and prompt-pack.
- Create `EP-JUDGE-001-evaluation-studio-mvp` epic folder with roadmap and workpack map.
- Create planning README notes for epics and optional sprint usage.
- Add discoverability links in `source-of-truth.md` and `feature-index.md`.

## Out of scope
- `WP-JUDGE-006` runtime/UI implementation.
- Evaluation Studio UI.
- Any `src/**` changes.
- New tests outside docs/workflow validators.
- Dependency, build, config, package, or script edits.
- n8n integration.

## Constraints
- Runtime APPLY is forbidden.
- Do not change `src/**`.
- Do not change `package.json` or `package-lock.json`.
- Do not change build/config/scripts.
- Do not add dependencies.
- Do not create a sprint as a mandatory layer.
- Do not change the meaning of Judge architecture or ADR-005.
- Allowed paths are limited to the initiative, workpack, epic, optional planning README, and index-link files listed in the workpack.

## Strong human gate triggers
- Any need to change runtime files.
- Any need to modify security invariants, IPC/preload boundaries, data formats, dependency metadata, package files, build config, or scripts.
- Any need to expand beyond the allowed files.
- Any proposal to implement `WP-JUDGE-006` inside this initiative.
- Any review finding that changes scope, risk profile, or routing.

## Candidate epics
- `EP-JUDGE-001 Judge Mode / Evaluation Studio MVP`: capability-level epic containing completed Judge foundation, sidebar entry, next Studio shell, later EvaluationRun history/export, tests/smoke, research mode, and n8n preflight.

## Risks
- The epic could become stale if future Judge workpacks do not update it; mitigation: make epic roadmap/workpack map an explicit update target for future Judge planning.
- Manual smoke remains pending for several completed UI/runtime workpacks; mitigation: mark pending smoke in the workpack map and keep `WP-JUDGE-008` as later QA/smoke slice.
- `WP-JUDGE-006` can drift into a giant APPLY if it includes history/export or n8n; mitigation: keep those as later separate workpacks.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../epics/EP-JUDGE-001-evaluation-studio-mvp/epic.md`
