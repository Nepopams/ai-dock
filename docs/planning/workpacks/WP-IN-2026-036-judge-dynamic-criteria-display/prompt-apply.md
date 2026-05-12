# Prompt: APPLY - WP-IN-2026-036 Judge Dynamic Criteria Display

MODE: APPLY.

## Preconditions
- Human approval context exists for `IN-2026-036`.
- Workpack and PLAN are valid.
- Gate evaluation found no active strong gate.
- Selected executor: `ai-dock-renderer-react-executor`.

## Task
Implement dynamic score criteria display in `CompareView` within the allowed files.

## Implementation requirements
- Add a pure helper `discoverScoreCriteria(result: JudgeResult | null): string[]`.
- Read all score buckets from `result.scores`.
- Preserve preferred default order: `coherence`, `factuality`, `helpfulness`.
- Append additional criteria in first-seen order.
- Trim, de-duplicate, and ignore invalid/empty criteria.
- Update `findScore` to accept `criterion: string`.
- Replace the fixed criteria array with dynamic `scoreCriteria`.
- Render `No score criteria returned.` when no criteria are discovered.
- Add targeted helper tests.
- Do not change main/preload/shared/store/export/storage/package files.

## Verification
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-036-judge-dynamic-criteria-display`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-036-judge-dynamic-criteria-display/workpack.md`
- `node --test tests/judgeDynamicCriteria.test.js`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Stop conditions
- Need to touch forbidden paths.
- Need shared type/contract changes.
- Need Judge pipeline/export/storage/preload/main changes.
- Need dependency or package metadata changes.
- Need large CompareView redesign.
