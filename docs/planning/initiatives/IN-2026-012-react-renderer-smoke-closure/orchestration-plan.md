# Orchestration Plan - IN-2026-012

## Initiative summary
Docs/evidence initiative to close the pending manual smoke from IN-2026-009 and record GO confidence for the React renderer default path.

## Assumptions
- The human-provided smoke evidence is accepted as the manual QA source for this closure.
- ADR-003 is already Accepted and does not need edits.
- IN-2026-011 remains planning-only and does not authorize legacy deletion.
- `npm run start:legacy` evidence is ambiguous (`PASS / NOT TESTED`), so it is non-blocking for React default confidence and remains a fallback follow-up if not actually exercised.
- No runtime changes are needed.

## Selected delivery mode
L2 docs/evidence APPLY. Runtime APPLY is forbidden.

## Epic breakdown
- E1: Read governance and renderer strategy context.
- E2: Create manual smoke evidence report.
- E3: Create initiative and workpack artifacts.
- E4: Validate artifacts and forbidden-path scope.

## Sprint mapping
Renderer consolidation / post React default smoke closure.

One docs-only workpack: `WP-IN-2026-012-react-renderer-smoke-closure`.

## Workpack queue
- `WP-IN-2026-012-react-renderer-smoke-closure` - Done.

## Executor routing
- Primary: Codex Initiative Runner.
- Secondary: docs/evidence reviewer posture.
- No runtime executor is selected because runtime APPLY is forbidden.

## Gate plan
- Scope gate: passed; allowed files are docs-only.
- Evidence gate: passed; no blocking FAIL was provided.
- Apply gate: docs-only.
- Review gate: validators, diff check, and forbidden-path status check.

## Verification strategy
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-012-react-renderer-smoke-closure`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-012-react-renderer-smoke-closure/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json vite.config.js scripts electron-builder.yml`

## Risk register
- Risk: fallback smoke ambiguity. Mitigation: record as non-blocking for React default and repeat before legacy retirement.
- Risk: manual evidence is not automated. Mitigation: record source and keep future automation as follow-up.
- Risk: pre-existing dirty `package-lock.json` appears in scope checks. Mitigation: document as unrelated and leave untouched.
