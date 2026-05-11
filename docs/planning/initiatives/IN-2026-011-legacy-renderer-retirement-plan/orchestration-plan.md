# Orchestration Plan - IN-2026-011

## Initiative summary
Docs-only architecture planning initiative for safe legacy renderer retirement after React became the default renderer path.

## Assumptions
- ADR-003 is the active renderer strategy source.
- The current working tree already contains ADR-003 acceptance docs from a prior request; this initiative does not modify ADR-003.
- Generated `src/renderer/react/dist/**` files are observed on disk but are not tracked source files.
- No runtime changes are needed to complete this planning initiative.

## Selected delivery mode
L2 architecture/docs planning. Runtime APPLY and file deletion are forbidden.

## Epic breakdown
- E1: Read-only renderer inventory.
- E2: Ownership classification and reference scan.
- E3: Retirement roadmap and follow-up workpack plan.

## Sprint mapping
- Renderer consolidation / post React default switch.
- One docs-only workpack: `WP-IN-2026-011-legacy-renderer-retirement-plan`.

## Workpack queue
- `WP-IN-2026-011-legacy-renderer-retirement-plan` - Done.

## Executor routing
- Primary: Codex Initiative Runner.
- Secondary: architecture/docs reviewer posture.
- No runtime executor is selected because runtime APPLY is forbidden.

## Gate plan
- Scope gate: passed; docs-only allowed files are explicit.
- Plan gate: passed; findings do not require runtime changes.
- Apply gate: docs-only; allowed paths only.
- Review gate: validators and forbidden-path checks.

## Verification strategy
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-011-legacy-renderer-retirement-plan`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-011-legacy-renderer-retirement-plan/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json vite.config.js scripts electron-builder.yml`

## Risk register
- Risk: shared support modules can be mistaken for legacy because they live outside `src/renderer/react/**`. Mitigation: classify as shared-renderer-support and forbid deletion.
- Risk: legacy icon paths are still referenced by `src/main/services.js`. Mitigation: classify icon deletion as high risk.
- Risk: pre-existing dirty files can obscure scope. Mitigation: record them in delivery report and final response.
