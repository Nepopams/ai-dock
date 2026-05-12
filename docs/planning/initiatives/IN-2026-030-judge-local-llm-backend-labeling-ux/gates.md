# Gates: IN-2026-030 Judge Local LLM Backend Labeling UX

## Soft gates
| Gate | Status | Notes |
| --- | --- | --- |
| Use derived labels only | Passed | Labels come from existing profile fields and are not persisted. |
| Keep privacy wording conservative | Passed | Copy must say labels are inferred and not guarantees. |
| Keep UI scoped | Passed | Only list/detail/dropdown text and helper note are planned. |

## Strong human gates
| Gate | Status | Decision |
| --- | --- | --- |
| Runtime APPLY requires approved workpack | Passed | Human approved `WP-JUDGE-005`. |
| Package/dependency change needed | Not triggered | Helper is dependency-free. |
| Settings storage schema change needed | Not triggered | No persisted fields are added. |
| Main/preload/IPC change needed | Not triggered | Renderer already receives profiles through existing API. |
| Dedicated local provider needed | Not triggered | Existing profile drivers are reused. |
| Large UI redesign needed | Not triggered | Inline labels only. |
| Token/auth handling change needed | Not triggered | Helper ignores token/auth values. |

## Stop-the-line events
Stop and ask Human if implementation requires any strong gate above.

## Approval log
| Date | Approval | Source |
| --- | --- | --- |
| 2026-05-12 | APPROVED | User explicitly approved `WP-JUDGE-005 Local LLM Backend Labeling and UX`. |

## Decisions log
| Decision | Rationale |
| --- | --- |
| Put helper in `src/shared/utils` | It is pure data derivation usable by renderer and tests without settings migration. |
| Derive endpoint classification from URL only | Matches MVP and avoids persisted backend kind. |
| Do not claim local/private privacy | URL inference does not prove endpoint ownership or routing. |
| Do not touch main/preload/IPC | Existing completions profile API already provides required fields. |
