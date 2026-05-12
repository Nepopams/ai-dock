# WP-UI-003 - Shell Restyle

## Workpack ID
`WP-UI-003-shell-restyle`

## Title
AI Dock UI v2 Shell Restyle

## Status
Done; automated verification passed. Manual Electron smoke remains required.

## Owner
Human + Codex

## Mode
L3 scoped renderer shell UI APPLY with human approval recorded for `WP-UI-003`.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/skills/ai-dock-renderer-react-executor/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/delivery-report.md`
- `docs/planning/initiatives/IN-UI-002-global-design-tokens-primitives/delivery-report.md`

## Goal
Apply UI v2 visuals to Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast, and app chrome while preserving current behavior and shell boundaries.

## User value
AI Dock gets a consistent cockpit frame for all current local views and web tabs before screen-specific restyles begin.

## In scope
- Restyle shell components visually.
- Add small shell-specific class names where useful.
- Update shell-related CSS in `global.css`.
- Use existing `--aid-*` token variables and primitives.
- Preserve all handlers, store actions, prompt routing flows, tab flows, drawer flows, and toast behavior.
- Update UI v2 roadmap status.

## Out of scope
- Chat/Judge/Connections/Form/History/Presets/Templates content restyles.
- BrowserView implementation or lifecycle.
- IPC, preload, shared contracts, registry/provider/prompt storage, package metadata, dependencies, or new icon library.
- Zustand state-shape changes.
- Broad CSS rewrite.

## Current architecture context
`App.tsx` mounts the persistent shell around every local view. `Sidebar.tsx` controls local view selection and service tab creation/focus. `TabStrip.tsx` renders web tab metadata, tab switching/closing, and Save Chat. `PromptRouter.tsx` owns the shell-level prompt cockpit and delegates behavior to existing store actions. `PromptDrawer.tsx` renders the existing prompt/template drawer inside `#content`. `Toast.tsx` renders a message-only notification. `global.css` contains the shell CSS and the `--aid-*` token layer from `WP-UI-002`.

## PLAN answers
1. Required exports: canonical `00-design-system.png` and `01-main-dock-shell.png` are not present. Numeric exports `0.png` through `10.png` exist; `0.png` and `1.png` likely correspond by order but are not deterministic by filename.
2. Shell elements restyled: app chrome, Sidebar, TabStrip, PromptRouter, adapter status list, PromptDrawer, Toast, and shell-scoped pill/button/input states.
3. Behaviors unchanged: local view focus, service select/create/focus, tab switch/close, Save Chat, prompt draft editing, target tabs/agents, Ctrl/Cmd+Enter, insert, insert+send, templates dialog, broadcast, recent inserts, adapter status semantics, drawer open/close, toast auto-dismiss.
4. `App.tsx` needs only minimal visual class names for shell scoping; layout structure remains unchanged.
5. `Sidebar.tsx` changes are visual/accessibility class names only; service grouping and fallback logic remain unchanged.
6. `TabStrip.tsx` changes are visual/accessibility class names only; tab data model and handlers remain unchanged.
7. `PromptRouter.tsx` changes are visual/accessibility class names only; prompt routing/store behavior remains unchanged.
8. `PromptDrawer`/`Toast` changes are visual/accessibility only; open/close/auto-dismiss/content behavior remains unchanged.
9. CSS sections touched: `#app`, `#sidebar`, `.sidebar-*`, `#tabstrip`, `#tabs`, `.tab*`, shell-scoped `.pill-btn`, `#prompt-router-container`, `#prompt-router`, `#prompt-toolbar`, `#toggle-prompt`, prompt input/select/actions/history, `.adapter-status*`, `#content`, `.drawer*`, prompt drawer list/form, `.toast`, and `@media` shell responsiveness if needed.
10. Deferred to `WP-UI-004+`: Chat, Judge/Evaluation Studio, Connections, Form Profiles, Form Runner, Prompt Templates manager, Media Presets, History Hub, and remaining view content.
11. Files changed: allowed shell components, `global.css`, UI v2 roadmap, initiative artifacts, and this workpack prompt pack.
12. Strong gate: none active. Missing canonical PNG names are a soft gate because markdown/tokens are sufficient for a safe shell-only restyle.

