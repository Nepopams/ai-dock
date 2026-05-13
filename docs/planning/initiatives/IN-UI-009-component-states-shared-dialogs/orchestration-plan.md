# IN-UI-009 Orchestration Plan

## Initiative summary
IN-UI-009 applies a scoped UI v2 pass to shared component states and dialogs: `ConfirmDialog`, `KeyValueEditor`, and opt-in state classes for empty/loading/error/warning/success. It does not perform screen-level visual gap fixpacks.

## Initiative classification
L3 scoped renderer shared component states UI APPLY.

## Selected delivery mode
Single runtime workpack: `WP-UI-009-component-states-shared-dialogs`.

## Autonomy level
L3 scoped renderer APPLY with explicit Human approval in the prompt.

## Selected executor
`ai-dock-renderer-react-executor`

## Secondary executors
- `ai-dock-test-qa-executor` for verification and manual smoke checklist.
- `ai-dock-security-hardening-executor` only for focus, disabled, and danger readability review.

## Epic breakdown
- Shared dialogs: confirm dialog overlay, dialog body, danger and cancel actions.
- Shared form fragments: key-value editor rows, warnings, add/remove states, read-only state.
- Shared states: opt-in empty, loading, error, warning, and success classes.

## Sprint mapping
- Slice 1: PLAN and artifact creation.
- Slice 2: Semantic class migration for `ConfirmDialog` and `KeyValueEditor`.
- Slice 3: Scoped CSS additions in `global.css`.
- Slice 4: Roadmap/visual acceptance updates and automated verification.

## Workpack queue
| Workpack | Status | Notes |
| --- | --- | --- |
| `WP-UI-009-component-states-shared-dialogs` | Done | Shared component states only; manual smoke pending. |

## Executor routing
Renderer React executor owns the scoped TSX/CSS changes. No store, IPC, main, preload, shared, package, or view executor is active for APPLY.

## Gate plan
- Gate A: scope is limited to shared component states.
- Gate B: PLAN confirms behavior and prop contracts remain unchanged.
- Gate C: diff remains within allowed files.
- Gate D: validators, tests, build, `git diff --check`, and forbidden-path checks pass.

## Plan summary
1. Confirm `10-component-states-board.png` is available.
2. Inspect shared components and existing CSS state primitives.
3. Create initiative/workpack artifacts.
4. Replace utility-like class clusters in `ConfirmDialog` with semantic classes.
5. Replace utility-like class clusters in `KeyValueEditor` with semantic classes.
6. Add scoped tokenized CSS for shared component states.
7. Update UI v2 roadmap and visual acceptance note.
8. Run automated verification and record manual smoke follow-up.

## Verification strategy
- Initiative validator.
- Workpack validator.
- `npm test`.
- `npm run build`.
- `git diff --check`.
- Full status and forbidden-path status checks.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Shared CSS leaks into screen-level restyle. | Use explicit `confirm-dialog-*`, `key-value-editor-*`, and opt-in `ui-state-*` selectors only. |
| Behavior changes in shared controls. | Preserve props, handlers, state, labels, and parent call sites. |
| Manual dialog states are not exercised by automated tests. | Record manual Electron smoke checklist in delivery report. |

## PLAN answers
1. Component States Board export available: `docs/design/ui-v2/exports/10-component-states-board.png`.
2. Shared components with old utility-like styling: `src/renderer/components/ConfirmDialog.tsx` and `src/renderer/components/KeyValueEditor.tsx`.
3. `ConfirmDialog` changes are visual-only: class names and dialog semantics only; `open`, labels, `onConfirm`, and `onCancel` behavior remain unchanged.
4. `KeyValueEditor` changes are visual-only: class names only; add/update/remove/read-only/empty-key warning behavior remains unchanged.
5. `Toast` does not need a change because it is already tokenized from the shell workpack and changing it would widen scope without clear value.
6. Shared/global CSS touched: new scoped `confirm-dialog-*`, `key-value-editor-*`, and opt-in `ui-state-*` selectors near existing UI primitives in `global.css`.
7. Broad screen restyle is avoided by not changing parent screens, view files, generic view layout selectors, store, IPC, or runtime logic.
8. Exact files changed: `ConfirmDialog.tsx`, `KeyValueEditor.tsx`, `global.css`, roadmap/visual-acceptance docs, initiative artifacts, and workpack prompt-pack.
9. No strong gate is active.

## Assumptions
- Existing parent screens already import and render `ConfirmDialog` and `KeyValueEditor`; parent call sites do not need changes.
- Manual screenshots from IN-UI-008 remain outside this initiative.

## Gates
- Strong gate if props, parent views, stores, IPC, package, or dependencies must change.
- Strong gate if scoped CSS cannot preserve readability or requires broad screen selectors.
- Strong gate if build errors require unrelated view changes.

## Verification
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-009-component-states-shared-dialogs`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-009-component-states-shared-dialogs/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/store src/renderer/react/store src/renderer/react/views src/renderer/react/components/Sidebar.tsx src/renderer/react/components/TabStrip.tsx src/renderer/react/components/PromptRouter.tsx src/renderer/react/components/PromptDrawer.tsx src/renderer/react/components/chat src/renderer/adapters package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
