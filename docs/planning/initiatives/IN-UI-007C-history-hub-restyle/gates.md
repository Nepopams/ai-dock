# IN-UI-007C Gates

## Soft gates
- Use numeric design export `9.png` because canonical `09-history-hub.png` is absent.
- Keep `HistoryView` changes markup-only and visual.
- Keep CSS changes scoped to `.history-*` and optional local helpers.
- Record manual Electron smoke for source/open/chat handoff flows.

## Strong human gates
- STOP if changes require history store, shared contracts, IPC, main/preload, package, or dependency changes.
- STOP if search, ingest, open-in-source, continue-in-chat, or create-thread behavior must change.
- STOP if implementation requires broad CSS rewrite or unrelated local view edits.
- STOP if build errors require changing forbidden paths.

## Stop-the-line events
None. No strong gate was triggered.

## Approval log
- Human approved `WP-UI-007C - History Hub Restyle` in the initiative request.

## Decisions log
- Use `docs/design/ui-v2/exports/9.png` plus handoff docs as the design source because canonical export filename is absent.
- Proceed as one bounded workpack with `HistoryView.tsx` and `global.css` only for runtime files.
- Automated verification passed; manual Electron smoke remains the final validation step.
