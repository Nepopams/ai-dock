# Orchestration Plan: IN-2026-028 Judge Sidebar Entry

## Initiative summary
This initiative adds a minimal visible Judge entry to the React sidebar. It does not change Judge runtime behavior.

## Assumptions
- `App.tsx` already renders `<CompareView />` when `activeLocalView === "compare"`.
- `useDockStore` already exposes `focusLocalView("compare")`.
- Reusing an existing sidebar icon is preferable to adding a new asset.

## Selected delivery mode
L3 scoped renderer UX APPLY.

## Epic breakdown
| Epic | Scope |
| --- | --- |
| E1 | Initiative/workpack orchestration |
| E2 | Add Sidebar local view entry |
| E3 | Verification and delivery report |

## Sprint mapping
Single scoped workpack: `WP-IN-2026-028-judge-sidebar-entry`.

## Workpack queue
| Workpack | Status |
| --- | --- |
| `WP-IN-2026-028-judge-sidebar-entry` | Done |

## Executor routing
- Selected executor: renderer React executor.
- Secondary review: renderer UX and workflow validation.

## Gate plan
- Stop if a new IPC/preload/shared/runtime change is needed.
- Stop if a new dependency or package change is needed.
- Stop if Sidebar needs a redesign beyond one entry.

## Verification strategy
- Validate initiative and workpack artifacts.
- Run unit tests and production build.
- Run diff whitespace and forbidden-path checks.
- Manual smoke remains for visual confirmation.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Sidebar visual density increases | Add one existing-style entry only |
| Wrong routing target | Use existing `focusLocalView("compare")` and existing App route |
| Scope drift into Judge runtime | Forbid runtime/shared/preload/main changes |
