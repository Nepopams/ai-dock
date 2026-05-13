# WP-UI-011A Connections Recomposition Fixpack

## Workpack ID
`WP-UI-011A-connections-recomposition-fixpack`

## Title
Connections Recomposition Fixpack

## Status
Done - automated verification passed; manual smoke and fresh screenshot pending.

## Owner
Human + Codex

## Mode
L3 scoped renderer runtime UI APPLY.

## Sources of truth
- `docs/design/ui-v2/exports/04-connections.png`
- `docs/design/ui-v2/current-screenshots/04-connections.current.png`
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-visual-triage-report.md`
- `docs/design/ui-v2/ui-v2-runtime-root-cause.md`
- `docs/design/ui-v2/ui-v2-fixpack-sequence.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`

## Goal
Recompose Connections to approximate UI v2 target layout while preserving existing completions profile, registry, adapter, token, and store behavior.

## User value
Connections becomes a usable UI v2 screen instead of the old Completion Profiles editor with tokenized styling.

## In scope
- Create IN-UI-011A artifacts and prompt-pack.
- Change `ConnectionsSettings.tsx`.
- Change `CompletionsSettings.tsx` meaningfully.
- Add profile list/editor/status rail/registry preview layout.
- Add scoped Connections CSS in `global.css`.
- Update visual gap/fixpack docs.
- Run validators, tests, build, and forbidden-path checks.

## Out of scope
- Provider profile schema changes.
- Registry schema changes.
- Adapter override behavior changes.
- Token/auth storage behavior changes.
- Store shape changes.
- IPC/main/preload/shared changes.
- Package/dependency/config changes.
- Shell, Chat, Judge, Form, Prompts, Presets, or History fixes.

## Allowed files
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/settings/ClientsAndCategories.tsx`
- `src/renderer/react/views/settings/AdapterOverrides.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-fixpack-sequence.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-011A-connections-recomposition-fixpack/**`
- `docs/planning/workpacks/WP-UI-011A-connections-recomposition-fixpack/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/forms/**`
- `src/renderer/react/views/history/**`
- `src/renderer/react/views/presets/**`
- `src/renderer/react/views/prompts/**`
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
- React renderer Connections view shell.
- React renderer completions profile settings view.
- Scoped global CSS for Connections.
- UI v2 planning docs.

## Selected executor
`ai-dock-renderer-react-executor`

## Secondary executors
- `ai-dock-zustand-state-executor` read-only confirmation.
- `ai-dock-test-qa-executor`.
- `ai-dock-security-hardening-executor` for token redaction review.

## Current architecture context
`ConnectionsSettings.tsx` owns the tab shell. `CompletionsSettings.tsx` owns the visible Completion Profiles surface and existing profile CRUD/save/test/token behavior through `window.completions`. Registry data is already available through `useDockStore` and `registrySlice`; this workpack uses that state for preview only and does not change registry behavior.

## Step-by-step plan
1. Inspect visual evidence and current owner JSX.
2. Confirm `CompletionsSettings.tsx` owns old visible strings.
3. Add compact Connections routing strip in `ConnectionsSettings.tsx`.
4. Recompose `CompletionsSettings.tsx` into profile list, editor, status rail, and registry preview.
5. Reuse existing handlers for save, set active, test, delete, clear token, headers, generic HTTP, and Back to Chat.
6. Use existing registry store state for preview.
7. Add scoped CSS for new layout classes.
8. Update matrix, backlog, sequence, roadmap, and delivery report.
9. Run validation, test, build, diff, and forbidden-path checks.

## PLAN answers
1. Visual evidence: target `04-connections.png` has model profiles, profile editor, status rail, top control strip, and registry preview; current screenshot is the old full-page Completion Profiles editor.
2. Current strings proving ownership: `New Profile`, `Back to Chat`, `Custom Headers`, `Test Connection`, and `Saved` are in `CompletionsSettings.tsx`.
3. CSS-only is insufficient because the target requires a different React layout and new preview/status sections.
4. Target layout implemented: top route strip, model profile list, profile editor, status cards, and Service Registry Preview.
5. Existing behaviors unchanged: add/remove/save/set-active/test/clear-token/generic-http/custom-headers/registry tab/adapter tab.
6. JSX owner components changed: `ConnectionsSettings.tsx` and `CompletionsSettings.tsx`.
7. CSS sections changed: scoped Connections/completions recomposition classes in `global.css`.
8. Token redaction preserved: token values are only in the password input and are not rendered in status cards.
9. Registry preview uses existing `registryClients`, `registryLoading`, `registryError`, and `fetchRegistry`; no registry schema or save behavior changes.
10. Exact files changed are within Allowed files.
11. No strong gate is active.

## Acceptance criteria
- `CompletionsSettings.tsx` has meaningful layout changes.
- Connections no longer looks like the old full-page editor.
- Profile list, editor, status rail, and registry preview are present.
- Token values are not exposed.
- Provider/profile/registry/adapter behavior unchanged.
- No forbidden path changes.
- Tests/build pass.
- Manual screenshot remains required before final visual GO.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-011A-connections-recomposition-fixpack`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-011A-connections-recomposition-fixpack/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/store src/renderer/react/store src/renderer/react/views/ChatView.tsx src/renderer/react/views/EvaluationStudioView.tsx src/renderer/react/views/CompareView.tsx src/renderer/react/views/forms src/renderer/react/views/history src/renderer/react/views/presets src/renderer/react/views/prompts src/renderer/adapters package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke
- Run `npm run dev:app`.
- Open Connections.
- Confirm Completion Profiles tab no longer looks like old full-page editor.
- Confirm model profile list, profile editor, right status cards, and registry preview are visible.
- Add/edit/save/set-active/test profile.
- Confirm Generic HTTP and Custom Headers remain usable.
- Confirm token remains redacted and clear token behavior is unchanged.
- Open Service Registry and Adapter Overrides tabs.
- Capture fresh `04-connections.current.png`.

## Security impact
No IPC, preload, main, shared, package, or dependency changes. Token values are not rendered outside the existing password input and existing serialization logic remains unchanged.

## IPC impact
None.

## State impact
No store shape changes. Added local profile search UI state only.

## Package impact
None.

## Docs impact
Adds IN-UI-011A planning artifacts and updates UI v2 visual fixpack docs.

## Rollback
Revert changes to `ConnectionsSettings.tsx`, `CompletionsSettings.tsx`, `global.css`, UI v2 docs, and IN/WP artifacts. No data migration rollback is needed.

## Done criteria
- Initiative/workpack validators pass.
- `npm test` passes.
- `npm run build` passes.
- `git diff --check` passes.
- Forbidden-path check is clean.
- Delivery report states token/auth/schema/store behavior unchanged.

## Risks
- Fresh screenshot may still be visually affected by the old shell pending WP-UI-011B.
- Registry preview can show empty/error states depending on local registry availability.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
