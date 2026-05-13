# WP-UI-009 Component States and Shared Dialogs Restyle

## Workpack ID
`WP-UI-009-component-states-shared-dialogs`

## Title
AI Dock UI v2 Component States and Shared Dialogs Restyle

## Status
Done - automated verification passed; manual smoke pending.

## Owner
Human + Codex

## Mode
L3 scoped renderer shared component states UI APPLY.

## Sources of truth
- `docs/design/ui-v2/exports/10-component-states-board.png`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/visual-acceptance.md`
- `docs/planning/initiatives/IN-UI-008-visual-acceptance-fixpack-plan/delivery-report.md`

## Goal
Apply UI v2 treatment to shared dialogs, key-value editor fragments, and scoped common state classes while preserving behavior.

## User value
Common dialogs and form fragments look consistent across UI v2 surfaces without introducing a new feature, dependency, or broad screen restyle.

## In scope
- Create initiative artifacts.
- Create prompt-pack.
- Restyle `ConfirmDialog` with semantic classes.
- Restyle `KeyValueEditor` with semantic classes.
- Add scoped tokenized CSS for confirm dialog, key-value editor, and opt-in state classes.
- Update UI v2 roadmap and visual acceptance note.
- Run validators, tests, build, diff, and forbidden-path checks.

## Out of scope
- Screen-level visual fixpacks.
- Shell, Chat, Judge, Connections, Form Runner, Prompt Templates, Media Presets, or History restyles.
- Store, IPC, preload, main, shared, package, dependency, config, script, build, or release changes.
- Screenshot automation or visual diff tooling.

## Allowed files
- `src/renderer/components/ConfirmDialog.tsx`
- `src/renderer/components/KeyValueEditor.tsx`
- `src/renderer/react/components/Toast.tsx` only if PLAN proves tiny state alignment is needed.
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/visual-acceptance.md`
- `docs/planning/initiatives/IN-UI-009-component-states-shared-dialogs/**`
- `docs/planning/workpacks/WP-UI-009-component-states-shared-dialogs/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/**`
- `src/renderer/react/components/Sidebar.tsx`
- `src/renderer/react/components/TabStrip.tsx`
- `src/renderer/react/components/PromptRouter.tsx`
- `src/renderer/react/components/PromptDrawer.tsx`
- `src/renderer/react/components/chat/**`
- `src/renderer/adapters/**`
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
- Shared renderer components: `ConfirmDialog`, `KeyValueEditor`.
- Shared renderer CSS primitives in `global.css`.
- UI v2 planning docs.

## Selected executor
`ai-dock-renderer-react-executor`

## Secondary executors
- `ai-dock-test-qa-executor`
- `ai-dock-security-hardening-executor` only for focus, disabled, danger, and readability review.

## Current architecture context
UI v2 screen workpacks already covered shell and major local views. This workpack covers the remaining cross-cutting Component States Board layer without changing screens or behavior. `ConfirmDialog` and `KeyValueEditor` currently use utility-like class strings, while `global.css` already contains `--aid-*` tokens and primitive classes from WP-UI-002.

## Step-by-step plan
1. Confirm Component States Board export availability.
2. Inspect shared component styling and existing token layer.
3. Create initiative and workpack artifacts.
4. Replace `ConfirmDialog` utility class clusters with semantic classes.
5. Replace `KeyValueEditor` utility class clusters with semantic classes.
6. Add scoped tokenized styles for confirm dialog, key-value editor, and opt-in state classes.
7. Update roadmap and visual acceptance notes.
8. Run validation, test, build, diff, and forbidden-path checks.
9. Update run state and delivery report.

## PLAN answers
1. Component States Board export available: `docs/design/ui-v2/exports/10-component-states-board.png`.
2. Shared components with old utility-like styling: `ConfirmDialog` and `KeyValueEditor`.
3. `ConfirmDialog` changes are visual-only and preserve props, open/null behavior, labels, and confirm/cancel callbacks.
4. `KeyValueEditor` changes are visual-only and preserve props, add/update/remove, read-only, placeholders, and empty-key warning behavior.
5. `Toast` does not need changes; it already uses tokenized shell-era styling.
6. Shared/global CSS selectors touched: new scoped `confirm-dialog-*`, `key-value-editor-*`, and opt-in `ui-state-*` selectors.
7. Broad screen restyle is avoided by not changing parent screens, views, generic layout selectors, store, IPC, package, or dependency files.
8. Exact changed files are limited to the allowed paths listed above.
9. No strong gate is active.

## Acceptance criteria
- Confirm dialog has UI v2 tokenized overlay, dialog, title, message, cancel, and danger action styles.
- Key-value editor has UI v2 tokenized rows, inputs, add/remove/empty buttons, read-only state, and warning state.
- Shared state classes are opt-in and scoped.
- Component props and parent call sites are unchanged.
- No forbidden path changes.
- Validators, tests, build, and diff checks pass.
- Manual smoke checklist is recorded.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-009-component-states-shared-dialogs`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-009-component-states-shared-dialogs/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/store src/renderer/react/store src/renderer/react/views src/renderer/react/components/Sidebar.tsx src/renderer/react/components/TabStrip.tsx src/renderer/react/components/PromptRouter.tsx src/renderer/react/components/PromptDrawer.tsx src/renderer/react/components/chat src/renderer/adapters package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke
- Run `npm run dev:app`.
- Trigger ConfirmDialog from Form Profiles delete.
- Trigger ConfirmDialog from Form Profiles dirty-state switch.
- Confirm/cancel both work.
- KeyValueEditor rows render in FormEditor Request tab.
- Add/edit/remove key-value rows work.
- Empty key warning remains visible.
- Presets editor and Apply Preset dialog still open.
- Toast remains readable.
- Shell and all local views still open.
- Keyboard focus visible on dialogs and key-value controls.

## Security impact
No IPC, preload, main, shared, secret handling, external navigation, or dependency changes. Danger and disabled states remain visually distinct.

## IPC impact
None.

## State impact
None.

## Package impact
None.

## Docs impact
Adds IN-UI-009 planning artifacts and updates UI v2 roadmap/acceptance notes.

## Rollback
Revert the changes in `ConfirmDialog.tsx`, `KeyValueEditor.tsx`, `global.css`, UI v2 docs, and IN/WP artifacts. No data migration or runtime storage rollback is needed.

## Done criteria
- Initiative/workpack validators pass.
- `npm test` passes.
- `npm run build` passes.
- `git diff --check` passes.
- Forbidden-path check is clean for runtime/package/config paths.
- Delivery report states shared component behavior unchanged and manual smoke remains required.

## Risks
- Manual smoke is required to verify modal stacking in the Electron app.
- Opt-in state classes do not guarantee visual acceptance until screenshots and gap matrix are completed.
- Shared CSS must remain scoped to avoid accidental broad restyle.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
