# Orchestration Plan - IN-2026-014

## Initiative summary
Run a docs-only architecture audit of non-React top-level renderer support modules. The initiative creates a report, initiative run-state artifacts, and a bounded workpack without changing runtime/source/package/build files.

## Assumptions
- Safe assumption: ADR-003 and the renderer retirement plan are current guidance for React-default and legacy fallback semantics.
- Safe assumption: Read-only scans of `src/renderer/**`, main/preload/shared references, and tests are sufficient to classify ownership for planning.
- Safe assumption: Updating `docs/_indexes/source-of-truth.md` with the new report link is allowed and does not change runtime behavior.
- Blocking assumption: Any import move, deletion, package/build edit, or runtime source edit requires a separate Human Gate and is outside this initiative.

## Selected delivery mode
L2 architecture/docs analysis initiative. Docs-only APPLY is allowed in explicitly allowed paths. Runtime APPLY is forbidden.

## Epic breakdown
- Epic ID: E1
- Title: Inventory and dependency mapping
- Scope: Scan renderer files and references from React, legacy entrypoint, main/preload/shared, tests, and docs.
- Risk profile: low for read-only analysis, high if findings are misused for deletion.
- Success criteria: top-level support modules and dependencies are mapped.

- Epic ID: E2
- Title: Ownership classification report
- Scope: Create `docs/architecture/non-react-renderer-support-ownership.md`.
- Risk profile: docs-only.
- Success criteria: classifications, recommendations, follow-up workpacks, and future rules are documented.

- Epic ID: E3
- Title: Initiative/workpack packaging
- Scope: Create file-backed initiative state and workpack prompt pack.
- Risk profile: docs-only.
- Success criteria: validators pass and forbidden-path check confirms no source/package/build changes caused by the initiative.

## Sprint mapping
- Sprint / slice: Renderer consolidation / pre legacy archive.
- Workpack candidates: `WP-IN-2026-014-non-react-renderer-support-ownership-audit`.
- Dependencies: ADR-003, renderer retirement plan, IN-2026-009 delivery report, current renderer source inventory.
- Exit criteria: architecture report created, validators pass, runtime scope clean.

## Workpack queue
- Workpack ID: `WP-IN-2026-014-non-react-renderer-support-ownership-audit`
- Type: docs-only architecture audit
- Purpose: classify top-level renderer support modules and propose follow-up workpacks.
- Dependency: none beyond read-only source/governance context.
- Expected status: Done after validation.

## Executor routing
- Workpack ID: `WP-IN-2026-014-non-react-renderer-support-ownership-audit`
- Selected executor: `ai-dock-initiative-runner`
- Primary skill: `ai-dock-initiative-runner`
- Secondary executors: none
- Rationale: this is an initiative-level docs-only architecture audit. Runtime executors are not needed because runtime APPLY is forbidden.

## Gate plan
- Soft gates:
  - Naming and folder selection for initiative/workpack artifacts.
  - Docs-only source-of-truth index link update.
  - Follow-up workpack sequencing.
- Strong human gates:
  - Runtime/source/package/build changes.
  - File moves/deletions.
  - Import/path alias/build script changes.
  - Any recommendation to immediately delete or move support modules.
- Gate owner: Human for strong gates; Codex may log soft gates.
- Expected decision point: no strong gate expected for the docs-only audit.

## Verification strategy
- Docs/workflow validation:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/workpack.md`
- Runtime tests: not run because runtime code is not changed.
- Smoke/manual QA: not run because runtime behavior is not changed.
- Commands:
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Risk register
- Risk: top-level support modules are mistaken for legacy in future deletion work.
- Impact: React runtime breakage.
- Mitigation: report states they are active React dependencies and future work requires import checks.
- Owner: Human + future workpack owner.
- Status: mitigated by documentation.

- Risk: `selectorHeuristics.js` is deleted because TS runtime uses `selectorHeuristics.ts`.
- Impact: test breakage and loss of JS parity evidence.
- Mitigation: classify as `migration-residue` and require IN-2026-021.
- Owner: future workpack owner.
- Status: open follow-up.

- Risk: legacy icons are deleted as renderer-only assets while main references `deepseek.svg`.
- Impact: service icon path breakage.
- Mitigation: require IN-2026-022 before icon deletion/archive.
- Owner: future workpack owner.
- Status: open follow-up.
