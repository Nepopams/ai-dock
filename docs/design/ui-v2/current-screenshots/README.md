# AI Dock UI v2 Current Screenshots

This folder is the capture pack for actual Electron app screenshots used by the UI v2 visual acceptance pass.

## Purpose
The canonical design PNGs in `../exports/` show the target Pencil frames. The screenshots in this folder should show the current running app after the UI v2 workpack chain. Visual acceptance requires both sides before deciding GO, GO with polish, or NO-GO.

## Capture rules
- Screenshots are produced manually by Human in the running Electron app.
- Codex must not create placeholder screenshots.
- Commit screenshots separately or as a follow-up to this acceptance pack.
- Capture the React renderer, not the legacy UI.
- Recommended window size: `1440x900`, or the closest size matching the Pencil export frame if Human knows it.

## Recommended launch
```sh
git checkout master
git pull
# Clear AI_DOCK_LEGACY_UI if it is set in your shell/session.
npm run dev:app
```

## Required screenshot names
| Screen | File |
| --- | --- |
| Main Dock Shell | `01-main-dock-shell.current.png` |
| Local Chat | `02-local-chat.current.png` |
| Judge Evaluation Studio | `03-judge-evaluation-studio.current.png` |
| Connections | `04-connections.current.png` |
| Form Profiles | `05-form-profiles.current.png` |
| Form Runner | `06-form-runner.current.png` |
| Prompt Templates | `07-prompt-templates.current.png` |
| Media Presets | `08-media-presets.current.png` |
| History Hub | `09-history-hub.current.png` |

## Capture sequence
1. Launch with `npm run dev:app`.
2. Confirm the React UI is loaded and the legacy UI is not active.
3. Capture Main Dock Shell with representative shell state.
4. Capture Local Chat.
5. Capture Judge Evaluation Studio.
6. Capture Connections.
7. Capture Form Profiles.
8. Capture Form Runner.
9. Capture Prompt Templates.
10. Capture Media Presets.
11. Capture History Hub.
12. Fill `../visual-gap-matrix.md` with the observed differences.
