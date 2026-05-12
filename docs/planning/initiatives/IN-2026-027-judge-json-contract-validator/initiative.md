# Initiative: IN-2026-027 Judge JSON Contract Validator Mode

## Initiative ID
`IN-2026-027-judge-json-contract-validator`

## Title
Judge JSON Contract Validator Mode

## Status
Completed

## Owner
Human + Codex

## Goal
Add a dependency-free JSON contract validation layer to the current Judge compatibility flow.

## User value
Users can compare structured JSON outputs and see deterministic parse/key findings alongside the LLM judge verdict.

## Problem
The preset catalog contains `json-contract-check`, but current Judge runtime has no deterministic validator execution or validator findings in the result.

## Success criteria
- [x] Runtime workpack and prompt-pack exist.
- [x] PLAN confirms canonical mode `json_contract_check`.
- [x] `JudgeInput` accepts optional validation config without breaking existing inputs.
- [x] Deterministic JSON parse and required-key checks run when validation is enabled.
- [x] Optional enum-value checks remain top-level and dependency-free.
- [x] Validator results are attached to `JudgeResult` and sanitized export payloads.
- [x] Validator findings are included in LLM prompt context when validation is enabled.
- [x] CompareView is minimally updated with JSON validation controls and findings display.
- [x] No new IPC channels, dependencies, provider settings changes, prompt source edits, or preset runtime import are added.
- [x] Required verification commands pass.

## In scope
- Create initiative artifacts.
- Create `WP-JUDGE-004-json-contract-validator-mode` and prompt-pack.
- Extend current Judge contract with optional validation config and validator results.
- Add deterministic JSON parse, required key, and simple enum-value checks.
- Add validator findings to prompt context.
- Update preload input/export sanitizers.
- Add minimal CompareView controls and result display.
- Add targeted tests and delivery report.

## Out of scope
- Full Evaluation Studio.
- Preset picker.
- Runtime import/use of evaluation preset catalog.
- JSON Schema library or full schema engine.
- Complex nested schema validation.
- New IPC channels.
- Provider settings migration.
- EvaluationRun storage/history.
- n8n integration.

## Constraints
- Do not add dependencies.
- Do not change package or lock files.
- Do not change provider settings.
- Do not change prompt/rubric source files.
- Do not change shared/main IPC channels.
- Do not connect the static preset catalog to runtime.
- Do not redesign CompareView.

## Strong human gate triggers
- Need for dependency, package, or lockfile changes.
- Need for a new IPC channel.
- Need for a full JSON Schema engine.
- Need for provider settings changes.
- Need to connect preset catalog to runtime.
- Need for a large CompareView redesign.
- Need to change prompt source files.
- Need for EvaluationRun/history/storage.

## Candidate epics
- Epic 1: Initiative/workpack orchestration.
- Epic 2: Shared Judge validation contract.
- Epic 3: Preload sanitizer and export sanitizer.
- Epic 4: Main deterministic validator helpers and prompt context.
- Epic 5: Minimal CompareView validation controls and findings.
- Epic 6: Tests, verification, and delivery report.

## Risks
- Deterministic validator findings may conflict with LLM scores.
- Enum checks can grow into schema validation if not constrained.
- Markdown export cannot be expanded in this workpack because exporter IPC is forbidden.
- Manual UI smoke remains required.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-004-json-contract-validator-mode/workpack.md`
