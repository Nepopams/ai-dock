# Workpack: WP-JUDGE-001 Current Contract Hardening

## Workpack ID
`WP-JUDGE-001-current-contract-hardening`

## Title
Judge Current Contract Hardening

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped runtime APPLY. Human approval is provided in the IN-2026-024 prompt. APPLY is allowed only if PLAN finds no strong gate.

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
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`
- Remote read-only `origin/workflow/in-2026-021-selector-heuristics-parity:docs/architecture/judge-mode-evaluation-studio.md`
- Remote read-only `origin/workflow/in-2026-021-selector-heuristics-parity:docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- Remote read-only `origin/workflow/in-2026-021-selector-heuristics-parity:docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/delivery-report.md`
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/shared/ipc/judge.ipc.ts`
- `src/shared/ipc/judge.ipc.js`
- `src/preload/modules/judge.js`
- `src/preload/utils/judge.js`
- `src/main/ipc/judge.ipc.js`
- `src/main/ipc/judge.ipc.ts`
- `src/main/services/judgePipeline.js`
- `src/main/services/judgePipeline.ts`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/views/CompareView.tsx`
- `src/shared/prompts/judge/system.md`
- `src/shared/prompts/judge/rubric.md`
- `tests/**`
- `package.json`

## Goal
Harden the current Judge prototype contract/result/error/progress path before future Evaluation Studio work, while preserving current answer comparison behavior.

## User value
Users keep the current Compare/Judge workflow, but failures become safer and more diagnosable, exported/current results become more structured, and future Judge phases get a firmer compatibility base.

## Current architecture context
Current Judge is a prototype answer-comparison flow:
- shared `JudgeInput` requires `requestId`, `judgeProfileId`, `question`, and at least two answers;
- shared `JudgeResult` has scores, verdict, summary, optional notes/rawResponse/partial;
- shared criteria are fixed to `coherence`, `factuality`, `helpfulness`;
- preload sanitizes input/export payloads;
- main IPC handles `judge:run` and progress over `judge:progress`;
- main pipeline loads one completions profile and calls OpenAI-compatible or generic HTTP provider;
- renderer store keeps one running/result/error/progress state;
- CompareView renders fixed criteria and export buttons.

## Affected modules
- `shared`
- `preload`
- `main`
- `renderer store`
- `tests`
- `docs/planning`

## In scope
- Backward-compatible optional `JudgeResult.metadata`.
- Optional `JudgeRunResponse.code`.
- Safe renderer-visible error details and stable codes.
- Optional progress stages `done` and `failed` on the existing progress channel.
- Minimal renderer store support for error code/details.
- Fix preload export sanitization for current object score buckets.
- Targeted tests for shared guards, preload sanitizers, and testable IPC error shaping.
- Initiative/workpack/run-state/delivery docs.

## Out of scope
- Evaluation Studio UI.
- EvaluationRun.
- Presets.
- JSON validator mode.
- Custom prompt model.
- History/export redesign.
- New IPC channels.
- Provider settings migration.
- Package/dependency changes.
- Prompt/rubric edits.
- Large CompareView rewrite.

## Allowed files
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/shared/ipc/judge.ipc.ts`
- `src/shared/ipc/judge.ipc.js`
- `src/preload/modules/judge.js`
- `src/preload/utils/judge.js`
- `src/main/ipc/judge.ipc.js`
- `src/main/ipc/judge.ipc.ts`
- `src/main/services/judgePipeline.js`
- `src/main/services/judgePipeline.ts`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/views/CompareView.tsx`
- `tests/**`
- `docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening/**`
- `docs/planning/workpacks/WP-JUDGE-001-current-contract-hardening/**`
- `docs/architecture/judge-mode-evaluation-studio.md` only if present and only for a short implementation note
- `docs/_indexes/source-of-truth.md` only if adding a workpack/report link

