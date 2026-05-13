# AI Dock UI v2 Workpack Roadmap

This roadmap decomposes UI v2 implementation into bounded workpacks. `WP-UI-001` completed the handoff inventory, `WP-UI-002` established the runtime token/primitives foundation, `WP-UI-003` applied the shared shell restyle, `WP-UI-004` applied the Local Chat restyle, `WP-UI-005` applied the Evaluation Studio restyle, `WP-UI-006` applied the Connections/Form Profiles restyle, `WP-UI-007A` applied the Form Runner restyle, `WP-UI-007B` applied the Prompt Templates / Media Presets restyle, and `WP-UI-007C` applied the History Hub restyle. `IN-UI-008` added the visual acceptance layer, `IN-UI-009` covered Component States / Shared Dialogs, and `IN-UI-010` performed screenshot-based visual gap triage before any further runtime UI fixpacks.

## WP-UI-001 Design Handoff Inventory
| Field | Detail |
| --- | --- |
| Goal | Create the UI v2 handoff pack, source/export rules, token inventory, screen map, implementation notes, and future workpack queue. |
| Affected files | `docs/design/ui-v2/**`, `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/**`, `docs/planning/workpacks/WP-UI-001-design-handoff-inventory/**`, optional index links. |
| Forbidden files | `src/**`, package/config/build/scripts/runtime files. |
| Verification | Initiative validator, workpack validator, `git diff --check`, forbidden-path status check. |
| Manual smoke | Not applicable. Docs-only. |
| Risks | Missing real PNG exports can block later work; mitigate by recording required filenames and source rules. |

