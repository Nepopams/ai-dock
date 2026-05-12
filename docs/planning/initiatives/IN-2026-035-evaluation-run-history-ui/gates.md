# Gates: IN-2026-035 EvaluationRun History UI Integration

## Soft gates
| Gate | Decision | Notes |
| --- | --- | --- |
| Initiative naming | Passed | Used requested `IN-2026-035-evaluation-run-history-ui`. |
| Workpack naming | Passed | Used requested `WP-JUDGE-007C-evaluation-run-history-ui`. |
| Local type strategy | Passed | `src/types/renderer.d.ts` exists but is outside allow-list; use local renderer bridge types/casts. |

## Strong human gates
| Gate | Status | Notes |
| --- | --- | --- |
| Main/preload/shared/storage/IPC changes required | Not triggered | PLAN confirms existing preload API is sufficient. |
| Package/dependency change required | Not triggered | No dependencies needed. |
| Auto-save required | Not triggered | Save is explicit only. |
| Large CompareView rewrite required | Not triggered | Work is additive: optional prop and Save button. |
| Open saved run impossible without runtime/shared changes | Not triggered | Renderer can adapt `EvaluationRunExport` to compare draft and hydrate `JudgeResult`. |
| Allowed/forbidden path conflict | Not triggered | Planned files are inside allow-list. |

## Stop-the-line events
None.

## Approval log
| Date | Approval | Source |
| --- | --- | --- |
| 2026-05-12 | Human approved `WP-JUDGE-007C EvaluationRun Save/List/Open/Delete UI` as L3 scoped renderer UI APPLY. | User request |

## Decisions log
| Decision | Outcome |
| --- | --- |
| Save behavior | Explicit button only; no auto-save. |
| Open behavior | Read full record, build compare draft from answer subjects, hydrate Judge result, do not run Judge. |
| Delete behavior | Use `window.confirm`, call existing delete API, refresh list. |
| List behavior | Load first 20 summaries; no search/filter. |
| Type declaration behavior | No edit to global renderer declarations because not allowed; use local bridge type. |
| Review verdict | GO with manual smoke follow-up after validators, tests, build, diff check, and forbidden-path scope check passed. |
