# IN-UI-002 - Global Design Tokens and UI Primitives

## Initiative ID
`IN-UI-002-global-design-tokens-primitives`

## Title
Global Design Tokens and UI Primitives

## Status
Done; automated verification passed. Manual Electron smoke remains required.

## Owner
Human + Codex

## Goal
Add a UI v2 CSS token layer and minimal reusable primitive classes in the existing React/Vite renderer without applying a full screen restyle.

## User value
Later UI v2 workpacks can apply the Pencil design consistently with less duplicated CSS, fewer screen-specific hacks, and a smaller regression surface.

## Problem
Current renderer styles are hardcoded and inconsistent across shell, local views, cards, buttons, inputs, chips, tables, empty states, and status indicators. Without a shared token foundation, each screen-level restyle would duplicate constants and increase drift.

## Success criteria
- UI v2 `--aid-*` variables exist in `src/renderer/react/styles/global.css`.
- Minimal opt-in primitive classes exist for future workpacks.
- Only conservative existing mappings are changed.
- No React component, Zustand, IPC, main, preload, shared, package, or dependency changes are made.
- Initiative and workpack validators pass.
- Tests/build pass or any failure is documented as pre-existing/out of scope.

## In scope
- Create initiative artifacts.
- Create `WP-UI-002` workpack and prompt pack.
- Add CSS custom properties under `:root`.
- Add minimal opt-in CSS primitives and focus/disabled helpers.
- Map only low-risk global/root shell dimensions and base colors.
- Add UI v2 docs notes about runtime token mapping status.
- Update the UI v2 roadmap status for `WP-UI-002`.

## Out of scope
- Shell restyle.
- Chat restyle.
- Judge/Evaluation Studio restyle.
- Connections/Form Profiles restyle.
- Remaining view restyle.
- New component library or UI dependency.
- New CSS architecture, CSS modules, or Tailwind.
- React behavior, Zustand state, IPC, storage, provider, or package changes.

## Constraints
- Do not add dependencies or UI libraries.
- Do not change `package.json` or `package-lock.json`.
- Do not change `src/main/**`, `src/preload/**`, or `src/shared/**`.
- Do not change React components, views, or stores.
- Keep the current app usable.
- Do not use `.pen` as the only implementation source.
- Do not broadly rewrite view-specific CSS.

## Strong human gate triggers
- STOP if token values cannot be verified sufficiently from `docs/design/ui-v2/design-tokens.md`.
- STOP if implementation requires dependency or package metadata changes.
- STOP if implementation requires main/preload/shared changes.
- STOP if CSS changes require broad view-specific rewrites.
- STOP if build failures caused by this workpack require edits outside allowed files.
- STOP if CSS parser/minifier warnings caused by this workpack cannot be fixed in `global.css`.

## Candidate epics
- UI v2 implementation.
- AI Dock renderer design system foundation.

## Risks
- Global CSS changes can affect every view, even when primitives are opt-in.
- Numeric PNG exports are present, but exact handoff filenames are still missing.
- Manual Electron smoke is still needed to inspect visual regressions.

## Links
- [Design tokens](../../../design/ui-v2/design-tokens.md)
- [Implementation notes](../../../design/ui-v2/implementation-notes.md)
- [Screen map](../../../design/ui-v2/screen-map.md)
- [UI v2 workpack roadmap](../../../design/ui-v2/ui-v2-workpack-roadmap.md)
- [WP-UI-002 workpack](../../workpacks/WP-UI-002-global-design-tokens-primitives/workpack.md)
