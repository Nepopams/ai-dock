# WP-UI-002 REVIEW Prompt

You are reviewing `WP-UI-002 Global Design Tokens and UI Primitives`.

## Review checks
- UI v2 variables were added under `:root`.
- Primitive classes were added but not broadly wired into React.
- No broad screen restyle happened.
- No React component/view/store changes happened.
- No main/preload/shared changes happened.
- No package/dependency/config changes happened.
- Tests/build pass.
- Manual smoke checklist is recorded.
- Delivery report states that screen restyles are deferred.

## Must-fix triggers
- Missing required token variables.
- Primitive classes coupled to a specific screen.
- Any forbidden-path change.
- Broad selector rewrites that materially restyle screens.
- Build or CSS parse failure caused by this workpack.
