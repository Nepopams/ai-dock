# Prompt Review: WP-JUDGE-002 Evaluation Preset Catalog

## Mode
REVIEW, read-only.

## Review checks
- Catalog created.
- Shared types/guards are isolated from current Judge contracts.
- No Judge runtime behavior changed.
- No IPC/preload/main/renderer changes.
- No package/lock/dependency/config/script changes.
- Tests validate catalog.
- Build passes.
- Workpack/initiative validators pass.
- Delivery report lists next workpacks.

## Required commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-002-evaluation-preset-catalog/workpack.md`
- `node --check src/shared/types/evaluationPreset.js`
- `node --test tests/evaluationPresets.test.js`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/renderer src/shared/ipc src/shared/types/judge.ts src/shared/types/judge.js src/shared/prompts/judge package.json package-lock.json tsconfig.json vite.config.js scripts`
