# Gates: IN-UI-001 AI Dock UI v2 Design Handoff Inventory

## Soft gates
| Gate | Decision | Rationale |
| --- | --- | --- |
| Initiative naming | Closed | User provided stable initiative ID. |
| Workpack naming | Closed | User provided `WP-UI-001-design-handoff-inventory`. |
| Design folder naming | Closed | User provided `docs/design/ui-v2/**`. |
| Workpack decomposition | Closed | UI v2 runtime split into `WP-UI-002` through `WP-UI-007`. |
| Index link update | Closed | Allowed and useful for source-of-truth discovery. |

## Strong human gates
None active for this L2 docs/design/planning APPLY.

Strong human gate is required before:
- Runtime APPLY.
- `src/**` changes.
- Package/config/script/dependency changes.
- IPC/preload/main/storage/security changes.
- Applying the entire UI v2 as a giant runtime refactor.

## Stop-the-line events
None.

## Approval log
| Date | Gate | Result | Notes |
| --- | --- | --- | --- |
| 2026-05-12 | Scope Gate | Passed | User explicitly requested L2 docs/design/planning APPLY and runtime APPLY forbidden. |
| 2026-05-12 | Plan Gate | Passed | Allowed/forbidden paths and verification commands were explicit; no strong gate active. |

## Decisions log
| Decision | Outcome | Reason |
| --- | --- | --- |
| `.pen` handling | Source/reference only | Runtime work must use PNG exports and Markdown specs. |
| PNG artifacts | README only, no placeholders | User explicitly said not to create binary placeholders. |
| First runtime workpack | `WP-UI-002 Global Design Tokens and UI Primitives` | Token mapping must precede shell/view restyles. |
| Runtime scope | Not performed | User explicitly forbade runtime APPLY. |
