# Gates: IN-2026-037 Judge Tests and Smoke Suite

## Soft gates
- Added a no-dependency docs QA test in `tests/**` to guard required QA docs and coverage inventory references.
- Added source-of-truth links for the new QA docs.

## Strong human gates
None active.

## Stop-the-line events
None.

## Approval log
| Date | Approval | Source |
| --- | --- | --- |
| 2026-05-12 | Human approved `WP-JUDGE-008 Tests and Smoke Suite` as L2/L3 QA/docs/test APPLY with runtime feature APPLY forbidden. | User request |

## Decisions log
| Decision | Rationale |
| --- | --- |
| Do not add Playwright/Cypress/Spectron/browser automation. | No existing UI harness was found and user explicitly forbade new automation dependencies. |
| Treat manual smoke as a Human QA Gate. | Electron navigation, real providers, OS dialogs, and BrowserView tab behavior are outside existing automated coverage. |
| Add `tests/judgeQaDocs.test.js`. | It is dependency-free, docs-only, and checks useful suite completeness without brittle UI parsing. |
| REVIEW verdict: GO with manual smoke follow-up. | Automated verification and scope checks passed; product smoke was not executed by Codex. |
