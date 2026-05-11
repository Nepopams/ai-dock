# Task Queue Template

## Queue status
Queued / Planning / Applying / Reviewing / Blocked / Done

| Workpack ID | Type | Selected executor | Status | Gate status | PLAN status | APPLY status | REVIEW status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `WP-XXXX-YYY` | docs-only/runtime/workflow | `ai-dock-...` | Queued | Pending | Not started | Not started | Not started | Create PLAN |

## Workpack ID
`WP-XXXX-YYY`

## Type
Docs-only / Workflow-governance / Runtime single-layer / Runtime multi-layer / Test/QA / Release-build.

## Selected executor
`ai-dock-...-executor` или `ai-dock-initiative-runner` для orchestration-only задач.

## Status
Queued / Planning / Plan Ready / Blocked / Applying / Applied / Reviewing / Fixpack / Done / Skipped

## Gate status
No gate / Soft gate logged / Strong gate pending / Approved / Rejected

## PLAN status
Not started / In progress / Done / Blocked

## APPLY status
Not started / In progress / Done / Blocked / Not applicable

## REVIEW status
Not started / In progress / GO / NO-GO / Not applicable

## Next action
Следующее конкретное действие для Codex или человека.
