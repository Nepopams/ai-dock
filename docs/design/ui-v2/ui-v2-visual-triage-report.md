# UI v2 Visual Triage Report

## Executive Summary

Codex image inspection was available for this pass. The target design PNGs and current screenshots were inspected side by side for screens 01-08. `09-history-hub.current.png` was missing, so History Hub remains pending screenshot evidence.

The UI v2 rollout is not visually accepted. Most previous workpacks passed validators, build, tests, and forbidden-path checks, but those gates did not prove visual fidelity. Several screens require React layout/component recomposition, not another broad CSS-only pass.

The clearest root cause is ownership mismatch. For example, the Connections screenshot is still the old Completion Profiles editor because the visible content is owned by `CompletionsSettings.tsx`, and IN-UI-006 did not modify that file. Similar CSS-only outcomes occurred for Chat and Judge.

## Top Root Causes

1. **Automated GO was not visual GO.** Previous delivery reports mostly proved build/test success and forbidden-path compliance, not target-vs-current composition.
2. **CSS-only changes were accepted where layout recomposition was required.** Chat and Judge target screens need React markup and layout changes, but prior passes did not change the main owner components.
3. **Some workpacks missed visible owner files.** Connections targeted `ConnectionsSettings.tsx`, but the current screen is mostly rendered by `CompletionsSettings.tsx`.
4. **Representative screenshot states are missing or empty.** Prompt Templates and Media Presets screenshots show empty states, while target designs show populated management/editor surfaces.
5. **The shell mismatch contaminates every screen.** The current app still shows old chrome/title, empty tab copy, collapsed prompt router, and blank workspace patterns that are visibly different from the target Dock shell.

## Screen Verdicts

| Screen | Verdict | Evidence Summary | First Fixpack |
| --- | --- | --- | --- |
| Main Dock Shell | NO-GO | Target cockpit shell is absent; current shell still uses old empty-tab/prompt-router composition. | WP-UI-011B |
| Local Chat | NO-GO | Target conversation rail/message/composer/right-rail layout is not present. Prior pass did not change Chat owner components. | WP-UI-011C |
| Judge Evaluation Studio | NO-GO | Target working studio is not the primary visible surface. Prior pass did not change Judge owner components. | WP-UI-011D |
| Connections | NO-GO | Current remains old Completion Profiles editor. `CompletionsSettings.tsx` was missed by IN-UI-006. | WP-UI-011A |
| Form Profiles | GO with polish | Closest screen: list/editor/preview composition exists, but density, shell, and editor polish remain. | WP-UI-011E |
| Form Runner | NO-GO | Partial columns exist, but target execution workspace/response inspector composition is not achieved. | WP-UI-011E |
| Prompt Templates | NO-GO | Current screenshot is empty-state, not target template manager/editor composition. | WP-UI-011F |
| Media Presets | NO-GO | Current screenshot is empty-state, not target preset gallery/editor/apply composition. | WP-UI-011F |
| History Hub | Pending screenshot | Target PNG exists, current screenshot missing. | WP-UI-011F after screenshot |

## Evidence Notes

- Renderer mode appears to be React UI, not legacy UI: screenshots show `AI Dock React UI`, and `src/main/main.js` loads the Vite React URL in dev unless `AI_DOCK_LEGACY_UI=true`.
- Connections target/current mismatch is structural, not color polish. The target has a different page composition.
- Chat and Judge mismatches correlate with previous changed-file history: both initiatives changed CSS and docs, but not their main owner components.
- Form Profiles is the only screen with a broadly similar information architecture, though it is not final.
- Prompt Templates and Media Presets need screenshots with representative data before final visual acceptance can distinguish empty-state polish from missing composition.

## Why Previous Automated GO Missed This

The previous checks answered: "Does the app compile, test, and avoid forbidden paths?" They did not answer: "Does the current Electron screenshot match the Pencil frame?" The manual smoke checklists were recorded as required, but screenshot-based visual comparison was introduced only in IN-UI-008 and applied here in IN-UI-010.

## Recommended Next Action

Start with **WP-UI-011A Connections Recomposition Fixpack** because it has the clearest evidence-backed owner miss and a bounded runtime surface. Run **WP-UI-011B Shell / PromptRouter Layout Breakthrough** immediately after, because shell mismatch affects every subsequent visual screenshot.
