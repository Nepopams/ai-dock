# IN-UI-007C History Hub Restyle

## Initiative ID
`IN-UI-007C-history-hub-restyle`

## Title
AI Dock UI v2 History Hub Restyle

## Status
Delivered - automated verification passed; manual Electron smoke pending.

## Owner
Human + Codex

## Goal
Apply UI v2 visual treatment to History Hub without changing history behavior, storage, IPC, ingest, open-in-source, continue-in-chat, or state contracts.

## User value
Users get a consistent History Hub workspace with readable search filters, thread rail, ingest panel, message cards, source actions, continue-in-chat actions, and search results.

## Problem
Most primary local views now use UI v2 styling, but History Hub still uses older mixed styling and does not visually match the current Dock workspace.

## Success criteria
- History Hub is visually aligned with UI v2 tokens and current shell/view restyles.
- Search/filter, reset, thread list, open thread, create thread, ingest, open source, continue in chat, and search results behavior remain unchanged.
- No history storage, shared IPC contract, main/preload, store, package, dependency, or unrelated local view changes.
- Validators, tests, build, diff check, and forbidden-path checks pass.

## In scope
- Create initiative artifacts and `WP-UI-007C` prompt-pack.
- Restyle `HistoryView.tsx` with minimal markup-only class/structure additions if useful.
- Update History Hub selectors in `src/renderer/react/styles/global.css`.
- Update UI v2 roadmap status.
- Add delivery report with manual smoke checklist.

## Out of scope
- History storage changes.
- History IPC/preload/main changes.
- Search algorithm or payload changes.
- Thread/message model changes.
- BrowserView focus/open-in-source behavior changes.
- Chat prompt handoff changes.
- New export/import features.
- New dependencies or UI libraries.

## Constraints
- Runtime APPLY is limited to `HistoryView.tsx`, `global.css`, roadmap, and initiative/workpack docs.
- Keep all handlers and store action calls semantically unchanged.
- Do not touch stores, shared contracts, main/preload, package/config/scripts, or unrelated local views.
- Do not do a broad CSS rewrite.

## Strong human gate triggers
- Required changes exceed allowed files.
- APPLY would require history store/shared/IPC/main/preload/package changes.
- Search, ingest, open-source, continue-chat, or create-thread behavior would change.
- `HistoryView` rewrite becomes too large or behavior-coupled.
- Build failures require unrelated source changes.

## Candidate epics
- UI v2 remaining local view rollout.
- History Hub workspace visual alignment.

## Risks
- History Hub touches data-sensitive conversation text; visual changes must not reveal new data or alter payloads.
- Canonical PNG filename is absent; numeric export `9.png` is used as the local design reference.
- Manual Electron smoke is required for BrowserView source and Chat handoff behavior.

## Links
- Workpack: `docs/planning/workpacks/WP-UI-007C-history-hub-restyle/workpack.md`
- UI v2 roadmap: `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- Screen map: `docs/design/ui-v2/screen-map.md`
