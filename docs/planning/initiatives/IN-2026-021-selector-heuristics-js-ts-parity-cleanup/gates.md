# Gates: IN-2026-021

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Keep `selectorHeuristics.js` | Approved | Tests import the CommonJS file and deletion is out of scope. | Codex |
| 2026-05-11 | Do not change TS/JS logic | Approved | Defaults match; runtime behavior changes are unnecessary and forbidden unless proven required. | Codex |
| 2026-05-11 | Strengthen tests without config changes | Approved | Node tests can read TS source text and require JS parity file without package/tsconfig/script changes. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Package/TS/test runner strategy | Required package/tsconfig/script change | Approve a separate test strategy workpack | Not triggered | Human |
| 2026-05-11 | File deletion or move | Required delete/move of `selectorHeuristics.js` or imports | Approve separate migration/removal workpack | Not triggered | Human |
| 2026-05-11 | Adapter runtime behavior change | Required change to TS runtime merge/uniq behavior | Approve revised scope | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | None | Continued within scoped APPLY | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Autonomous L3 scoped APPLY | `WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup` allowed files only | User prompt | No strong gate triggered. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Treat `selectorHeuristics.js` as test-facing parity artifact | Node tests import JS; TS runtime imports TS | Keep JS and guard parity instead of deleting. |
| 2026-05-11 | Do not change TypeScript runtime logic | Defaults match and TS inputs are typed as strings | Runtime adapter behavior remains unchanged. |
