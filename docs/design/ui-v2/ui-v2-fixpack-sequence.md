# UI v2 Fixpack Sequence

No runtime fixpack should start without a PLAN that references the target PNG, current screenshot, owner files, and the visual gap row from `visual-gap-matrix.md`.

## WP-UI-011A Connections Recomposition Fixpack

- Trigger evidence: `04-connections.current.png` is still the old Completion Profiles editor, while `04-connections.png` shows a compact model-profile/editor/status-card composition.
- Target screens: Connections, Completion Profiles tab, Service Registry preview, Adapter Overrides entry points.
- Owner files: `ConnectionsSettings.tsx`, `CompletionsSettings.tsx`, `ClientsAndCategories.tsx`, `AdapterOverrides.tsx`, `global.css`.
- Allowed files: those owner files plus initiative/workpack docs.
- Forbidden files: `src/main/**`, `src/preload/**`, `src/shared/**`, stores, package/config files.
- Expected change type: React layout recomposition plus scoped CSS; not schema/runtime changes.
- Verification: initiative/workpack validators, `npm test`, `npm run build`, forbidden-path status check.
- Manual smoke: switch tabs, edit/save/test completion profile, preserve token redaction, service registry add/edit/delete, adapter overrides save/reset/health-check.

## WP-UI-011B Shell / PromptRouter Layout Breakthrough

- Trigger evidence: `01-main-dock-shell.current.png` does not match target shell composition and affects every local screen.
- Target screens: Main Dock Shell and inherited shell around all local views.
- Owner files: `App.tsx`, `Sidebar.tsx`, `TabStrip.tsx`, `PromptRouter.tsx`, `PromptDrawer.tsx`, `Toast.tsx`, `global.css`.
- Allowed files: shell owner files plus initiative/workpack docs.
- Forbidden files: BrowserView main/preload/shared contracts, stores, package/config files.
- Expected change type: bounded layout/markup changes for top strip, rail, router cockpit, workspace placeholder, and tokenized shell states.
- Verification: initiative/workpack validators, `npm test`, `npm run build`, BrowserView forbidden-path check.
- Manual smoke: sidebar navigation, tab create/switch/close, prompt insert/send/broadcast, router collapse/expand, drawer/toast visibility, BrowserView bounds.

## WP-UI-011C Chat Layout Recomposition

- Trigger evidence: `02-local-chat.current.png` lacks target chat composition; prior Chat workpack did not touch Chat owner components.
- Target screens: Local Chat.
- Owner files: `ChatView.tsx`, `ConversationList.tsx`, `MessageList.tsx`, `MessageItem.tsx`, `CompareButton.tsx`, `global.css`.
- Allowed files: Chat owner files plus initiative/workpack docs.
- Forbidden files: completions provider logic, IPC, stores, package/config files.
- Expected change type: React markup/layout changes and scoped CSS for conversation rail, thread pane, composer, presets/status rail.
- Verification: initiative/workpack validators, `npm test`, `npm run build`, forbidden-path status check.
- Manual smoke: new/select conversation, send/stream/abort/retry, presets, export, compare handoff, message copy/delete/regenerate.

## WP-UI-011D Judge Studio Layout Recomposition

- Trigger evidence: `03-judge-evaluation-studio.current.png` still prioritizes old mode/saved-run layout rather than target working studio.
- Target screens: Evaluation Studio and CompareView.
- Owner files: `EvaluationStudioView.tsx`, `CompareView.tsx`, `global.css`.
- Allowed files: Judge view owner files plus initiative/workpack docs.
- Forbidden files: Judge runtime/store/storage/export contracts, package/config files.
- Expected change type: visual/layout recomposition that preserves run/save/open/delete/export behavior.
- Verification: initiative/workpack validators, `npm test`, `npm run build`, forbidden-path status check.
- Manual smoke: manual start, run judge, JSON contract checks, score table, save/open/delete runs, export MD/JSON.

## WP-UI-011E Settings/Form Follow-up

- Trigger evidence: Form Profiles is close but needs polish; Form Runner remains a NO-GO against target composition.
- Target screens: Form Profiles and Form Runner.
- Owner files: `FormProfilesManager.tsx`, `FormEditor.tsx`, `FormRunView.tsx`, `global.css`.
- Allowed files: form view owner files plus initiative/workpack docs.
- Forbidden files: form schema, render utilities, IPC/preload/main/shared, stores, package/config files.
- Expected change type: targeted layout cleanup, density/readability fixes, response inspector alignment.
- Verification: initiative/workpack validators, `npm test`, `npm run build`, forbidden-path status check.
- Manual smoke: profile CRUD/test/open-run, dirty/delete confirmations, generated fields, preview redaction, sync/stream/abort/copy.

## WP-UI-011F Remaining Surfaces Polish

- Trigger evidence: Prompt Templates and Media Presets screenshots show empty states instead of target populated/editor surfaces; History screenshot is missing.
- Target screens: Prompt Templates, Media Presets, History Hub, Component States Board evidence.
- Owner files: `TemplatesManager.tsx`, `InsertPromptDialog.tsx`, `PresetsGallery.tsx`, `ApplyPresetDialog.tsx`, `HistoryView.tsx`, shared dialog files if needed, `global.css`.
- Allowed files: specific owner files chosen by sub-workpack PLAN plus initiative/workpack docs.
- Forbidden files: storage schemas, shared types/utils, IPC/main/preload, stores, package/config files.
- Expected change type: split if needed into Prompt Templates, Media Presets, History, and shared states; use representative data screenshots.
- Verification: initiative/workpack validators, `npm test`, `npm run build`, forbidden-path status check.
- Manual smoke: template CRUD/import/export/variable hints, preset CRUD/import/export/apply warnings, history search/ingest/open-source/continue-chat.
