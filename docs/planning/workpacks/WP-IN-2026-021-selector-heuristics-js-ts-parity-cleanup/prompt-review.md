# Prompt Review: WP-IN-2026-021

## Role
You are `ai-dock-test-qa-executor` reviewing the scoped parity cleanup.

## Review checks
- No forbidden paths changed.
- No package/tsconfig/script changes.
- No React import changes.
- No adapter implementation changes.
- TS/JS logic is unchanged except comments.
- Node selector tests cover defaults, parity, override ordering, duplicate removal, trimming, and JS falsy handling.
- Documentation states JS parity artifact ownership.

## Required commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-021-selector-heuristics-js-ts-parity-cleanup`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup/workpack.md`
- `node --test tests/selectorHeuristics.test.js`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/react src/renderer/adapters/impl package.json package-lock.json tsconfig.json vite.config.js scripts`

## Verdict
Return GO only if verification passes and the forbidden-path check has no new workpack-related changes.
