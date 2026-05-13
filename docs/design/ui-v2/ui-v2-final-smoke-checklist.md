# UI v2 Final Smoke Checklist

Run this after current screenshots are captured. The goal is to confirm that the UI v2 rollout is visually present and operationally usable before any WP-UI-009 fixpack.

## Launch mode verification
- [ ] `npm run dev:app` starts the Electron app.
- [ ] React renderer is loaded.
- [ ] Legacy UI is not active.
- [ ] `AI_DOCK_LEGACY_UI` is not set for this run.
- [ ] App window is captured at `1440x900` or the agreed design comparison size.

## Shell
- [ ] Sidebar is visible, readable, and not legacy-styled.
- [ ] TabStrip is visible and uses the compact top strip.
- [ ] PromptRouter is visible and usable.
- [ ] PromptRouter collapse/expand still works.
- [ ] PromptDrawer/modal surfaces appear above the shell.
- [ ] Toast states are readable.
- [ ] BrowserView bounds are not shifted under the shell.

## Local views
- [ ] Chat opens and composer remains reachable.
- [ ] Evaluation Studio opens and Judge controls are readable.
- [ ] Connections opens and tabs are usable.
- [ ] Form Profiles opens and editor/list areas are readable.
- [ ] Form Runner opens from Form Profiles and directly if available.
- [ ] Prompt Templates opens and editor modal is usable.
- [ ] Media Presets opens and Apply dialog is usable.
- [ ] History Hub opens and thread/search/message panels are readable.

## Cross-view regressions
- [ ] Navigation between all local views works.
- [ ] Web client tabs still open/focus/close.
- [ ] Modals remain above shell and are dismissible.
- [ ] Forms do not clip labels, inputs, or primary actions.
- [ ] Scrolling works in tall lists and message panels.
- [ ] Keyboard focus is visible on buttons, inputs, selects, and dialogs.
- [ ] Primary actions remain visually distinct.
- [ ] Destructive actions remain visually distinct.
- [ ] Import/export dialogs remain readable.
- [ ] Empty, loading, warning, and error states are readable.

## Acceptance decision
- [ ] Every screen has a current screenshot.
- [ ] Every screen has a row in `visual-gap-matrix.md`.
- [ ] Each screen is marked GO, GO with polish, or NO-GO.
- [ ] NO-GO rows are mapped to a scoped WP-UI-009 fixpack.
