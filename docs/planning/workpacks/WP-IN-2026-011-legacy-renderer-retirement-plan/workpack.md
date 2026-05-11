# Workpack: WP-IN-2026-011 Legacy Renderer Retirement Plan

## Workpack ID
`WP-IN-2026-011-legacy-renderer-retirement-plan`

## Title
Legacy Renderer Retirement Plan

## Status
Done

## Owner
Human + Codex

## Mode
L2 architecture/docs PLAN/APPLY/REVIEW. Runtime APPLY and file deletion are forbidden.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `package.json`
- `src/main/main.js`
- `src/renderer/**`
- `src/renderer/react/**`
- `vite.config.js`

## Goal
Create a safe architecture plan for retiring the legacy plain renderer while preserving React-owned and shared renderer support modules.

## User value
Contributors can safely plan legacy archive/deletion work without accidentally deleting active React support code.

## In scope
- Read-only renderer inventory.
- Ownership classification.
- Reference/dependency scan.
- Retirement options and recommendation.
- Follow-up workpack queue.
- Architecture report creation.
- Source-of-truth index link update.

## Out of scope
- Runtime/source changes.
- File deletion or moves.
- Package or lockfile changes.
- `main.js`, Vite, build scripts, preload, shared, or IPC changes.

## Current architecture context
ADR-003 says React is default and legacy remains an explicit fallback. IN-2026-009 implemented React default selection and `start:legacy`. Vite is rooted at `src/renderer/react`. Top-level renderer support modules remain outside `src/renderer/react/**`, but React imports them.

PLAN conclusions:
1. Legacy entrypoint is limited to `index.html`, `index.js`, `index.css`, `tabs.js`, `prompts.js`, and legacy icons.
2. Top-level `store/**`, `adapters/**`, `components/**`, and `utils/**` are active React/shared support.
3. `src/renderer/icons/deepseek.svg` is referenced by `src/main/services.js`, so icon deletion is high risk.
4. Immediate deletion is not recommended.
5. Option D staged retirement is recommended.

## Allowed files
- `docs/planning/initiatives/IN-2026-011-legacy-renderer-retirement-plan/**`
- `docs/planning/workpacks/WP-IN-2026-011-legacy-renderer-retirement-plan/**`
- `docs/architecture/renderer-retirement-plan.md`
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
1. Read governance, ADR-003, IN-2026-009 report, package scripts, main renderer selection, Vite config, and renderer inventory.
2. Scan all `src/renderer/**` files and references.
3. Classify renderer groups by ownership and risk.
4. Create `docs/architecture/renderer-retirement-plan.md`.
5. Add the report to `docs/_indexes/source-of-truth.md`.
6. Create initiative and workpack prompt-pack artifacts.
7. Run validators and forbidden-path checks.
8. Record REVIEW and delivery report.

## Acceptance criteria
- [x] Renderer retirement plan exists.
- [x] Renderer files/groups are classified.
- [x] Retirement options A-D are documented.
- [x] Recommendation is Option D staged retirement.
- [x] Follow-up workpacks are proposed.
- [x] No runtime/source/package/build files are changed by this initiative.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-011-legacy-renderer-retirement-plan`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-011-legacy-renderer-retirement-plan/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json vite.config.js scripts electron-builder.yml`

## Security impact
None. Docs-only planning does not alter sandbox, contextIsolation, preload, IPC, secrets, tokens, or renderer Node access.

## IPC impact
none

## Docs impact
- Adds `docs/architecture/renderer-retirement-plan.md`.
- Adds initiative/workpack artifacts.
- Updates source-of-truth index with the new report link.

## Rollback
Revert the docs-only changes for this initiative:
- remove `docs/architecture/renderer-retirement-plan.md`
- remove IN-2026-011 initiative/workpack folders
- remove the source-of-truth index entry for the report

## Done criteria
- Validators pass.
- Diff is docs-only and within allowed files.
- Forbidden-path check shows no initiative-caused runtime/source/package/build changes.
- Delivery report is complete.

## Risks
- Pre-existing dirty files may appear in aggregate git status.
- Shared support modules can be misread as legacy unless follow-up workpacks preserve classification.
- Legacy fallback smoke still matters until deletion.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
