# Delivery Report: IN-2026-026 Judge Custom Rubric / Custom Prompt

## Summary
Completed automated delivery for `WP-JUDGE-003-custom-rubric-prompt`. The work adds optional `customPrompt` support to the existing Judge compatibility flow, keeps current `rubric` behavior, preserves the existing `window.judge.run(input)` channel, adds safe sanitizer/metadata handling, updates CompareView minimally, and adds targeted tests. Evaluation Studio, preset runtime integration, deterministic validators, EvaluationRun, provider settings, prompts, and package files were not changed.

## Workpacks completed
| Workpack ID | Status | REVIEW verdict | Notes |
| --- | --- | --- | --- |
| `WP-JUDGE-003-custom-rubric-prompt` | Done | GO | Compatibility hardening for custom rubric/custom prompt complete. |

## Files changed
- `src/shared/types/judge.ts`
- `src/shared/types/judge.js`
- `src/preload/utils/judge.js`
- `src/main/services/judgePipeline.js`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/react/views/CompareView.tsx`
- `tests/judge-types.test.js`
- `tests/judge-preload.test.js`
- `tests/judge-pipeline.test.js`
- `docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt/**`
- `docs/planning/workpacks/WP-JUDGE-003-custom-rubric-prompt/**`

Not changed:
- `src/main/ipc/**`
- `src/shared/ipc/**`
- `src/shared/prompts/judge/**`
- `src/shared/presets/evaluation/**`
- `src/main/providers/**`
- `src/main/services/settings.js`
- `package.json`
- `package-lock.json`
- `scripts/**`

## Commands run
| Command | Purpose | Result |
| --- | --- | --- |
| `git status --short` | Confirm starting worktree state | PASS |
| `git branch --show-current` | Confirm branch | PASS: `workflow/in-2026-026-judge-custom-rubric-prompt` |
| `Get-Content -Raw ...` | Read required governance, workflow, prior delivery, runtime, UI, tests, prompts, preset catalog, and package context | PASS |
| `rg --files tests` | Inspect test suite | PASS |
| `rg -n ...` | Locate Judge/rubric/store usages | PASS |
| `git show b4785f0:docs/architecture/judge-mode-evaluation-studio.md` | Consult missing IN-2026-023 report from history | PASS |
| `git show b4785f0:docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md` | Consult missing ADR-005 from history | PASS |
| `New-Item -ItemType Directory -Force ...` | Create initiative/workpack directories | PASS |
| `apply_patch` | Create/update docs and runtime/test files | PASS |
| `node --check src/main/services/judgePipeline.js` | Syntax-check Judge pipeline | PASS |
| `node --check src/preload/utils/judge.js` | Syntax-check preload sanitizer | PASS |
| `node --test tests/judge-types.test.js` | Targeted shared guard tests | PASS: 7/7 |
| `node --test tests/judge-preload.test.js` | Targeted preload tests | PASS: 5/5 |
| `node --test tests/judge-pipeline.test.js` | Targeted prompt/metadata tests | PASS: 3/3 |
| `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-003-custom-rubric-prompt/workpack.md` | Validate workpack | PASS |
| `npm test` | Full test suite | PASS: 44/44 |
| `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt` | Validate initiative | PASS after heading fix |
| `npm run preload:build` | Build preload bundle | PASS |
| `npm run build` | Build app | PASS with CSS minifier warnings |
| `git status --short` | Inspect worktree | PASS |
| `git diff --stat` | Inspect tracked diff size | PASS |
| `git diff --check` | Whitespace/error diff check | PASS |
| `git status --short -- package.json package-lock.json tsconfig.json vite.config.js scripts src/main/providers src/main/services/settings.js src/shared/prompts/judge src/shared/presets/evaluation src/shared/ipc src/main/ipc` | Forbidden-path scope check | PASS: empty output |

## Test results
- `node --test tests/judge-types.test.js`: PASS, 7 tests.
- `node --test tests/judge-preload.test.js`: PASS, 5 tests.
- `node --test tests/judge-pipeline.test.js`: PASS, 3 tests.
- `npm test`: PASS, 44 tests.
- `npm run preload:build`: PASS.
- `npm run build`: PASS with existing CSS minifier warnings around stylesheet syntax.

## Review results
- Backward compatibility preserved: existing input without `customPrompt` remains valid.
- Current answer comparison still requires 2+ answers.
- Existing `window.judge.run(input)` flow remains the only run path.
- No new IPC channels.
- No package/lock/dependency/config/script changes.
- No provider settings changes.
- No prompt/rubric source file changes.
- Preset catalog remains disconnected from runtime.
- CompareView changed minimally: one optional custom instructions textarea and payload/draft state.
- `customPrompt` is not included in result metadata or sanitized export metadata; metadata stores only `customPromptApplied`.
- REVIEW verdict: GO.

## Manual smoke checklist
| Check | Status |
| --- | --- |
| Open Compare/Judge view | Not run |
| Run current answer comparison without custom rubric/prompt | Not run |
| Run with custom rubric only | Not run |
| Run with custom judge instructions only | Not run |
| Run with both custom rubric and custom judge instructions | Not run |
| See scores/verdict/summary | Not run |
| Export Markdown/JSON still works | Not run |
| No profile/provider failure still shows safe error | Not run |
| Chat/Form/History local views still open | Not run |

## Risks
- Manual UI smoke was not run in this automated pass.
- Custom instructions can still influence judge behavior; prompt assembly bounds the block and restates strict JSON output, but LLM compliance is not deterministic.
- `rawResponse` can reflect any provider output; sanitized export metadata does not include custom prompt text by default.
- Architecture report/ADR-005 are absent from this stacked branch and were consulted from git history instead of recreated.
- `npm run build` passed with existing CSS minifier warnings.

## Follow-ups
- Manual smoke the Compare/Judge view.
- `WP-JUDGE-004 JSON / Schema Validator Mode`.
- `WP-JUDGE-005 Local LLM Backend Labeling and UX`.
- `WP-JUDGE-006 Evaluation Studio UI Shell`.
- Later EvaluationRun/history/export work should decide how custom prompts are stored or redacted.

## Merge recommendation
GO for the bounded runtime/shared/preload/renderer/test workpack after manual smoke or direct reviewer acceptance. No forbidden runtime/package/provider/prompt/preset/IPC paths were changed.
