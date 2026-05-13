# IN-UI-009 Gates

## Soft gates
- Component States Board export exists.
- Shared component candidates are limited to `ConfirmDialog` and `KeyValueEditor`.
- `Toast` remains unchanged because a tiny alignment change is not necessary.
- Scoped CSS uses semantic `confirm-dialog-*`, `key-value-editor-*`, and opt-in `ui-state-*` selectors.
- Manual Electron smoke remains required for dialog stacking and parent-surface integration.

## Strong human gates
- STOP if component props or parent screen rewrites are required.
- STOP if main, preload, shared, store, IPC, package, dependency, config, script, or build files need changes.
- STOP if scoped CSS becomes a broad screen-level restyle.
- STOP if build errors require unrelated view/store changes.
- STOP if this workpack turns into a visual gap fixpack.

## Stop-the-line events
None.

## Approval log
- Human explicitly approved `IN-UI-009` as an L3 scoped renderer shared component states UI APPLY.

## Decisions log
- Use Component States Board as the design reference.
- Replace utility-like class clusters in `ConfirmDialog` and `KeyValueEditor` with semantic classes.
- Preserve all props, handlers, labels, read-only behavior, warning behavior, and parent call sites.
- Add scoped shared state classes without wiring them broadly into screens.
- Keep screenshot capture and visual gap matrix as the next acceptance step.

