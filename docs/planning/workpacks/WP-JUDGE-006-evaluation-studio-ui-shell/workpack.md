# Workpack: WP-JUDGE-006 Evaluation Studio UI Shell

## Workpack ID
`WP-JUDGE-006-evaluation-studio-ui-shell`

## Title
Evaluation Studio UI Shell

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped renderer UI APPLY

## Type
Renderer UI

## Selected executor
`ai-dock-renderer-react-executor`

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
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/epic.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `src/renderer/react/App.tsx`
- `src/renderer/react/components/Sidebar.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/views/history/HistoryView.tsx`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/store/judgeSlice.ts`
- `src/shared/utils/completionsProfileLabels.ts`
- `src/shared/types/judge.ts`
- `package.json`

## Goal
Create the first Evaluation Studio shell for Judge Mode while reusing the existing Compare/Judge workflow and avoiding Judge runtime changes.

## User value
Users entering Judge from the sidebar see a standalone Evaluation Studio capability, can manually start a comparison, and can distinguish available Judge modes from planned Evaluation Studio roadmap items.

## In scope
- Create `EvaluationStudioView`.
- Route `activeLocalView === "compare"` through `EvaluationStudioView`.
- Show a concise title/intro for Evaluation Studio / Judge Mode.
- Show mode/status cards:
  - Answer comparison: available.
  - JSON contract check: available in current Judge form.
  - Custom rubric/instructions: available in current Judge form.
  - Research comparison: planned.
  - Evaluation history/export: planned.
- Show manual start state when `compareDraft` is missing.
- Create a compare draft from manual question/task, answer A, answer B, and optional labels using existing store actions.
- Reuse `CompareView` as the working answer-comparison surface.
- Add minimal CSS.
- Update initiative/workpack artifacts and `EP-JUDGE-001` status files.

## Out of scope
- New IPC.
- New shared contracts.
- Judge pipeline changes.
- Preset picker runtime integration.
- Deterministic validator expansion.
- EvaluationRun storage/history.
- Research source picker.
- BrowserView content extraction.
- File import.
- n8n integration.
- Dedicated local LLM provider.
- Large `CompareView` rewrite.

## Current architecture context
The sidebar already exposes `Judge` as local view `compare`, and `App.tsx` currently renders `CompareView` for `activeLocalView === "compare"`. `CompareView` contains the current working Judge surface, including profile selection, custom rubric, custom judge instructions, JSON contract check, and Markdown/JSON export. `useDockStore` already exposes `compareDraft` and `actions.prepareJudgeComparison`, which can create a draft and focus the compare route without new IPC.

## Allowed files
- `src/renderer/react/App.tsx`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/evaluation/**`
- `src/renderer/react/views/CompareView.tsx` only for minimal composition compatibility, if needed
- `src/renderer/react/store/useDockStore.ts` only if manual-start draft handling needs tiny type handling
- `src/renderer/react/styles/global.css`
- `docs/planning/initiatives/IN-2026-032-evaluation-studio-ui-shell/**`
- `docs/planning/workpacks/WP-JUDGE-006-evaluation-studio-ui-shell/**`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`
- `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`
- `docs/architecture/judge-mode-evaluation-studio.md` only for a short implementation note, if useful

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/judgeSlice.ts` unless PLAN proves a minimal action is required
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

## PLAN conclusion
1. `EP-JUDGE-001` epic artifacts exist, so the strong prerequisite gate is clear.
2. Judge opens today through `Sidebar` calling `focusLocalView("compare")`, and `App.tsx` renders `CompareView` for that local view.
3. `EvaluationStudioView` can replace the App route target while composing `CompareView` when a draft exists, preserving existing Chat/History prepared comparison behavior.
4. When `compareDraft` is missing, the shell can render a manual start form and call `actions.prepareJudgeComparison`.
5. `useDockStore` does not need changes because existing draft preparation accepts a question and answer list.
6. `CompareView` does not need changes because it already owns the working Judge form and results.
7. Exact files to change are `App.tsx`, new `EvaluationStudioView.tsx`, `global.css`, initiative/workpack docs, and `EP-JUDGE-001` roadmap/map status files.
8. Strong gate: none active. Any need for forbidden paths, new IPC, dependencies, provider/settings schema, history/storage, or large rewrites would stop the line.

## Step-by-step plan
1. Create initiative artifacts and prompt-pack.
2. Create `EvaluationStudioView` with header, status cards, manual start, and working area.
3. Use `compareDraft` to decide between manual start and `CompareView`.
4. Use existing `actions.prepareJudgeComparison` for manual start.
5. Update `App.tsx` to render `EvaluationStudioView` for the compare route.
6. Add minimal styles consistent with the existing dark UI.
7. Update epic roadmap/workpack map for `WP-JUDGE-006`.
8. Run validators, tests, build, diff, and forbidden-path scope checks.
9. Update delivery report, run-state, queue, and workpack status.

## Acceptance criteria
- [x] `EvaluationStudioView` exists.
- [x] App routes compare to `EvaluationStudioView`.
- [x] Existing `CompareView` is reused and not rewritten.
- [x] Empty/manual start state appears when `compareDraft` is absent.
- [x] Manual start requires both answer texts.
- [x] Manual start creates a draft through existing store action.
- [x] Available and planned mode cards render.
- [x] No new IPC, main, preload, shared, package, dependency, or provider/settings changes.
- [x] `EP-JUDGE-001` roadmap/workpack map is updated.
- [x] Automated verification is recorded.
- [x] Manual smoke checklist is recorded.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-032-evaluation-studio-ui-shell`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-006-evaluation-studio-ui-shell/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

Manual smoke checklist:
- `npm run dev:app`
- Sidebar Judge opens Evaluation Studio shell.
- Empty state appears if no `compareDraft`.
- Manual start with two answers opens working Compare/Judge surface.
- Existing prepared comparison from Chat still opens with answers.
- Run Judge without JSON validation.
- Run Judge with JSON validation.
- Custom rubric/instructions still work.
- Export MD/JSON still works.
- Chat/Form Profiles/History/Connections still open.
- BrowserView tabs still work.

## Security impact
Renderer-only UI composition. No secrets, token surfaces, IPC channels, preload bridge exposure, main-process handlers, or provider/runtime changes.

## IPC impact
None. This workpack must not add or modify IPC contracts, preload bridge APIs, main handlers, or renderer IPC consumers.

## Docs impact
Creates IN-2026-032 artifacts and `WP-JUDGE-006` prompt-pack, then updates the Judge epic roadmap/workpack map to reflect the UI shell delivery.

## Rollback
Revert `EvaluationStudioView`, the App route import/render change, the CSS additions, and the IN-2026-032/WP-JUDGE-006/EP-JUDGE-001 docs updates. Existing CompareView and Judge runtime behavior should remain available because they are not rewritten.

## Done criteria
- [x] Renderer shell implemented.
- [x] Compare route renders the shell.
- [x] Existing CompareView remains the single working Judge surface.
- [x] Manual start flow works through existing store action.
- [x] Initiative validator PASS.
- [x] Workpack validator PASS.
- [x] `npm test` PASS.
- [x] `npm run build` PASS.
- [x] `git diff --check` PASS.
- [x] Forbidden-path scope check PASS.
- [x] Delivery report complete.

## Risks
- Manual smoke may remain pending if an Electron session is not run.
- Wrapper + existing CompareView may produce some duplicate title/header chrome.
- Future modes remain planned and need separate workpacks.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
