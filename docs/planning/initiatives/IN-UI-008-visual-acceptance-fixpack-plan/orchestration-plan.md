# IN-UI-008 Orchestration Plan

## Initiative summary
IN-UI-008 prepares the UI v2 visual acceptance layer: canonical design exports, current screenshot capture instructions, visual gap matrix, final smoke checklist, and scoped fixpack backlog. It does not change runtime code.

## Initiative classification
Docs/design/assets/planning APPLY. Runtime APPLY is forbidden.

## Selected delivery mode
Single docs/design/assets workpack: `WP-UI-008-visual-acceptance-fixpack-plan`.

## Autonomy level
L2 docs/workflow APPLY autonomy.

## Selected executor
`ai-dock-product-planner`

## Secondary executors
- `ai-dock-test-qa-executor` for final smoke checklist structure.
- `ai-dock-renderer-react-executor` only as future fixpack context; no runtime APPLY in this initiative.

## Epic breakdown
- UI v2 visual acceptance evidence: canonical exports, current screenshots, and visual gap matrix.
- UI v2 final smoke: launch, shell, local views, cross-view regressions, and focus/readability checks.
- UI v2 fixpack planning: scoped WP-UI-009 buckets based on evidence.

## Sprint mapping
- Slice 1: Canonicalize existing design exports.
- Slice 2: Create screenshot and visual acceptance docs.
- Slice 3: Create gap matrix, final smoke checklist, and fixpack backlog.
- Slice 4: Validate artifacts and forbidden paths.

## Workpack queue
| Workpack | Status | Notes |
| --- | --- | --- |
| `WP-UI-008-visual-acceptance-fixpack-plan` | In progress | Docs/design/assets only. |

## Executor routing
Primary executor is `ai-dock-product-planner` because this is planning/design QA structure. `ai-dock-test-qa-executor` informs checklist content. Runtime renderer executor is not active for APPLY.

## Gate plan
- Gate A: scope is docs/assets/planning only.
- Gate B: PLAN confirms exports, screenshot model, matrix, fixpack backlog, and forbidden paths.
- Gate C: diff must remain in allowed docs/assets/planning paths.
- Gate D: validators and forbidden-path check must pass.

## Plan summary
1. Inventory numeric and canonical design exports.
2. Copy missing canonical PNGs from numeric exports without deleting numeric files.
3. Create current screenshot capture instructions.
4. Create visual acceptance criteria and evidence model.
5. Create visual gap matrix template.
6. Create final smoke checklist.
7. Create scoped fixpack backlog template.
8. Update roadmap, screen map, and indexes.
9. Validate initiative/workpack artifacts and forbidden paths.

## Verification strategy
- Initiative/workpack validators.
- `git diff --check`.
- `git status --short`.
- Runtime/package/config forbidden-path status check.
- No `npm test` or `npm run build` because no runtime changed.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Visual acceptance claimed without actual screenshots. | Docs explicitly require current screenshots and gap matrix before GO. |
| Numeric export references break. | Numeric files are preserved. |
| Future fixpack grows too broad. | Backlog splits WP-UI-009 into bounded buckets with forbidden scope creep. |

## PLAN answers
1. Numeric PNG exports present: `0.png`, `1.png`, `2.png`, `3.png`, `4.png`, `5.png`, `6.png`, `7.png`, `8.png`, `9.png`, `10.png`.
2. Canonical PNG exports were missing before APPLY: all eleven canonical names from `00-design-system.png` through `10-component-states-board.png`.
3. All canonical files can be created by copying their numeric source exports because each numeric source exists.
4. Numeric files must not be deleted because previous UI workpack delivery reports and soft-gate notes reference the numeric exports as evidence.
5. Current screenshots must be captured manually in the running Electron app and stored under `docs/design/ui-v2/current-screenshots/` using `.current.png` names.
6. Codex must not perform visual acceptance without current screenshots because repository diffs and builds cannot prove actual layout, clipping, legacy-mode state, BrowserView bounds, or modal/focus visibility.
7. The visual gap matrix contains design PNG, current screenshot, status, main visual gaps, functional risk, proposed fixpack, priority, owner, and evidence notes.
8. The final smoke checklist covers launch mode, shell, local views, cross-view regressions, focus, modals, forms, scrolling, primary actions, and import/export dialogs.
9. The fixpack backlog uses scoped WP-UI-009 buckets: shell/layout, chat/evaluation, settings/form, prompts/presets/history, and design-token polish.
10. Changed files are limited to `docs/design/ui-v2/**`, initiative/workpack artifacts, and index docs.
11. No strong gate is active because the scope is docs/assets only and all allowed/forbidden paths are explicit.
12. Runtime non-change is proven by forbidden-path `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`.

## Assumptions
- The numeric PNG exports are valid Pencil exports supplied by Human.
- Current screenshots will be captured by Human after this pack is merged or checked out locally.
- Screenshot files themselves are intentionally absent unless Human adds them later.

## Gates
- Strong gate if runtime source changes are required.
- Strong gate if any package/dependency/config/script change is required.
- Strong gate if visual acceptance is requested without current screenshots.

## Verification
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-008-visual-acceptance-fixpack-plan`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-008-visual-acceptance-fixpack-plan/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
