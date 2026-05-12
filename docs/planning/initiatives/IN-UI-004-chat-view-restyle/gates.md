# Gates: IN-UI-004 Chat View Restyle

## Soft gates
- Canonical export filename `docs/design/ui-v2/exports/02-local-chat.png` is missing.
- Numeric export `docs/design/ui-v2/exports/2.png` exists and was visually checked as the Local Chat reference.
- Manual Electron smoke is required after automated checks.

## Strong human gates
- No active strong gate.
- Strong gate would trigger if changes require forbidden paths, store shape changes, IPC/preload/main/shared changes, package/dependency changes, or runtime behavior changes.

## Stop-the-line events
None.

## Approval log
- Human explicitly approved `WP-UI-004 Chat View Restyle` as L3 scoped renderer Chat UI APPLY.

## Decisions log
- Proceed without canonical PNG filename because design mapping can be derived from `2.png`, design tokens, implementation notes, and screen map.
- Keep changes visual-only and scoped to allowed Chat renderer files plus Chat-related CSS.
- Use CSS-first Chat selectors rather than React behavior changes because existing component class structure supports the restyle.
