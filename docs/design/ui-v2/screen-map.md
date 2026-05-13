# AI Dock UI v2 Screen Map

This table links Pencil frames and PNG exports to the current React surfaces and proposed UI workpacks.

| Frame name | PNG file | Current React route/local view | Current files | Target workpack | Notes |
| --- | --- | --- | --- | --- | --- |
| AI Dock / 00 Design System - Source of Truth | `00-design-system.png` | Shared UI states | `src/renderer/react/styles/global.css`, shared component callsites | `WP-UI-002` | Token and primitive source for later workpacks. |
| Main Dock Shell | `01-main-dock-shell.png` | App shell, all local views and web tabs | `App.tsx`, `Sidebar.tsx`, `TabStrip.tsx`, `PromptRouter.tsx`, `PromptDrawer.tsx`, `Toast.tsx`, `global.css` | `WP-UI-003` | Must preserve BrowserView/tab behavior and prompt router flows. |
| Local Chat | `02-local-chat.png` | `activeLocalView === "chat"` | `ChatView.tsx`, `MessageList.tsx`, `ConversationList.tsx`, `CompareButton.tsx`, `global.css` | `WP-UI-004` | Must preserve streaming, abort, retry, export, presets. |
| Judge Evaluation Studio | `03-judge-evaluation-studio.png` | `activeLocalView === "compare"` | `EvaluationStudioView.tsx`, `CompareView.tsx`, `src/renderer/store/judgeSlice.ts`, `useDockStore.ts`, `global.css` | `WP-UI-005` | Visual only; no Judge contracts or EvaluationRun schema changes. |
| Connections | `04-connections.png` | `activeLocalView === "completions"` | `ConnectionsSettings.tsx`, `CompletionsSettings.tsx`, `ClientsAndCategories.tsx`, `AdapterOverrides.tsx`, `global.css` | `WP-UI-006` | Keep provider/profile/registry behavior unchanged. |
| Form Profiles | `05-form-profiles.png` | `activeLocalView === "formProfiles"` | `FormProfilesManager.tsx`, `FormEditor.tsx`, `useDockStore.ts`, `global.css` | `WP-UI-006` | Pair with Connections because both are settings/form-heavy. |
| Form Runner | `06-form-runner.png` | `activeLocalView === "formRun"` | `FormRunView.tsx`, `useDockStore.ts`, `global.css` | `WP-UI-007` | Must preserve redaction, timeouts, sync/stream run and abort. |
| Prompt Templates | `07-prompt-templates.png` | `activeLocalView === "prompts"` | `TemplatesManager.tsx`, `InsertPromptDialog.tsx`, `global.css` | `WP-UI-007` | Visual only; template import/export/rendering unchanged. |
| Media Presets | `08-media-presets.png` | `activeLocalView === "presets"` | `PresetsGallery.tsx`, `ApplyPresetDialog.tsx`, `global.css` | `WP-UI-007` | Visual only; adapter warning and apply behavior unchanged. |
| History Hub | `09-history-hub.png` | `activeLocalView === "history"` | `HistoryView.tsx`, `useDockStore.ts`, `global.css` | `WP-UI-007` | No history schema, ingestion, search, or bridge changes. |
| Component States Board | `10-component-states-board.png` | Shared states across all UI | `global.css`, repeated button/input/card/table/chip callsites | `WP-UI-002` and follow-up view workpacks | Establishes token/state baseline before screen work. |

## Route notes
- `App.tsx` currently maps local views directly through `activeLocalView`.
- `compare` routes to `EvaluationStudioView`, which composes `CompareView`.
- The shell components remain mounted around every local view.
- Runtime BrowserView/web-client content is outside this design handoff scope except for shell boundaries around it.

## Current screenshot mapping
`IN-UI-008 Visual Acceptance and Fixpack Plan` adds a manual current-screenshot capture layer. Current app screenshots belong in `docs/design/ui-v2/current-screenshots/` and should use the `.current.png` names listed below.

| Design PNG | Current screenshot |
| --- | --- |
| `01-main-dock-shell.png` | `current-screenshots/01-main-dock-shell.current.png` |
| `02-local-chat.png` | `current-screenshots/02-local-chat.current.png` |
| `03-judge-evaluation-studio.png` | `current-screenshots/03-judge-evaluation-studio.current.png` |
| `04-connections.png` | `current-screenshots/04-connections.current.png` |
| `05-form-profiles.png` | `current-screenshots/05-form-profiles.current.png` |
| `06-form-runner.png` | `current-screenshots/06-form-runner.current.png` |
| `07-prompt-templates.png` | `current-screenshots/07-prompt-templates.current.png` |
| `08-media-presets.png` | `current-screenshots/08-media-presets.current.png` |
| `09-history-hub.png` | `current-screenshots/09-history-hub.current.png` |
