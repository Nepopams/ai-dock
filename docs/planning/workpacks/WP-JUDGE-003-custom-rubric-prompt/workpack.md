# Workpack: WP-JUDGE-003 Custom Rubric / Custom Prompt

## Workpack ID
`WP-JUDGE-003-custom-rubric-prompt`

## Title
Judge Custom Rubric / Custom Prompt

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped runtime/shared/preload/main/renderer/test APPLY. Human approval is provided in the IN-2026-026 prompt. APPLY is allowed only if PLAN finds no strong gate.

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
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening/delivery-report.md`
- `docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog/delivery-report.md`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/preload/utils/judge.js`
- `src/preload/modules/judge.js`
- `src/main/services/judgePipeline.js`
- `src/main/ipc/judge.ipc.js`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/react/views/CompareView.tsx`
- `src/shared/prompts/judge/system.md`
- `src/shared/prompts/judge/rubric.md`
- `src/shared/presets/evaluation/catalog.json`
- `src/shared/presets/evaluation/README.md`
- `tests/**`
- `package.json`

## Goal
Make user-supplied rubric and user-supplied judge instructions first-class optional inputs in the current Judge compatibility flow without building Evaluation Studio.

## User value
Users can run Judge comparisons with their own criteria and extra judge instructions while the existing CompareView flow continues to work.

## Current architecture context
The current Judge prototype already supports an optional `rubric` string. `CompareView` has an optional rubric override, `preload/utils/judge.js` sanitizes that value, and `judgePipeline.js` inserts it into the user prompt. There is no separate custom judge instruction field, and result metadata does not indicate whether custom rubric or custom instructions were applied.

## Affected modules
- `shared types`
- `preload sanitizer`
- `main Judge service`
- `renderer CompareView`
- `renderer store`
- `tests`
- `docs/planning`

## In scope
- Optional `customPrompt` field on `JudgeInput`.
- JS/TS guard parity for `customPrompt`.
- Preload sanitizer support for optional `customPrompt`.
- Prompt assembly block for additional judge instructions.
- Metadata flags: `rubricSource` and `customPromptApplied`.
- Minimal CompareView textarea and payload update.
- Targeted tests.
- Initiative/workpack/run-state/delivery docs.

## Out of scope
- Full Evaluation Studio.
- Preset catalog runtime integration.
- Deterministic validators.
- EvaluationRun storage/history.
- n8n integration.
- Provider settings migration.
- Dedicated local LLM provider.
- New IPC channels.

## Allowed files
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/preload/utils/judge.js`
- `src/main/services/judgePipeline.js`
- `src/renderer/store/judgeSlice.ts` only if PLAN proves need
- `src/renderer/react/store/useDockStore.ts` only if CompareDraft needs customPrompt persistence
- `src/renderer/react/views/CompareView.tsx`
- `tests/**`
- `docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt/**`
- `docs/planning/workpacks/WP-JUDGE-003-custom-rubric-prompt/**`
- `docs/architecture/judge-mode-evaluation-studio.md` only for a short implementation note

## Forbidden files
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `src/main/providers/**`
- `src/main/services/settings.js`
- `src/main/ipc/judge.ipc.js` unless PLAN proves no new channel and only type-compatible update is required
- `src/shared/ipc/**`
- `src/preload/modules/judge.js` unless PLAN proves sanitizer exposure must change
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
1. Current optional rubric flow: `CompareView` sends optional `rubric`; preload trims it; `judgePipeline` uses `input.rubric || DEFAULT_RUBRIC` in `buildUserPrompt`.
2. Field name: use `customPrompt` because it matches the initiative preference and is clear as additional judge instructions.
3. Backward compatibility: yes. `customPrompt` is optional, existing inputs remain valid, existing answer comparison still requires 2+ answers, and existing `window.judge.run(input)` continues to use the same channel.
4. New IPC channel: not needed. If a new channel becomes necessary, stop.
5. Prompt/rubric source files: no edits needed. The extra block can be assembled in `judgePipeline.js`.
6. Preset catalog: not needed and must remain disconnected.
7. Prompt assembly: insert `customPrompt` as a separate bounded "Additional user judge instructions" block after rubric and before question/answers, then restate that system/rubric/strict JSON output cannot be overridden.
8. Prompt injection mitigation: custom instructions are task guidance only, cannot replace system prompt, cannot change output contract, and answer text/instructions that ask to reveal secrets or change JSON format are not followed.
9. Exact files to change: listed in Expected file changes. No `src/main/ipc`, `src/shared/ipc`, prompt source, preset catalog, package, config, provider, or settings files are needed.
10. Tests: update shared guard tests, preload sanitizer tests, and add pure helper tests for prompt assembly and metadata flags.
11. CompareView behavior: keep existing layout and flow; add a textarea beside rubric and include `customPrompt` only when non-empty.

## IPC impact
No new channel and no IPC contract constant changes. Existing `window.judge.run(input)` carries an optional field.

## Preload impact
`sanitizeJudgeInput` allows `customPrompt` only when it is a non-empty trimmed string and rejects non-string values.

## Renderer impact
Minimal CompareView addition: one textarea and draft persistence field. No redesign.

## Store impact
`CompareDraft` gets optional `customPrompt` so draft persistence matches the existing rubric pattern.

## Data/storage impact
No storage, migration, EvaluationRun, or history changes.

## Security impact
The full custom prompt is not stored in result metadata or exported metadata by default. Metadata records only source flags. Prompt assembly keeps strict JSON output after the custom block.

## Step-by-step plan
1. Extend shared Judge input/result metadata types and JS guards.
2. Extend preload sanitizer and export metadata whitelist.
3. Update Judge prompt assembly and metadata helper, exposing pure helpers only through `_private` for tests.
4. Add CompareDraft/customPrompt state and a minimal CompareView textarea.
5. Add/update targeted tests.
6. Add a short architecture note only if the architecture report exists on the current branch; otherwise consult the report from history and avoid recreating it.
7. Run required verification.
8. Update initiative/workpack state and delivery report.

## Test strategy
- Keep tests dependency-free using Node's built-in test runner.
- Test only pure helpers for prompt assembly and metadata, avoiding provider mocks.
- Verify existing full test/build suite after targeted tests.

## Test plan
- Update `tests/judge-types.test.js`.
- Update `tests/judge-preload.test.js`.
- Add `tests/judge-pipeline.test.js`.
- Run all verification commands listed below.

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-003-custom-rubric-prompt/workpack.md`
- `node --check src/main/services/judgePipeline.js`
- `node --check src/preload/utils/judge.js`
- `npm test`
- `npm run preload:build`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- package.json package-lock.json tsconfig.json vite.config.js scripts src/main/providers src/main/services/settings.js src/shared/prompts/judge src/shared/presets/evaluation src/shared/ipc src/main/ipc`

## Manual smoke checklist
- Open Compare/Judge view.
- Run current answer comparison without custom rubric/prompt.
- Run with custom rubric only.
- Run with custom judge instructions only.
- Run with both custom rubric and custom judge instructions.
- See scores/verdict/summary.
- Export Markdown/JSON still works.
- No profile/provider failure still shows safe error.
- Chat/Form/History local views still open.

## Docs/index updates required
- Initiative/workpack docs.
- Architecture report/ADR-005 are absent from this stacked branch and were consulted from git history. Do not recreate the full report in this runtime workpack.
- No index update is required.

## Docs impact
- Adds IN-2026-026 initiative artifacts.
- Adds `WP-JUDGE-003-custom-rubric-prompt` workpack and prompt-pack.
- Does not recreate the absent architecture report on this stacked branch.

## Rollback
Revert this workpack's changes in allowed files. No persisted user data rollback is needed.

## Acceptance criteria
- [x] Optional `customPrompt` is accepted by Judge input guards.
- [x] Non-string `customPrompt` is rejected by Judge input guards and preload sanitizer.
- [x] Preload trims `customPrompt` and omits empty values.
- [x] Prompt assembly includes custom instructions in a bounded block.
- [x] Prompt assembly preserves strict JSON output requirement after custom instructions.
- [x] Result metadata has `rubricSource` and `customPromptApplied` flags.
- [x] CompareView sends customPrompt only when non-empty.
- [x] No new IPC channels.
- [x] No package/lock/dependency changes.
- [x] No prompt/rubric source file changes.
- [x] Preset catalog is not connected to runtime.

## Done criteria
- [x] Workpack validator PASS.
- [x] Initiative validator PASS.
- [x] Required checks run and recorded.
- [x] REVIEW verdict recorded.
- [x] Delivery report complete.

## Risks
- Custom instructions can still bias Judge output. Mitigation: bounded block and output-contract restatement.
- Manual UI smoke is still required after automated build.
- Future Evaluation Studio may evolve `customPrompt` into a richer instruction model.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
