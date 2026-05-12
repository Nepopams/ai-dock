# Orchestration Plan: IN-2026-025 Judge Evaluation Preset Catalog

## Initiative summary
This L3 scoped shared-data/test initiative adds the first static Evaluation Preset Catalog for Judge Mode. It intentionally does not connect presets to the current Judge runtime, IPC, preload bridge, or UI.

## Assumptions
- Safe assumption: Human approval in the prompt authorizes this bounded `WP-JUDGE-002` APPLY after `WP-JUDGE-001`.
- Safe assumption: The work should be stacked on `workflow/in-2026-024-judge-contract-hardening` because IN-2026-024 is not present on `master`.
- Safe assumption: JSON catalog data can be validated with Node built-ins and local guards.
- Blocking assumption: Any runtime use of the catalog, new IPC, UI picker, dependency, package/config change, or current Judge contract change requires stop-the-line.

## Selected delivery mode
Scoped shared-data/test APPLY. Affected layers are new shared preset data, new shared preset types/guards, tests, and planning docs only.

## Epic breakdown
| Epic ID | Title | Scope | Risk profile | Success criteria |
| --- | --- | --- | --- | --- |
| E1 | PLAN and gates | Create file-backed initiative/workpack artifacts | Low | Workpack validates; no strong gate |
| E2 | Preset model | Add new EvaluationPreset type/guard files | Low/medium | Current Judge types untouched |
| E3 | Catalog data | Add static JSON catalog and README | Low | 10 MVP presets included |
| E4 | Tests | Validate catalog shape and required semantics | Medium | Targeted and full tests pass |
| E5 | Review | Scope and forbidden-path verification | Low | Delivery report complete |

## Sprint mapping
| Sprint / slice | Workpack | Dependencies | Exit criteria |
| --- | --- | --- | --- |
| Current slice | `WP-JUDGE-002-evaluation-preset-catalog` | `WP-JUDGE-001` hardening context | Catalog/tests delivered; no runtime changes |

## Workpack queue
| Workpack ID | Type | Purpose | Dependency | Expected status |
| --- | --- | --- | --- | --- |
| `WP-JUDGE-002-evaluation-preset-catalog` | shared-data/test | Add static preset catalog v1 and validation tests | IN-2026-024 context | In Progress |

## Executor routing
| Workpack ID | Selected executor | Primary skill | Secondary executors | Rationale |
| --- | --- | --- | --- | --- |
| `WP-JUDGE-002-evaluation-preset-catalog` | `ai-dock-main-process-executor` | `ai-dock-main-process-executor` | `ai-dock-test-qa-executor`, `ai-dock-renderer-react-executor` for future UI readiness review only | User-selected executor; implementation is shared data plus tests and has no runtime consumer |

## Gate plan
- Soft gates: stacked branch selection, static catalog path, JSON format, adding new shared type file.
- Strong gates: any main/preload/renderer/IPC/current Judge type/prompt/package/config/script change; validator runtime; UI integration; dependency addition.
- Gate owner: Human for strong gates; Codex can close soft gates in `gates.md`.
- PLAN conclusion: no strong gate is required for the static catalog/test scope.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack structure.
- Syntax-check `src/shared/types/evaluationPreset.js`.
- Run targeted catalog test.
- Run full `npm test`.
- Run `npm run build`.
- Inspect status/stat/check and forbidden paths.

## Risk register
| Risk | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Static catalog mistaken for active runtime behavior | Medium | README and delivery report explicitly state no runtime consumption | Codex | Planned |
| Catalog data has duplicate ids or invalid validators | Medium | Add targeted tests and guards | Codex | Planned |
| JSON format needs dependency to validate | Low | Use local guards and Node JSON parse only | Codex | Planned |
| Stacked branch includes prior workpack context | Medium | Record branch dependency and merge recommendation | Codex | Logged |
