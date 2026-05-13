# WP-UI-011A REVIEW Prompt

Review WP-UI-011A.

Checks:
- `CompletionsSettings.tsx` changed meaningfully.
- Connections is not CSS-only.
- Profile list/editor/status rail/registry preview are present.
- Save, set-active, test, clear token, headers, generic HTTP, registry tab, and adapter tab behavior remain wired to existing handlers.
- Token values are not exposed.
- No forbidden files changed.
- Validators, tests, build, and diff checks pass.
- Fresh screenshot remains required before final GO.

Verdict:
- GO if automated verification passes and no forbidden scope is present.
