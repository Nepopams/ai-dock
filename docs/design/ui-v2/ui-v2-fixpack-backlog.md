# UI v2 Fixpack Backlog

This backlog is a template. Do not start a runtime fixpack until `visual-gap-matrix.md` has current screenshots and concrete visual gaps.

## WP-UI-009A Shell/Layout Visual Fixpack
| Field | Detail |
| --- | --- |
| Trigger condition | Shell, BrowserView bounds, Sidebar, TabStrip, PromptRouter, PromptDrawer, or Toast is marked NO-GO or GO with polish. |
| Likely files | `src/renderer/react/App.tsx`, shell components, `src/renderer/react/styles/global.css`. |
| Forbidden files | `src/main/**`, `src/preload/**`, `src/shared/**`, package/config/scripts, store files, unrelated local views. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Shell navigation, BrowserView bounds, prompt router insert/send/broadcast, drawer, toast, focus states. |
| Acceptable changes | Tokenized spacing/color/radius fixes, clipped-control fixes, z-index/focus polish inside shell scope. |
| Forbidden scope creep | BrowserView lifecycle changes, IPC changes, tab data model changes, new dependencies. |

## WP-UI-009B Chat/Evaluation Visual Fixpack
| Field | Detail |
| --- | --- |
| Trigger condition | Chat or Evaluation Studio is marked NO-GO or GO with polish. |
| Likely files | `ChatView.tsx`, chat components, `EvaluationStudioView.tsx`, `CompareView.tsx`, `global.css`. |
| Forbidden files | Chat provider logic, Judge pipeline/storage/export contracts, main/preload/shared, package/config/scripts. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Chat send/stream/abort/retry/export/compare; Judge manual start/run/save/open/delete/export. |
| Acceptable changes | Message/card/table/readability/focus polish, layout clipping fixes, status chip clarity. |
| Forbidden scope creep | Streaming changes, judge result schema changes, EvaluationRun storage changes. |

## WP-UI-009C Settings/Form Visual Fixpack
| Field | Detail |
| --- | --- |
| Trigger condition | Connections, Form Profiles, or Form Runner is marked NO-GO or GO with polish. |
| Likely files | Connections/settings/form view files and `global.css`. |
| Forbidden files | Provider/profile/form schemas, registry contracts, form render utilities, main/preload/shared, package/config/scripts. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Profile load/save/test, registry/adapters, form CRUD/test/open-run, redaction, sync/stream/abort/copy. |
| Acceptable changes | Form density, validation/error readability, modal/list/table polish, tokenized control states. |
| Forbidden scope creep | Schema migrations, token/auth handling changes, form execution behavior changes. |

## WP-UI-009D Prompts/Presets/History Visual Fixpack
| Field | Detail |
| --- | --- |
| Trigger condition | Prompt Templates, Media Presets, or History Hub is marked NO-GO or GO with polish. |
| Likely files | Prompt/preset/history view files, dialog components in scope, `global.css`. |
| Forbidden files | Template/preset/history storage, adapter resolution, ingest/search contracts, main/preload/shared, package/config/scripts. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Template CRUD/import/export/insert; preset CRUD/import/export/apply; history search/ingest/open-source/continue-chat. |
| Acceptable changes | Card/list/dialog/search/result readability fixes and scoped visual polish. |
| Forbidden scope creep | Import/export semantics, apply behavior, search semantics, history storage changes. |

## WP-UI-009E Design Token Polish
| Field | Detail |
| --- | --- |
| Trigger condition | Multiple screens show the same color, typography, radius, focus, or spacing mismatch that is best solved at token level. |
| Likely files | `src/renderer/react/styles/global.css`, docs token notes. |
| Forbidden files | React component behavior, main/preload/shared, package/config/scripts, storage/store files. |
| Validation commands | Initiative/workpack validators, `npm test`, `npm run build`, `git diff --check`, forbidden-path status check. |
| Manual smoke focus | Cross-view readability, focus, disabled, empty/loading/error states, modal layering. |
| Acceptable changes | Adjusting `--aid-*` variables or primitive class polish based on screenshot evidence. |
| Forbidden scope creep | Broad selector rewrites, adding a UI library, changing view layouts without screen-specific workpack evidence. |
