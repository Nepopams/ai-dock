# Workpack: WP-UI-004 Chat View Restyle

## Workpack ID
WP-UI-004-chat-view-restyle

## Title
AI Dock UI v2 Chat View Restyle

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped renderer Chat UI APPLY

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/README.md`
- `docs/design/ui-v2/exports/2.png`
- `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/delivery-report.md`
- `docs/planning/initiatives/IN-UI-002-global-design-tokens-primitives/delivery-report.md`
- `docs/planning/initiatives/IN-UI-003-shell-restyle/delivery-report.md`

## Goal
Apply UI v2 visual treatment to Local Chat while preserving all current Chat behavior.

## User value
Users get a cleaner, more consistent Local Chat view that matches the UI v2 shell: readable conversation rail, message cards, pinned composer, status chips, response presets, and actions.

## In scope
- Visual-only restyle for ChatView, ConversationList, MessageList, MessageItem, CompareButton if needed.
- Chat-related CSS updates in `global.css`.
- Roadmap status update.
- Initiative/workpack/prompt-pack artifacts and delivery report.

## Out of scope
- Chat provider changes.
- Streaming, retry, abort, export, persistence, or compare behavior changes.
- Zustand store shape or action changes.
- IPC, preload, main, shared, package, config, dependency, or unrelated view changes.

## Current architecture context
`ChatView` owns status, conversation settings, active profile/model badges, export, stop, retry, response presets, and composer. `ConversationList` owns conversation selection, creation, export, and delete controls. `MessageList` owns scroll behavior, copy/delete/regenerate actions, and new-message indicator. `MessageItem` owns message card rendering and context menu. `CompareButton` prepares Judge comparison payload and must keep existing handoff behavior.

## Allowed files
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/components/chat/ConversationList.tsx`
- `src/renderer/react/components/chat/MessageList.tsx`
- `src/renderer/react/components/chat/MessageItem.tsx`
- `src/renderer/react/components/CompareButton.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-004-chat-view-restyle/**`
- `docs/planning/workpacks/WP-UI-004-chat-view-restyle/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/ConnectionsSettings.tsx`
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

## Step-by-step plan
1. Verify design handoff and available Local Chat export.
2. Read Chat components, read-only store context, and Chat-related CSS.
3. Create initiative artifacts and prompt pack.
4. Apply bounded visual restyle using existing `--aid-*` tokens.
5. Update roadmap status and delivery report.
6. Run validators, tests, build, diff check, and forbidden-path check.

## Acceptance criteria
- Local Chat is visually aligned with UI v2.
- Conversation rail, message pane, message cards, composer, presets, status, and actions remain readable.
- Chat event handlers and behavior are preserved.
- No forbidden files are changed.
- Automated verification passes.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-004-chat-view-restyle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-004-chat-view-restyle/workpack.md`
- `npm test`
- `npm run build`
- `git diff --check`
- Forbidden-path status check.

## Security impact
No security boundary changes. No new IPC, preload, main, token handling, external links, or dependency changes.

## IPC impact
None. Existing `window.chat`, `window.api.clipboard`, and Judge handoff usage are preserved.

## Docs impact
New initiative/workpack artifacts and roadmap status update.

## Rollback
Revert changes to the allowed Chat component/CSS/docs files from this workpack only.

## Done criteria
- PLAN answers recorded.
- APPLY completed within allowed paths.
- Validators, tests, build, diff check, and forbidden-path check pass.
- Delivery report records manual smoke status and next workpack.

## Risks
- Missing canonical PNG filename reduces design traceability.
- Chat CSS can affect scroll and pinned composer behavior.
- Manual Electron smoke remains necessary.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`

## PLAN answers
1. Local Chat UI v2 export: canonical `02-local-chat.png` is missing. Numeric export `2.png` exists and visually matches Local Chat; markdown handoff and tokens are also used.
2. Restyled elements: Chat shell layout, conversation rail/list/cards, header status/badges/actions, message pane, empty state, streaming/new-message indicators, message cards/context menu, composer, presets panel, and Compare button styling if needed.
3. Behaviors unchanged: conversation load/create/select/export/delete, send, stream, abort, retry, presets, JSON mode, copy/delete/regenerate, scroll-to-bottom, export, and compare handoff.
4. `ChatView` may receive markup-only class adjustments if needed; no handler or action changes.
5. `ConversationList` changes are visual only.
6. `MessageList` changes are visual only.
7. `MessageItem` changes are visual only.
8. `CompareButton` changes are visual only if a class is added.
9. CSS touched: Chat-related selectors from `.chat-shell` through `.chat-message--error`, plus optional `.compare-button` alignment.
10. Deferred: Evaluation Studio, Connections, Forms, History, Presets, Prompt Templates, provider/runtime changes, markdown rendering, and virtualization.
11. Exact files changed: `src/renderer/react/styles/global.css`, `docs/design/ui-v2/ui-v2-workpack-roadmap.md`, and IN/WP planning artifacts.
12. Strong gate: none active. STOP if forbidden files or behavior changes become necessary.
