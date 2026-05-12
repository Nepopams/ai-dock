# Prompt Apply: WP-JUDGE-007C EvaluationRun History UI Integration

Apply the approved PLAN for `IN-2026-035`.

## Scope
- Add Save Evaluation in `CompareView`.
- Add optional `onEvaluationSaved` callback.
- Add saved EvaluationRuns list/open/delete UI in `EvaluationStudioView`.
- Add minimal `hydrateJudgeResult` Zustand action.
- Add minimal dark UI styles.
- Update EP-JUDGE docs and architecture note.

## Constraints
- Do not change main/preload/shared/storage/IPC/package/build/dependency files.
- Do not add auto-save, search/filter, n8n, or CompareView redesign.
- Use the existing `window.evaluationRuns` API.
- Use local bridge types/casts instead of editing global declarations.

## Stop if
- Any forbidden path change is needed.
- Opening saved run cannot work without shared/preload/main/storage changes.
- Save requires a new API or dependency.
- Review reveals a Must Fix that changes scope/routing/risk.
