# Initiative: IN-2026-035 EvaluationRun History UI Integration

## Initiative ID
`IN-2026-035-evaluation-run-history-ui`

## Title
EvaluationRun History UI Integration

## Status
Done

## Owner
Human + Codex

## Goal
Make saved `EvaluationRun` records usable from Evaluation Studio UI: save the current Judge result, list saved evaluations, open a saved run without re-running Judge, and delete saved runs.

## User value
Users can preserve Judge/Evaluation Studio results and return to them later without relying on manual export files.

## Problem
`IN-2026-033` added the normalized `EvaluationRun` export foundation, and `IN-2026-034` added a separate save/list/read/delete preload API. The renderer UI does not yet use that API, so saved evaluations are not reachable from Evaluation Studio.

## Human approval context
The human explicitly approved `WP-JUDGE-007C EvaluationRun Save/List/Open/Delete UI` as the next Judge Mode workpack.

Autonomy level: L3 scoped renderer UI APPLY.

## Success criteria
- [x] Initiative artifacts exist and validate.
- [x] `WP-JUDGE-007C-evaluation-run-history-ui` exists with prompt-pack.
- [x] PLAN answers the requested EvaluationStudioView, CompareView payload, save, open, delete, refresh, files, verification, and gate questions.
- [x] Save Evaluation is available only after a Judge result and evaluated answers exist.
- [x] Save uses the existing `mapJudgeExportPayloadToEvaluationRun` mapper and `window.evaluationRuns.save`.
- [x] Evaluation Studio lists up to 20 saved runs via `window.evaluationRuns.list({ limit: 20, offset: 0 })`.
- [x] Open reads a saved run, restores compare draft, and hydrates `judgeResult` without re-running Judge.
- [x] Delete uses `window.evaluationRuns.delete` and refreshes the list.
- [x] No auto-save, search/filter, n8n, new dependency, package change, IPC/storage/preload/main/shared change, or large CompareView redesign.
- [x] EP-JUDGE roadmap/workpack map and short architecture note are updated.
- [x] Automated verification and scope checks are recorded.

## In scope
- Create initiative artifacts and workpack/prompt-pack.
- Execute PLAN, Gate Evaluation, APPLY, QA/Verification, REVIEW, and delivery reporting.
- Add a Save Evaluation button to `CompareView`.
- Add optional `onEvaluationSaved` prop to `CompareView`.
- Add a compact saved EvaluationRuns list/panel to `EvaluationStudioView`.
- Add open saved run behavior using existing store compare draft plus minimal Judge result hydration.
- Add delete saved run behavior using the existing preload API.
- Add minimal Zustand action `hydrateJudgeResult(result: JudgeResult): void`.
- Add minimal dark UI styles.
- Add focused renderer helper tests only if useful and possible without brittle UI harness.
- Update EP-JUDGE planning docs and a short architecture note.

## Out of scope
- Auto-save after every Judge run.
- Search/filter/sort advanced UI.
- New IPC/storage/preload/shared channels or contracts.
- Main process changes.
- Storage changes.
- n8n integration.
- EvaluationRun import/export beyond existing APIs.
- Full CompareView redesign.
- Dedicated EvaluationRun detail page.
- Package/dependency/build config changes.

## Constraints
- Do not change `src/main/**`.
- Do not change `src/preload/**`.
- Do not change `src/shared/**`.
- Do not change storage.
- Do not change IPC channels.
- Do not change `package.json` or `package-lock.json`.
- Do not add dependencies.
- Use only the existing `window.evaluationRuns` API.
- Use local renderer casts instead of editing global window declarations unless the allow-list is expanded.
- Keep saved-list summaries compact and do not render full subject content in the list.

## Strong human gate triggers
- Need to change main, preload, shared, storage, IPC, package, dependency, or build metadata.
- Need to auto-save runs.
- Need a large CompareView rewrite.
- Open saved run cannot be implemented without runtime/shared/preload changes.
- Required file changes exceed the allowed paths.
- Security invariant risk appears, including Node access from renderer or token/secret exposure.
- REVIEW Must Fix changes scope, risk profile, routing, or allowed paths.

## Candidate epics
- `EP-JUDGE-001 Judge Mode / Evaluation Studio MVP`

## Risks
- Saved list uses summaries only; opening a record intentionally loads full saved subject content into CompareView.
- Manual Electron smoke remains required because this is UI behavior.
- The global `window.evaluationRuns` TypeScript declaration path exists but is not in the allow-list, so renderer code must use a narrow local bridge type/cast.
- Existing CompareView cleanup clears Judge result on unmount; open flow must keep Studio in the compare workspace.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-007C-evaluation-run-history-ui/workpack.md`
