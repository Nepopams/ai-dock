# Orchestration Plan: IN-2026-035 EvaluationRun History UI Integration

## Initiative summary
Deliver a single scoped renderer UI workpack that connects the existing EvaluationRun save/list/read/delete preload API to Evaluation Studio and CompareView.

## Assumptions
- The human approval context covers `WP-JUDGE-007C` scope and allows L3 scoped renderer UI APPLY after a valid PLAN and gate check.
- `window.evaluationRuns` already exists from `IN-2026-034`; no preload or IPC changes are needed.
- Saved runs are already `EvaluationRunExport` records, so renderer open can adapt `record.run` into the existing compare draft shape.
- The existing export payload shape in `CompareView` is the correct source for Save Evaluation.
- Because `src/types/renderer.d.ts` is not in the allowed files, renderer code will use a narrow local bridge type/cast instead of editing declarations.

## Selected delivery mode
L3 scoped renderer UI APPLY, one workpack only.

Classification:
- Runtime single-layer dominant: renderer UI.
- Secondary state change: minimal Zustand action in existing judge slice.
- No IPC/preload/shared/storage/package/dependency change.

## Epic breakdown
- `EP-JUDGE-001`: Evaluation Studio MVP.
- Current slice: `WP-JUDGE-007C EvaluationRun History UI Integration`.
- Next slice: `WP-JUDGE-008 Tests and Smoke Suite`.

## Sprint mapping
No sprint folder is required. The epic roadmap/workpack map remain the delivery source of truth.

## Workpack queue
1. `WP-JUDGE-007C-evaluation-run-history-ui` - current scoped APPLY.
2. `WP-JUDGE-008 Tests and Smoke Suite` - future follow-up.

## Executor routing
Selected executor:
- `ai-dock-renderer-react-executor`

Secondary executors:
- `ai-dock-zustand-state-executor` for minimal `hydrateJudgeResult`.
- `ai-dock-test-qa-executor` for verification.
- `ai-dock-ipc-security-reviewer` for read-only API usage review.

## Gate plan
Gate A is satisfied by the human-approved workpack scope, allowed/forbidden paths, executor, and constraints.

Gate B is passed only if PLAN confirms:
- save/list/read/delete use existing preload API;
- no shared/preload/main/storage/package changes are required;
- opening saved runs can hydrate existing renderer state without re-running Judge.

Strong gate if any runtime layer beyond renderer/store is needed.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run `npm test`.
- Run `npm run build`.
- Run `git status --short`.
- Run `git diff --stat`.
- Run `git diff --check`.
- Run forbidden-path status check for main, preload, shared, package, build config, and scripts.
- Record manual Electron smoke checklist as pending unless executed separately.

## Risk register
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Need for global `window.evaluationRuns` typing outside allow-list | TypeScript build failure | Use narrow local bridge type/cast in allowed renderer files. |
| Open saved run accidentally re-runs Judge | User confusion/cost | Hydrate `judgeResult` directly and prepare compare draft from saved run. |
| Saved list exposes full subject content | Privacy issue | Render summaries only; full content appears only after explicit Open. |
| Existing export behavior regresses | User loses export workflow | Reuse export payload construction and leave Export MD/JSON handlers unchanged. |
| Manual UI behavior not smoke-tested | Residual QA risk | Keep manual smoke checklist in delivery report and recommend WP-JUDGE-008 follow-up. |
