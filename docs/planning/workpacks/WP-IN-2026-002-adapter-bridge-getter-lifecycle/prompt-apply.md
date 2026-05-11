# APPLY Prompt - AdapterBridge Getter Lifecycle

## Preconditions
- PLAN completed and found no strong human gate.
- Workpack validates.
- Allowed/forbidden paths are explicit.
- Selected executor: `ai-dock-main-process-executor`.

## Executor-aware context
- Selected executor: `ai-dock-main-process-executor`
- Primary skill: `ai-dock-main-process-executor`
- Secondary executor: `ai-dock-ipc-security-reviewer`
- Allowed paths:
  - `src/main/browserViews/adapterBridge.js`
  - `src/main/ipc/bootstrap.js`
  - `docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle/**`
  - `docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/**`
  - `docs/_indexes/ipc-index.md` only if PLAN confirms docs impact
  - `docs/architecture/service-catalog.md` only if PLAN confirms docs impact
- Forbidden paths:
  - `src/preload/**`
  - `src/renderer/**`
  - `src/shared/**`
  - `tests/**` unless separately justified by PLAN
  - `package.json`
  - `package-lock.json`
  - `node_modules/**`
  - `dist/**`
  - `build/**`
  - `release/**`
- Approved PLAN summary:
  - `adapterBridge.js` is already late-bound and should not be changed unless verification reveals a Must Fix.
  - `bootstrap.js` should remove the unused direct `tabManager` parameter from `registerMainIpc`.
  - No docs index update required.
- Stop-the-line triggers:
  - Need to change preload/renderer/shared/package/lockfile/dependencies.
  - Need to add or rename IPC channels.
  - Need to change adapter response shape.
  - Need to modify `adapterBridge.ts` or tests without expanded gate.
- Verification commands:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/workpack.md`
  - `node --check src/main/browserViews/adapterBridge.js`
  - `node --check src/main/ipc/bootstrap.js`
  - `npm test`
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src/preload src/renderer src/shared package.json package-lock.json`
- Required docs/index updates: initiative/workpack state only; no IPC/service catalog update planned.
- Review Gate checklist: no stale direct AdapterBridge tabManager closure, no IPC contract drift, forbidden paths unchanged, verification recorded.

## Execution rules
- Make the smallest possible runtime diff.
- Do not touch forbidden paths.
- Preserve `adapter:exec` and `adapter:ping`.
- Preserve `{ ok: true, data }` and `{ ok: false, error, code }`.

## Verification
Run all verification commands and record actual results in initiative `run-state.md` and `delivery-report.md`.

## Report
1. What changed.
2. Files consulted.
3. Files changed.
4. Commands run.
5. Verification results.
6. Risks.
