# WP-UI-002 APPLY Prompt

You are `ai-dock-renderer-react-executor` for VR AI Dock. Apply only the approved scoped CSS foundation.

## Apply scope
- Add `--aid-*` UI v2 variables under `:root` in `src/renderer/react/styles/global.css`.
- Add opt-in primitive classes for surfaces, panels, cards, buttons, inputs, chips, empty states, tables, and focus.
- Map only low-risk global values: body base colors, shell dimensions, prompt router offsets, content offset, legacy pill button token colors/radius, focus-visible helpers.
- Fix only obvious malformed CSS in `global.css` if it is syntactically invalid.
- Update the UI v2 design token mapping status and roadmap status.

## Do not
- Do not edit React components or views.
- Do not wire primitives into components.
- Do not restyle Shell, Chat, Judge, Connections, Forms, History, Presets, or Templates.
- Do not change dependencies, package files, IPC, preload, main, shared, stores, storage, or provider behavior.

## Verification
Run the workflow validators, `npm test`, `npm run build`, `git diff --check`, and forbidden-path status check.
