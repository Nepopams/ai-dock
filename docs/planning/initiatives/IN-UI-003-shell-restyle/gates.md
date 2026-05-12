# IN-UI-003 Gates

## Soft gates
- Canonical `00-design-system.png` and `01-main-dock-shell.png` filenames are missing; numeric exports `0.png` and `1.png` exist alongside `2.png` through `10.png`.
- Manual Electron smoke remains required after automated verification unless explicitly run.

## Strong human gates
No active strong gate.

## Stop-the-line events
None.

## Approval log
- 2026-05-12: Human approved `WP-UI-003 Shell Restyle` as the next UI v2 runtime workpack.

## Decisions log
- Proceed from markdown handoff and `--aid-*` tokens because the work is shell-only and does not require pixel-perfect frame implementation.
- Do not change Zustand state shape or BrowserView/layout IPC behavior.
- Keep local view content restyles deferred to `WP-UI-004+`.
