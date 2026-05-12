# Orchestration Plan: IN-UI-001 AI Dock UI v2 Design Handoff Inventory

## Initiative summary
This L2 docs/design/planning initiative prepares a design handoff inventory for applying Pencil UI v2 to AI Dock. It creates design docs, initiative run-state, a bounded planning workpack, prompt-pack, and a future UI workpack roadmap. Runtime APPLY is explicitly forbidden.

## Assumptions
- Safe assumption: `ai-dock.pen` may be stored in `docs/design/ui-v2/source/` or kept externally if binary size is too large.
- Safe assumption: runtime implementation should use PNG exports and Markdown specs instead of `.pen` parsing.
- Safe assumption: the design handoff pack should use stable filenames for PNG exports to make future workpacks deterministic.
- Safe assumption: `WP-UI-002 Global Design Tokens and UI Primitives` is the next runtime workpack after this inventory.
- Blocking assumption for future work: any runtime UI v2 APPLY requires a separate approved runtime workpack and Human Gate.

## Selected delivery mode
Docs-only / design-planning APPLY under L2 autonomy. No runtime files, package files, config files, scripts, or dependencies may change.

## Epic breakdown
| Epic ID | Title | Scope | Risk profile | Success criteria |
| --- | --- | --- | --- | --- |
| E1 | Handoff inventory | Source/export rules, token inventory, screen map, implementation notes | Low, docs-only | Handoff docs exist and are linked |
| E2 | Token foundation | Future mapping of tokens into `global.css` | Medium, global CSS runtime risk later | Scoped as `WP-UI-002` |
| E3 | Shell restyle | Future shell components and app chrome | Medium, BrowserView/top-inset risk later | Scoped as `WP-UI-003` |
| E4 | Chat restyle | Future Chat view visuals | Medium, streaming/abort visibility risk later | Scoped as `WP-UI-004` |
| E5 | Evaluation Studio restyle | Future Judge/Evaluation Studio visuals | Medium, history/export sensitive flows later | Scoped as `WP-UI-005` |
| E6 | Settings/forms restyle | Future Connections and Form Profiles visuals | Medium, form validation/dirty state risk later | Scoped as `WP-UI-006` |
| E7 | Remaining views | Future Form Runner, Prompt Templates, Media Presets, History Hub visuals | Medium, may require splitting | Scoped as `WP-UI-007` |

## Sprint mapping
| Sprint / slice | Workpack candidates | Dependencies | Exit criteria |
| --- | --- | --- | --- |
| Planning closeout | `WP-UI-001` | None | Design handoff docs, initiative artifacts, validators pass |
| Runtime token foundation | `WP-UI-002` | Human review of UI v2 handoff and PNG exports | Tokens and shared state primitives mapped |
| Shell baseline | `WP-UI-003` | `WP-UI-002` | Shell visuals updated without BrowserView/top-inset regression |
| Primary workflows | `WP-UI-004`, `WP-UI-005` | `WP-UI-003` | Chat and Evaluation Studio restyled with smoke checks |
| Settings/forms | `WP-UI-006` | `WP-UI-002`, ideally `WP-UI-003` | Connections and Form Profiles restyled |
| Remaining local views | `WP-UI-007` | Prior token/shell work; may split if large | Form Runner, Prompt Templates, Media Presets, History Hub restyled |

## Workpack queue
| Workpack ID | Type | Purpose | Dependency | Expected status |
| --- | --- | --- | --- | --- |
| `WP-UI-001-design-handoff-inventory` | docs/design/planning | Create handoff inventory and roadmap | None | Done |
| `WP-UI-002 Global Design Tokens and UI Primitives` | runtime renderer CSS | Map UI v2 tokens to existing CSS/state primitives | Human Gate after this initiative | Proposed |
| `WP-UI-003 Shell Restyle` | runtime renderer UI | Restyle Sidebar, TabStrip, PromptRouter, PromptDrawer, Toast, App chrome | `WP-UI-002` | Proposed |
| `WP-UI-004 Chat View Restyle` | runtime renderer UI | Restyle Local Chat without behavior changes | `WP-UI-003` | Proposed |
| `WP-UI-005 Evaluation Studio Restyle` | runtime renderer UI | Restyle Evaluation Studio and CompareView surfaces | `WP-UI-003` | Proposed |
| `WP-UI-006 Connections/Form Profiles Restyle` | runtime renderer UI | Restyle settings/form-heavy surfaces | `WP-UI-002`, `WP-UI-003` | Proposed |
| `WP-UI-007 Remaining Views Restyle` | runtime renderer UI | Restyle Form Runner, Prompt Templates, Media Presets, History Hub | Prior UI workpacks; may split | Proposed |

