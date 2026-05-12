# Prompt Plan: WP-JUDGE-007C EvaluationRun History UI Integration

Use Initiative Runner PLAN for `IN-2026-035`.

## Required PLAN answers
1. How `EvaluationStudioView` currently works.
2. How `CompareView` currently forms export payload.
3. How to save current Judge result as `EvaluationRun` without changing main/preload/shared.
4. Whether a Zustand action is needed for hydrating saved Judge result; if yes, which minimal action.
5. How to open saved `EvaluationRun`:
   - create compare draft from `run.subjects/question`;
   - restore `judgeResult` from `run.result + run.validatorResults + run.metadata`.
6. How to delete saved `EvaluationRun`.
7. How to refresh saved runs list after save/delete.
8. Exact files to change.
9. Tests/build commands to run.
10. Whether any strong gate is active.

## PLAN conclusion
Proceed to APPLY only if no main, preload, shared, storage, IPC, package, dependency, auto-save, n8n, or large CompareView rewrite is required.
