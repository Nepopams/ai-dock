# Workpack: WP-UI-005 Evaluation Studio Restyle

## Workpack ID
WP-UI-005-evaluation-studio-restyle

## Title
AI Dock UI v2 Evaluation Studio Restyle

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped renderer Evaluation Studio UI APPLY

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/README.md`
- `docs/design/ui-v2/exports/3.png`
- `docs/planning/initiatives/IN-UI-001-ai-dock-ui-v2-design-handoff-inventory/delivery-report.md`
- `docs/planning/initiatives/IN-UI-002-global-design-tokens-primitives/delivery-report.md`
- `docs/planning/initiatives/IN-UI-003-shell-restyle/delivery-report.md`
- `docs/planning/initiatives/IN-UI-004-chat-view-restyle/delivery-report.md`

## Goal
Apply UI v2 visual treatment to Evaluation Studio and CompareView without changing Judge/EvaluationRun behavior.

## User value
Users get a clearer Judge workspace with stronger panel hierarchy, saved run cards, manual start inputs, Judge controls, JSON findings, dynamic score table, and export/save actions.

## In scope
- Visual-only restyle for EvaluationStudioView and CompareView if needed.
- Evaluation/Compare-related CSS updates in `global.css`.
- Roadmap status update.
- Initiative/workpack/prompt-pack artifacts and delivery report.

## Out of scope
- Judge runtime/prompt/pipeline changes.
- EvaluationRun storage/read/write/export/schema changes.
- Zustand state shape or action changes.
- IPC, preload, main, shared, package, config, dependency, or unrelated view changes.
- New Judge modes, n8n integration, preset picker runtime, or provider settings changes.

## Current architecture context
`EvaluationStudioView` owns the Studio header, mode cards, saved evaluations panel, saved run load/open/delete flows, manual start form, and composition with `CompareView`. `CompareView` owns Judge profile selection, question/rubric/custom instructions, JSON contract controls, answer selection, Run Judge, Export MD/JSON, Save Evaluation, progress/error panels, validator findings, and dynamic score criteria table. `scoreCriteria.ts`, `judgeSlice`, `useDockStore`, and shared Judge/EvaluationRun types were read to confirm runtime boundaries and remain unchanged.

## Allowed files
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/evaluation/**`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-005-evaluation-studio-restyle/**`
- `docs/planning/workpacks/WP-UI-005-evaluation-studio-restyle/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/components/chat/**`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/forms/**`
- `src/renderer/react/views/history/**`
- `src/renderer/react/views/presets/**`
- `src/renderer/react/views/prompts/**`
- `src/renderer/adapters/**`
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
1. Verify design handoff and available Judge Evaluation Studio export.
2. Read EvaluationStudioView, CompareView, evaluation helper, read-only store/shared context, package scripts, and Evaluation/Compare CSS.
3. Create initiative artifacts and prompt pack.
4. Apply bounded visual restyle using existing `--aid-*` tokens.
5. Update roadmap status and delivery report.
6. Run validators, tests, build, diff check, and forbidden-path check.

## Acceptance criteria
- Evaluation Studio and CompareView are visually aligned with UI v2.
- Saved run list, manual start form, Judge controls, answers, JSON findings, error/progress panels, score table, export, and save actions remain readable.
- Judge/EvaluationRun event handlers and behavior are preserved.
- No forbidden files are changed.
- Automated verification passes.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-005-evaluation-studio-restyle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-005-evaluation-studio-restyle/workpack.md`
- `npm test`
- `npm run build`
- `git diff --check`
- Forbidden-path status check.

## Security impact
No security boundary changes. No new IPC, preload, main, token handling, external links, storage, or dependency changes.

## IPC impact
None. Existing `window.judge`, `window.exporter`, `window.evaluationRuns`, `window.completions`, and `window.api.clipboard` usage is preserved.

## Docs impact
New initiative/workpack artifacts and roadmap status update.

## Rollback
Revert changes to the allowed Evaluation/Compare CSS/docs files from this workpack only.

## Done criteria
- PLAN answers recorded.
- APPLY completed within allowed paths.
- Validators, tests, build, diff check, and forbidden-path check pass.
- Delivery report records manual smoke status and next workpack.

## Risks
- Missing canonical PNG filename reduces design traceability.
- Visual changes can affect dense score table readability.
- Manual Electron smoke remains necessary.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`

## PLAN answers
1. Judge Evaluation Studio UI v2 export: canonical `03-judge-evaluation-studio.png` is missing. Numeric export `3.png` exists and visually matches the Judge Evaluation Studio frame; markdown handoff and tokens are also used.
2. EvaluationStudioView elements restyled: Studio shell/header, mode cards, saved evaluations panel, saved run cards/chips/actions, manual start form, working header, empty/error states.
3. CompareView elements restyled: Judge comparison shell, profile/question/rubric/custom instruction controls, JSON contract controls, answers cards, Run/Export/Save actions, progress/error panels, validator findings, dynamic score table.
4. Behaviors unchanged: manual start, prepareJudgeComparison, hydrateJudgeResult, savedRuns load/refresh/open/delete, runJudge, updateCompareDraft, export MD/JSON, save EvaluationRun, JSON contract options, dynamic criteria discovery.
5. `EvaluationStudioView` does not require handler changes; markup-only class changes are allowed only if CSS cannot target safely.
6. `CompareView` changes are visual only; no runtime/action changes.
7. `views/evaluation` helper files do not need changes; prefer no changes to `scoreCriteria.ts`.
8. CSS touched: Evaluation/Compare selectors around `.compare-view`, `.compare-*`, `.evaluation-studio-*`, `.evaluation-history-*`, `.evaluation-manual-*`, and responsive rules.
9. Deferred: Connections/Form Profiles restyle, remaining views, new Judge modes, n8n, runtime preset picker, provider/storage/export changes.
10. Exact files changed: `src/renderer/react/styles/global.css`, `docs/design/ui-v2/ui-v2-workpack-roadmap.md`, and IN/WP planning artifacts.
11. Strong gate: none active. STOP if forbidden files or behavior changes become necessary.
