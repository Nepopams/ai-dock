# WP-UI-003 PLAN Prompt

You are Codex for VR AI Dock. Run PLAN for `WP-UI-003 Shell Restyle`.

## Mission
Plan a scoped renderer shell UI APPLY that restyles Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast, and app chrome while preserving behavior.

## Required answers
1. Are required UI v2 exports available for Main Dock Shell and Design System? If canonical names are missing, identify what exists.
2. Which shell elements will be restyled?
3. Which shell behaviors must remain unchanged?
4. Whether `App.tsx` needs className/layout markup changes. Prefer minimal.
5. Whether `Sidebar.tsx` changes are visual only.
6. Whether `TabStrip.tsx` changes are visual only.
7. Whether `PromptRouter.tsx` changes are visual only.
8. Whether `PromptDrawer`/`Toast` changes are visual only.
9. What exact CSS sections will be touched.
10. What must remain deferred to `WP-UI-004+`.
11. Which exact files will be changed.
12. Is there any strong gate?

## Allowed files
Use only the workpack allow-list.

## Forbidden files
Do not change main, preload, shared, views, stores, adapters, package/config/scripts, build, release, or dependency files.
