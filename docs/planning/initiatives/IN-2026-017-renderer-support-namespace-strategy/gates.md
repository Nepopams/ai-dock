# Gates - IN-2026-017

## Soft gates
Soft gates can be closed autonomously because they do not change scope, risk profile, or allowed paths.

| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | ADR numbering | Approved `ADR-004` | Existing decisions directory contains ADR-002 and ADR-003 only. | Codex |
| 2026-05-11 | Docs-only APPLY | Approved | L2 autonomy allows docs-only changes in explicitly allowed paths. | Codex |
| 2026-05-11 | Source-of-truth link | Approved | Adding ADR-004 to the index does not change runtime. | Codex |
| 2026-05-11 | Migration recommendation | Approved deferred strategy | Option A avoids immediate runtime/import churn. | Codex |

## Strong human gates
Strong gates require stopping before any action.

| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Runtime/source change | Any change to `src/main/**`, `src/renderer/**`, `src/preload/**`, `src/shared/**` | Approve separate runtime workpack and PLAN | Not triggered | Human |
| 2026-05-11 | Import/path move | Any namespace migration, path move, import update, delete, Vite/TS/package/script/lockfile change | Approve separate gated workpack | Not triggered | Human |
| 2026-05-11 | Immediate migration | Recommendation requires migration now | Decide scope and approve Human Gate | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | None | Continued docs-only initiative | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | User request | L2 architecture/docs namespace strategy | Human | Runtime APPLY, moves, imports, config changes, and deletes were explicitly forbidden. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Recommend Option A now | No current feature requires namespace migration; import churn would be high. | Keep top-level renderer support as-is and document ownership. |
| 2026-05-11 | Defer Option C/D | Shared/split namespaces may be useful later but need gated migration. | Future migrations remain optional/deferred. |
| 2026-05-11 | Add IN-2026-023 | n8n/Judge/cross-history work may benefit from a renderer support preflight. | Preflight before larger renderer support changes. |
