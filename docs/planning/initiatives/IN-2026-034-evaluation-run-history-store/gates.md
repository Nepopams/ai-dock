# Gates: IN-2026-034 EvaluationRun History Store

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-12 | Storage layout | Approved file-per-run plus index | Simpler read/delete/rollback, compact list summaries, no database/dependency | Codex |
| 2026-05-12 | Preload entry path normalization | Approved `src/preload/index.ts` | Repo uses TypeScript preload entrypoint; prompt's `.js` allowance maps to this source file for registration | Codex |
| 2026-05-12 | IPC index update | Approved docs index update | Governance requires IPC index update when adding channels; docs-only, no runtime scope expansion | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-12 | Runtime APPLY | L3 storage-sensitive runtime APPLY requires valid workpack and PLAN | Confirm APPLY can proceed if no strong gate found | Satisfied by current prompt and PLAN | Human + Codex |
| 2026-05-12 | Chat history boundary | Any need to change existing chat history storage or IPC | Stop and request new approval | Not triggered | Human |
| 2026-05-12 | Database/migration/dependency | Any need for DB, migration, dependency, package, or lockfile change | Stop and request new approval | Not triggered | Human |
| 2026-05-12 | Judge runtime/provider boundary | Any need to change Judge pipeline or provider/settings model | Stop and request new approval | Not triggered | Human |
| 2026-05-12 | Renderer UI | Any need to implement EvaluationRun history UI | Stop and split into future UI workpack | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-12 | None | None | None | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-12 | Scope and L3 movement | `WP-JUDGE-007B EvaluationRun History Store` | Human | Explicitly data/storage-sensitive runtime APPLY |
| 2026-05-12 | Plan Gate | Proceed to APPLY if no strong gate | Codex under human L3 instruction | PLAN found no active strong gate |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-12 | Keep EvaluationRun storage separate | Avoid mixing evaluation artifacts with chat thread/message history | New store under `userData/ai-dock/evaluations` |
| 2026-05-12 | Use bounded EvaluationRun IPC channels | Need save/list/read/delete only | No arbitrary invoke, no search/import/migration channels |
| 2026-05-12 | Summary privacy rule | List views should not leak evaluation inputs | Summaries omit full subjects, `rawResponse`, and custom prompt |
| 2026-05-12 | No renderer UI | This workpack is API/store foundation only | UI integration deferred |
| 2026-05-12 | Review Gate result | Automated validators/tests/build/scope checks passed | `WP-JUDGE-007B` is GO with manual smoke follow-up |
