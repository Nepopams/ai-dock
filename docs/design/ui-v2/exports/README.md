# AI Dock UI v2 PNG Exports

This folder is the expected home for PNG exports from `ai-dock.pen`. Do not create placeholder PNG files. Add real exports only when Human provides or exports them from Pencil.

## Canonicalization status
`IN-UI-008 Visual Acceptance and Fixpack Plan` copied the existing numeric Pencil exports to canonical filenames. Numeric files remain in place for traceability and must not be deleted because earlier UI workpack delivery reports reference them as design evidence.

| Numeric source | Canonical file | Status |
| --- | --- | --- |
| `0.png` | `00-design-system.png` | Copied from numeric export. |
| `1.png` | `01-main-dock-shell.png` | Copied from numeric export. |
| `2.png` | `02-local-chat.png` | Copied from numeric export. |
| `3.png` | `03-judge-evaluation-studio.png` | Copied from numeric export. |
| `4.png` | `04-connections.png` | Copied from numeric export. |
| `5.png` | `05-form-profiles.png` | Copied from numeric export. |
| `6.png` | `06-form-runner.png` | Copied from numeric export. |
| `7.png` | `07-prompt-templates.png` | Copied from numeric export. |
| `8.png` | `08-media-presets.png` | Copied from numeric export. |
| `9.png` | `09-history-hub.png` | Copied from numeric export. |
| `10.png` | `10-component-states-board.png` | Copied from numeric export. |

## Required exports
| File | Pencil frame | Purpose |
| --- | --- | --- |
| `00-design-system.png` | `AI Dock / 00 Design System - Source of Truth` | Source visual reference for tokens, states, and component primitives. |
| `01-main-dock-shell.png` | `Main Dock Shell` | Shell, sidebar, tab strip, prompt router, prompt drawer, toast, and overall app chrome. |
| `02-local-chat.png` | `Local Chat` | Local chat layout, conversations, messages, composer, presets, status, and streaming states. |
| `03-judge-evaluation-studio.png` | `Judge Evaluation Studio` | Judge/Evaluation Studio screen, comparison workspace, saved runs, results, and validator states. |
| `04-connections.png` | `Connections` | Connections settings, profile/registry/adapters tabs, form density, and data entry patterns. |
| `05-form-profiles.png` | `Form Profiles` | Profile manager, profile list, editor, validation, dirty state, and test result surfaces. |
| `06-form-runner.png` | `Form Runner` | Request runner, parameter panel, preview, stream output, response, and error states. |
| `07-prompt-templates.png` | `Prompt Templates` | Prompt template list, tags, editor modal, search/filter, import/export controls. |
| `08-media-presets.png` | `Media Presets` | Preset gallery, preset cards, editor modal, apply dialog, import conflict dialog. |
| `09-history-hub.png` | `History Hub` | History search, thread list, messages, ingest panel, source-open and continue-in-chat actions. |
| `10-component-states-board.png` | `Component States Board` | Buttons, inputs, cards, tables, chips, tabs, empty/loading/error states, focus/hover/disabled states. |

## Export requirements
- Export at consistent scale and preserve the full frame bounds.
- Keep filenames exactly as listed above so future workpacks can reference them deterministically.
- If a frame is revised, replace the matching PNG and note the export date in the runtime workpack PLAN.
- The first runtime workpack, `WP-UI-002 Global Design Tokens and UI Primitives`, must verify that these exports are available or explicitly record any missing exports before APPLY.
