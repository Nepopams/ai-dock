# Workpack: WP-JUDGE-008 Tests and Smoke Suite

## Workpack ID
`WP-JUDGE-008-tests-smoke-suite`

## Title
Judge Tests and Smoke Suite

## Status
Done

## Owner
Human + Codex

## Mode
L2 QA/docs APPLY; L3 only for no-dependency `tests/**`; runtime feature APPLY forbidden

## Type
QA/docs/test

## Selected executor
`ai-dock-test-qa-executor`

## Secondary executors
- `ai-dock-renderer-react-executor`, read-only UI flow review only.
- `ai-dock-ipc-security-reviewer`, QA/security checklist review only.

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
- `docs/_indexes/executor-index.md`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/epic.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- Prior Judge delivery reports from `IN-2026-023` through `IN-2026-036`.
- `package.json`
- `tests/**/*`
- `src/renderer/react/views/EvaluationStudioView.tsx`, read-only context
- `src/renderer/react/views/CompareView.tsx`, read-only context
- `src/renderer/react/components/Sidebar.tsx`, read-only context
- `src/renderer/store/judgeSlice.ts`, read-only context
- `src/shared/types/judge.ts`, read-only context
- `src/shared/types/evaluationRun.ts`, read-only context
- `src/main/storage/evaluationRunStore.js`, read-only context
- `src/main/ipc/evaluationRun.ipc.js`, read-only context
- `src/preload/modules/evaluationRun.js`, read-only context
- `src/main/ipc/export.ipc.js`, read-only context

## Goal
Create a unified Judge MVP QA suite: automated coverage inventory, manual smoke scenarios, smoke evidence template, release confidence GO/NO-GO checklist, and minimal docs completeness tests.

## User value
The user can evaluate Judge MVP readiness from one place and can run a repeatable smoke suite before continuing into Research Mode, n8n integration, or deeper Evaluation Studio work.

## Current architecture context
Judge Mode has progressed through contract hardening, preset catalog, custom rubric/prompt, JSON contract validation, backend labels, Evaluation Studio shell, EvaluationRun export, EvaluationRun history store, EvaluationRun history UI, and dynamic criteria display. Automated tests exist across shared guards, preload sanitizers, main IPC/store helpers, export mapping, pipeline helpers, label helpers, and dynamic criteria discovery. There is no repo-level Electron UI test harness.

## PLAN conclusion
1. Existing automated tests covering Judge MVP are: `judge-types`, `judge-preload`, `judge-pipeline`, `judge-ipc`, `judge-export`, `evaluationRun`, `evaluationRunStore`, `evaluationRunIpc`, `evaluationRunPreload`, `evaluationPresets`, `completionsProfileLabels`, and `judgeDynamicCriteria`.
2. Manual smoke gaps are Electron startup/navigation, sidebar Judge open, manual start flow, real Judge run with provider/local backend, progress UI, JSON validation UI cases, save/list/open/delete UI, real export dialogs/files, dynamic criteria display from saved/custom runs, backend labels in UI, adjacent views, BrowserView tab lifecycle, and local LLM endpoint smoke.
3. No existing UI test harness was found. Do not add Playwright, Cypress, Spectron, browser automation, or any dependency.
4. QA docs to create: automated coverage inventory, smoke suite, smoke evidence template, and release confidence checklist.
5. New `tests/**` is useful only as a no-dependency documentation completeness check. Add `tests/judgeQaDocs.test.js`; do not test DOM/React UI by brittle parsing.
6. Judge MVP GO requires required automated commands to pass and manual smoke scenarios A-J to pass or be explicitly waived by the Human owner. Manual smoke not executed means conditional GO only.
7. Exact files to change: `docs/qa/**`, this initiative folder, this workpack folder, EP-JUDGE roadmap/workpack map, a short architecture note, source-of-truth QA links, and `tests/judgeQaDocs.test.js`.
8. Strong gate: none active. Stop if any runtime source, IPC/preload/shared, renderer behavior, export/storage/provider, package/dependency, config, scripts, or browser automation change becomes necessary.

