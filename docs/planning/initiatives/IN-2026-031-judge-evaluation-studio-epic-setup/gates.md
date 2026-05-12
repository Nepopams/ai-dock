# Gates: IN-2026-031 Judge Evaluation Studio Epic Setup

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-12 | Epic container naming | Approved | `EP-JUDGE-001-evaluation-studio-mvp` is stable, capability-scoped, and matches Judge workpack naming. | Codex |
| 2026-05-12 | No Judge sprint folder | Approved | Sprint layer is optional; roadmap slices inside the epic are sufficient before a release slice is chosen. | Codex |
| 2026-05-12 | Planning README notes | Approved | `epics/_README.md` and `sprints/_README.md` clarify when these layers are appropriate. | Codex |
| 2026-05-12 | Index links | Approved | Adding epic links to source-of-truth and feature index improves discoverability without changing architecture meaning. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-12 | Runtime APPLY | Any `src/**` or runtime UI implementation would exceed L2 scope | Create and approve a separate runtime workpack | Not triggered | Human |
| 2026-05-12 | Package/build/script metadata | Any dependency, package, config, or script change would exceed scope | Stop and request Human decision | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-12 | None | None | None needed | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-12 | L2 docs/governance APPLY | `IN-2026-031` allowed docs paths only | Human prompt | Runtime APPLY explicitly forbidden |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-12 | Use an epic, not another standalone initiative chain | Judge work already spans multiple foundation workpacks and future delivery slices | `EP-JUDGE-001` becomes the capability-level source of truth |
| 2026-05-12 | Keep sprint layer optional | There is no current release/sprint commitment for Judge MVP | Roadmap slices live in `roadmap.md`; no Judge sprint folder is created |
| 2026-05-12 | Mark `WP-JUDGE-006` as Next | Foundation layers and sidebar entry are done, but Studio UI is not implemented | Next work must be a separate bounded runtime workpack |
