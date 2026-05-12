# Task Queue: IN-2026-029 Codex Skill Frontmatter Compatibility

## Queue status
Completed.

## Workpack ID
`WP-IN-2026-029-codex-skill-frontmatter-compatibility`

## Type
`workflow-governance`

## Selected executor
Workflow/governance executor.

## Status
Done.

## Gate status
No strong gate triggered.

## PLAN status
Done. 20 skill files found; all 20 lacked frontmatter.

## APPLY status
Done. Frontmatter and validator script added.

## REVIEW status
PASS.

## Current queue
| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| T1 | Read required context | Done | Governance, workflows, and skills read. |
| T2 | Inventory skill files | Done | 20 found, 20 missing frontmatter. |
| T3 | Create initiative/workpack artifacts | Done | File-backed state created. |
| T4 | Add frontmatter | Done | Existing content preserved. |
| T5 | Add validator script | Done | Dependency-free Node script. |
| T6 | REVIEW verification | Done | Validators and scope checks pass. |

## Next action
Run Codex CLI manually to confirm loader no longer skips AI Dock skills.
