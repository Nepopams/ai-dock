# Task Queue: IN-UI-001 AI Dock UI v2 Design Handoff Inventory

## Queue status
Done. `WP-UI-001` completed as docs/design/planning APPLY. Future runtime UI workpacks are proposed only.

## Workpack ID
`WP-UI-001-design-handoff-inventory`

## Type
Docs/design/planning

## Selected executor
`ai-dock-initiative-runner`

## Status
Done

## Gate status
Gate A/B/C/D: passed for docs-only scope. No strong human gate active.

## PLAN status
Done. PLAN answers are recorded in `orchestration-plan.md` and `workpack.md`.

## APPLY status
Done. APPLY created docs/planning/design artifacts only.

## REVIEW status
Done. Review result: GO after validators, diff check, and runtime forbidden-path check.

## Next action
Human should provide or verify PNG exports, then approve `WP-UI-002 Global Design Tokens and UI Primitives` as the first runtime UI workpack.

## Queue table
| Order | Workpack | Type | Status | Gate | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | `WP-UI-001-design-handoff-inventory` | Docs/design/planning | Done | Passed | Completed by this initiative. |
| 2 | `WP-UI-002 Global Design Tokens and UI Primitives` | Runtime renderer CSS/UI | Proposed | Requires Human Gate | Next recommended action. |
| 3 | `WP-UI-003 Shell Restyle` | Runtime renderer UI | Proposed | Requires Human Gate | Depends on `WP-UI-002`. |
| 4 | `WP-UI-004 Chat View Restyle` | Runtime renderer UI | Proposed | Requires Human Gate | Depends on shell/token baseline. |
| 5 | `WP-UI-005 Evaluation Studio Restyle` | Runtime renderer UI | Proposed | Requires Human Gate | Depends on shell/token baseline. |
| 6 | `WP-UI-006 Connections/Form Profiles Restyle` | Runtime renderer UI | Proposed | Requires Human Gate | Settings/form-heavy surfaces. |
| 7 | `WP-UI-007 Remaining Views Restyle` | Runtime renderer UI | Proposed | Requires Human Gate | May split if diff size is high. |
