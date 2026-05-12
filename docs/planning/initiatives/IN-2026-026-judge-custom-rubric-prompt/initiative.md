# Initiative: IN-2026-026 Judge Custom Rubric / Custom Prompt

## Initiative ID
`IN-2026-026-judge-custom-rubric-prompt`

## Title
Judge Custom Rubric / Custom Prompt

## Status
Done

## Owner
Human + Codex

## Goal
Support user-supplied rubric and user-supplied judge instructions as explicit inputs in the current Judge compatibility flow.

## User value
Users can compare answers with their own evaluation criteria and judge instructions before the full Evaluation Studio UI exists.

## Problem
The current Judge prototype supports an optional rubric string, but custom judge instructions are not a first-class input. That blocks user-defined evaluation scenarios that do not fit the default rubric while Evaluation Studio is still being built.

## Success criteria
- [x] Runtime workpack and prompt-pack exist.
- [x] PLAN confirms no new IPC channel, no preset catalog runtime integration, no prompt source edits, no provider settings migration, and no package/dependency changes.
- [x] `JudgeInput` accepts optional `customPrompt` without breaking existing inputs.
- [x] Preload sanitizer trims optional `customPrompt`, omits empty strings, and rejects non-string values.
- [x] Judge prompt assembly includes custom instructions in a separate bounded block and preserves strict JSON output requirements.
- [x] Judge result metadata records `rubricSource` and `customPromptApplied` without storing the custom prompt text.
- [x] CompareView is minimally updated to send optional custom judge instructions.
- [x] Targeted tests cover shared guard, preload sanitizer, prompt assembly, and metadata flags.
- [x] Required verification commands are run and recorded.

## In scope
- Create initiative artifacts.
- Create `WP-JUDGE-003-custom-rubric-prompt` and prompt-pack.
- Backward-compatible Judge contract extension.
- Preload input sanitizer update.
- Bounded prompt assembly update.
- Metadata flags for rubric/custom prompt usage.
- Minimal CompareView custom instructions textarea.
- Targeted tests.
- Short architecture implementation note if needed.

## Out of scope
- Full Evaluation Studio.
- Preset picker or preset catalog runtime integration.
- Deterministic validators.
- EvaluationRun storage/history.
- n8n integration.
- Provider settings migration.
- Dedicated local LLM provider.
- New IPC channels.

## Constraints
- Do not add dependencies.
- Do not change package or lock files.
- Do not change provider settings model.
- Do not change `src/shared/prompts/judge/**`.
- Do not redesign CompareView.
- Do not connect `src/shared/presets/evaluation/**` to runtime.

## Strong human gate triggers
- Need for a new IPC channel.
- Need for package, lockfile, dependency, tsconfig, vite, or script changes.
- Need for provider settings migration.
- Need to edit prompt/rubric source files.
- Need for a large CompareView rewrite.
- Need to connect preset catalog to runtime.
- Need for EvaluationRun/history/storage.

## Candidate epics
- Epic 1: Initiative/workpack orchestration.
- Epic 2: Shared Judge contract hardening for `customPrompt`.
- Epic 3: Preload sanitizer and prompt assembly.
- Epic 4: Minimal CompareView support.
- Epic 5: Targeted tests and verification.

## Risks
- Custom instructions can try to override JSON output or system behavior. Mitigation: keep instructions in a bounded block and restate output constraints after the block.
- Metadata could leak custom user text. Mitigation: store booleans/source flags only.
- UI state could drift from existing rubric behavior. Mitigation: use the same CompareDraft persistence pattern.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `../../workpacks/WP-JUDGE-003-custom-rubric-prompt/workpack.md`
