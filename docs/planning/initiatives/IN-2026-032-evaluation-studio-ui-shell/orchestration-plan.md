# Orchestration Plan: IN-2026-032 Evaluation Studio UI Shell

## Initiative summary
Deliver the first renderer-only Evaluation Studio shell for Judge Mode. The shell gives the sidebar Judge entry a product-level landing/workspace surface, shows available and planned evaluation modes, supports manual two-answer start when there is no draft, and reuses the existing Compare/Judge flow for all actual evaluation work.

## Assumptions
- `EP-JUDGE-001` exists and remains the source of truth for Judge MVP sequencing.
- `activeLocalView === "compare"` is the existing route used by the sidebar and prepared comparison flows.
- `useDockStore.actions.prepareJudgeComparison` is the correct existing action for manual draft creation.
- `CompareView` owns current Judge run logic, custom rubric/instructions, JSON validation, and export behavior.
- No new IPC, shared contracts, provider settings, or persistence are needed.

## Selected delivery mode
L3 scoped renderer UI APPLY, approved by the human for `WP-JUDGE-006 Evaluation Studio UI Shell`.

## Epic breakdown
- Epic: `EP-JUDGE-001 Judge Mode / Evaluation Studio MVP`.
- Completed foundation: `WP-JUDGE-001` through `WP-JUDGE-005`.
- Completed entry point: `IN-2026-028 Judge Sidebar Entry`.
- Current slice: `WP-JUDGE-006 Evaluation Studio UI Shell`.
- Later slices: `WP-JUDGE-007` history/export, `WP-JUDGE-008` tests/smoke, `WP-JUDGE-009` research comparison, `WP-JUDGE-010` n8n preflight.

## Sprint mapping
No sprint folder is required. The Judge MVP already uses roadmap slices inside `EP-JUDGE-001`, and this workpack is a bounded slice rather than a release train.

## Workpack queue
| Workpack ID | Type | Status | Notes |
| --- | --- | --- | --- |
| `WP-JUDGE-006-evaluation-studio-ui-shell` | Renderer UI APPLY | In progress | Create shell, manual start, and App routing |

## Executor routing
- Primary executor: `ai-dock-renderer-react-executor`.
- Secondary executor: `ai-dock-test-qa-executor` for validators, tests, build, diff checks, and smoke checklist recording.
- `ai-dock-zustand-state-executor` is not needed unless existing store actions cannot create the manual draft.
- `ai-dock-product-planner` is limited to concise UX wording already captured in this plan.

## Gate plan
Strong gate status: clear to proceed. `EP-JUDGE-001` artifacts exist, and the implementation can stay within renderer UI and planning docs. Stop immediately if implementation requires forbidden paths, new IPC, package changes, provider/settings changes, history/storage, or a large `CompareView` rewrite.

## Verification strategy
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-032-evaluation-studio-ui-shell`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-006-evaluation-studio-ui-shell/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
- Manual smoke checklist recorded in `delivery-report.md`.

## Risk register
| Risk | Level | Mitigation |
| --- | --- | --- |
| Shell grows into full Evaluation Studio | Medium | Keep scope to wrapper, status cards, manual draft, and existing CompareView reuse |
| Existing compare flows regress | Medium | Preserve `focusLocalView("compare")` and render CompareView whenever `compareDraft` exists |
| Planned cards imply clickable features | Low | Render as static status cards |
| Manual smoke cannot be completed in this turn | Medium | Record pending checklist explicitly |
