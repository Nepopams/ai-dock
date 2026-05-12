# Task Queue: IN-2026-026 Judge Custom Rubric / Custom Prompt

## Queue status
Delivered: PLAN, APPLY, REVIEW, and delivery report are complete.

## Workpack ID
`WP-JUDGE-003-custom-rubric-prompt`

## Type
`runtime-development`

## Selected executor
`ai-dock-main-process-executor`

## Status
Done

## Gate status
No strong gate triggered. Runtime APPLY remains bounded to approved paths.

## PLAN status
Done. PLAN concluded optional `customPrompt` can be added backward-compatibly on the existing `judge:run` flow.

## APPLY status
Done. Shared, preload, main service, renderer, and tests were updated inside allowed paths.

## REVIEW status
Done. Automated verification passed.

## Next action
Review diff, then commit/push when requested.

## Current queue
| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| T1 | Read required governance, workflow, Judge runtime/UI/test context | Done | Existing Judge rubric flow and sanitizer inspected. |
| T2 | Create initiative/workpack artifacts | Done | File-backed state created. |
| T3 | PLAN `WP-JUDGE-003-custom-rubric-prompt` | Done | No strong gate found. |
| T4 | APPLY bounded runtime/shared/preload/renderer/test changes | Done | Optional `customPrompt` flow implemented. |
| T5 | REVIEW automated verification and scope checks | Done | Required commands passed. |
| T6 | Update delivery report and final run-state | Done | Manual smoke remains not run. |

## Blocked tasks
None.

## Out-of-scope queue
| Future work | Reason |
| --- | --- |
| Preset picker | Separate Evaluation Studio/UI workpack. |
| JSON validators | Separate deterministic validator workpack. |
| EvaluationRun history/storage | Separate storage/history workpack. |
| n8n integration | Future integration after EvaluationRun shape exists. |
