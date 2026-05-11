# Initiative: IN-2026-024 Judge Current Contract Hardening

## Initiative ID
`IN-2026-024-judge-current-contract-hardening`

## Title
Judge Current Contract Hardening

## Status
Done

## Owner
Human + Codex

## Goal
Harden the current Judge contract/result/error/progress layer without implementing the full Evaluation Studio.

## User value
Judge Mode becomes more reliable and ready for later presets, validators, custom rubric, local LLM UX, and EvaluationRun work without breaking the current CompareView flow.

## Problem
The current Judge prototype is a narrow answer-comparison flow. Before broader Evaluation Studio work, it needs a stable backward-compatible contract, result metadata, safe errors, progress hardening, and targeted tests.

## Success criteria
- [x] Runtime workpack and prompt-pack exist.
- [x] PLAN answers contract, scope, IPC, dependency, file, test, error-safety, and compatibility questions.
- [x] Existing `JudgeInput` and `window.judge.run(input)` remain compatible.
- [x] Existing CompareView answer comparison remains compatible.
- [x] `JudgeResult` gains optional safe metadata.
- [x] `JudgeRunResponse` gains optional stable error code.
- [x] Renderer-visible error details do not include raw stack traces by default.
- [x] No new IPC channels.
- [x] No package, lockfile, dependency, provider settings, prompt, or rubric changes.
- [x] Targeted tests are added and pass.
- [x] Required validation/build commands are run and recorded.

## In scope
- Create initiative artifacts.
- Create `WP-JUDGE-001-current-contract-hardening` and prompt-pack.
- Execute PLAN and gate evaluation.
- If no strong gate is found, execute bounded runtime APPLY.
- Add backward-compatible optional result metadata.
- Add stable error code to Judge run response.
- Sanitize renderer-visible error details.
- Optionally extend progress stages without adding channels.
- Add targeted tests for shared Judge guards, preload Judge sanitizers, and testable IPC error shaping.
- Update docs/run-state/delivery report.

## Out of scope
- Full Evaluation Studio UI.
- EvaluationRun implementation/storage/history.
- Preset catalog.
- JSON validator mode.
- Local provider system.
- New IPC channels.
- Provider settings migration.
- Package/dependency changes.
- Prompt/rubric changes.
- Large CompareView rewrite.
- n8n integration.

## Constraints
- L3 scoped runtime APPLY is authorized only for this workpack.
- `package.json` and `package-lock.json` are forbidden.
- `src/main/providers/**`, `src/main/services/settings.js`, and `src/shared/prompts/judge/**` are forbidden.
- No new dependencies.
- No new IPC channels.
- No EvaluationRun storage/history.
- No large renderer redesign.
- Runtime changes must stay inside the explicit allowed files.

## Strong human gate triggers
- Need for a new IPC channel.
- Need for package/lockfile/dependency changes.
- Need for provider settings migration.
- Need for prompt/rubric source changes.
- Need for large CompareView rewrite.
- Need for EvaluationRun storage/history.
- Need for token/secret handling changes beyond safe error redaction.
- Need to edit any forbidden path.
- Failure to validate workpack/PLAN preconditions.

## Candidate epics
- Epic 1: File-backed initiative/workpack orchestration.
- Epic 2: Backward-compatible Judge contract metadata.
- Epic 3: Safe error code/details hardening.
- Epic 4: Progress compatibility hardening.
- Epic 5: Targeted test coverage.
- Epic 6: Verification, review, and delivery report.

## Risks
- Shared contract changes can ripple into preload/renderer types. Mitigation: optional fields only and no new channel.
- Export sanitizer currently has prototype assumptions around score shape. Mitigation: targeted test and backward-compatible sanitization.
- Build may expose unrelated TypeScript issues. Mitigation: record verification result and keep diff scoped.
- IN-2026-023 docs are not present in the current branch; remote `origin/workflow/in-2026-021-selector-heuristics-parity` contains them and was consulted read-only. Mitigation: record as branch-base context risk, do not recreate report here.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-001-current-contract-hardening/workpack.md`
