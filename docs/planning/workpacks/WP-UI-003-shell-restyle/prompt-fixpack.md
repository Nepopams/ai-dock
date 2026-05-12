# WP-UI-003 FIXPACK Prompt

Use this only if REVIEW finds a must-fix issue.

## Allowed fix scope
- Correct shell-scoped CSS regressions.
- Revert accidental view-content restyle selectors.
- Correct visual-only class names or focus/readability styling.
- Update run-state and delivery report.

## Forbidden fix scope
- Do not edit forbidden paths.
- Do not change behavior, state shape, IPC, BrowserView lifecycle, packages, dependencies, or view content.
- Do not begin Chat/Judge/settings restyles.

## Verification
Re-run the failed command plus validators, `npm test`, `npm run build`, `git diff --check`, and forbidden-path status check.
