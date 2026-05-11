# Gates: IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Naming | Approved | Used user-provided initiative ID and planning workpack ID. | Codex |
| 2026-05-11 | ADR numbering | Approved | `ADR-005` was free; ADR-002 through ADR-004 already exist. | Codex |
| 2026-05-11 | Index updates | Approved | New architecture report and ADR require source-of-truth links; feature index gets a Judge Mode reference. | Codex |
| 2026-05-11 | Docs-only APPLY | Approved | Scope is limited to allowed planning, architecture, ADR, and index files. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Runtime APPLY | Any source/runtime change after this planning initiative | Approve specific future workpack and PLAN | Pending | Human |
| 2026-05-11 | Shared contract change | Next-generation Evaluation contract affects `src/shared/**` and preload/main/renderer consumers | Approve contract scope, rollout order, and compatibility plan | Pending | Human |
| 2026-05-11 | Provider settings model | Any dedicated local provider profile or settings schema change | Approve settings migration and rollback plan | Pending | Human |
| 2026-05-11 | History/storage format | EvaluationRun persistence may affect history/export storage | Approve storage format, migration, and privacy controls | Pending | Human |
| 2026-05-11 | Package/dependency drift | Any validator library or schema dependency addition | Approve dependency and lockfile changes | Pending | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | No stop-the-line event occurred during docs-only planning | Continued within allowed paths | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | L2 docs/workflow autonomy | Planning artifacts, report, ADR, allowed index links | User prompt | Runtime APPLY explicitly forbidden |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Create ADR-005 | Judge Mode introduces a durable architecture direction, not just a report | Future runtime work should follow ADR-005 unless superseded |
| 2026-05-11 | Recommend `WP-JUDGE-001` first | Current contract is too narrow for presets/history/validators | Contract hardening should precede large UI or provider changes |
| 2026-05-11 | Reuse completions profiles for MVP local/API backends | Existing OpenAI-compatible and generic HTTP profiles already support cloud and local endpoints | No provider settings migration in MVP |
