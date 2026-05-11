# Gates - IN-2026-014

## Soft gates
Soft gates can be closed autonomously because they do not change scope, risk profile, or allowed paths.

| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Initiative/workpack naming | Approved | User supplied stable IDs and paths. | Codex |
| 2026-05-11 | Docs-only APPLY | Approved | L2 autonomy allows docs-only changes in explicitly allowed paths. | Codex |
| 2026-05-11 | Source-of-truth index link | Approved | Adding the architecture report link is allowed and does not affect runtime. | Codex |
| 2026-05-11 | Follow-up queue | Approved | Future workpacks are recommendations only and do not authorize runtime changes. | Codex |

## Strong human gates
Strong gates require stopping before any action.

| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Runtime/source changes | Any change to `src/main/**`, `src/renderer/**`, `src/preload/**`, `src/shared/**`, package/build/scripts, imports, moves, or deletes | Approve a separate workpack and PLAN | Not triggered | Human |
| 2026-05-11 | Immediate migration/deletion | Audit finding would require immediate file move/delete | Decide scope and approve gated workpack | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | None | Continued docs-only initiative | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | User request | L2 architecture/docs audit in allowed paths | Human | Runtime APPLY, moves, deletes, and package/build changes were explicitly forbidden. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Classify top-level `store/**` as `store-slice-support` | React `useDockStore.ts` imports all top-level store slices. | Store slices are active React dependencies. |
| 2026-05-11 | Classify top-level TypeScript adapter modules as `adapter-runtime-support` | React store/views and adapter state use adapter registry/runtime modules. | Adapter modules must be kept until a namespace migration workpack exists. |
| 2026-05-11 | Classify top-level components as `react-owned-shared-support` | React form views import `ConfirmDialog` and `KeyValueEditor`. | Components are not legacy despite top-level placement. |
| 2026-05-11 | Classify `selectorHeuristics.js` as `migration-residue` | Tests import the JS file; adapter runtime imports the TS file. | Requires JS/TS parity cleanup workpack before deletion. |
| 2026-05-11 | Classify top-level icons as high-risk `legacy-only` | Legacy HTML references icons, and main services references `deepseek.svg`. | Icon cleanup requires a separate ownership workpack. |
