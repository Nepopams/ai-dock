# Orchestration Plan: IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Initiative summary
This L2 product/architecture planning initiative turns the existing Judge prototype into a target Evaluation Studio architecture. It creates docs-only artifacts, audits the current implementation read-only, decomposes runtime delivery into bounded workpacks, and stops before runtime APPLY.

## Assumptions
- Safe assumption: `ADR-005` is the next available ADR number because `docs/architecture/decisions/**` currently contains ADR-002, ADR-003, and ADR-004 only.
- Safe assumption: initial local LLM support should reuse existing OpenAI-compatible and generic HTTP completion profiles before any dedicated provider profile exists.
- Safe assumption: deterministic validators are planned as separate, explicit result sources rather than hidden LLM prompt instructions.
- Blocking assumption: runtime implementation of new contracts, providers, history storage, or UI requires future approved workpacks and Human Gate.

## Selected delivery mode
Docs-only / architecture planning. Runtime APPLY is forbidden. This initiative may create docs, planning artifacts, ADR draft, and index links only.

## Epic breakdown
| Epic ID | Title | Scope | Risk profile | Success criteria |
| --- | --- | --- | --- | --- |
| E1 | Current Judge snapshot | Read-only audit of pipeline, IPC, contracts, prompts, store, UI, provider, export | Low, read-only | Current limitations are documented |
| E2 | Capability model | Define EvaluationRun and related entities | Medium, future contract impact | Entities and contract direction are documented without code changes |
| E3 | Modes and presets | Define evaluation modes and preset catalog | Medium, product scope | MVP presets and later modes are bounded |
| E4 | Backends | Define API/local/hybrid backend strategy | Medium, provider/security impact later | No provider settings migration is authorized now |
| E5 | UX and flow | Define Evaluation Studio view and CompareView evolution | Medium, renderer impact later | UX model is staged |
| E6 | Delivery decomposition | Split runtime work into small workpacks | High if bundled, mitigated by queue | No giant APPLY; workpacks list affected modules and gates |

## Sprint mapping
| Sprint / slice | Workpack candidates | Dependencies | Exit criteria |
| --- | --- | --- | --- |
| Planning closeout | `WP-IN-2026-023-judge-mode-evaluation-studio-architecture` | None | Report, ADR, initiative docs, validators pass |
| Runtime preflight | `WP-JUDGE-001` | Human approval of this planning output | Contract gaps and minimal hardening plan reviewed |
| Preset foundation | `WP-JUDGE-002`, `WP-JUDGE-003` | `WP-JUDGE-001` | Presets/custom rubric model ready |
| Structured validation | `WP-JUDGE-004` | Preset model | JSON/schema checks separated from LLM verdicts |
| Backend clarity | `WP-JUDGE-005` | Existing profile model reviewed | API/local labels without provider migration |
| Studio UX | `WP-JUDGE-006` | Contract/preset/backend slices | UI shell can run bounded flows |
| Persistence/export | `WP-JUDGE-007` | Contract/result shape settled | History/export strategy gated |
| QA and growth | `WP-JUDGE-008` through `WP-JUDGE-010` | Prior slices | Smoke suite, research mode, n8n preflight |

## Workpack queue
| Workpack ID | Type | Purpose | Dependency | Expected status |
| --- | --- | --- | --- | --- |
| `WP-IN-2026-023-judge-mode-evaluation-studio-architecture` | docs-only | Create architecture report, ADR draft, run-state, prompt-pack | None | Done |
| `WP-JUDGE-001 Current Contract Hardening` | runtime multi-layer, staged | Make current Judge contract safer before expansion | Human Gate after this initiative | Proposed |
| `WP-JUDGE-002 Evaluation Preset Catalog` | docs/data plus shared/preload/main later | Add initial preset catalog | `WP-JUDGE-001` | Proposed |
| `WP-JUDGE-003 Custom Rubric / Custom Judge Prompt` | runtime multi-layer, staged | Support custom prompt/rubric fields safely | `WP-JUDGE-001` and `WP-JUDGE-002` | Proposed |
| `WP-JUDGE-004 JSON / Schema Validator Mode` | runtime multi-layer, staged | Add deterministic JSON validation mode | Preset result model | Proposed |
| `WP-JUDGE-005 Local LLM Backend Labeling and UX` | renderer/settings planning/runtime | Label API/local profile usage | Existing completions profiles | Proposed |
| `WP-JUDGE-006 Evaluation Studio UI Shell` | renderer/store | Create Studio shell and source selection | Core contract/preset slices | Proposed |
| `WP-JUDGE-007 EvaluationRun History and Export` | history/export/main/preload/renderer, staged | Persist/export EvaluationRuns | Result model settled | Proposed |
| `WP-JUDGE-008 Tests and Smoke Suite` | tests/QA | Add coverage and manual smoke | Runtime slices | Proposed |
| `WP-JUDGE-009 Research Comparison Mode` | runtime/UI, staged | Evaluate long research outputs | Studio shell/history support | Proposed |
| `WP-JUDGE-010 n8n EvaluationRun integration preflight` | docs/API planning | Prepare future n8n consumption | EvaluationRun shape stable | Proposed |

