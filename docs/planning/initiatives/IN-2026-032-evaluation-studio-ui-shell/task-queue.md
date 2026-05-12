# Task Queue: IN-2026-032 Evaluation Studio UI Shell

## Queue status
Completed. Single approved renderer UI workpack was delivered.

## Workpack ID
`WP-JUDGE-006-evaluation-studio-ui-shell`

## Type
L3 scoped renderer UI APPLY

## Selected executor
`ai-dock-renderer-react-executor`

## Status
Done

## Gate status
Strong gate clear. Epic exists, and no forbidden runtime/package/IPC changes are planned.

## PLAN status
Completed.

PLAN conclusion:
1. `EP-JUDGE-001` artifacts exist, so the initiative may proceed.
2. Judge currently opens through the sidebar `Judge` entry using `focusLocalView("compare")`, and `App.tsx` renders the compare route for `activeLocalView === "compare"`.
3. `EvaluationStudioView` can wrap the route and compose `CompareView` whenever `compareDraft` exists.
4. Empty state can use `actions.prepareJudgeComparison` to create a draft from two manual answers.
5. `useDockStore` does not need changes because `prepareJudgeComparison` already accepts a question and answer list.
6. `CompareView` does not need changes for the shell; it remains the working Judge form/result surface.
7. Exact runtime files to change: `src/renderer/react/App.tsx`, `src/renderer/react/views/EvaluationStudioView.tsx`, and `src/renderer/react/styles/global.css`.
8. Exact docs files to change: IN-2026-032 artifacts, `WP-JUDGE-006` prompt-pack, and `EP-JUDGE-001` roadmap/workpack map.
9. Verification commands are listed in the orchestration plan.

## APPLY status
Completed.

## REVIEW status
GO.

## Next action
Run manual smoke in an Electron session, then open a separate `WP-JUDGE-007 EvaluationRun History and Export` initiative/workpack.
