# Gates: IN-2026-025 Judge Evaluation Preset Catalog

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Naming | Approved | Used user-provided initiative and workpack IDs. | Codex |
| 2026-05-11 | Stacked branch | Approved | IN-2026-024 artifacts are not on `master`, so IN-2026-025 was branched from `workflow/in-2026-024-judge-contract-hardening`. | Codex |
| 2026-05-11 | Catalog location | Approved | `src/shared/presets/evaluation/**` matches allowed paths and future shared data use. | Codex |
| 2026-05-11 | JSON catalog | Approved | Static JSON needs no package/config changes and can be validated by tests. | Codex |
| 2026-05-11 | New EvaluationPreset type files | Approved | New shared type/guard files avoid changing current Judge contracts. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Judge runtime change | If catalog must be consumed by pipeline/runtime | Approve separate runtime workpack | Not triggered | Human |
| 2026-05-11 | IPC/preload/renderer change | If preset picker or bridge/channel is needed | Approve separate UI/IPC workpack | Not triggered | Human |
| 2026-05-11 | Dependency/package change | If validation needs a package | Approve dependency/lockfile workpack | Not triggered | Human |
| 2026-05-11 | Current Judge contract change | If `JudgeInput`/`JudgeResult` must change | Approve shared contract workpack | Not triggered | Human |
| 2026-05-11 | Validator runtime | If validators must execute | Approve validator runtime workpack | Not triggered | Human |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | No stop-the-line event occurred during PLAN | Continued to scoped APPLY | Closed |
| 2026-05-11 | None | No stop-the-line event occurred during APPLY/REVIEW | Completed bounded catalog workpack | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | L3 shared-data/test APPLY | `WP-JUDGE-002 Evaluation Preset Catalog` only | User prompt | No runtime, IPC, preload, renderer, dependency, or package changes |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Catalog is static data only | User explicitly forbids runtime connection | Runtime Judge behavior remains unchanged |
| 2026-05-11 | Use declarative validators | Validator execution is out of scope | Catalog can describe validators without running them |
| 2026-05-11 | Do not update architecture report on this branch | Report is absent from the stacked branch | Remote report remains consulted read-only; no report recreation |
| 2026-05-11 | No manual smoke required | No runtime/UI behavior changed | Automated tests/build are sufficient for this workpack |
