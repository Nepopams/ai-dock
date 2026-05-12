# AI Dock UI v2 Implementation Notes

These notes map Pencil UI v2 frames to the current React renderer. They are a docs-only handoff inventory and do not authorize runtime APPLY.

## Global implementation guidance
- Apply UI v2 through bounded workpacks, not a single shell-wide rewrite.
- Start with `WP-UI-002 Global Design Tokens and UI Primitives`.
- Map tokens into existing `global.css` variables/classes before view restyles.
- Do not add UI libraries or dependencies.
- Do not change IPC, preload, main-process handlers, storage formats, or package metadata for visual restyles.
- Use PNG exports and Markdown specs for implementation. Do not implement directly from `.pen` parsing.

## Main Dock Shell
| Item | Notes |
| --- | --- |
| Pencil frame | `Main Dock Shell` |
| Current files | `src/renderer/react/App.tsx`, `src/renderer/react/components/Sidebar.tsx`, `src/renderer/react/components/TabStrip.tsx`, `src/renderer/react/components/PromptRouter.tsx`, `src/renderer/react/components/PromptDrawer.tsx`, `src/renderer/react/components/Toast.tsx`, `src/renderer/react/styles/global.css` |
| Target visual changes | Tokenized shell background, 72px dock rail polish, 44px tab strip polish, prompt router density, drawer/modal layering, toast state styling, selected/local view affordances. |
| Out of scope | BrowserView lifecycle, tab management internals, new IPC, route model changes, prompt router behavior changes. |
| Smoke checks | Sidebar local views still switch; web client tabs still switch/close; prompt router insert/broadcast controls still work; prompt drawer opens/closes; toast appears and dismisses. |

## Local Chat
| Item | Notes |
| --- | --- |
| Pencil frame | `Local Chat` |
| Current files | `src/renderer/react/views/ChatView.tsx`, `src/renderer/react/components/chat/MessageList.tsx`, `src/renderer/react/components/chat/ConversationList.tsx`, `src/renderer/react/components/CompareButton.tsx`, `src/renderer/react/styles/global.css` |
| Target visual changes | Chat layout density, conversation sidebar states, message bubbles, composer, response preset panel, provider/model/status chips, streaming/error/retry/abort visuals. |
| Out of scope | Chat provider behavior, streaming protocol, retry/abort logic, completions profile storage, export behavior. |
| Smoke checks | Start conversation; send message; streaming status renders; abort remains available while busy; retry appears for retryable errors; export remains disabled/enabled correctly. |

## Judge Evaluation Studio
| Item | Notes |
| --- | --- |
| Pencil frame | `Judge Evaluation Studio` |
| Current files | `src/renderer/react/views/EvaluationStudioView.tsx`, `src/renderer/react/views/CompareView.tsx`, `src/renderer/store/judgeSlice.ts`, `src/renderer/react/store/useDockStore.ts`, `src/renderer/react/views/evaluation/scoreCriteria.ts`, `src/renderer/react/styles/global.css` |
| Target visual changes | Studio header density, mode/status cards, saved evaluations list, manual start form, comparison inputs/results tables, JSON contract findings, save/export controls. |
| Out of scope | Judge IPC contracts, result schema changes, saved run storage format, new evaluation modes, n8n integration, LLM provider changes. |
| Smoke checks | Judge route opens; manual comparison starts; saved evaluations refresh/open/delete states remain visible; run judge, JSON validation, save, export, and back-to-chat still work. |

## Connections
| Item | Notes |
| --- | --- |
| Pencil frame | `Connections` |
| Current files | `src/renderer/react/views/ConnectionsSettings.tsx`, `src/renderer/react/views/CompletionsSettings.tsx`, `src/renderer/react/views/settings/ClientsAndCategories.tsx`, `src/renderer/react/views/settings/AdapterOverrides.tsx`, `src/renderer/react/styles/global.css` |
| Target visual changes | Tab treatment, settings panel hierarchy, profile cards/forms, registry tables, adapter override states, validation/error surfaces. |
| Out of scope | Provider profile schema, registry contracts, adapter resolution logic, secret/token handling, preload APIs. |
| Smoke checks | Switch each Connections tab; load completion profiles; registry list renders; adapter overrides render; save/test controls remain reachable. |

