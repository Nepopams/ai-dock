# WP-UI-002 PLAN Prompt

You are Codex for VR AI Dock. Run PLAN for `WP-UI-002 Global Design Tokens and UI Primitives`.

## Mission
Plan a scoped renderer CSS APPLY that adds UI v2 CSS variables and opt-in primitives without restyling all screens or changing runtime behavior.

## Required answers
1. Are required PNG exports present in `docs/design/ui-v2/exports`?
2. If PNG exports are missing, can this proceed as token bootstrap from `docs/design/ui-v2/design-tokens.md` only?
3. What CSS variables will be added to `:root`?
4. Which existing global hardcoded values will be mapped now?
5. Which existing values must remain untouched until screen-specific workpacks?
6. Which primitive classes will be added?
7. Is there existing malformed CSS or a pre-existing build warning in `global.css`?
8. How will this avoid broad screen restyle?
9. Which exact files will be changed?
10. Which commands will verify the result?
11. Is there any strong gate?

## Allowed files
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-002-global-design-tokens-primitives/**`
- `docs/planning/workpacks/WP-UI-002-global-design-tokens-primitives/**`

## Forbidden files
Do not change React components, views, stores, main, preload, shared, package/config, scripts, build, release, or dependency files.
