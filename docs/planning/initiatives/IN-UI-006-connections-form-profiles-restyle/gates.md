# Gates: IN-UI-006 Connections and Form Profiles Restyle

## Soft gates
- Keep visual changes scoped to Connections and Form Profiles.
- Preserve all existing event handlers and runtime behavior.
- Prefer CSS-first changes for Connections.
- Use minimal semantic classNames for Form Profiles where utility-like classes block tokenized styling.
- Record manual Electron smoke checklist.

## Strong human gates
- STOP if changes require main/preload/shared/package/dependency changes.
- STOP if changes require store state-shape changes.
- STOP if changes alter completions, registry, adapter, form profile, form editor, test, save, delete, duplicate, or open-run behavior.
- STOP if provider/profile/form/registry schema changes are needed.
- STOP if FormEditor diff becomes a broad logic rewrite or requires split into WP-UI-006A/006B.
- STOP if build errors require unrelated view/store changes.

## Stop-the-line events
None.

## Approval log
- Human explicitly approved `WP-UI-006 Connections / Form Profiles Restyle` in the initiative request.

## Decisions log
- Canonical PNG names `04-connections.png` and `05-form-profiles.png` are absent; numeric `4.png` and `5.png` are present and used with the markdown handoff.
- No split is required because Connections can be CSS-first and Form Profiles changes are visual-only semantic classNames plus scoped CSS.
- Actual `ConfirmDialog` and `KeyValueEditor` live under `src/renderer/components/**`; avoid editing those files and style their current output from the allowed Form Profiles scope.
