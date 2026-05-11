# Gates

## Soft gates
Soft gates закрыты автономно, потому что они не меняют scope, risk profile или allowed paths.

| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Workpack ID selection | Approved | Stable docs-only ID выбран по initiative ID. | Codex |
| 2026-05-11 | Queue size | Approved | Один workpack достаточен для L2 smoke pilot. | Codex |
| 2026-05-11 | Executor routing | Approved | `ai-dock-initiative-runner` является orchestration executor, not runtime executor. | Codex |
| 2026-05-11 | Verification command set | Approved | Команды структурной валидации и git diff checks покрывают docs-only scope. | Codex |
| 2026-05-11 | REVIEW verdict recording | Approved | REVIEW read-only по смыслу; запись verdict в run-state/delivery-report является частью docs delivery. | Codex |

## Strong human gates
Strong gates не сработали.

| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Runtime/package/dependency/security policy scope | Not triggered | None | Closed | Human + Codex |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | No impact | Continued L2 docs/workflow loop | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | L2 autonomy policy | Docs/workflow-only initiative runner smoke | User request | Strong gate stop conditions explicitly provided. |
| 2026-05-11 | Soft Gate A/B equivalent | Docs-only workpack PLAN/APPLY path | Codex under L2 | No runtime, dependency, package or forbidden path change. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Use one docs-only workpack | Initiative asks for one workpack smoke pilot | Avoids giant APPLY and keeps scope bounded. |
| 2026-05-11 | Use validation scripts directly | Scripts already exist and require no dependencies | Verification remains read-only. |
