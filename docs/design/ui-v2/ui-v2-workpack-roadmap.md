# AI Dock UI v2 Workpack Roadmap

This roadmap decomposes UI v2 implementation into bounded workpacks. `WP-UI-001` completed the handoff inventory, `WP-UI-002` established the runtime token/primitives foundation, and `WP-UI-003` applies the shared shell restyle. Remaining runtime workpacks require separate PLAN, Human Gate, APPLY, and REVIEW.

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
| Goal | Apply UI v2 to Local Chat while preserving streaming, abort, retry, export, presets, and compare handoff. |
| Affected files | `ChatView.tsx`, `MessageList.tsx`, `ConversationList.tsx`, `CompareButton.tsx`, `global.css`. |
| Forbidden files | Chat provider/main/preload/shared contracts, package/config/build/scripts files, unrelated views. |
| Verification | Existing chat tests/build where available; targeted smoke for send/abort/retry/export; `git diff --check`. |
| Manual smoke | New conversation; send message; streaming status; abort; retryable error state; export; Compare button opens Judge. |
| Risks | Visual changes can hide busy/error states; mitigate with explicit status token mapping and disabled-state checks. |

## WP-UI-005 Evaluation Studio Restyle
| Field | Detail |
| --- | --- |
| Goal | Apply UI v2 to Evaluation Studio, CompareView, saved runs, result tables, validation findings, and judge controls. |
| Affected files | `EvaluationStudioView.tsx`, `CompareView.tsx`, `src/renderer/react/views/evaluation/**`, `global.css`; store files only if PLAN proves no visual alternative. |
| Forbidden files | Judge IPC/shared/main/preload contracts, EvaluationRun storage format, package/config/build/scripts files. |
| Verification | Judge/Evaluation tests/build where available; manual smoke; forbidden-path status check. |
| Manual smoke | Manual comparison start; run Judge; JSON contract mode; save/open/delete saved run; export MD/JSON; back to Chat. |
| Risks | Visual restyle may accidentally touch data-sensitive history/export flows; mitigate by limiting changes to renderer presentation. |

## WP-UI-006 Connections/Form Profiles Restyle
| Field | Detail |
| --- | --- |
| Goal | Apply UI v2 to Connections and Form Profiles settings surfaces with consistent forms, tabs, validation, dirty, confirm, and test states. |
| Affected files | `ConnectionsSettings.tsx`, `CompletionsSettings.tsx`, `views/settings/**`, `FormProfilesManager.tsx`, `FormEditor.tsx`, `ConfirmDialog.tsx`, `global.css`. |
| Forbidden files | Provider/profile storage contracts, registry contracts, main/preload/shared IPC, package/config/build/scripts files. |
| Verification | Build/test commands from workpack; focused smoke for settings tabs and form profile CRUD/test. |
| Manual smoke | Connections tabs switch; profiles load/save/test; registry/adapters render; form profile create/duplicate/delete/save/cancel/test/open runner. |
| Risks | Utility-class screens may need scoped styling decisions; mitigate by keeping visual-only changes and avoiding schema/persistence edits. |

## WP-UI-007 Remaining Views Restyle
| Field | Detail |
| --- | --- |
| Goal | Apply UI v2 to Form Runner, Prompt Templates, Media Presets, History Hub, and remaining component states not covered earlier. |
| Affected files | `FormRunView.tsx`, `TemplatesManager.tsx`, `InsertPromptDialog.tsx`, `PresetsGallery.tsx`, `ApplyPresetDialog.tsx`, `HistoryView.tsx`, `global.css`. |
| Forbidden files | History storage/search/ingest contracts, form runner IPC/contracts, media preset schema/adapters, prompt template storage, package/config/build/scripts files. |
| Verification | Build/test commands from workpack; view-by-view smoke; forbidden-path status check. |
| Manual smoke | Form run sync/stream/abort/copy; prompt template CRUD/import/export; media preset CRUD/apply/import/export; history search/open/ingest/continue. |
| Risks | Bundling too many views can still be large; PLAN may split WP-UI-007 into 7A/7B/7C if PNG complexity or diff size is high. |

## Dependency order
1. `WP-UI-001` must complete before runtime UI work.
2. `WP-UI-002` must run before shell or view restyles.
3. `WP-UI-003` should run before view restyles because shell dimensions and top inset affect every screen.
4. `WP-UI-004` and `WP-UI-005` can follow the shell work in either order.
5. `WP-UI-006` should precede `WP-UI-007` if form/control primitives need hardening.

## Next recommended runtime workpack
`WP-UI-004 Chat View Restyle` is the next runtime workpack after the `WP-UI-003` shell restyle.