## Executor routing
| Workpack ID | Selected executor | Primary skill | Secondary executors | Rationale |
| --- | --- | --- | --- | --- |
| `WP-IN-2026-023-judge-mode-evaluation-studio-architecture` | `ai-dock-initiative-runner` | `ai-dock-initiative-runner` | none | Planning-only artifact creation |
| `WP-JUDGE-001` | `preload-ipc-implementer` | `ai-dock-preload-ipc-executor` | `main-process-implementer`, `state-store-implementer`, `test-qa-implementer` | Contract hardening starts at shared/preload boundary, then main/renderer consumers |
| `WP-JUDGE-002` | `preload-ipc-implementer` or `main-process-implementer` | `ai-dock-preload-ipc-executor` | `renderer-ui-implementer`, `test-qa-implementer` | Presets need contract/data location before UI consumption |
| `WP-JUDGE-003` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `preload-ipc-implementer`, `main-process-implementer` | UX entry plus payload propagation |
| `WP-JUDGE-004` | `main-process-implementer` | `ai-dock-main-process-executor` | `preload-ipc-implementer`, `renderer-ui-implementer`, `test-qa-implementer` | Validators must run in controlled main/shared layers |
| `WP-JUDGE-005` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `chat-completions-implementer` | Mostly labeling/UX around existing profiles |
| `WP-JUDGE-006` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `state-store-implementer`, `test-qa-implementer` | Evaluation Studio shell is UI/store dominant |
| `WP-JUDGE-007` | `history-exporter-implementer` | `ai-dock-history-exporter-executor` | `preload-ipc-implementer`, `renderer-ui-implementer`, `security-hardening-implementer` | History/export touches sensitive persisted data |
| `WP-JUDGE-008` | `test-qa-implementer` | `ai-dock-test-qa-executor` | runtime owners as needed | Coverage and smoke suite |
| `WP-JUDGE-009` | `renderer-ui-implementer` | `ai-dock-renderer-react-executor` | `main-process-implementer`, `history-exporter-implementer` | Research comparison needs source selection and context-size handling |
| `WP-JUDGE-010` | `n8n-integration-implementer` | `ai-dock-n8n-integration-executor` | `preload-ipc-implementer`, `security-hardening-implementer` | Future workflow integration planning |

## Gate plan
- Soft gates: ADR numbering, docs naming, bounded workpack ordering, index link updates.
- Strong human gates: any runtime APPLY, shared contract changes, provider settings changes, history data format changes, package/dependency changes, security boundary changes.
- Gate owner: Human for runtime and data-contract decisions; Codex can close docs-only soft gates.
- Expected decision point: Human reviews this report and chooses whether `WP-JUDGE-001` is approved as the first runtime workpack.

## Verification strategy
- Docs/workflow validation: run initiative validator, workpack validator, `git diff --check`.
- Runtime tests: not run because runtime APPLY is forbidden and no runtime files are changed.
- Smoke/manual QA: checklist is included in the report for later runtime work.
- Commands:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/workpack.md`
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src/main src/renderer src/shared src/preload package.json package-lock.json tsconfig.json vite.config.js scripts`

## Risk register
| Risk | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Contract expansion becomes a giant APPLY | High | Split by shared/preload/main/renderer/history/tests workpacks | Human + Codex | Mitigated in plan |
| Local LLM quality varies | Medium | Explicit backend labels, local-only expectations, hybrid validation | Future implementer | Open |
| JSON validation mixes deterministic and LLM verdicts | Medium | Separate `validators[]` and normalized findings | Future implementer | Open |
| History/export may leak sensitive content | High | Separate gated workpack with privacy controls | `history-exporter-implementer` | Open |
| Dirty `package-lock.json` exists before this initiative | Low for docs scope | Record as pre-existing and avoid edits | Codex | Observed |
