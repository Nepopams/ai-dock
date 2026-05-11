# Orchestration Plan: IN-2026-024 Judge Current Contract Hardening

## Initiative summary
This L3 initiative executes the first scoped Judge runtime workpack after IN-2026-023 planning. It hardens the prototype Judge contract/result/error/progress layer while preserving current answer comparison behavior.

## Assumptions
- Safe assumption: The Human approval in the prompt satisfies Gate A/B for running the first bounded runtime workpack if PLAN finds no strong gate.
- Safe assumption: The current branch lacks IN-2026-023 docs, but remote `origin/workflow/in-2026-021-selector-heuristics-parity` contains them; those remote docs were read-only context.
- Safe assumption: Optional fields on existing response/result types preserve backward compatibility.
- Blocking assumption: Any new channel, dependency, provider settings migration, prompt/rubric edit, or EvaluationRun storage would exceed this initiative and must stop.

## Selected delivery mode
Runtime multi-layer, scoped single workpack. Layers touched: shared contracts, preload sanitizer, main IPC/pipeline, renderer store, tests, planning docs. No new IPC channels and no provider/settings/package changes.

## Epic breakdown
| Epic ID | Title | Scope | Risk profile | Success criteria |
| --- | --- | --- | --- | --- |
| E1 | PLAN and gates | Create artifacts and answer plan requirements | Low | Workpack valid; no strong gate found |
| E2 | Result metadata | Add optional metadata to JudgeResult and pipeline | Medium | Existing result shape still valid |
| E3 | Error hardening | Add stable code and sanitize details | Medium/security | No renderer stack traces by default |
| E4 | Progress hardening | Keep channel, optional done/failed stages | Low | Existing listeners still work |
| E5 | Tests | Add targeted tests without dependencies | Medium | `npm test` passes |
| E6 | Review | Validate scope and report | Low | Delivery report complete |

## Sprint mapping
| Sprint / slice | Workpack candidates | Dependencies | Exit criteria |
| --- | --- | --- | --- |
| Current slice | `WP-JUDGE-001-current-contract-hardening` | Human approval context | Verification commands passed; manual smoke pending |

## Workpack queue
| Workpack ID | Type | Purpose | Dependency | Expected status |
| --- | --- | --- | --- | --- |
| `WP-JUDGE-001-current-contract-hardening` | scoped runtime | Harden current Judge contract/result/error/progress/tests | Human approval in prompt | Done |

## Executor routing
| Workpack ID | Selected executor | Primary skill | Secondary executors | Rationale |
| --- | --- | --- | --- | --- |
| `WP-JUDGE-001-current-contract-hardening` | `ai-dock-main-process-executor` | `ai-dock-main-process-executor` | `ai-dock-ipc-security-reviewer`, `ai-dock-renderer-react-executor`, `ai-dock-test-qa-executor` | Main Judge pipeline/IPC is primary; shared/preload/store/tests are compatibility support |

## Gate plan
- Soft gates: artifact naming, remote IN-2026-023 context read-only, optional metadata shape, optional progress stage expansion.
- Strong gates: new IPC channel, dependency/package changes, provider settings migration, prompt/rubric edits, EvaluationRun storage/history, large CompareView rewrite, forbidden path changes.
- Gate owner: Human for strong gates; Codex can close soft gates.
- Expected decision point: after PLAN. Current PLAN conclusion: no strong gate found.

## Verification strategy
- Workflow validators for initiative/workpack.
- `node --check` for touched JS runtime/preload files.
- `npm test`.
- `npm run preload:build`.
- `npm run build`.
- `git status --short`, `git diff --stat`, `git diff --check`.
- Forbidden-path status check for package/config/provider/settings/prompts/scripts.

## Risk register
| Risk | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Optional metadata breaks guards/export | Medium | Keep metadata optional and validate as object only | Codex | Mitigated |
| Error details expose stack/secret | High | No stack in IPC fail; redact token-like strings | Codex | Mitigated |
| Export sanitizer rejects current object scores | Medium | Fix object score sanitizer and add tests | Codex | Mitigated |
| Renderer redesign creep | Medium | Store code only; CompareView minimal progress label if needed | Codex | Mitigated |
| Missing IN-2026-023 docs on branch | Low/medium | Consult remote docs read-only; do not recreate in this scope | Codex | Logged |
