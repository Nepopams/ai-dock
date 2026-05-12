# IN-UI-003 - AI Dock UI v2 Shell Restyle

## Initiative ID
`IN-UI-003-shell-restyle`

## Title
AI Dock UI v2 Shell Restyle

## Status
Done; automated verification passed. Manual Electron smoke remains required.

## Owner
Human + Codex

## Goal
Apply UI v2 visuals to the shared AI Dock shell while preserving existing navigation, BrowserView, prompt routing, tabs, drawer, and toast behavior.

## User value
The user gets a consistent AI Dock cockpit frame around current local views and web tabs: a tokenized 72px dock rail, compact 44px tab strip, prompt router chrome, drawer, toast, and stable workspace boundaries.

## Problem
UI v2 tokens and primitives exist, but the visible shell still uses older mixed styles. Later view restyles would sit inside an inconsistent frame unless the shell is updated first.

## Success criteria
- Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast, and app chrome use UI v2 shell visuals.
- Existing click handlers, tab actions, prompt router behavior, drawer behavior, toast visibility, and local view routing are preserved.
- No BrowserView lifecycle, IPC, state-shape, package, dependency, main, preload, shared, adapter, store, or view-content changes are made.
- Screen view restyles are explicitly deferred to `WP-UI-004+`.
- Initiative/workpack validators, tests, build, diff checks, and forbidden-path checks pass.

## In scope
- Create initiative artifacts.
- Create `WP-UI-003` workpack and prompt pack.
- Apply visual-only shell component class/name affordances where useful.
- Update shell-related CSS in `global.css`.
- Use existing `--aid-*` tokens and primitives from `WP-UI-002`.
- Update UI v2 roadmap status.
- Add delivery report with manual smoke checklist status.

## Out of scope
- ChatView restyle.
- EvaluationStudioView / CompareView restyle.
- Connections/Form/Profile restyle.
- Prompt Templates manager restyle.
- History/Presets restyle.
- BrowserView implementation or lifecycle changes.
- Registry/provider/prompt storage changes.
- New icon library, dependencies, or UI library.

## Constraints
- Do not change `src/main/**`, `src/preload/**`, `src/shared/**`.
- Do not change package or lock files.
- Do not change IPC contracts, BrowserView lifecycle, Zustand state shape, tab/router behavior, or prompt routing semantics.
- Do not restyle local view content beyond shell boundaries.
- Do not perform a broad CSS rewrite.

## Strong human gate triggers
- STOP if Shell/Design System references are insufficient for a safe shell-only style map.
- STOP if implementation requires main/preload/shared/package changes.
- STOP if BrowserView bounds or tab lifecycle must change.
- STOP if prompt routing behavior must change.
- STOP if `global.css` changes become a broad view rewrite.
- STOP if build errors require unrelated views/stores.

## Candidate epics
- UI v2 renderer rollout.
- AI Dock shell/chrome consistency.

## Risks
- Shell top inset changes can visibly affect BrowserView and local content bounds.
- Generic CSS selectors could accidentally restyle local views if not scoped to shell.
- Canonical PNG names remain missing; numeric exports are available but not deterministic by filename.

## Links
- [UI v2 design tokens](../../../design/ui-v2/design-tokens.md)
- [UI v2 implementation notes](../../../design/ui-v2/implementation-notes.md)
- [UI v2 screen map](../../../design/ui-v2/screen-map.md)
- [UI v2 workpack roadmap](../../../design/ui-v2/ui-v2-workpack-roadmap.md)
- [WP-UI-003 workpack](../../workpacks/WP-UI-003-shell-restyle/workpack.md)
