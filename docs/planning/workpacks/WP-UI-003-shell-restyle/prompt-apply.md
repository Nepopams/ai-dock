# WP-UI-003 APPLY Prompt

You are `ai-dock-renderer-react-executor` for VR AI Dock. Apply only the approved shell restyle.

## Apply scope
- Add small shell-specific class names/attributes only where useful for visual styling and accessibility.
- Restyle `#app`, Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast, and shell chrome in `global.css`.
- Use existing `--aid-*` tokens from `WP-UI-002`.
- Keep 72px rail and 44px tabstrip.
- Preserve `useTopInsetSync` compatibility and BrowserView bounds assumptions.
- Update the UI v2 roadmap status.

## Do not
- Do not change behavior handlers, store actions, state shape, IPC, BrowserView lifecycle, preload/main/shared files, local view content, package files, dependencies, or scripts.
- Do not do a broad CSS rewrite.
- Do not add a UI library or icon package.

## Verification
Run validators, `npm test`, `npm run build`, `git diff --check`, and forbidden-path status check.