## Executor routing
| Workpack ID | Selected executor | Primary skill | Secondary executors | Rationale |
| --- | --- | --- | --- | --- |
| `WP-UI-001` | `ai-dock-initiative-runner` | `ai-dock-initiative-runner` | none | Docs/design/planning only. |
| `WP-UI-002` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `test-qa-implementer` | Token and global UI primitive mapping is renderer/CSS dominant. |
| `WP-UI-003` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `test-qa-implementer` | Shell visuals are renderer components plus CSS. |
| `WP-UI-004` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `chat-completions-implementer`, `test-qa-implementer` if behavior risk appears | Chat visuals must preserve streaming/abort/retry flows. |
| `WP-UI-005` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `state-store-implementer`, `history-exporter-implementer`, `test-qa-implementer` only if PLAN requires coordination | Judge visuals must avoid data/history/contract changes. |
| `WP-UI-006` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `test-qa-implementer` | Connections/Form Profiles are renderer settings and form surfaces. |
| `WP-UI-007` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `history-exporter-implementer`, `test-qa-implementer` if History risk appears | Remaining local views are renderer-dominant but include sensitive history/form flows. |

## Gate plan
- Gate A Scope: passed by user-provided L2 docs/design/planning scope and explicit allowed/forbidden files.
- Gate B Plan: passed autonomously because no strong human gate is active for docs-only APPLY.
- Gate C Apply: verify diff stays inside allowed docs/index paths.
- Gate D Review: verify handoff docs exist, validators pass, no runtime/package/config files changed, delivery report records no runtime APPLY.
- Strong gate: none active for this initiative. Future runtime work starts at `WP-UI-002` and requires Human Gate.

## Verification strategy
- Run initiative validator.
- Run workpack validator.
- Run `git status --short`.
- Run `git diff --stat`.
- Run `git diff --check`.
- Run forbidden runtime/package/config status check:
  - `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
- Runtime tests/build are not required here because no runtime files are changed.

## Risk register
| Risk | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Full UI v2 applied as a giant runtime refactor | High | Decompose into `WP-UI-002` through `WP-UI-007` | Human + Codex | Mitigated in roadmap |
| Missing PNG exports block implementation | Medium | Required export names documented | Human | Open for future runtime work |
| `.pen` parsing becomes hidden source of truth | Medium | Source README requires PNG + Markdown specs | Codex | Mitigated |
| Global CSS token work causes cross-screen regression | High | `WP-UI-002` must verify shared states before view restyles | Future renderer executor | Open |
| Runtime scope drift during docs initiative | Medium | Forbidden-path status check and delivery report | Codex | Mitigated |

## PLAN answers
1. The full design cannot be applied in one APPLY because it touches shell, global CSS, multiple local views, Judge, Chat, History, forms, and shared component states. That is a multi-layer runtime change with high regression risk.
2. A design handoff inventory is needed so Codex has PNG exports, tokens, screen mapping, target workpacks, allowed paths, smoke checks, and out-of-scope boundaries before runtime work.
3. `.pen` belongs in `docs/design/ui-v2/source/` or external design storage if binary size is too large. PNG exports belong in `docs/design/ui-v2/exports/`.
4. This initiative creates the six `docs/design/ui-v2/**` files plus initiative artifacts and `WP-UI-001` prompt-pack.
5. Next UI workpacks are `WP-UI-002` through `WP-UI-007`, starting with global tokens and primitives.
6. Allowed and forbidden files are recorded in `initiative.md`, this plan, and the workpack.
7. No strong gate is active for the docs-only APPLY. Future runtime APPLY requires Human Gate.
8. Runtime is verified unchanged with `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`.
