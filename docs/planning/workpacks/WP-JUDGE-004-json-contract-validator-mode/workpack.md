# Workpack: WP-JUDGE-004 JSON Contract Validator Mode

## Workpack ID
`WP-JUDGE-004-json-contract-validator-mode`

## Title
Judge JSON Contract Validator Mode

## Status
Completed

## Owner
Human + Codex

## Mode
L3 scoped runtime/shared/preload/main/renderer/test APPLY. Human approval is provided in the IN-2026-027 prompt. APPLY is allowed only if PLAN finds no strong gate.

## Type
`runtime-development`

## Selected executor
- `ai-dock-main-process-executor`

## Primary skill
- `ai-dock-main-process-executor`

## Secondary executors
- `ai-dock-ipc-security-reviewer`
- `ai-dock-renderer-react-executor`
- `ai-dock-test-qa-executor`

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`
- Git history `docs/architecture/judge-mode-evaluation-studio.md`
- Git history `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening/delivery-report.md`
- `docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog/delivery-report.md`
- `docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt/delivery-report.md`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/preload/utils/judge.js`
- `src/preload/modules/judge.js`
- `src/main/services/judgePipeline.js`
- `src/main/ipc/judge.ipc.js`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/react/views/CompareView.tsx`
- `src/shared/presets/evaluation/catalog.json`
- `src/shared/presets/evaluation/README.md`
- `tests/**`
- `package.json`

## Goal
Add first dependency-free JSON contract validation to the current Judge flow without creating Evaluation Studio.

## User value
Users can compare JSON outputs and see which answer parses, which required top-level keys are missing, and whether simple enum values match before reading the LLM verdict.

## In scope
- Optional `validation` config on `JudgeInput`.
- `json_contract_check` mode.
- Deterministic JSON parse, required keys, and simple top-level enum checks.
- Optional `validatorResults` on `JudgeResult`.
- Validator findings in LLM prompt context.
- Preload input and export sanitizer support.
- Minimal CompareView controls and findings display.
- Targeted tests and initiative/workpack docs.

## Out of scope
- Full Evaluation Studio.
- Preset picker.
- Runtime import/use of preset catalog.
- Full JSON Schema engine.
- Nested validation.
- New IPC channels.
- Provider settings changes.
- Prompt/rubric source file changes.
- EvaluationRun storage/history.

## Current architecture context
Current Judge is an answer-comparison compatibility flow. It validates `JudgeInput`, resolves one completions profile, builds a prompt, invokes the provider, parses the LLM JSON response, and returns fixed-criterion scores. IN-2026-026 added optional `customPrompt`. This workpack adds a deterministic validator layer before the provider call and passes sanitized findings as prompt evidence, while keeping the existing channel and answer comparison contract.

## Allowed files
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/preload/utils/judge.js`
- `src/main/services/judgePipeline.js`
- `src/renderer/store/judgeSlice.ts` only if PLAN proves need
- `src/renderer/react/store/useDockStore.ts` only if CompareDraft needs validation config persistence
- `src/renderer/react/views/CompareView.tsx`
- `tests/**`
- `docs/planning/initiatives/IN-2026-027-judge-json-contract-validator/**`
- `docs/planning/workpacks/WP-JUDGE-004-json-contract-validator-mode/**`
- `docs/architecture/judge-mode-evaluation-studio.md` only if adding short implementation note and file exists

## Forbidden files
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `src/main/providers/**`
- `src/main/services/settings.js`
- `src/main/ipc/**`
- `src/shared/ipc/**`
- `src/preload/modules/judge.js` unless PLAN proves exposure must change without new channel
- `src/shared/prompts/judge/**`
- `src/shared/presets/evaluation/**`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Expected file changes
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/preload/utils/judge.js`
- `src/main/services/judgePipeline.js`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/react/views/CompareView.tsx`
- `tests/judge-types.test.js`
- `tests/judge-preload.test.js`
- `tests/judge-pipeline.test.js`
- initiative/workpack docs

## PLAN conclusion
1. Canonical mode name: use `json_contract_check`, matching the preset catalog.
2. Backward-compatible input extension: add optional `validation?: { mode: "json_contract_check"; enabled?: boolean; allowMarkdownFence?: boolean; requiredKeys?: string[]; enumValues?: Record<string, string[]> }`.
3. Validator results format: `JudgeValidatorResult` with `type`, `status`, `answerKey`, optional `agentId`, `message`, `key`, `path`, and optional non-sensitive `expected`/`actual`.
4. Execution location: dependency-free pure helpers in `src/main/services/judgePipeline.js`.
5. Prompt context: add a bounded "Deterministic validation findings" block before question/answers and preserve final strict JSON instruction.
6. IPC: no new channel; existing `judge:run` payload carries optional config.
7. CompareView: preserve existing flow; add one JSON validation fieldset, required keys textarea, allow-fence checkbox, and findings display.
8. Preset catalog: not imported or connected to runtime.
9. Enum values: implement only simple top-level exact string checks; no nested paths or type schema.
10. Strong gate: none. Any need for dependency, IPC, schema engine, provider settings, prompt source edits, preset runtime import, or large UI redesign would stop.

## Step-by-step plan
1. Extend shared Judge types/guards with validation config and validator result shape.
2. Extend preload sanitizer for validation config and sanitized validator results in export payloads.
3. Add deterministic validator helpers to `judgePipeline.js`.
4. Include validator findings in prompt context and attach `validatorResults` to normal/fallback results.
5. Add metadata flags `validationApplied` and `validationMode`.
6. Update CompareDraft and CompareView minimally.
7. Add/update targeted tests.
8. Run required verification.
9. Update run-state, task queue, workpack, and delivery report.

## Acceptance criteria
- [x] `JudgeInput` accepts valid validation config.
- [x] Invalid validation config is rejected.
- [x] Preload trims required keys, drops empties, rejects non-string keys, and caps keys.
- [x] JSON parse passes valid JSON.
- [x] JSON parse fails invalid JSON without throwing the whole Judge run.
- [x] Fenced JSON is supported when enabled.
- [x] Missing required top-level keys are reported.
- [x] Simple enum value mismatches are reported.
- [x] `validatorResults` are attached to `JudgeResult`.
- [x] Prompt includes deterministic findings and still ends with strict JSON instruction.
- [x] CompareView behavior without validation is preserved.
- [x] No forbidden files are changed.

## Test plan
- Update `tests/judge-types.test.js`.
- Update `tests/judge-preload.test.js`.
- Update `tests/judge-pipeline.test.js`.
- Run full `npm test`, preload build, build, and scope checks.

## Security impact
Validator results must not include raw answer text or secrets. Findings include only answer key, agent id, validator type, status, key/path, expected enum values, and sanitized short actual value. Renderer receives findings through the existing result object only.

## IPC impact
No new IPC channel and no shared IPC contract changes. Existing `judge:run` request carries optional validation config.

## Docs impact
Adds IN-2026-027 initiative docs and `WP-JUDGE-004` workpack/prompt-pack. Architecture report is absent on this branch, so no architecture file is created.

## Rollback
Revert this workpack's changes in allowed files. No storage or migration rollback is needed.

## Done criteria
- [x] Workpack validator PASS.
- [x] Initiative validator PASS.
- [x] Required syntax/test/build/scope checks run and recorded.
- [x] REVIEW verdict recorded.
- [x] Delivery report complete.

## Risks
- Manual UI smoke remains required.
- Validator/LLM findings can disagree.
- Markdown export formatting of validator findings is deferred due forbidden exporter IPC path.
- Future EvaluationRun may reshape validator result fields.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
