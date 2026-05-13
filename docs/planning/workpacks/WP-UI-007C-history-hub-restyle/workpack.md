# WP-UI-007C History Hub Restyle

## Workpack ID
`WP-UI-007C-history-hub-restyle`

## Title
AI Dock UI v2 History Hub Restyle

## Status
Done - automated verification passed; manual Electron smoke pending.

## Owner
Human + Codex

## Mode
L3 scoped renderer History UI APPLY

## Sources of truth
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/9.png`
- `src/renderer/react/views/history/HistoryView.tsx`
- `src/renderer/react/styles/global.css`

## Goal
Apply UI v2 visual treatment to History Hub without changing history behavior.

## User value
Users get a consistent History Hub workspace with readable filters, timeline/thread rail, ingest controls, message cards, source actions, continue-in-chat action, and search results.

## In scope
- Restyle `HistoryView.tsx` only as needed for markup-only visual structure.
- Restyle History Hub selectors in `global.css`.
- Update UI v2 roadmap and initiative artifacts.
- Preserve all handlers and payload construction.

## Out of scope
- History storage changes.
- History IPC/preload/main changes.
- Search algorithm changes.
- Thread/message data model changes.
- BrowserView tab focus behavior changes.
- Chat prompt handoff changes.
- New history export/import features.
- New dependencies.

## Current architecture context
`HistoryView` consumes history state/actions from `useDockStore`, renders search filters, thread list, ingest controls, messages, source actions, continue-in-chat actions, and search results. Behavior is implemented through existing store actions and preload-backed bridge APIs. This workpack only changes renderer presentation.

## Allowed files
- `src/renderer/react/views/history/HistoryView.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-007C-history-hub-restyle/**`
- `docs/planning/workpacks/WP-UI-007C-history-hub-restyle/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/forms/**`
- `src/renderer/react/views/prompts/**`
- `src/renderer/react/views/presets/**`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/components/chat/**`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/ConnectionsSettings.tsx`
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
1. Confirm design export availability and gates.
2. Add minimal History Hub header/empty/result semantic classes in `HistoryView` if useful.
3. Tokenize the existing History CSS block in `global.css`.
4. Update UI v2 roadmap status.
5. Run validators, tests, build, diff check, and forbidden-path status check.
6. Update delivery report with verification and manual smoke checklist.

## Acceptance criteria
- History Hub restyled with UI v2 tokens.
- Search/filter payload construction unchanged.
- Ingest payload and limit unchanged.
- Open-in-source bridge call unchanged.
- Continue-in-chat quote/focus behavior unchanged.
- Create-thread behavior unchanged.
- No forbidden files changed.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-007C-history-hub-restyle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-007C-history-hub-restyle/workpack.md`
- `npm test`
- `npm run build`
- `git diff --check`
- Forbidden-path status check.

## Security impact
No new IPC, Node access, external navigation, secret handling, or data exposure. Existing open-in-source bridge usage remains unchanged.

## IPC impact
None. Existing `window.historyHub` and `window.__AI_DOCK_HISTORY__` calls are preserved.

## Docs impact
Roadmap and initiative/workpack artifacts are updated.

## Rollback
Revert this workpack's changes in allowed files. No storage migrations or contract changes are introduced.

## Done criteria
- Artifacts exist and validate.
- Runtime changes are limited to `HistoryView.tsx` and `global.css`.
- Tests/build pass.
- Forbidden-path status check is clean.
- Delivery report records manual smoke checklist and rollout status.

## Risks
- Manual Electron smoke is required for source focus and chat handoff.
- Long message/search result text must remain readable and non-destructive to layout.
- Canonical export name is absent; numeric `9.png` is used.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`

## PLAN answers
1. History Hub canonical export is absent, but numeric export `9.png` is available and used with the UI v2 markdown handoff.
2. Restyle main shell/header, search/filter sidebar, thread list, active thread item, loading/empty/error states, main thread header, ingest panel, message cards, role badges, source/continue actions, and search results.
3. Search/filter payloads, reset, auto-open first thread, open thread, create thread, ingest payload/limit, open-in-source bridge call, continue-in-chat quote behavior, and store state shape remain unchanged.
4. `HistoryView` needs only markup-only visual additions/classes; handlers stay unchanged.
5. CSS touched: existing `.history-*` block in `global.css` and responsive `.history-*` media rules.
6. Deferred after UI v2 rollout: final manual smoke/assets pass; no new feature work in this workpack.
7. Exact changed runtime files: `HistoryView.tsx` and `global.css`; docs limited to roadmap and initiative/workpack artifacts.
8. No strong gate is active.
