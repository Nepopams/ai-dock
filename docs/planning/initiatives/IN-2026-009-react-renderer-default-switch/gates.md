# Gates - IN-2026-009

## Soft gates
- README update is allowed because README documents run commands affected by the script rename/default switch.
- Service catalog update is allowed because renderer ownership/default mode is architecture documentation.
- `AI_DOCK_REACT_DIST=true` is allowed as a React-mode dist selector for `npm start`; it does not expose legacy mode.
- README is not valid UTF-8 for `apply_patch`; a narrow PowerShell encoding-aware edit was used only for README command docs and trailing whitespace cleanup.

## Strong human gates
- Dependency addition: not needed.
- `package-lock.json` change: not needed.
- Legacy renderer deletion: not needed.
- Preload/shared/IPC contract changes: not needed.
- Production React build path ambiguity: not triggered; Vite config defines `src/renderer/react/dist`.

## Stop-the-line events
None.

## Approval log
- Human prompt explicitly approved moving from IN-2026-008 planning to this runtime/build workpack.

## Decisions log
- React is default renderer.
- Legacy is selected only through `AI_DOCK_LEGACY_UI=true`.
- `dev:app` is the full React dev app script.
- `dev:new-ui` remains as a compatibility alias.
- `electron:build` runs React build before packaging.
- REVIEW verdict is GO with manual smoke pending.
