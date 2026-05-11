# Workpack: WP-IN-2026-017 Renderer Support Namespace Strategy

## Workpack ID
`WP-IN-2026-017-renderer-support-namespace-strategy`

## Title
Renderer Support Namespace Strategy

## Status
Done

## Owner
Human + Codex

## Mode
L2 architecture/docs PLAN/APPLY/REVIEW. Runtime APPLY, path moves, import updates, and deletion are forbidden.

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
- `docs/architecture/renderer-retirement-plan.md`
- `docs/architecture/non-react-renderer-support-ownership.md`
- `package.json`
- `vite.config.js`
- `tsconfig.json`
- `src/renderer/react/**`
- `src/renderer/store/**`
- `src/renderer/adapters/**`
- `src/renderer/components/**`
- `src/renderer/utils/**`

## Goal
Create a proposed architecture decision for renderer support namespace strategy without changing runtime files, imports, or config.

## User value
Future renderer and legacy-retirement workpacks can rely on a clear rule: keep active top-level support as-is now, and only migrate through later gated workpacks if the value justifies the churn.

## In scope
- Read-only namespace snapshot.
- Options A-D analysis.
- ADR-004 creation.
- Follow-up workpack recommendations.
- Initiative and workpack artifacts.
- Source-of-truth index link.

## Out of scope
- `src/renderer/**` changes.
- Runtime changes.
- Import updates.
- File moves or deletion.
- Vite alias changes.
- `tsconfig.json` changes.
- `package.json` or `package-lock.json` changes.
- Dependency changes.
- React UI or legacy fallback changes.

## Current architecture context
React is the default renderer mode. Legacy plain renderer is a separate explicit fallback and retirement track. IN-2026-014 proved that top-level `store/**`, `adapters/**`, `components/**`, and `utils/**` are active React dependencies. Vite is rooted at `src/renderer/react`, and `tsconfig.json` currently includes `src/renderer/react` and `src/types`.

Current namespace snapshot:
- `src/renderer/react/**` = React app source.
- `src/renderer/store/**` = active Zustand slice support.
- `src/renderer/adapters/**` = active BrowserView/Web adapter support.
- `src/renderer/components/**` = active shared React components outside React root.
- `src/renderer/utils/**` = active renderer utilities.
- Legacy entrypoint = separate retirement track.

Affected modules:
- docs/architecture decisions
- docs/planning artifacts
- docs index
- Runtime modules are read-only context only.

## Allowed files
- `docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy/**`
- `docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/**`
- `docs/architecture/decisions/**`
- `docs/_indexes/source-of-truth.md` only for the ADR link
- `docs/architecture/non-react-renderer-support-ownership.md` only for a short ADR link if needed

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
1. Read governance, Initiative Runner workflow, ADR-003, renderer retirement plan, IN-2026-014 ownership audit, package scripts, Vite config, TypeScript config, and renderer support inventory.
2. Confirm next ADR number.
3. Summarize current namespace snapshot.
4. Evaluate Options A-D for benefits, risks, migration cost, import churn, Vite/TS impact, verification needs, future workpacks, and strong gates.
5. Create ADR-004 with Status Proposed.
6. Create initiative artifacts and prompt pack.
7. Add ADR-004 to source-of-truth index.
8. Run validators and scope checks.
9. Update delivery report and run-state.

## Acceptance criteria
- [x] Initiative artifacts exist.
- [x] Workpack and prompt-pack exist.
- [x] ADR-004 exists and has Status Proposed.
- [x] Options A-D are documented.
- [x] Recommendation is Option A now, with C/D deferred.
- [x] Follow-up workpacks IN-2026-018 through IN-2026-023 are proposed.
- [x] No immediate migration is authorized.
- [x] Validators pass.
- [x] Forbidden-path scope check confirms no initiative-caused runtime/source/package/build changes.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

Runtime tests/build/smoke are not run because this is docs-only and runtime APPLY is forbidden.

## Security impact
None. This workpack does not change sandbox, contextIsolation, preload bridge, IPC contracts, renderer Node access, secrets, tokens, or logging.

## IPC impact
None.

## Docs impact
- Adds `docs/architecture/decisions/ADR-004-renderer-support-namespace-strategy.md`.
- Adds initiative/workpack artifacts.
- Updates `docs/_indexes/source-of-truth.md` with ADR-004.

## Rollback
Revert this docs-only initiative:
- remove `docs/architecture/decisions/ADR-004-renderer-support-namespace-strategy.md`
- remove `docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy/**`
- remove `docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/**`
- remove ADR-004 entry from `docs/_indexes/source-of-truth.md`

## Done criteria
- Validators pass.
- Diff remains docs-only and inside allowed files.
- Forbidden-path scope check is clean except pre-existing unrelated dirty files.
- ADR recommendation avoids immediate migration.
- Delivery report includes files consulted, files changed, commands run, verification, risks, and follow-ups.

## Risks
- Deferring migration preserves some naming ambiguity.
- Future migration cost can grow if renderer support expands.
- Existing dirty `package-lock.json` can appear in status output but is not part of this workpack.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
