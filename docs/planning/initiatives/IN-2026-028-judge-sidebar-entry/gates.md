# Gates: IN-2026-028 Judge Sidebar Entry

## Soft gates
| Gate | Status | Notes |
| --- | --- | --- |
| Reuse existing icon | Passed | Reused `infoIcon`; no asset added. |
| Keep Sidebar structure | Passed | Added one object to `localViews`. |

## Strong human gates
| Gate | Status | Decision |
| --- | --- | --- |
| Runtime Judge change needed | Not triggered | Existing route/store are sufficient. |
| IPC/preload/shared change needed | Not triggered | No boundary change. |
| Package/dependency change needed | Not triggered | No new dependency. |
| Sidebar redesign needed | Not triggered | One existing-style entry only. |
| Forbidden path edit needed | Not triggered | Changes stayed in allowed paths. |

## Stop-the-line events
None.

## Approval log
| Date | Approval | Source |
| --- | --- | --- |
| 2026-05-12 | APPROVED | User provided L3 scoped renderer UX APPLY initiative. |

## Decisions log
| Decision | Rationale |
| --- | --- |
| Put Judge in `localViews` | Matches Chat/Presets local view buttons and gets active class behavior. |
| Reuse `infoIcon` | Avoids adding an asset for a minimal entry. |
