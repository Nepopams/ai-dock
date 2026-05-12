# Prompt Plan: WP-IN-2026-028 Judge Sidebar Entry

## Mode
PLAN.

## Objective
Confirm that the existing Judge/Compare view can be exposed through Sidebar without runtime changes.

## PLAN answers
- `CompareView` exists and `App.tsx` renders it for `activeLocalView === "compare"`.
- `focusLocalView("compare")` already exists through `useDockStore`.
- No IPC/preload/shared/main changes are needed.
- No package/dependency changes are needed.
- No new icon asset is needed; reuse `infoIcon`.
- Exact runtime file to change: `src/renderer/react/components/Sidebar.tsx`.
- Strong gate: none.
