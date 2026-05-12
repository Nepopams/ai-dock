# Initiative: IN-2026-025 Judge Evaluation Preset Catalog

## Initiative ID
`IN-2026-025-judge-evaluation-preset-catalog`

## Title
Judge Evaluation Preset Catalog

## Status
Done

## Owner
Human + Codex

## Goal
Create the first static Evaluation Presets v1 catalog for future Judge Mode / Evaluation Studio work.

## User value
Future users will be able to select ready-made evaluation modes instead of writing a rubric from scratch for every Judge run.

## Problem
Judge Mode is moving toward Evaluation Studio, but the current prototype has no catalog or data model for evaluation presets. Without a catalog foundation, later UI/runtime work will stay coupled to hard-coded criteria.

## Success criteria
- [x] Runtime/data workpack and prompt-pack exist.
- [x] PLAN answers location, type/guard, JSON viability, runtime isolation, catalog format, preset scope, tests, gates, and exact files.
- [x] Static catalog exists under `src/shared/presets/evaluation/**`.
- [x] Shared EvaluationPreset types/guards exist without changing current Judge contracts.
- [x] Catalog includes all 10 MVP preset ids.
- [x] Validators are declarative only.
- [x] Targeted catalog tests pass.
- [x] No `src/main/**`, `src/preload/**`, `src/renderer/**`, `src/shared/ipc/**`, current Judge types, prompts, package, config, or script files are changed.
- [x] Required verification commands are run and recorded.

## In scope
- Create initiative artifacts.
- Create `WP-JUDGE-002-evaluation-preset-catalog` and prompt-pack.
- Add static evaluation preset catalog data.
- Add shared EvaluationPreset types/guards if PLAN approves.
- Add catalog validation tests.
- Update run-state, gates, and delivery report.

## Out of scope
- Runtime prompt assembly.
- Current Judge pipeline behavior.
- UI preset picker.
- Validator execution.
- New IPC channels.
- New provider settings.
- EvaluationRun storage/history.
- n8n integration.

## Constraints
- Do not change Judge pipeline runtime.
- Do not change main/preload/renderer/IPC.
- Do not change current `JudgeInput`/`JudgeResult`.
- Do not add dependencies.
- Do not change package, lockfile, tsconfig, vite, or scripts.
- Do not implement deterministic validator runtime.
- Do not implement Evaluation Studio UI.

## Strong human gate triggers
- Need to edit `src/main/**`, `src/preload/**`, `src/renderer/**`, or `src/shared/ipc/**`.
- Need to edit current `src/shared/types/judge.*`.
- Need for package, lockfile, dependency, tsconfig, vite, or script changes.
- Need for provider settings migration.
- Need to execute validators at runtime.
- Need for UI preset picker or CompareView changes.
- Inability to validate catalog without a new dependency.

## Candidate epics
- Epic 1: Initiative/workpack orchestration.
- Epic 2: EvaluationPreset shared data model.
- Epic 3: Static preset catalog v1.
- Epic 4: Catalog validation tests.
- Epic 5: Verification and REVIEW.

## Risks
- Catalog shape can accidentally become a runtime contract too early. Mitigation: keep it static data and document that runtime does not consume it yet.
- Criteria can diverge from future prompt assembly needs. Mitigation: keep shape explicit and versioned.
- JSON catalog can become hard to validate manually. Mitigation: dependency-free guard tests.
- This branch is stacked on `workflow/in-2026-024-judge-contract-hardening` because IN-2026-024 artifacts are not on `master`.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-002-evaluation-preset-catalog/workpack.md`