## Form Profiles
| Item | Notes |
| --- | --- |
| Pencil frame | `Form Profiles` |
| Current files | `src/renderer/react/views/forms/FormProfilesManager.tsx`, `src/renderer/react/views/forms/FormEditor.tsx`, `src/renderer/react/store/useDockStore.ts`, `src/renderer/react/styles/global.css` |
| Target visual changes | Profile list density, editor grouping, validation summary, dirty state, test result panel, destructive confirm states. |
| Out of scope | Form profile schema, validation rules, persistence, test endpoint behavior, profile duplication/delete semantics. |
| Smoke checks | Fetch profiles; create draft; dirty-state confirm works; validation issues display; test profile; save/cancel; open Form Runner. |

## Form Runner
| Item | Notes |
| --- | --- |
| Pencil frame | `Form Runner` |
| Current files | `src/renderer/react/views/forms/FormRunView.tsx`, `src/renderer/react/store/useDockStore.ts`, `src/renderer/react/styles/global.css` |
| Target visual changes | Parameter panel, request preview cards, stream output, last response/error panels, timeout controls, copy actions. |
| Out of scope | HTTP execution, streaming event protocol, timeout semantics, redaction rules, form render utilities. |
| Smoke checks | Select profile; edit fields; preview updates with redacted secrets; run sync request; stream/abort when enabled; copy preview/body still works. |

## Prompt Templates
| Item | Notes |
| --- | --- |
| Pencil frame | `Prompt Templates` |
| Current files | `src/renderer/react/views/prompts/TemplatesManager.tsx`, `src/renderer/react/views/prompts/InsertPromptDialog.tsx`, `src/renderer/react/styles/global.css` |
| Target visual changes | Search/filter row, table density, tag chips, editor modal, variable hints, import/export actions, empty/loading/error states. |
| Out of scope | Template storage, import/export semantics, variable extraction/rendering, prompt insertion behavior. |
| Smoke checks | Load templates; search and tag filter; create/edit/delete/duplicate; variable hints render; import/export actions still call existing APIs. |

## Media Presets
| Item | Notes |
| --- | --- |
| Pencil frame | `Media Presets` |
| Current files | `src/renderer/react/views/presets/PresetsGallery.tsx`, `src/renderer/react/components/ApplyPresetDialog.tsx`, `src/renderer/react/styles/global.css` |
| Target visual changes | Preset toolbar, grid/card density, kind and tag chips, editor modal, apply dialog, import conflict dialog, adapter warning states. |
| Out of scope | Media preset schema, adapter resolution, applying presets to tabs, import/export behavior. |
| Smoke checks | Fetch presets; filter by kind/tag/search; create/edit/delete/duplicate; apply dialog selection works; import/export controls still call APIs. |

## History Hub
| Item | Notes |
| --- | --- |
| Pencil frame | `History Hub` |
| Current files | `src/renderer/react/views/history/HistoryView.tsx`, `src/renderer/react/store/useDockStore.ts`, `src/renderer/react/styles/global.css` |
| Target visual changes | Search/filter sidebar, thread list, message cards, ingest panel, source-open actions, search result panel, loading/error/empty states. |
| Out of scope | History storage schema, search contracts, ingestion adapters, open-in-source bridge behavior, cross-history features. |
| Smoke checks | Load threads; search/reset; open thread; ingest compatible tab; open message in source; continue in chat; create thread. |

## Component States Board
| Item | Notes |
| --- | --- |
| Pencil frame | `Component States Board` |
| Current files | `src/renderer/react/styles/global.css`, shared component callsites in `src/renderer/react/components/**` and `src/renderer/react/views/**` |
| Target visual changes | Tokenized buttons, inputs, cards, tables, chips, tabs, modal overlays, focus, hover, selected, disabled, loading, empty, warning, and error states. |
| Out of scope | New component library, broad React rewrite, dependency changes, unrelated UX copy edits. |
| Smoke checks | Keyboard focus visible; disabled controls do not look clickable; error/warning/ready chips are distinct; tables remain readable; modal overlays maintain z-index above shell. |

## Current implementation risks to plan around
- `global.css` is large and mixes shell, chat, judge, history, presets, modals, and component states.
- Several form screens use Tailwind-like utility class strings directly in JSX, so token adoption must be scoped and verified by screen.
- Existing components use many pill-shaped controls; UI v2 should normalize them only where the design calls for it.
- Judge/Evaluation Studio has runtime-sensitive history/export flows. Visual restyle must not alter payloads, storage, or bridge behavior.
