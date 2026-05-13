# WP-UI-011A FIXPACK Prompt

Use only for bounded fixes found in review.

Allowed:
- Fix JSX/CSS bugs in allowed Connections files.
- Clarify docs/delivery report.
- Fix validator or build issues caused by this workpack.

Forbidden:
- Any schema/store/IPC/package/dependency change.
- Broad shell or unrelated local view restyle.
- Token/auth behavior changes.

After fixes, rerun validators, `npm test`, `npm run build`, `git diff --check`, and forbidden-path checks.
