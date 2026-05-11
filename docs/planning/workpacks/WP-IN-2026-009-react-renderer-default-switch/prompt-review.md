# REVIEW Prompt - WP-IN-2026-009

Review checks:
- React renderer is default in `main.js`.
- Legacy renderer requires explicit fallback flag.
- `dev:new-ui` is compatibility alias.
- `electron:build` runs React build before packaging.
- `package-lock.json` is unchanged.
- No dependency changes.
- No preload/shared/IPC contract changes.
- Validators pass.
- `npm test`, `npm run build`, and `npm run preload:build` pass.
- Delivery report contains manual smoke checklist.

Verdict:
- GO if all checks pass and only allowed files changed.
- NO-GO if forbidden paths changed or verification failed without an acceptable limitation.
