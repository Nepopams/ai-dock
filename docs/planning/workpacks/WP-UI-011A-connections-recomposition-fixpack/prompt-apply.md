# WP-UI-011A APPLY Prompt

Apply the approved Connections Recomposition Fixpack.

Required:
- Change `CompletionsSettings.tsx` meaningfully.
- Recompose visible layout into model profile list, profile editor, status rail, and Service Registry Preview.
- Preserve all existing provider/profile/token/registry/adapter behavior.
- Use existing `--aid-*` tokens and scoped CSS.
- Update UI v2 visual fixpack docs and delivery report.

Forbidden:
- Provider schema changes.
- Registry schema changes.
- Store changes.
- IPC/main/preload/shared changes.
- Package/dependency/config changes.
- Unrelated view changes.
