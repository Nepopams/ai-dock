# Prompt Review: WP-JUDGE-001 Current Contract Hardening

## Mode
REVIEW, read-only.

## Review checks
- Backward compatibility preserved.
- No package/lock/dependency changes.
- No provider settings migration.
- No new IPC channels.
- Error details sanitized.
- Current CompareView not redesigned.
- Tests added and PASS.
- Build/preload PASS or failures documented.
- No secrets/tokens in renderer-visible errors.
- Workpack/initiative validators PASS.
- Delivery report contains follow-ups.

## Required commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-001-current-contract-hardening/workpack.md`
- `node --check src/main/ipc/judge.ipc.js`
- `node --check src/main/services/judgePipeline.js`
- `node --check src/preload/modules/judge.js`
- `node --check src/preload/utils/judge.js`
- `npm test`
- `npm run preload:build`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- package.json package-lock.json tsconfig.json vite.config.js scripts src/main/providers src/main/services/settings.js src/shared/prompts/judge`
