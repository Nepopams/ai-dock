# Prompt Plan: WP-JUDGE-007B EvaluationRun History Store

Use Initiative Runner PLAN for `IN-2026-034`.

## Required PLAN answers
1. Why EvaluationRun store must be separate from chat history.
2. Which storage layout to choose.
3. Why file-per-run or another layout is appropriate.
4. Which IPC channels are needed and why they are bounded.
5. Which preload API is needed.
6. How to preserve backward compatibility with `EvaluationRunExport`.
7. Rollback plan.
8. How list summaries avoid `rawResponse`, secrets, full subject content, and custom prompts.
9. Exact files to change.
10. Tests to add.
11. Whether any strong gate is active.

## PLAN conclusion
Proceed to APPLY only if no chat history, Judge runtime, renderer UI, database, migration, package, dependency, or provider/settings change is required.
