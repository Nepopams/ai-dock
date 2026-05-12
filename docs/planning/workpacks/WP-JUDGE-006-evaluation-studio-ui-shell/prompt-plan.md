# Prompt Plan: WP-JUDGE-006 Evaluation Studio UI Shell

## Objective
Plan the renderer-only Evaluation Studio shell without changing Judge runtime, IPC, preload, shared contracts, package files, or provider/settings schema.

## Required answers
- Confirm `EP-JUDGE-001` exists before APPLY.
- Explain current Judge entry flow through Sidebar/App.
- Explain how `EvaluationStudioView` can compose `CompareView`.
- Explain empty/manual start handling with `compareDraft` absent.
- Decide whether `useDockStore` changes are needed.
- Decide whether `CompareView` changes are needed.
- List exact files to change.
- List verification commands.
- Identify strong gates.

## PLAN conclusion
`EP-JUDGE-001` exists. The shell can be implemented by adding `EvaluationStudioView`, routing `App.tsx` to it for `activeLocalView === "compare"`, using `prepareJudgeComparison` for manual start, and reusing `CompareView` for the working Judge surface. No store or CompareView change is required by the initial plan.