## WP-UI-002 Global Design Tokens and UI Primitives
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-002-global-design-tokens-primitives`; screen adoption remains deferred. |
| Goal | Map UI v2 tokens to existing `global.css` variables/classes and define stable shared states for buttons, inputs, cards, tables, chips, tabs, modals, focus, disabled, loading, empty, warning, and error. |
| Affected files | `src/renderer/react/styles/global.css`; limited shared component class callsites only if PLAN proves necessary. |
| Forbidden files | `package.json`, `package-lock.json`, `src/main/**`, `src/preload/**`, `src/shared/**`, `scripts/**`, build/release outputs, unrelated views. |
| Verification | Type/build or targeted CSS smoke as defined by workpack; `git diff --check`; forbidden-path status check. |
| Manual smoke | Launch app; inspect shell, buttons, inputs, modals, focus states, empty/error/loading states across at least Chat, Connections, Judge, History. |
| Risks | Global CSS regressions across all views; mitigate by token-first mapping and no broad selectors without screenshots/smoke. |

## WP-UI-003 Shell Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-003-shell-restyle`; local view content restyles remain deferred. |
| Goal | Apply UI v2 shell visuals to Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast, and app chrome. |
| Affected files | `App.tsx`, `Sidebar.tsx`, `TabStrip.tsx`, `PromptRouter.tsx`, `PromptDrawer.tsx`, `Toast.tsx`, `global.css`. |
| Forbidden files | `src/main/**`, `src/preload/**`, `src/shared/**`, package/config/build/scripts files, view-specific business logic. |
| Verification | Build/test commands from workpack; forbidden-path status check; no new IPC/dependencies. |
| Manual smoke | Sidebar local views; web tab switch/close; prompt insert/broadcast; drawer open/close; toast visibility; BrowserView bounds still correct. |
| Risks | Shell CSS can affect BrowserView bounds and local view top inset; mitigate with explicit rail/tabstrip dimensions and visual smoke. |

## WP-UI-004 Chat View Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-004-chat-view-restyle`; Chat runtime behavior remains unchanged and manual Electron smoke remains required. |
| Goal | Apply UI v2 to Local Chat while preserving streaming, abort, retry, export, presets, and compare handoff. |
| Affected files | `ChatView.tsx`, `MessageList.tsx`, `ConversationList.tsx`, `CompareButton.tsx`, `global.css`. |
| Forbidden files | Chat provider/main/preload/shared contracts, package/config/build/scripts files, unrelated views. |
| Verification | Existing chat tests/build where available; targeted smoke for send/abort/retry/export; `git diff --check`. |
| Manual smoke | New conversation; send message; streaming status; abort; retryable error state; export; Compare button opens Judge. |
| Risks | Visual changes can hide busy/error states; mitigate with explicit status token mapping and disabled-state checks. |

## WP-UI-005 Evaluation Studio Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-005-evaluation-studio-restyle`; Judge runtime, EvaluationRun storage, and export behavior remain unchanged. |
| Goal | Apply UI v2 to Evaluation Studio, CompareView, saved runs, result tables, validation findings, and judge controls. |
| Affected files | `EvaluationStudioView.tsx`, `CompareView.tsx`, `src/renderer/react/views/evaluation/**`, `global.css`; store files only if PLAN proves no visual alternative. |
| Forbidden files | Judge IPC/shared/main/preload contracts, EvaluationRun storage format, package/config/build/scripts files. |
| Verification | Judge/Evaluation tests/build where available; manual smoke; forbidden-path status check. |
| Manual smoke | Manual comparison start; run Judge; JSON contract mode; save/open/delete saved run; export MD/JSON; back to Chat. |
| Risks | Visual restyle may accidentally touch data-sensitive history/export flows; mitigate by limiting changes to renderer presentation. |

## WP-UI-006 Connections/Form Profiles Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-006-connections-form-profiles-restyle`; provider/profile/form/registry behavior remains unchanged. |
| Goal | Apply UI v2 to Connections and Form Profiles settings surfaces with consistent forms, tabs, validation, dirty, confirm, and test states. |
| Affected files | `ConnectionsSettings.tsx`, `CompletionsSettings.tsx`, `views/settings/**`, `FormProfilesManager.tsx`, `FormEditor.tsx`, `ConfirmDialog.tsx`, `global.css`. |
| Forbidden files | Provider/profile storage contracts, registry contracts, main/preload/shared IPC, package/config/build/scripts files. |
| Verification | Build/test commands from workpack; focused smoke for settings tabs and form profile CRUD/test. |
| Manual smoke | Connections tabs switch; profiles load/save/test; registry/adapters render; form profile create/duplicate/delete/save/cancel/test/open runner. |
| Risks | Utility-class screens may need scoped styling decisions; mitigate by keeping visual-only changes and avoiding schema/persistence edits. |

## WP-UI-007A Form Runner Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-007A-form-runner-restyle`; form execution behavior, redaction, sync/stream/abort/copy, and navigation remain unchanged. |
| Goal | Apply UI v2 to Form Runner as the direct follow-up to Form Profiles. |
| Affected files | `FormRunView.tsx`, `global.css`. |
| Forbidden files | Form runner IPC/contracts, shared form render utilities, form profile schema, stores, package/config/build/scripts files, unrelated views. |
| Verification | Build/test commands from workpack; Form Runner smoke; forbidden-path status check. |
| Manual smoke | Form run profile selection; generated fields; validation; request preview redaction; sync run; stream run; abort; copy preview/response; Back to Form Profiles. |
| Risks | Manual Electron smoke is still required; canonical export name is absent and numeric `6.png` was used. |

## WP-UI-007B Prompt Templates / Media Presets Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-007B-prompts-presets-restyle`; template/preset CRUD, import/export, adapter warnings, and apply behavior remain unchanged. |
| Goal | Apply UI v2 to Prompt Templates and Media Presets without changing prompt template storage, preset schema, import/export, or apply behavior. |
| Affected files | `TemplatesManager.tsx`, prompt dialog components if scoped by PLAN, `PresetsGallery.tsx`, `ApplyPresetDialog.tsx`, `global.css`. |
| Forbidden files | Prompt template storage contracts, media preset schema/adapters, main/preload/shared IPC, package/config/build/scripts files. |
| Verification | Build/test commands from workpack; prompt template CRUD/import/export smoke; media preset CRUD/apply/import/export smoke; forbidden-path status check. |
| Manual smoke | Prompt template create/edit/delete/insert/import/export; media preset create/edit/delete/apply/import/export; shell and previous UI v2 views still open. |
| Risks | Prompt and media preset flows are storage-heavy; mitigate by keeping changes visual-only and scoped to renderer view/components. |

## WP-UI-007C History Hub Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-007C-history-hub-restyle`; history storage/search/ingest/open-source/continue-chat behavior remains unchanged. |
| Goal | Apply UI v2 to History Hub without changing history storage/search/ingest/export or continue flows. |
| Affected files | `HistoryView.tsx`, scoped history components if present, `global.css`. |
| Forbidden files | History storage/search/ingest contracts, exporters, IPC/main/preload/shared, package/config/build/scripts files. |
| Verification | Build/test commands from workpack; history search/open/ingest/export/continue smoke; forbidden-path status check. |
| Manual smoke | History list/search/filter; open item; source metadata; continue in Chat; export/copy if available; previous UI v2 views still open. |
| Risks | History Hub touches data-sensitive summaries; mitigate by visual-only renderer changes and no history schema changes. |

## IN-UI-008 Visual Acceptance and Fixpack Plan
| Field | Detail |
| --- | --- |
| Status | Acceptance pack prepared; manual screenshots and gap matrix remain required. |
| Goal | Canonicalize design exports, define current screenshot capture, create visual gap matrix, final smoke checklist, and scoped WP-UI-009 fixpack backlog. |
| Affected files | `docs/design/ui-v2/exports/**`, `docs/design/ui-v2/current-screenshots/**`, visual acceptance docs, roadmap/screen-map/index links, initiative/workpack artifacts. |
| Forbidden files | `src/**`, package/config/build/scripts files, runtime CSS/React, dependencies, screenshot automation tooling. |
| Verification | Initiative validator, workpack validator, `git diff --check`, forbidden-path status check. |
| Manual smoke | Capture current screenshots and fill the visual gap matrix before any WP-UI-009 runtime fixpack starts. |
| Risks | Without screenshots, visual acceptance cannot be claimed even if automated checks pass. |

## IN-UI-009 Component States / Shared Dialogs Restyle
| Field | Detail |
| --- | --- |
| Status | Done by `IN-UI-009-component-states-shared-dialogs`; shared component behavior remains unchanged; manual smoke pending. |
| Goal | Apply UI v2 treatment to Component States Board leftovers: ConfirmDialog, KeyValueEditor, and scoped common empty/loading/error/warning/success/focus/danger states. |
| Affected files | `src/renderer/components/ConfirmDialog.tsx`, `src/renderer/components/KeyValueEditor.tsx`, `src/renderer/react/styles/global.css`, visual acceptance docs, initiative/workpack artifacts. |
| Forbidden files | `src/main/**`, `src/preload/**`, `src/shared/**`, stores, view files, shell components, chat components, adapters, package/config/build/scripts files. |
| Verification | Initiative validator, workpack validator, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke | Trigger Form Profiles confirm dialogs; verify KeyValueEditor add/edit/remove/warning states; confirm Presets/Apply dialogs and Toast remain readable. |
| Risks | Shared CSS can leak if selectors are too broad; mitigate with semantic scoped selectors and no parent screen changes. |

## IN-UI-010 Visual Gap Auto-Triage
| Field | Detail |
| --- | --- |
| Status | Done as docs/design triage; no runtime changes. |
| Goal | Compare canonical design PNGs against current screenshots and code ownership to produce an evidence-backed visual gap matrix, root-cause report, and fixpack sequence. |
| Affected files | `docs/design/ui-v2/visual-gap-matrix.md`, `ui-v2-visual-triage-report.md`, `ui-v2-runtime-root-cause.md`, `ui-v2-fixpack-sequence.md`, `ui-v2-fixpack-backlog.md`, roadmap, initiative/workpack artifacts. |
| Forbidden files | `src/**`, package/config/build/scripts files, runtime CSS/React, dependencies. |
| Verification | Initiative validator, workpack validator, `git diff --check`, forbidden-path status check. |
| Manual smoke | Capture missing `09-history-hub.current.png`; recapture Prompts/Presets with representative data before final acceptance. |
| Risks | Triage does not fix UI; it routes bounded runtime fixpacks to actual owner files. |

## Dependency order
1. `WP-UI-001` must complete before runtime UI work.
2. `WP-UI-002` must run before shell or view restyles.
3. `WP-UI-003` should run before view restyles because shell dimensions and top inset affect every screen.
4. `WP-UI-004` and `WP-UI-005` can follow the shell work in either order.
5. `WP-UI-006` should precede `WP-UI-007A` because Form Runner follows Form Profiles.
6. `WP-UI-007B` and `WP-UI-007C` should remain separate to avoid a giant APPLY across remaining views.
7. `IN-UI-009` can run before final visual acceptance because it is cross-cutting component-state polish, not a screen-level gap fixpack.
8. `IN-UI-010` must precede any WP-UI-011 runtime fixpack because it identifies evidence-backed owner files and acceptance blockers.

## Next recommended runtime workpack
After `IN-UI-010`, the first recommended runtime fixpack is `WP-UI-011A Connections Recomposition Fixpack`, followed immediately by `WP-UI-011B Shell / PromptRouter Layout Breakthrough`. The missing `09-history-hub.current.png` should be captured before History-specific acceptance or fixes.
