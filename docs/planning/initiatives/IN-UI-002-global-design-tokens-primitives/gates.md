# IN-UI-002 Gates

## Soft gates
- Exact named PNG exports from `docs/design/ui-v2/exports/README.md` are not present; numeric exports exist.
- Manual Electron smoke remains required after automated verification.

## Strong human gates
- No active strong gate.
- Human approval context explicitly approved `WP-UI-002 Global Design Tokens and UI Primitives`.

## Stop-the-line events
None.

## Approval log
- 2026-05-12: Human approved `WP-UI-002` as the next UI v2 runtime workpack.

## Decisions log
- Proceed as token bootstrap from `docs/design/ui-v2/design-tokens.md` because this workpack does not apply screen-level Pencil frames.
- Keep primitives opt-in and do not wire them into React components in this initiative.
- Fix the obvious malformed orphan CSS block in `global.css` as CSS hygiene under `WP-UI-002`.
