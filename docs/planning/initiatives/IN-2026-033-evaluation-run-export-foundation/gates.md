# Gates: IN-2026-033 EvaluationRun Export Foundation

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-12 | Split `WP-JUDGE-007` into `007A` and `007B` | Approved | Keeps export foundation separate from storage/history risk. | Human + Codex |
| 2026-05-12 | Use existing export IPC channels | Approved | Existing channels satisfy current export behavior; new IPC would trigger a strong gate. | Codex |
| 2026-05-12 | Add normalized JSON envelope additively | Approved | Keeps legacy top-level JSON fields and adds `evaluationRun` for future consumers. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-12 | Runtime APPLY | L3 scoped workpack and PLAN required | Confirm APPLY can proceed if no strong gate found | Satisfied by current prompt and PLAN | Human + Codex |
| 2026-05-12 | Storage/history | Any need to change `src/main/storage/**` or add EvaluationRun persistence | Create separate `WP-JUDGE-007B` with storage/privacy plan | Not triggered | Human |
| 2026-05-12 | IPC/preload channel | Any need for new IPC/shared channel/preload bridge API | Stop and request new approval | Not triggered | Human |
| 2026-05-12 | Dependencies/package | Any need for package or lockfile change | Stop and request new approval | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-12 | None | None | None | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-12 | Scope and L3 movement | `WP-JUDGE-007A EvaluationRun Export Foundation` only | Human | `WP-JUDGE-007B` history store stays follow-up only. |
| 2026-05-12 | Plan Gate | Proceed to APPLY if no strong gate | Codex under human L3 instruction | PLAN found no active strong gate. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-12 | EvaluationRun in this workpack is export-only | Avoid history/storage scope | No persistence fields beyond export envelope. |
| 2026-05-12 | Markdown omits raw response by default | Privacy hardening | Raw model/debug output is not written into Markdown reports. |
| 2026-05-12 | JSON keeps legacy top-level fields | Backward compatibility | Consumers expecting `question`, `answers`, `result`, `generatedAt` continue to work. |
| 2026-05-12 | Review Gate result | Automated validators/tests/build/scope checks passed | `WP-JUDGE-007A` is GO with manual smoke follow-up. |
