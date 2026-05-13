# UI v2 Runtime Root Cause Analysis

## Renderer Mode Verification

Current screenshots show the React renderer window title (`AI Dock React UI`). `src/main/main.js` uses the React/Vite renderer URL in dev unless `AI_DOCK_LEGACY_UI=true`. The visual mismatch is therefore not explained by accidentally running the legacy UI. It is a React UI implementation/acceptance gap.

## Changed Files vs Owner Files

| Workpack | Target Surface | Visible Owner Files | Evidence from Prior Diffs | Root Cause |
| --- | --- | --- | --- | --- |
| IN-UI-003 | Shell | `App.tsx`, `Sidebar.tsx`, `TabStrip.tsx`, `PromptRouter.tsx`, `PromptDrawer.tsx`, `Toast.tsx`, `global.css` | Shell files were changed, but current screenshot still shows old visible strings/states and a collapsed router. | Visual target requires a stronger shell/layout pass and screenshot acceptance. |
| IN-UI-004 | Chat | `ChatView.tsx`, `ConversationList.tsx`, `MessageList.tsx`, `MessageItem.tsx`, `CompareButton.tsx`, `global.css` | Prior commit changed `global.css` and docs, not Chat owner components. | CSS-only pass could not create the target chat composition. |
| IN-UI-005 | Judge | `EvaluationStudioView.tsx`, `CompareView.tsx`, `global.css` | Prior commit changed `global.css` and docs, not Judge owner components. | CSS-only pass could not move the working studio into the target primary layout. |
| IN-UI-006 | Connections | `ConnectionsSettings.tsx`, `CompletionsSettings.tsx`, `ClientsAndCategories.tsx`, `AdapterOverrides.tsx`, `global.css` | Prior commit changed `ConnectionsSettings.tsx` minimally and did not change `CompletionsSettings.tsx`. | The visible Completion Profiles editor owner was missed. |
| IN-UI-006 | Form Profiles | `FormProfilesManager.tsx`, `FormEditor.tsx`, `global.css` | Owner files were changed. | Result is closer, but still needs polish and shell cleanup. |
| IN-UI-007A | Form Runner | `FormRunView.tsx`, `global.css` | Owner file was changed. | Layout changed partially but did not reach target composition. |
| IN-UI-007B | Prompt Templates | `TemplatesManager.tsx`, `InsertPromptDialog.tsx`, `global.css` | Owner files were changed. | Current screenshot is an empty state and does not prove target manager/editor composition. |
| IN-UI-007B | Media Presets | `PresetsGallery.tsx`, `ApplyPresetDialog.tsx`, `global.css` | Owner files were changed. | Current screenshot is an empty state and does not prove target gallery/apply composition. |
| IN-UI-007C | History Hub | `HistoryView.tsx`, `global.css` | Owner files were changed. | Current screenshot is missing, so no visual verdict can be made. |
| IN-UI-009 | Component States | `ConfirmDialog.tsx`, `KeyValueEditor.tsx`, `global.css` | Shared component files were changed. | No component-state screenshot evidence yet; this does not solve screen composition gaps. |

## Concrete Examples

### Connections Owner Miss

`ConnectionsSettings.tsx` is a tab shell. The current Connections screenshot is dominated by the Completion Profiles editor, which is owned by `CompletionsSettings.tsx`. Because IN-UI-006 did not change `CompletionsSettings.tsx`, it could not produce the target Connections frame with model profiles, profile editor, right status cards, and registry preview.

### Chat CSS-Only Gap

The Local Chat target requires moving/structuring conversation rail, message pane, composer, and presets. IN-UI-004 did not change `ChatView.tsx` or chat components, so the result remained mostly legacy composition with tokenized styling around it.

### Judge CSS-Only Gap

The Judge target presents the working comparison studio as the main surface. IN-UI-005 did not change `EvaluationStudioView.tsx` or `CompareView.tsx`, so the mode cards and saved evaluations still dominate the first viewport.

## Acceptance Gate Failure

The rollout accepted technical gates without a visual evidence gate. The missing gate was:

1. Capture current screenshot for the exact target state.
2. Compare target PNG and current screenshot.
3. Mark `NO-GO` when composition differs, even if tests/build pass.
4. Route a scoped fixpack to actual owner files.

IN-UI-010 now provides that gate for follow-up fixpacks.
