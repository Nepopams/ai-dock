# Initiative: IN-2026-036 Judge Dynamic Criteria Display

## Initiative ID
`IN-2026-036-judge-dynamic-criteria-display`

## Title
Judge Dynamic Criteria Display

## Status
Done

## Owner
Human + Codex

## Goal
Align `CompareView` score rendering with `EvaluationRun` and export support for dynamic score criteria.

## User value
Users can see every criterion returned by Judge or restored from a saved EvaluationRun, including future presets and custom rubric-derived criteria, instead of losing non-default scores in the UI.

## Problem
`CompareView` still renders only `coherence`, `factuality`, and `helpfulness`, while `EvaluationRun` export/history can carry arbitrary criteria such as `clarity`, `depth`, `evidence`, `json_validity`, `prompt_adherence`, or `security`.

## Success criteria
- [x] `CompareView` discovers criteria from `judgeResult.scores`.
- [x] Existing default criteria keep preferred ordering: `coherence`, `factuality`, `helpfulness`.
- [x] Additional criteria render after defaults in first-seen order.
- [x] Empty/no-score results show `No score criteria returned.`
- [x] No `src/main/**`, `src/preload/**`, `src/shared/**`, package, dependency, storage, export, or Judge pipeline changes.
- [x] Targeted helper tests, `npm test`, and `npm run build` pass.
- [x] EP-JUDGE roadmap/workpack map and architecture note are updated.

## In scope
- Create file-backed initiative artifacts.
- Create `WP-IN-2026-036-judge-dynamic-criteria-display` and prompt-pack.
- Execute PLAN, gate evaluation, scoped APPLY, verification, and REVIEW.
- Add a pure renderer helper for criteria discovery.
- Update `CompareView` score table rendering to use discovered criteria.
- Add a small empty-state row when no score criteria are present.
- Add targeted helper tests.
- Update EP-JUDGE roadmap/workpack map and a short architecture note.

## Out of scope
- Judge runtime or prompt changes.
- Preset picker changes.
- Dynamic criteria editing or generation.
- New IPC, preload, storage, export, or EvaluationRun format changes.
- Main process changes.
- Shared contract/type changes.
- Package or dependency changes.
- Full CompareView redesign.

## Constraints
- Autonomy: L3 scoped renderer UI APPLY.
- Human approval context: user explicitly approved the small Judge compatibility workpack.
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary executor: `ai-dock-test-qa-executor`.
- `ai-dock-zustand-state-executor` is only available if PLAN proves store hydration changes are required; PLAN concluded it is not required.
- Allowed runtime files are limited to renderer UI/helper and optional helper test.
- Forbidden paths include `src/main/**`, `src/preload/**`, `src/shared/**`, `package.json`, `package-lock.json`, `scripts/**`, build output, and release output.

## Strong human gate triggers
- Need to change `src/main/**`, `src/preload/**`, or `src/shared/**`.
- Need to change Judge pipeline, export, storage, IPC, preload bridge, or EvaluationRun persistence.
- Need a dependency or package metadata change.
- Need to change `src/renderer/store/judgeSlice.ts`.
- Need to change `EvaluationStudioView.tsx` beyond docs-compatible read-only context.
- Need a large CompareView redesign.
- Verification cannot run safely.
- Diff leaves the allowed paths.

## Candidate epics
- `EP-JUDGE-001`: Judge Mode / Evaluation Studio MVP compatibility slice for dynamic criteria display.

## Risks
- Existing shared `JudgeCriterion` is still a fixed union; this workpack avoids changing shared types and treats dynamic criteria as renderer display compatibility data.
- Manual Electron smoke may remain pending.
- Saved runs with fewer than two answers are still blocked by existing `EvaluationStudioView` open behavior and are out of scope.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `docs/planning/workpacks/WP-IN-2026-036-judge-dynamic-criteria-display/workpack.md`
