# WP-UI-008 Visual Acceptance and Fixpack Plan

## Workpack ID
`WP-UI-008-visual-acceptance-fixpack-plan`

## Title
UI v2 Visual Acceptance and Fixpack Plan

## Status
Done - acceptance pack prepared; manual screenshots pending.

## Owner
Human + Codex

## Mode
L2 docs/design/assets/planning APPLY. Runtime APPLY is forbidden.

## Sources of truth
- `docs/design/ui-v2/exports/README.md`
- `docs/design/ui-v2/source/README.md`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- UI v2 delivery reports from `IN-UI-001` through `IN-UI-007C`

## Goal
Prepare canonical design exports, current screenshot capture instructions, visual gap matrix, final smoke checklist, and scoped fixpack backlog before any further UI runtime changes.

## User value
The project gets an evidence-based acceptance process for deciding whether UI v2 actually looks right in the running Electron app and what fixpacks are truly needed.

## In scope
- Copy numeric design exports to canonical filenames when canonical targets are missing.
- Preserve numeric design exports.
- Create `current-screenshots/README.md`.
- Create visual acceptance, gap matrix, final smoke checklist, and fixpack backlog docs.
- Update roadmap, screen map, and index links.
- Create initiative artifacts and prompt-pack.

## Out of scope
- Runtime CSS/React changes.
- Store, IPC, preload, main, shared, package, config, script, build, or release changes.
- Screenshot automation.
- Visual diff tooling.
- Actual UI fixpack implementation.

## Allowed files
- `docs/design/ui-v2/exports/**`
- `docs/design/ui-v2/current-screenshots/**`
- `docs/design/ui-v2/visual-acceptance.md`
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-final-smoke-checklist.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/README.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/planning/initiatives/IN-UI-008-visual-acceptance-fixpack-plan/**`
- `docs/planning/workpacks/WP-UI-008-visual-acceptance-fixpack-plan/**`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`

## Forbidden files
- `src/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Affected modules
Docs/design assets and planning only. Runtime impact: none.

## Selected executor
`ai-dock-product-planner`

## Secondary executors
- `ai-dock-test-qa-executor` for checklist and visual acceptance structure.
- `ai-dock-renderer-react-executor` only for future fixpack planning context, no runtime APPLY.

## Current architecture context
UI v2 runtime workpacks have already touched the shell and local renderer views, but their automated verification focused on build/test/path discipline rather than visual screenshot comparison. The design source is represented by Pencil PNG exports in `docs/design/ui-v2/exports/`; the current app evidence must be supplied separately as manual Electron screenshots.

## Step-by-step plan
1. Inspect numeric and canonical PNG export status.
2. Copy numeric PNGs to missing canonical filenames.
3. Update exports README with mapping status.
4. Create current screenshot capture README.
5. Create visual acceptance model and acceptance levels.
6. Create visual gap matrix template.
7. Create final smoke checklist.
8. Create WP-UI-009 fixpack backlog template.
9. Update roadmap, screen map, and indexes.
10. Run docs/assets verification and forbidden-path checks.

## PLAN answers
1. Numeric exports exist: `0.png` through `10.png`.
2. Canonical exports missing before APPLY: all eleven canonical target names.
3. All canonical files can be created by copying numeric exports.
4. Numeric files must not be deleted because earlier delivery reports reference them and they preserve original export evidence.
5. Current screenshots should be captured manually in the running Electron app after `npm run dev:app`, using `1440x900` or the agreed Pencil comparison size.
6. Codex should not perform visual acceptance without current screenshots because no static file check proves actual rendered state, legacy-mode status, clipping, focus, BrowserView bounds, or modal stacking.
7. Visual gap matrix includes design PNG, current screenshot, status, visual gaps, functional risk, proposed fixpack, priority, owner, and evidence notes.
8. Final smoke checklist covers launch mode, shell, all local views, cross-view regressions, modals, forms, scrolling, focus, primary actions, and import/export dialogs.
9. Fixpack backlog uses scoped `WP-UI-009A` through `WP-UI-009E` buckets with trigger, likely files, forbidden files, validation, manual smoke focus, acceptable changes, and forbidden scope creep.
10. Exact changed files are within the allowed docs/assets/planning paths listed above.
11. No strong gate is active.
12. Runtime code non-change is proven with `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`.

## Acceptance criteria
- Canonical PNG copies exist for every available numeric export.
- Numeric PNG files still exist.
- Current screenshot folder contains README instructions, not placeholder screenshots.
- Visual acceptance, gap matrix, final smoke checklist, and fixpack backlog docs exist.
- Roadmap and indexes point to the visual acceptance layer.
- No runtime/package/config files changed.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-008-visual-acceptance-fixpack-plan`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-008-visual-acceptance-fixpack-plan/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Security impact
None. No runtime code, IPC, preload, main, shared, secret handling, or dependency changes.

## IPC impact
None.

## State impact
None.

## Package impact
None.

## Docs impact
Adds a visual acceptance layer and updates UI v2 design references.

## Rollback
Delete the new IN-UI-008/WP-UI-008 artifacts, visual acceptance docs, current screenshot README, canonical PNG copies, and revert roadmap/index/screen-map/exports README edits. Numeric PNG originals remain available.

## Done criteria
- Initiative and workpack validators pass.
- Canonical PNG copies exist for numeric exports.
- Numeric PNG files remain present.
- Current screenshot README, visual acceptance doc, gap matrix, smoke checklist, and fixpack backlog exist.
- Roadmap/screen-map/index links are updated.
- `git diff --check` passes.
- Forbidden runtime/package/config path check is clean.
- Delivery report states that screenshots and visual QA remain manual follow-up work.

## Risks
- Visual acceptance remains incomplete until Human captures current screenshots.
- Manual screenshot capture can vary by window size or app state; document deviations in the matrix.
- Fixpacks must not start from intuition; they must be backed by gap matrix rows.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