## In scope
- Create initiative artifacts.
- Create workpack and prompt-pack.
- Create Judge MVP automated coverage inventory.
- Create Judge MVP smoke suite.
- Create smoke evidence template.
- Create release confidence GO/NO-GO checklist.
- Add no-dependency docs QA test for required QA suite structure.
- Update EP-JUDGE roadmap/workpack map.
- Add short architecture QA note and source-of-truth links.

## Out of scope
- Runtime source changes.
- UI redesign.
- Electron UI automation with a new dependency.
- Research comparison mode.
- n8n integration.
- Storage migration.
- Provider/model discovery.
- New IPC/storage/export/preload/shared behavior.
- Package or dependency changes.

## Allowed files
- `docs/qa/**`
- `docs/planning/initiatives/IN-2026-037-judge-tests-smoke-suite/**`
- `docs/planning/workpacks/WP-JUDGE-008-tests-smoke-suite/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/architecture/judge-mode-evaluation-studio.md`, only for a short QA note
- `docs/_indexes/source-of-truth.md`, only for QA doc links
- `docs/_indexes/feature-index.md`, only if consistent links are needed
- `tests/**`, only for no-dependency test-only coverage without runtime changes

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Read required governance, workflow, Judge, test, and runtime context.
2. Create initiative artifacts.
3. Create `WP-JUDGE-008-tests-smoke-suite` and prompt-pack.
4. Write automated coverage inventory.
5. Write manual smoke suite A-J.
6. Write smoke evidence template.
7. Write release confidence checklist.
8. Add dependency-free docs QA test.
9. Update EP-JUDGE roadmap/workpack map.
10. Add architecture note and source-of-truth links.
11. Run validators, targeted docs test, full tests, build, diff, whitespace, and forbidden-path checks.
12. Finalize run-state, task queue, gates, delivery report, and REVIEW verdict.

## Acceptance criteria
- [x] QA docs are created under `docs/qa/**`.
- [x] Automated coverage inventory includes the expected Judge/EvaluationRun tests and gaps.
- [x] Smoke suite covers all required Judge MVP flows.
- [x] Evidence template is usable for a Human QA run.
- [x] Release confidence doc includes readiness criteria, blockers, automated commands, manual smoke requirements, rollback notes, and next workpacks.
- [x] No runtime source, dependency, package, IPC, preload, shared, renderer, export, storage, provider, or automation harness changes are made.
- [x] EP-JUDGE roadmap and workpack map are updated.
- [x] Validators, targeted docs test, `npm test`, `npm run build`, diff, whitespace, and forbidden-path checks pass.
- [x] Delivery report clearly states the smoke suite was created, not executed.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-037-judge-tests-smoke-suite`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-008-tests-smoke-suite/workpack.md`
- `node --test tests/judgeQaDocs.test.js`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Security impact
No runtime or security boundary changes. The QA docs include checks for no secret/token exposure, Markdown raw response omission, stable IPC errors, and backend label privacy wording.

## IPC impact
None. Existing IPC files are read for coverage inventory only.

## Docs impact
Creates a new `docs/qa` Judge MVP QA source of truth and planning artifacts. Updates EP-JUDGE roadmap/workpack map, a short architecture implementation note, and source-of-truth QA links.

## Rollback
Revert the new `docs/qa/**`, initiative/workpack docs, `tests/judgeQaDocs.test.js`, EP-JUDGE doc updates, architecture note, and source-of-truth links. No persisted data or runtime behavior is affected.

## Done criteria
- [x] All acceptance criteria are met.
- [x] Verification commands pass or are explicitly marked blocked.
- [x] Forbidden-path scope check is empty.
- [x] Manual smoke is recorded as pending Human QA, not completed.
- [x] REVIEW verdict is recorded.

## Risks
- Manual smoke remains required before product-smoked confidence.
- Existing automated tests cannot prove real provider availability, OS dialogs, BrowserView lifecycle, or local LLM endpoint behavior.
- Docs can drift if future Judge workpacks do not update the QA suite.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
