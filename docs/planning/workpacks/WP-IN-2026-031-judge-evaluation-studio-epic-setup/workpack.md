# Workpack: WP-IN-2026-031 Judge Evaluation Studio Epic Setup

## Workpack ID
`WP-IN-2026-031-judge-evaluation-studio-epic-setup`

## Title
Judge Evaluation Studio Epic Setup

## Status
Completed

## Owner
Human + Codex

## Mode
L2 docs/governance APPLY. Runtime APPLY is forbidden.

## Type
`docs-governance`

## Selected executor
- `ai-dock-initiative-runner`

## Primary skill
- Initiative Runner

## Secondary executors
- Workflow validation

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/human-gates.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/delivery-report.md`
- `docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening/delivery-report.md`
- `docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog/delivery-report.md`
- `docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt/delivery-report.md`
- `docs/planning/initiatives/IN-2026-027-judge-json-contract-validator/delivery-report.md`
- `docs/planning/initiatives/IN-2026-028-judge-sidebar-entry/delivery-report.md`
- `docs/planning/initiatives/IN-2026-030-judge-local-llm-backend-labeling-ux/delivery-report.md`

## Goal
Create the `EP-JUDGE-001` epic source of truth for Judge Mode / Evaluation Studio MVP, link completed foundation work, and prepare a bounded roadmap before `WP-JUDGE-006 Evaluation Studio UI Shell`.

## User value
Developers and Codex can quickly understand what Judge foundation layers are complete, what comes next, what belongs to MVP, what is deferred, and why the next UI Shell work must be separate from history/export and n8n integration.

## In scope
- Create IN-2026-031 initiative artifacts.
- Create this docs/governance workpack and prompt-pack.
- Create `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/epic.md`.
- Create `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/roadmap.md`.
- Create `docs/planning/epics/EP-JUDGE-001-evaluation-studio-mvp/workpack-map.md`.
- Create `docs/planning/epics/_README.md`.
- Create `docs/planning/sprints/_README.md`.
- Update `source-of-truth.md` and `feature-index.md` only with epic discoverability links.

## Out of scope
- `WP-JUDGE-006` runtime/UI implementation.
- Evaluation Studio UI.
- Any renderer/main/shared/preload changes.
- New runtime tests.
- n8n integration.
- Architecture or ADR-005 meaning changes.
- Package/dependency/build/script changes.

## Current architecture context
ADR-005 treats Judge Mode as a first-class Evaluation Studio capability and explicitly requires staged workpacks. Foundation workpacks `WP-JUDGE-001` through `WP-JUDGE-005` are complete, and `IN-2026-028` exposed the existing Judge entry point. The next major work is `WP-JUDGE-006`, but it needs an epic container to preserve the completed foundation and avoid bundling UI shell, history/export, tests, research, and n8n preflight into one giant APPLY.

## Allowed files
- `docs/planning/epics/**`
- `docs/planning/sprints/**`
- `docs/planning/initiatives/IN-2026-031-judge-evaluation-studio-epic-setup/**`
- `docs/planning/workpacks/WP-IN-2026-031-judge-evaluation-studio-epic-setup/**`
- `docs/_indexes/source-of-truth.md` only for epic links
- `docs/_indexes/feature-index.md` only for epic link

## Forbidden files
- `src/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `electron-builder.yml`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## PLAN conclusion
1. Judge Mode needs an epic because completed Judge workpacks now form a capability-level direction rather than isolated CompareView patches.
2. A sprint folder is not needed now because sprint layer is optional and no release/delivery slice is being scheduled; the epic roadmap can hold MVP slices.
3. Existing workpacks in the epic: `WP-JUDGE-001`, `WP-JUDGE-002`, `WP-JUDGE-003`, `WP-JUDGE-004`, `WP-JUDGE-005`, and `IN-2026-028`.
4. Future MVP roadmap workpacks: `WP-JUDGE-006`, `WP-JUDGE-007`, `WP-JUDGE-008`, `WP-JUDGE-009`, and `WP-JUDGE-010`.
5. Docs files to change are limited to initiative artifacts, workpack/prompt-pack, epic folder, optional planning README notes, and index links.
6. Strong gate: none. Runtime/package/build/script changes would trigger stop-the-line but are not needed.
7. Verification: initiative validator, workpack validator, `git diff --check`, status/stat review, and forbidden-path scope check.

## Step-by-step plan
1. Read required governance, workflow, architecture, index, and Judge delivery report context.
2. Inspect existing planning folders and validator requirements.
3. Create IN-2026-031 initiative artifacts.
4. Create this workpack and prompt-pack.
5. Create `EP-JUDGE-001` epic files.
6. Create optional epics/sprints README notes.
7. Add index links for epic discoverability.
8. Run required validators and scope checks.
9. Update run-state and delivery report with final command results.

## Acceptance criteria
- [x] Initiative artifacts exist.
- [x] Workpack and prompt-pack exist.
- [x] `EP-JUDGE-001` folder exists.
- [x] `epic.md`, `roadmap.md`, and `workpack-map.md` exist.
- [x] Completed Judge foundation workpacks are linked.
- [x] `WP-JUDGE-006` is marked Next and not implemented.
- [x] Sprint layer is explained as optional.
- [x] Runtime/package/build/script files are unchanged by this initiative.
- [x] Validators and diff/scope checks pass.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-031-judge-evaluation-studio-epic-setup`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-031-judge-evaluation-studio-epic-setup/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js electron-builder.yml scripts`

## Security impact
None for this docs-only workpack. No runtime, IPC, preload, renderer, provider, token, or secret handling changes.

## IPC impact
None. No IPC contracts, channels, handlers, preload bridge exposure, or renderer consumers are changed.

## Docs impact
Creates epic-level Judge planning artifacts and updates indexes for discoverability. Does not change architecture report or ADR-005 meaning.

## Rollback
Delete the IN-2026-031 initiative folder, the `WP-IN-2026-031` workpack folder, the `EP-JUDGE-001` epic folder, the optional planning README notes if undesired, and remove the added epic links from `source-of-truth.md` and `feature-index.md`.

## Done criteria
- [x] Epic folder and required epic files created.
- [x] Roadmap slices recorded.
- [x] Workpack map includes completed, next, and later Judge work.
- [x] `WP-JUDGE-006` is documented as the next separate workpack.
- [x] Sprint layer optionality is documented.
- [x] Initiative validator PASS.
- [x] Workpack validator PASS.
- [x] Diff check PASS.
- [x] Forbidden runtime/package/build/script scope check PASS.
- [x] Delivery report complete.

## Risks
- Manual smoke is pending for prior UI-facing Judge workpacks.
- The epic can become stale if future Judge workpacks do not update it.
- `WP-JUDGE-006` remains a future runtime workpack and still needs Human Gate approval.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
