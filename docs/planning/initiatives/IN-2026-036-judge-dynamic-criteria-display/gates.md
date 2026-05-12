# Gates: IN-2026-036 Judge Dynamic Criteria Display

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-12 | Naming | Approved | Use user-provided initiative slug and expected workpack path. | Codex |
| 2026-05-12 | Helper location | Approved | `src/renderer/react/views/evaluation/**` is in the allow-list and keeps helper close to CompareView. | Codex |
| 2026-05-12 | Targeted test strategy | Approved | A pure helper test in `tests/judgeDynamicCriteria.test.js` is within the allow-list. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-12 | Runtime APPLY | L3 scoped renderer UI APPLY requires valid workpack and PLAN | User already approved this small compatibility workpack; PLAN found no strong gate | Closed | Human + Codex |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-12 | None | None | None | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-12 | L3 scoped renderer UI APPLY | `IN-2026-036` / `WP-IN-2026-036-judge-dynamic-criteria-display` | Human | Explicit approval in user request. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-12 | Do not change shared Judge types | Dynamic display can be handled in renderer from existing runtime scores | Avoids forbidden `src/shared/**` changes and keeps compatibility scope small |
| 2026-05-12 | Keep `judgeSlice` unchanged | PLAN found no store hydration adjustment is needed | Avoids secondary Zustand executor |
| 2026-05-12 | Render trimmed criterion ids directly | No label catalog is required for this compatibility workpack | Custom criteria remain visible without new mapping data |
| 2026-05-12 | REVIEW verdict GO | Diff stayed inside renderer/test/docs allow-list and verification passed | Initiative can close with manual smoke follow-up |
