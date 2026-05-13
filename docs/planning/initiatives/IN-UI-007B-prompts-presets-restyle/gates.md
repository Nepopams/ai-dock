# IN-UI-007B Gates

## Soft gates
- Keep JSX class changes visual-only.
- Keep CSS selectors scoped to Prompt Templates, Insert Prompt, Media Presets, and Apply dialog.
- Preserve focus, disabled, error, import conflict, and apply feedback readability.
- Record manual smoke checklist for Electron-only flows.

## Strong human gates
- STOP if runtime behavior requires store/shared/schema/IPC/package changes.
- STOP if `WP-UI-007B` must split into `WP-UI-007B1` and `WP-UI-007B2`.
- STOP if build errors require unrelated view/store changes.
- STOP if import/export/apply semantics need implementation changes.

## Stop-the-line events
None.

## Approval log
- Human approved `WP-UI-007B — Prompt Templates / Media Presets Restyle` in the initiative request.

## Decisions log
- Use numeric design exports `7.png` and `8.png` because canonical `07-*` and `08-*` filenames are absent.
- Proceed as one bounded workpack because Presets/Apply already have semantic selectors and Prompt Templates class migration can remain scoped.
- No strong gate triggered during APPLY or REVIEW.
