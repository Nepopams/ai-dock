# Workpack: WP-IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Workpack ID
`WP-IN-2026-023-judge-mode-evaluation-studio-architecture`

## Title
Judge Mode / Evaluation Studio Architecture

## Status
Done

## Owner
Human + Codex

## Mode
L2 architecture/docs PLAN/APPLY/REVIEW. Runtime APPLY, source changes, dependency changes, and package metadata changes are forbidden.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/human-gates.md`
- `.codex/workflows/executor-routing.md`
- `.codex/prompts/initiative-runner-template.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`
- `docs/_indexes/ipc-index.md`
- `docs/_indexes/executor-index.md`
- `docs/architecture/service-catalog.md`
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/decisions/ADR-004-renderer-support-namespace-strategy.md`
- `src/main/services/judgePipeline.js`
- `src/main/services/judgePipeline.ts`
- `src/main/ipc/judge.ipc.js`
- `src/main/ipc/judge.ipc.ts`
- `src/shared/ipc/judge.ipc.js`
- `src/shared/ipc/judge.ipc.ts`
- `src/shared/types/judge.js`
- `src/shared/types/judge.ts`
- `src/shared/prompts/judge/system.md`
- `src/shared/prompts/judge/rubric.md`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `src/main/services/settings.js`
- `src/main/providers/openaiCompatible.js`
- `src/main/providers/genericHttp.js`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/views/history/HistoryView.tsx`
- `src/main/services/exporter.js`
- `src/main/ipc/export.ipc.js`
- `src/preload/modules/judge.js`
- `src/preload/modules/exporter.js`
- `src/preload/utils/judge.js`
- `tests/**`

## Goal
Create a product and architecture plan for Judge Mode as an Evaluation Studio capability, including current-state audit, target model, evaluation modes, backend strategy, preset catalog, contract direction, UX model, risk analysis, MVP, phased roadmap, workpack decomposition, and manual smoke checklist.

## User value
Future implementation work can deliver a coherent Evaluation Studio instead of incrementally stretching the current CompareView prototype. Users will eventually evaluate AI answers, research, JSON outputs, prompt adherence, and multi-agent results through API or local models with export/history support.

## In scope
- Create initiative artifacts for `IN-2026-023`.
- Create this planning workpack and prompt-pack.
- Create architecture/product report.
- Create ADR draft for Judge Mode evaluation architecture.
- Update source-of-truth and feature indexes for new architecture links.
- Read runtime/source files only for audit and planning.
- Define bounded future implementation workpacks.

## Out of scope
- Runtime code changes.
- `src/main/**`, `src/renderer/**`, `src/shared/**`, `src/preload/**` changes.
- `package.json` or `package-lock.json` changes.
- `tsconfig.json`, `vite.config.*`, or `scripts/**` changes.
- Prompt/rubric source changes.
- Tests additions or edits.
- Provider settings migration.
- Evaluation history schema implementation.
- Local LLM provider implementation.

## Current architecture context
The current Judge prototype is centered on `CompareView` and one answer-comparison pipeline:
- `judgePipeline.js` validates `JudgeInput`, loads completions settings, resolves one `judgeProfileId`, sends a strict JSON prompt to either OpenAI-compatible or generic HTTP provider, extracts/parses JSON, and normalizes fixed scores.
- `judge.ipc.js` exposes `judge:run` and progress events (`queued`, `running`, `parsing`).
- `src/shared/types/judge.*` restricts criteria to `coherence`, `factuality`, and `helpfulness`; answers require at least two items.
- `src/shared/prompts/judge/system.md` and `rubric.md` define a fixed comparison rubric.
- `judgeSlice.ts` manages one running/result/error/progress state.
- `CompareView.tsx` provides question, answer selection, judge profile selection, optional rubric override, score table, error details, and MD/JSON export.
- `useDockStore.ts` prepares compare drafts from Chat assistant messages and focuses the local compare view.
- Existing completions profiles can point to API or local OpenAI-compatible endpoints, and generic HTTP profiles can map custom endpoints.
- Export IPC supports Judge Markdown/JSON exports, but evaluation runs are not persisted as a first-class history entity.

## Allowed files
- `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/**`
- `docs/_indexes/source-of-truth.md` only for adding report/ADR links
- `docs/_indexes/feature-index.md` only for adding Judge Mode / Evaluation Studio feature reference

## Forbidden files
- `src/main/**`
- `src/renderer/**`
- `src/shared/**`
- `src/preload/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Read governance, Initiative Runner workflow, DoR/DoD, indexes, service catalog, and relevant ADRs.
2. Read current Judge runtime, IPC, shared contracts, prompts, store, UI, provider, export, history, and tests in read-only mode.
3. Confirm `ADR-005` is available.
4. Create initiative artifacts with file-backed run-state and task queue.
5. Create architecture/product report with all requested sections.
6. Create ADR-005 draft.
7. Create planning workpack and prompt-pack.
8. Add report/ADR links to `source-of-truth.md` and Judge Mode feature reference to `feature-index.md`.
9. Run initiative/workpack validators and diff/scope checks.
10. Update run-state and delivery report with verification results.

## Acceptance criteria
- [x] Initiative artifacts exist.
- [x] Workpack and prompt-pack exist.
- [x] Architecture/product report exists and covers requested sections.
- [x] ADR-005 draft exists.
- [x] Source-of-truth index references the new report and ADR.
- [x] Feature index references Judge Mode / Evaluation Studio.
- [x] Future implementation workpacks are bounded and avoid giant APPLY.
- [x] Recommended first runtime workpack is identified.
- [x] Validators pass.
- [x] Forbidden-path scope check confirms no initiative-caused runtime/source/package/build changes.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/shared src/preload package.json package-lock.json tsconfig.json vite.config.js scripts`

Runtime tests/build/smoke are not run because this is docs-only and runtime APPLY is forbidden.

## Security impact
No direct security impact because no runtime code, IPC, preload bridge, provider settings, tokens, or logging paths are changed. The report records future risks around prompt injection, local-only privacy expectations, timeout/retry/abort, malformed JSON, and exporting sensitive inputs.

## IPC impact
None for this workpack. Future Judge Mode implementation will likely need shared IPC contract evolution, but that requires a separate runtime workpack and Human Gate.

## Docs impact
- Adds `docs/architecture/judge-mode-evaluation-studio.md`.
- Adds `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`.
- Adds initiative artifacts under `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/**`.
- Adds planning workpack and prompt-pack under `docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/**`.
- Updates `docs/_indexes/source-of-truth.md`.
- Updates `docs/_indexes/feature-index.md`.

## Rollback
Revert this docs-only initiative by removing:
- `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`

Then remove the new Judge Mode / Evaluation Studio entries from:
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`

No runtime rollback is needed because no runtime files are changed.

## Done criteria
- Initiative validator passes.
- Workpack validator passes.
- `git diff --check` passes or only reports known unrelated warnings.
- Forbidden-path scope check shows no initiative-caused changes under forbidden files.
- Delivery report includes files consulted, files changed, commands run, verification, risks, runtime scope check, and follow-ups.
- Merge recommendation is recorded.

## Risks
- Future runtime implementation touches multiple layers and must be split.
- Existing Judge export sanitizer appears stricter/different from result typing around score fields; future hardening should inspect this before expanding result shape.
- Dedicated local provider profile is intentionally deferred to avoid provider settings migration now.
- Evaluation history requires privacy and rollback planning.
- Pre-existing `package-lock.json` dirty state is outside this workpack.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
