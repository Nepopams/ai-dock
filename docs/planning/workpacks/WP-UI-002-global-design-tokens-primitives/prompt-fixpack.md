# WP-UI-002 FIXPACK Prompt

Use this only if REVIEW finds a must-fix issue.

## Allowed fix scope
- Correct missing or malformed `--aid-*` variables.
- Correct opt-in primitive CSS that breaks build/minification.
- Revert accidental broad screen restyle selectors.
- Update delivery report/run state to reflect the fix.

## Forbidden fix scope
- Do not edit React components, views, stores, main, preload, shared, package/config, scripts, or dependencies.
- Do not add UI libraries.
- Do not use fixpack to start Shell, Chat, Judge, or settings restyles.

## Verification
Re-run the failed command plus validators, `npm test`, `npm run build`, `git diff --check`, and forbidden-path status check.
