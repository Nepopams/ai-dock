# Workpack: WP-IN-2026-014 Non-React Renderer Support Ownership Audit

## Workpack ID
`WP-IN-2026-014-non-react-renderer-support-ownership-audit`

## Title
Non-React Renderer Support Ownership Audit

## Status
Done

## Owner
Human + Codex

## Mode
L2 architecture/docs PLAN/APPLY/REVIEW. Runtime APPLY, file moves, and file deletion are forbidden.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/human-gates.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/renderer-retirement-plan.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `package.json`
- `vite.config.js`
- `src/renderer/react/**`
- `src/renderer/store/**`
- `src/renderer/adapters/**`
- `src/renderer/components/**`
- `src/renderer/utils/**`
- `src/renderer/index.html`
- `src/renderer/index.js`
- `src/renderer/tabs.js`
- `src/renderer/prompts.js`

## Goal
Classify top-level renderer support modules outside `src/renderer/react/**` so future legacy renderer retirement cannot accidentally delete active React dependencies.

## User value
Developers have a concrete ownership map and follow-up queue for renderer support namespace decisions, migrations, and cleanup.

## In scope
- Read-only renderer inventory.
- Dependency/reference map across React, legacy, main/preload/shared, and tests.
- Ownership classification model and classification table.
- Architecture report creation.
- Initiative and prompt-pack artifacts.
- Source-of-truth index link for the report.

## Out of scope
- Runtime code edits.
- File moves.
- File deletion.
- Import updates.
- Vite/TypeScript path alias changes.
- Package or lockfile edits.
- Dependency changes.
- Legacy entrypoint deletion.

## Current architecture context
ADR-003 states that React renderer is the default development/runtime UI and legacy plain renderer is an explicit fallback. The renderer retirement plan already warns that not every file outside `src/renderer/react/**` is legacy. This workpack sharpens that warning into a file/group ownership table.

PLAN conclusions:
1. `src/renderer/react/store/useDockStore.ts` imports all top-level store slices and top-level adapter registry modules.
2. React settings, presets, forms, and chat views import top-level adapters, components, store helpers, and utils.
3. Legacy `index.js` imports only `tabs.js` and `prompts.js`; no legacy import of top-level support modules was found.
4. `tests/selectorHeuristics.test.js` imports `src/renderer/adapters/selectorHeuristics.js`.
5. `src/main/services.js` references `src/renderer/icons/deepseek.svg`, so top-level icons need separate ownership cleanup.

Affected modules:
- docs/planning only
- docs/architecture only
- docs index only
- Runtime modules are read-only context only.

## Allowed files
- `docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit/**`
- `docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/**`
- `docs/architecture/non-react-renderer-support-ownership.md`
- `docs/_indexes/source-of-truth.md` only for the report link

## Forbidden files
- `src/main/**`
- `src/renderer/**`
- `src/preload/**`
- `src/shared/**`
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
1. Read governance, Initiative Runner, ADR-003, renderer retirement plan, IN-2026-009 delivery report, package scripts, Vite config, and renderer source context.
2. Inventory `src/renderer/**` and tracked source files.
3. Scan React imports and references to top-level `store/**`, `adapters/**`, `components/**`, and `utils/**`.
4. Scan legacy entrypoint references, main/preload/shared references, and tests.
5. Classify each support file or small group.
6. Create `docs/architecture/non-react-renderer-support-ownership.md`.
7. Create initiative artifacts and prompt pack.
8. Add source-of-truth index link for the new report.
9. Run validators and scope checks.
10. Record delivery report and REVIEW verdict.

## Acceptance criteria
- [x] Initiative artifacts exist.
- [x] Workpack and prompt-pack exist.
- [x] Architecture report exists.
- [x] Top-level renderer support modules are classified.
- [x] Dependency map includes React, legacy, main/preload, and test usage where found.
- [x] Follow-up workpacks IN-2026-017 through IN-2026-022 are proposed.
- [x] Legacy deletion is not authorized.
- [x] Validators pass.
- [x] Forbidden-path check confirms no initiative-caused runtime/source/package/build changes.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

Runtime tests/build/smoke are not part of this docs-only initiative because no runtime behavior is changed.

## Security impact
None. This workpack does not change sandbox, contextIsolation, preload bridge, IPC contracts, renderer Node access, secrets, tokens, or logs.

## IPC impact
None. AdapterBridge IPC is referenced only as context for adapter runtime ownership.

## Docs impact
- Adds `docs/architecture/non-react-renderer-support-ownership.md`.
- Adds initiative/workpack artifacts.
- Updates `docs/_indexes/source-of-truth.md` with the new report link.

## Rollback
Revert this docs-only initiative:
- remove `docs/architecture/non-react-renderer-support-ownership.md`
- remove `docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit/**`
- remove `docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/**`
- remove the source-of-truth index entry for the report

## Done criteria
- Validators pass.
- Diff remains docs-only and inside allowed files.
- Forbidden-path scope check is clean except for pre-existing unrelated worktree changes.
- Delivery report includes files consulted, files changed, commands run, verification, risks, and follow-ups.

## Risks
- Existing dirty worktree files may appear in broad status output.
- Future work can still misuse the report unless workpacks enforce import checks.
- Namespace migration will require runtime import changes and React smoke in separate gated workpacks.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
