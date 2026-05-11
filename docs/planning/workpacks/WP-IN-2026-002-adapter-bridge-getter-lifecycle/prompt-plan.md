# PLAN Prompt - AdapterBridge Getter Lifecycle

## Режим
PLAN ONLY, repo-aware runtime analysis.

## Sources to read
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `src/main/main.js`
- `src/main/ipc/bootstrap.js`
- `src/main/browserViews/adapterBridge.js`
- `src/main/ipc/shell.js`
- `docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/workpack.md`

## Understanding
Проверить L3 scoped runtime autonomy на AdapterBridge lifecycle. Public IPC channels and shapes must stay unchanged. Preload/renderer/shared/package/dependency files are forbidden.

## Inspected files
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`
- `src/main/main.js`
- `src/main/ipc/bootstrap.js`
- `src/main/browserViews/adapterBridge.js`
- `src/main/ipc/shell.js`
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `package.json`

## File-level implementation plan
1. `src/main/browserViews/adapterBridge.js`: no change planned; it already accepts `{ getTabManager }`, resolves `tabManager` per `adapter:exec`, preserves `adapter:ping` and response shape.
2. `src/main/ipc/bootstrap.js`: remove the unused `tabManager` destructured parameter from `registerMainIpc`.
3. Initiative/workpack docs: update queue, run-state, gates and delivery report after APPLY/verification/REVIEW.
4. No docs index update: `ipc-index.md` and `service-catalog.md` already describe late-bound `getTabManager` access.

## Verification plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/workpack.md`
- `node --check src/main/browserViews/adapterBridge.js`
- `node --check src/main/ipc/bootstrap.js`
- `npm test`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/preload src/renderer src/shared package.json package-lock.json`

## Gate evaluation
- Strong gate: none.
- PLAN valid: yes.
- Workpack valid pending validator run.
- Selected executor: `ai-dock-main-process-executor`.
- Allowed/forbidden paths: explicit.
- Verification commands: explicit and runnable.

## Risks
- `src/main/browserViews/adapterBridge.ts` is a stale counterpart outside scope.
- Manual Electron smoke remains pending unless the human runs it.

## Questions
None blocking.
