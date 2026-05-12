# Initiative: IN-UI-004 Chat View Restyle

## Initiative ID
IN-UI-004-chat-view-restyle

## Title
AI Dock UI v2 Chat View Restyle

## Status
Done

## Owner
Human + Codex

## Goal
Apply UI v2 visual treatment to the Local Chat view while preserving existing conversation, send, stream, abort, retry, export, presets, message actions, and compare handoff behavior.

## User value
Local Chat becomes visually consistent with the UI v2 Dock shell and token foundation, with clearer conversation rail, readable message surfaces, a stable composer, status chips, response presets, and action states.

## Problem
The shell now uses UI v2 styling, but Local Chat still carries older hardcoded dense styling. Without a bounded Chat restyle, the primary local workflow remains visually inconsistent and future view workpacks risk duplicating visual constants.

## Success criteria
- Chat view uses UI v2 tokens and visual language.
- Chat runtime behavior remains unchanged.
- No chat provider, IPC, preload, main, shared, store, package, or dependency changes.
- Automated validators, tests, build, diff check, and forbidden-path status check pass.
- Delivery report records that manual Electron smoke remains required unless explicitly run.

## In scope
- Create initiative artifacts.
- Create `WP-UI-004-chat-view-restyle` workpack and prompt pack.
- Plan Chat visual restyle against UI v2 handoff.
- Apply visual-only changes to allowed Chat renderer files and Chat-related CSS.
- Update UI v2 roadmap status and delivery report.

## Out of scope
- Chat provider changes.
- Chat IPC, preload, main, or shared changes.
- `chatSlice` behavior or state-shape changes.
- Completion settings changes.
- Judge/Evaluation Studio restyle.
- Connections, Forms, History, Presets, Prompt Templates restyles.
- New dependencies, UI libraries, markdown renderer, or virtualization.

## Constraints
- Do not change `src/main/**`, `src/preload/**`, `src/shared/**`, `src/renderer/store/**`, or `src/renderer/react/store/**`.
- Do not change `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.*`, `scripts/**`, or `electron-builder.yml`.
- Do not change send, streaming, abort, retry, export, persistence, or compare behavior.
- Do not perform a broad CSS rewrite or touch unrelated local views.

## Strong human gate triggers
- STOP if Local Chat visual mapping cannot proceed from available exports and markdown handoff.
- STOP if implementation needs main, preload, shared, store, package, config, or dependency changes.
- STOP if send, stream, abort, retry, export, or compare behavior must change.
- STOP if CSS changes become a broad rewrite.
- STOP if build errors require unrelated view/store edits.

## Candidate epics
- UI v2 adoption for AI Dock local views.
- Local Chat visual consistency and readability.

## Risks
- Canonical export filename `02-local-chat.png` is absent; numeric export `2.png` is used as reference with markdown handoff.
- Visual-only CSS can still affect scroll height, pinned composer, or button readability.
- Manual Electron smoke is required for interaction-level confidence.

## Links
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/workpacks/WP-UI-004-chat-view-restyle/workpack.md`