## Forbidden files
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `src/main/providers/**`
- `src/main/services/settings.js`
- `src/shared/prompts/judge/**`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/preload/index.js`
- `src/preload/index.ts`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Expected file changes
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/shared/ipc/judge.ipc.ts`
- `src/preload/utils/judge.js`
- `src/main/ipc/judge.ipc.js`
- `src/main/services/judgePipeline.js`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/views/CompareView.tsx` only if progress labels need minimal compatibility
- `tests/judge-types.test.js`
- `tests/judge-preload.test.js`
- `tests/judge-ipc.test.js`
- initiative/workpack docs

## PLAN conclusion
Current Judge contracts:
- `JudgeInput` and `JudgeInputAnswer` in `src/shared/types/judge.*`.
- `JudgeResult`, `JudgeScore`, `JudgeExportPayload` and guards in `src/shared/types/judge.*`.
- `JudgeRunRequest`, `JudgeRunResponse`, `JudgeProgressEvent` in `src/shared/ipc/judge.ipc.ts`; JS shared IPC only exports channel constants.
- Preload `window.judge.run(input)` and `window.judge.onProgress(cb)` in `src/preload/modules/judge.js`.
- Main `judge:run`/`judge:progress` in `src/main/ipc/judge.ipc.js`.

Harden now:
- Optional result metadata with schema/contract version, profile id, driver, model, duration, finish reason, usage, response format, parse state, and partial reason.
- Stable optional error code in `JudgeRunResponse`.
- Sanitized non-stack error details.
- Existing progress channel may emit optional `done`/`failed` stages.
- Tests for guards, sanitizers, and IPC error shape.

Leave for later:
- EvaluationRun.
- Presets.
- Validators.
- Custom prompt model.
- History/export redesign.
- Local provider system.

Backward compatibility:
- Yes. Existing required input/result fields remain unchanged.
- New fields are optional.
- Existing `window.judge.run(input)` remains the same method and channel.
- CompareView keeps current fixed answer comparison flow.

New IPC channels:
- No. If a new channel becomes necessary, stop-the-line.

Package/dependency changes:
- No. Use existing Node test runner.

Exact files to change:
- listed in Expected file changes.

Tests to add:
- shared guard tests;
- preload sanitizer tests;
- main IPC error helper tests with Electron mocked through Node module loader.

Error safety:
- Do not return `error.stack` through main IPC.
- Map errors to stable codes.
- Redact token-like/key-like/password-like strings from details.
- Renderer stores optional code/details but no raw stack from response or local catch.

CompareView behavior:
- Keep same inputs, buttons, score table, and export flow.
- Add only minimal labels for `done`/`failed` if progress union is expanded.

## IPC impact
No new channels. Existing `judge:run` response type gains optional `code`; existing `judge:progress` event type gains optional stages on the same channel.

## Preload impact
No new bridge namespace or method. Existing sanitizers are hardened for export metadata/object score buckets.

## Renderer impact
No redesign. `judgeSlice` stores optional error code and avoids stack details. CompareView may display existing progress plus optional done/failed labels.

## Store impact
Adds optional `judgeErrorCode` to Judge slice state.

## Data/storage impact
None. No storage or migration.

## Security impact
- Sandbox/contextIsolation unchanged.
- No direct renderer Node access.
- No token/secret handling changes except safer error redaction.
- Renderer-visible error details no longer include raw stacks by default.

## Step-by-step plan
1. Update shared Judge TS/JS guards with optional metadata validation.
2. Update shared IPC TS response/progress types with optional code and optional done/failed progress stages.
3. Update main Judge pipeline to attach safe metadata to success and parse fallback results.
4. Update main Judge IPC to map stable error codes, sanitize details, and send done/failed progress over existing channel.
5. Update preload sanitizer export path to preserve safe metadata and handle object score buckets without requiring `agentId`.
6. Update Judge slice to store optional error code and avoid raw stack details.
7. Add minimal CompareView labels for done/failed if progress stages are emitted.
8. Add targeted tests.
9. Run required validation/test/build/scope commands.
10. Update run-state and delivery report.

## Test strategy
- Unit tests: shared Judge guards and preload sanitizers.
- IPC helper tests: stable code/details shape with mocked Electron import.
- Integration tests: existing `npm test`.
- Build tests: `npm run preload:build`, `npm run build`.
- Manual smoke: required after automated verification.

## Test plan
- Add `tests/judge-types.test.js`.
- Add `tests/judge-preload.test.js`.
- Add `tests/judge-ipc.test.js`.
- Run all verification commands listed below.

## Verification commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-001-current-contract-hardening/workpack.md`
- `node --check src/main/ipc/judge.ipc.js`
- `node --check src/main/services/judgePipeline.js`
- `node --check src/preload/modules/judge.js`
- `node --check src/preload/utils/judge.js`
- `npm test`
- `npm run preload:build`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- package.json package-lock.json tsconfig.json vite.config.js scripts src/main/providers src/main/services/settings.js src/shared/prompts/judge`

## Manual smoke checklist
- [ ] Open Compare/Judge view.
- [ ] Run current answer comparison with 2 answers.
- [ ] See progress.
- [ ] See scores/verdict/summary.
- [ ] Export Markdown/JSON still works.
- [ ] Invalid/no profile state shows safe error.
- [ ] Provider failure path does not expose tokens or raw stack.
- [ ] Existing Chat/Form/History local views still open.

## Docs/index updates required
- Initiative/workpack docs only.
- Do not update `source-of-truth.md` unless adding an explicit workpack/report link becomes necessary.
- Do not rewrite architecture report. Current branch lacks the report; remote context was consulted read-only.

## Docs impact
- Adds IN-2026-024 initiative artifacts.
- Adds `WP-JUDGE-001-current-contract-hardening` workpack and prompt-pack.
- No architecture report rewrite.
- No index update planned.

## Rollback
Revert this workpack's changes in allowed files:
- remove optional metadata/code/progress additions;
- restore previous sanitizer behavior if needed;
- remove new tests;
- remove IN-2026-024 initiative/workpack docs.

No storage rollback is needed because no data format or persistence changes are made.

## Acceptance criteria
- [x] Current valid JudgeInput still passes.
- [x] Invalid answer/score shapes are rejected.
- [x] Current JudgeResult remains valid.
- [x] JudgeResult can include optional safe metadata.
- [x] JudgeRunResponse can include optional stable `code`.
- [x] Main IPC no longer returns raw stack as details by default.
- [x] No new IPC channels.
- [x] CompareView current flow remains compatible.
- [x] Tests pass.
- [x] Build/preload pass or failures are documented.
- [x] Forbidden-path check shows no package/provider/settings/prompt/script changes.

## Done criteria
- [x] Workpack validator PASS.
- [x] Initiative validator PASS.
- [x] Required checks run and recorded.
- [x] REVIEW verdict recorded.
- [x] Delivery report complete.

## Risks
- Build can reveal pre-existing issues unrelated to Judge hardening.
- Metadata shape is intentionally compatibility-only and not full EvaluationRun.
- Manual smoke is still required because automated tests do not launch Electron UI.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
