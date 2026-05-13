# WP-UI-009 Prompt APPLY

Apply the scoped component states restyle only after PLAN passes.

Requirements:
- Replace `ConfirmDialog` utility class clusters with semantic `confirm-dialog-*` classes.
- Replace `KeyValueEditor` utility class clusters with semantic `key-value-editor-*` classes.
- Preserve all props, handlers, labels, read-only behavior, warning behavior, and parent call sites.
- Add scoped tokenized CSS in `global.css`.
- Do not change screen views, stores, IPC, main, preload, shared, package, config, scripts, or dependencies.
- Update roadmap/acceptance docs and initiative run state.

Run the verification commands from `workpack.md`.