## Allowed files
- `src/renderer/react/App.tsx`
- `src/renderer/react/components/Sidebar.tsx`
- `src/renderer/react/components/TabStrip.tsx`
- `src/renderer/react/components/PromptRouter.tsx`
- `src/renderer/react/components/PromptDrawer.tsx`
- `src/renderer/react/components/Toast.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-003-shell-restyle/**`
- `docs/planning/workpacks/WP-UI-003-shell-restyle/**`
- `docs/_indexes/source-of-truth.md` only if an index link is needed

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/react/views/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
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

## Step-by-step plan
1. Read governance, design handoff, `WP-UI-002` delivery, shell components, `global.css`, store context, and package scripts.
2. Record PLAN answers and gate decisions in initiative/workpack artifacts.
3. Add visual-only shell class names and accessibility attributes where useful.
4. Restyle shell CSS using `--aid-*` tokens with selectors scoped to shell IDs/classes.
5. Update UI v2 roadmap status and next workpack.
6. Run validators, tests, build, diff checks, and forbidden-path checks.
7. Update run-state and delivery report.

## Acceptance criteria
- Shell components visibly use UI v2 tokenized chrome.
- Local view content is not restyled.
- No behavior handlers are removed or replaced.
- No state shape, IPC, BrowserView, package, dependency, main, preload, shared, adapter, store, or view files are changed.
- Prompt router collapse/insert/send/broadcast/template/recent flows remain wired to existing handlers.
- Tests/build pass and manual smoke status is recorded.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-003-shell-restyle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-003-shell-restyle/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/react/views src/renderer/store src/renderer/react/store src/renderer/adapters package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke checklist
- `npm run dev:app`
- App starts.
- Sidebar visible and readable.
- Sidebar local views open: Chat, Judge, Media Presets, Form Profiles, Prompts, History, Connections.
- Service client buttons still create/focus tabs.
- Tab strip shows empty state when no tabs.
- Tab create/switch/close still works.
- Save Chat button still works or fails safely if no chat.
- Prompt router visible.
- Prompt router collapse/expand still works.
- Prompt insert works.
- Prompt insert+send works.
- Templates dialog opens.
- Broadcast still calls existing behavior.
- Recent inserts dropdown remains usable.
- Adapter status chips/list remain readable.
- PromptDrawer opens/closes if reachable.
- Toast appears and is readable.
- BrowserView content bounds are not visibly shifted/broken.
- Chat/Judge/Connections/Form/History view content remains accessible.
- Keyboard focus visible on shell controls.

## Security impact
No security boundary, IPC, preload, main process, provider, storage, secret, or token handling change. Visual focus/readability improvements only.

## IPC impact
None.

## Docs impact
Adds initiative/workpack artifacts and updates the UI v2 roadmap status for `WP-UI-003`.

## Rollback
Revert edits to the allowed shell component files, `global.css`, the UI v2 roadmap, and the `IN-UI-003`/`WP-UI-003` planning directories. No data migration, package cleanup, or IPC rollback is required.

## Done criteria
- Workpack artifacts exist and validate.
- Shell visual restyle is applied within allowed files.
- Automated verification passes.
- Manual smoke status is recorded.
- Delivery report identifies `WP-UI-004 Chat View Restyle` as next.

## Risks
- Shell CSS can affect BrowserView and content top inset visually.
- Prompt router compacting can affect viewport height; `useTopInsetSync` must continue to drive bounds.
- Canonical export names remain missing and should be aligned for later restyles.

## Prompt pack links
- [PLAN prompt](prompt-plan.md)
- [APPLY prompt](prompt-apply.md)
- [REVIEW prompt](prompt-review.md)
- [FIXPACK prompt](prompt-fixpack.md)
