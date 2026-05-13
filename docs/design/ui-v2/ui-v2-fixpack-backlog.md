# UI v2 Fixpack Backlog

This backlog is now evidence-backed by `visual-gap-matrix.md` and `ui-v2-visual-triage-report.md`. Do not start a runtime fixpack from this file alone: each fixpack still needs its own initiative/workpack PLAN, allowed files, forbidden files, verification, and visual acceptance target.

## Priority Summary

| Priority | Fixpack | Why |
| --- | --- | --- |
| P0 | WP-UI-011A Connections Recomposition Fixpack | Clearest owner-file miss: current screen is owned by `CompletionsSettings.tsx`, which IN-UI-006 did not change. |
| P0 | WP-UI-011B Shell / PromptRouter Layout Breakthrough | Shell mismatch affects every screenshot and blocks final visual acceptance. |
| P0 | WP-UI-011C Chat Layout Recomposition | Prior Chat pass was CSS-only and cannot create the target chat composition. |
| P1 | WP-UI-011D Judge Studio Layout Recomposition | Prior Judge pass was CSS-only and target requires working-surface recomposition. |
| P1 | WP-UI-011E Settings/Form Follow-up | Form Profiles is close, but Form Runner remains visually divergent. |
| P1 | WP-UI-011F Remaining Surfaces Polish | Prompt Templates and Media Presets need populated-state proof; History screenshot is missing. |

## WP-UI-011A Connections Recomposition Fixpack

| Field | Detail |
| --- | --- |
| Trigger evidence | `04-connections.current.png` remains the old Completion Profiles editor, unlike `04-connections.png`. |
| Likely files | `src/renderer/react/views/ConnectionsSettings.tsx`, `src/renderer/react/views/CompletionsSettings.tsx`, `src/renderer/react/views/settings/ClientsAndCategories.tsx`, `src/renderer/react/views/settings/AdapterOverrides.tsx`, `src/renderer/react/styles/global.css`. |
| Forbidden files | `src/main/**`, `src/preload/**`, `src/shared/**`, stores, package/config/scripts/build outputs. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Completion profile load/save/test/set-active, token redaction, Generic HTTP config, registry add/edit/delete, adapter override save/reset/health-check. |
| Acceptable changes | React layout recomposition and scoped CSS for model profiles, editor, status cards, and registry preview. |
| Forbidden scope creep | Provider schema changes, token handling changes, registry contract changes, IPC/main/preload changes. |

## WP-UI-011B Shell / PromptRouter Layout Breakthrough

| Field | Detail |
| --- | --- |
| Trigger evidence | `01-main-dock-shell.current.png` lacks the target cockpit shell, router, tab strip, and workspace placeholder composition. |
| Likely files | `src/renderer/react/App.tsx`, `src/renderer/react/components/Sidebar.tsx`, `src/renderer/react/components/TabStrip.tsx`, `src/renderer/react/components/PromptRouter.tsx`, `src/renderer/react/components/PromptDrawer.tsx`, `src/renderer/react/components/Toast.tsx`, `src/renderer/react/styles/global.css`. |
| Forbidden files | BrowserView lifecycle/bounds logic in main/preload/shared, stores, package/config/scripts/build outputs, unrelated local views. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Sidebar navigation, tab create/switch/close, prompt router insert/send/broadcast, drawer/toast, BrowserView bounds. |
| Acceptable changes | Bounded shell markup/layout changes, prompt router visible composition, shell placeholder/status polish. |
| Forbidden scope creep | IPC changes, BrowserView data model changes, new dependencies, local view restyles. |

## WP-UI-011C Chat Layout Recomposition

| Field | Detail |
| --- | --- |
| Trigger evidence | `02-local-chat.current.png` does not match target conversation rail/message/composer/right-rail composition. |
| Likely files | `src/renderer/react/views/ChatView.tsx`, `src/renderer/react/components/chat/ConversationList.tsx`, `src/renderer/react/components/chat/MessageList.tsx`, `src/renderer/react/components/chat/MessageItem.tsx`, `src/renderer/react/components/CompareButton.tsx`, `src/renderer/react/styles/global.css`. |
| Forbidden files | Chat provider logic, stores, main/preload/shared, package/config/scripts/build outputs. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | New/select conversation, send/stream/abort/retry, composer pinned state, message actions, export, compare handoff. |
| Acceptable changes | React layout changes and scoped CSS that preserve existing handlers and chat state contracts. |
| Forbidden scope creep | Streaming protocol changes, completions provider changes, chatSlice shape changes. |

## WP-UI-011D Judge Studio Layout Recomposition

| Field | Detail |
| --- | --- |
| Trigger evidence | `03-judge-evaluation-studio.current.png` still uses the old mode/saved-run first viewport rather than target working studio. |
| Likely files | `src/renderer/react/views/EvaluationStudioView.tsx`, `src/renderer/react/views/CompareView.tsx`, `src/renderer/react/styles/global.css`. |
| Forbidden files | Judge pipeline/storage/export contracts, stores, main/preload/shared, package/config/scripts/build outputs. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Manual start, Run Judge, JSON contract findings, dynamic score table, save/open/delete run, export MD/JSON. |
| Acceptable changes | Visual/layout recomposition of Studio/CompareView while preserving all event handlers and storage/export behavior. |
| Forbidden scope creep | Judge result schema changes, EvaluationRun storage changes, export semantics changes. |

## WP-UI-011E Settings/Form Follow-up

| Field | Detail |
| --- | --- |
| Trigger evidence | `05-form-profiles.current.png` is close but needs polish; `06-form-runner.current.png` remains a composition NO-GO. |
| Likely files | `src/renderer/react/views/forms/FormProfilesManager.tsx`, `src/renderer/react/views/forms/FormEditor.tsx`, `src/renderer/react/views/forms/FormRunView.tsx`, `src/renderer/react/styles/global.css`. |
| Forbidden files | Form schemas, form render utilities, IPC/main/preload/shared, stores, package/config/scripts/build outputs. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Form profile CRUD/test/open-run, dirty/delete confirms, generated fields, redaction, sync/stream/abort/copy. |
| Acceptable changes | Density, clipping, response inspector, validation/error readability, and scoped layout cleanup. |
| Forbidden scope creep | Form execution behavior changes, schema migrations, shared utility rewrites. |

## WP-UI-011F Remaining Surfaces Polish

| Field | Detail |
| --- | --- |
| Trigger evidence | Prompt Templates and Media Presets screenshots are empty-state mismatches; History current screenshot is missing. |
| Likely files | `TemplatesManager.tsx`, `InsertPromptDialog.tsx`, `PresetsGallery.tsx`, `ApplyPresetDialog.tsx`, `HistoryView.tsx`, scoped shared state files if planned, `global.css`. |
| Forbidden files | Template/preset/history storage, adapter resolution, search/ingest contracts, main/preload/shared, stores, package/config/scripts/build outputs. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Template CRUD/import/export/variables, preset CRUD/import/export/apply, history search/ingest/open-source/continue-chat. |
| Acceptable changes | Split runtime fixpacks if the owner set is too broad; require populated screenshots for Prompts/Presets and current screenshot for History. |
| Forbidden scope creep | Import/export behavior changes, preset apply behavior changes, history storage/search semantics changes. |

## Token Polish Follow-Up

Token-level polish should run only after the screen recomposition fixpacks identify repeated visual drift across multiple accepted screenshots. It should be limited to `--aid-*` variables and primitive state classes in `global.css`, with no view behavior changes.
