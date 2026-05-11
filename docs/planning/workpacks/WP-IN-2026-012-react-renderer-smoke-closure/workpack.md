# Workpack: WP-IN-2026-012 React Renderer Smoke Closure

## Workpack ID
`WP-IN-2026-012-react-renderer-smoke-closure`

## Title
React Renderer Smoke Closure

## Status
Done

## Owner
Human + Codex

## Mode
L2 docs/evidence PLAN/APPLY/REVIEW. Runtime APPLY is forbidden.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/renderer-retirement-plan.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `package.json`

## Goal
Record human-provided manual smoke evidence and close the IN-2026-009 pending manual smoke for React renderer default confidence.

## User value
Developers and Codex can treat the React renderer default path as the validated baseline for further renderer planning.

## In scope
- Create smoke evidence report.
- Create initiative artifacts.
- Create workpack prompt pack.
- Update source-of-truth index with report link.
- Run docs/workflow validators and forbidden-path checks.

## Out of scope
- Runtime/source changes.
- Package or lockfile changes.
- Build script, Vite, or Electron builder changes.
- ADR-003 changes.
- Legacy archive, move, deletion, or fallback behavior changes.

## Current architecture context
ADR-003 is Accepted and states that React is the default development/runtime UI while legacy remains an explicit fallback. IN-2026-009 implemented the React default switch but left manual smoke pending. IN-2026-011 documented that legacy retirement is staged and deletion remains forbidden without a separate gated workpack.

PLAN conclusions:
1. Human-provided evidence covers React dev app, local views, BrowserView tabs, prompt tools, and production-style `npm start`.
2. No blocking React or preload errors were reported.
3. React default confidence can move from CONDITIONAL GO to GO.
4. `npm run start:legacy` is ambiguous as `PASS / NOT TESTED`; this does not block React default confidence but remains a fallback follow-up if not actually tested.
5. No runtime, package, build, ADR, or renderer strategy changes are needed.

## Allowed files
- `docs/planning/initiatives/IN-2026-012-react-renderer-smoke-closure/**`
- `docs/planning/workpacks/WP-IN-2026-012-react-renderer-smoke-closure/**`
- `docs/architecture/react-renderer-smoke-report.md`
- `docs/_indexes/source-of-truth.md`

## Forbidden files
- `src/main/**`
- `src/renderer/**`
- `src/preload/**`
- `src/shared/**`
- `package.json`
- `package-lock.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Read required governance, ADR, retirement plan, IN-2026-009 delivery report, and package scripts.
2. Record human-provided manual smoke evidence in `docs/architecture/react-renderer-smoke-report.md`.
3. Create initiative run-state artifacts.
4. Create this workpack and prompt pack.
5. Add smoke report link to source-of-truth index.
6. Run initiative/workpack validators.
7. Run diff and forbidden-path checks.
8. Record delivery report and review verdict.

## Acceptance criteria
- [x] Smoke report exists.
- [x] Manual smoke closure is recorded.
- [x] React default confidence is GO.
- [x] Legacy deletion is not authorized.
- [x] Runtime/source/package/build files are not changed by this initiative.
- [x] Validators pass.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-012-react-renderer-smoke-closure`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-012-react-renderer-smoke-closure/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json vite.config.js scripts electron-builder.yml`

## Security impact
None. Docs-only evidence capture does not alter sandbox, contextIsolation, preload, IPC, secrets, tokens, or renderer Node access.

## IPC impact
none

## Docs impact
- Adds `docs/architecture/react-renderer-smoke-report.md`.
- Adds IN-2026-012 initiative/workpack artifacts.
- Updates source-of-truth index with the new report link.

## Rollback
Revert the docs-only changes for this initiative:
- remove `docs/architecture/react-renderer-smoke-report.md`
- remove IN-2026-012 initiative/workpack folders
- remove the source-of-truth index entry for the report

## Done criteria
- Validators pass.
- Diff is docs-only and within allowed files.
- Forbidden-path check shows no initiative-caused runtime/source/package/build changes.
- Delivery report is complete.

## Risks
- Legacy fallback status is ambiguous and may require a later manual smoke before retirement work.
- Manual smoke evidence is not automated UI smoke.
- Pre-existing dirty `package-lock.json` may appear in aggregate git status.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
