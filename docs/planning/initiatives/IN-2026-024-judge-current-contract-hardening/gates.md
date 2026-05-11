# Gates: IN-2026-024 Judge Current Contract Hardening

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Naming | Approved | Used user-provided initiative and workpack IDs. | Codex |
| 2026-05-11 | Remote IN-2026-023 context | Approved | Current branch lacks IN-2026-023 docs, but remote branch contains them and was consulted read-only. | Codex |
| 2026-05-11 | Optional metadata | Approved | Backward-compatible optional `metadata` does not break current result consumers. | Codex |
| 2026-05-11 | Error code/details | Approved | Optional `code` and sanitized details preserve current response shape. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | New IPC channel | If hardening requires new channel | Approve new shared/preload/main/renderer contract plan | Not triggered | Human |
| 2026-05-11 | Dependency/package change | If tests or validation need package changes | Approve dependency/lockfile workpack | Not triggered | Human |
| 2026-05-11 | Provider settings migration | If backend metadata needs settings changes | Approve migration/rollback plan | Not triggered | Human |
| 2026-05-11 | EvaluationRun storage/history | If persistence is needed | Approve data format/migration plan | Not triggered | Human |
| 2026-05-11 | Prompt/rubric edit | If prompts must change | Approve prompt/rubric workpack | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | No stop-the-line event occurred during PLAN | Continued to scoped APPLY | Closed |
| 2026-05-11 | None | No stop-the-line event occurred during APPLY/REVIEW | Completed bounded workpack; manual smoke pending | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | L3 runtime APPLY | `WP-JUDGE-001 Current Contract Hardening` only | User prompt | No Evaluation Studio, presets, validators, provider/settings, package changes |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | No new IPC channel | Current `judge:run` and `judge:progress` are sufficient | Keep bridge/channel surface stable |
| 2026-05-11 | Do not edit prompts | Metadata/error hardening does not need prompt changes | `src/shared/prompts/judge/**` remains untouched |
| 2026-05-11 | Do not implement EvaluationRun | This workpack is compatibility hardening only | Future work remains gated |
| 2026-05-11 | Keep UI changes minimal | Progress stages can be labeled without redesigning CompareView | Current CompareView flow remains intact |
| 2026-05-11 | Treat manual smoke as follow-up | Automated checks cannot fully exercise Electron UI/provider flows | Merge recommendation is conditional on manual smoke |
