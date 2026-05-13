# WP-UI-009 Prompt FIXPACK

Use only if REVIEW finds a must-fix inside the same scope.

Allowed fixes:
- Correct semantic class wiring in `ConfirmDialog` or `KeyValueEditor`.
- Correct scoped CSS for focus, warning, danger, disabled, or modal readability.
- Correct docs/run-state/delivery-report status.

Forbidden fixes:
- Parent screen rewrites.
- Store, IPC, main, preload, shared, package, dependency, or schema changes.
- Visual gap fixpacks for whole screens.

Re-run the full verification command set after any fix.

