# Prompt Plan: WP-JUDGE-007A EvaluationRun Export Foundation

## Objective
Plan a scoped EvaluationRun export foundation for Judge Mode without adding EvaluationRun history storage, new IPC channels, storage migration, provider/settings changes, dependencies, or Judge runtime pipeline changes.

## Required answers
1. What EvaluationRun export foundation means in this workpack.
2. Why history storage is excluded from APPLY.
3. Whether existing export IPC channels can be used.
4. Whether preload modules or shared IPC need changes; if yes, STOP.
5. Which EvaluationRun export shape to choose.
6. How to preserve compatibility with current `JudgeExportPayload`.
7. How to render validator results in Markdown.
8. How to render dynamic criteria instead of hard-coded criteria.
9. How to handle `rawResponse` in Markdown/JSON export.
10. Which exact files to change.
11. Which tests to add or update.
12. Whether any strong gate is active.

## PLAN conclusion
`WP-JUDGE-007A` can proceed under L3 scoped APPLY. The work uses existing export IPC channels, introduces an export-only EvaluationRun envelope, keeps JSON legacy top-level fields, omits raw response from Markdown, and avoids storage/history/provider/package/runtime pipeline scope. No strong gate is active unless implementation needs forbidden paths or new IPC/storage/dependencies.
