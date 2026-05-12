# FIXPACK Prompt: WP-UI-001 Design Handoff Inventory

Use this only if REVIEW returns NO-GO for `WP-UI-001`.

## Rules
- Fix only the REVIEW Must Fix items.
- Do not expand scope.
- Do not modify runtime files.
- Do not modify package/config/script files.
- Stay inside the original allowed files.
- Re-run the same verification commands.
- Update `run-state.md`, `task-queue.md`, `gates.md`, and `delivery-report.md`.

## Stop-the-line
Stop and request Human Gate if any fix requires:
- `src/**`
- package/config/script/dependency changes
- new IPC/preload/main/storage/security changes
- real design application to runtime components
