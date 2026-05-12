# EP-JUDGE-001 Roadmap

## Delivery slices
| Slice | Workpack / Initiative | Status | Purpose | Exit notes |
| --- | --- | --- | --- | --- |
| Slice 1 Foundation | `WP-JUDGE-001` through `WP-JUDGE-005` | Done | Harden current Judge contract, add preset catalog, custom rubric/prompt, JSON validator mode, and backend labels. | Automated verification passed in each delivery report; manual smoke remains pending for UI-facing slices. |
| Slice 2 Entry Point | `IN-2026-028 Judge Sidebar Entry` | Done | Make existing Judge/Compare view discoverable from the React sidebar. | Automated tests/build passed; manual UI smoke pending. |
| Slice 3 Studio Shell | `WP-JUDGE-006 Evaluation Studio UI Shell` | Done | Create first-class Evaluation Studio shell and keep CompareView as the answer-comparison working surface. | Delivered by `IN-2026-032`; automated tests/build passed, manual smoke pending. |
| Slice 4A Export Foundation | `WP-JUDGE-007A EvaluationRun Export Foundation` | Done | Add export-only normalized EvaluationRun envelope, dynamic Markdown criteria, validator findings, and safe metadata. | Delivered by `IN-2026-033`; no storage/history, new IPC, provider/settings, package, or dependency changes. Manual smoke pending. |
| Slice 4B History Store | `WP-JUDGE-007B EvaluationRun History Store` | Done | Add separate file-backed save/list/read/delete storage foundation for EvaluationRun records. | Delivered by `IN-2026-034`; no chat history mixing, renderer UI, Judge runtime, provider/settings, package, dependency, database, or migration changes. Manual smoke pending. |
| Slice 5 Tests/Smoke | `WP-JUDGE-008 Tests and Smoke Suite` | Later | Consolidate automated Judge coverage and manual smoke checklist across compatibility and Studio flows. | Should close pending manual smoke gaps where feasible. |
| Slice 6 Research/Multi-agent/n8n | `WP-JUDGE-009` / `WP-JUDGE-010` | Later | Add research comparison/multi-agent modes and preflight future n8n EvaluationRun integration. | n8n remains preflight only until EvaluationRun shape is stable. |

## Sprint policy
No Judge sprint folder is required for this roadmap today. Sprints are optional and should be created only when a release/delivery slice needs separate planning. For the current Judge MVP, roadmap slices inside this epic are the source of truth.

## Next action
Run the `WP-JUDGE-006`, `WP-JUDGE-007A`, and `WP-JUDGE-007B` manual smoke checklists when an Electron session is available. Plan EvaluationRun History View/UI integration as a separate follow-up workpack; keep QA consolidation, research mode, and n8n integration in their later slices.
