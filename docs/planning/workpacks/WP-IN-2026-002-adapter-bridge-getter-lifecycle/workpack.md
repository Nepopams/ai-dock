# Workpack: AdapterBridge Getter Lifecycle

## Workpack ID
`WP-IN-2026-002-adapter-bridge-getter-lifecycle`

## Title
AdapterBridge Getter Lifecycle.

## Status
Done

## Owner
Human + Codex.

Selected executor: `ai-dock-main-process-executor`.

Secondary executor: `ai-dock-ipc-security-reviewer`.

## Mode
`runtime-development`

## Sources of truth
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
- `docs/_indexes/ipc-index.md`
- `docs/architecture/service-catalog.md`
- `src/main/main.js`
- `src/main/ipc/bootstrap.js`
- `src/main/browserViews/adapterBridge.js`
- `src/main/ipc/shell.js`
- `scripts/workflow/validate-initiative.mjs`
- `scripts/workflow/validate-workpack.mjs`

## Goal
Проверить L3 scoped runtime autonomy и привести AdapterBridge IPC registration к late-bound `getTabManager` lifecycle без изменения IPC channel names, preload/shared/renderer или adapter execution contract.

## User value
Снижается риск stale `TabManager` reference при пересоздании окна/TabManager, а AdapterBridge следует bootstrap/context handoff стилю.

## In scope
- Проверить `main.js -> bootstrap.js -> adapterBridge.js` lifecycle.
- Подтвердить, что `adapterBridge.js` получает актуальный `tabManager` через `getTabManager()` на каждый `adapter:exec`.
- Убрать lingering direct `tabManager` parameter из `registerMainIpc` bootstrap signature, если PLAN подтверждает, что он не нужен.
- Сохранить `IPC_ADAPTER_EXEC` / `IPC_ADAPTER_PING` channel names.
- Сохранить response shapes:
  - success: `{ ok: true, data }`
  - failure: `{ ok: false, error, code }`
- Обновить initiative run-state, gates, task-queue и delivery-report.

## Out of scope
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
- `tests/**`, если PLAN отдельно не обоснует и не зафиксирует allowed path.
- `package.json`
- `package-lock.json`
- dependencies.
- Новые IPC channels.
- Изменение adapter execution contract.
- Изменение `TabManager` behavior.
- `src/main/browserViews/adapterBridge.ts` без отдельного Human Gate.

## Current architecture context
`src/main/main.js` создаёт `TabManager` и вызывает `registerMainIpc({ tabManager, getMainWindow, getTabManager })`. `src/main/ipc/bootstrap.js` централизует регистрацию IPC и уже вызывает `registerAdapterBridgeIpc({ getTabManager })`. `src/main/browserViews/adapterBridge.js` уже принимает `{ getTabManager }`, вызывает `getTabManager()` внутри `IPC_ADAPTER_EXEC` handler и возвращает safe `{ ok: false, error, code }` при ошибке.

PLAN подтверждает, что stale-reference runtime behavior уже исправлен в JS. Минимальный APPLY остаётся в `bootstrap.js`: убрать unused direct `tabManager` из `registerMainIpc` destructuring, чтобы bootstrap context не принимал лишний lifecycle reference.

Affected modules:
- `main`
- `IPC bootstrap`
- `BrowserView AdapterBridge`
- `workflow docs`

## Allowed files
- `src/main/browserViews/adapterBridge.js`
- `src/main/ipc/bootstrap.js`
- `docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle/**`
- `docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/**`
- `docs/_indexes/ipc-index.md` only if PLAN confirms docs impact.
- `docs/architecture/service-catalog.md` only if PLAN confirms docs impact.

## Forbidden files
- `src/preload/**`
- `src/renderer/**`
- `src/shared/**`
- `tests/**`, если PLAN отдельно не обоснует.
- `package.json`
- `package-lock.json`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. PLAN: read-only inspect instruction sources and runtime files.
2. PLAN: confirm current AdapterBridge lifecycle and whether docs indexes need updates.
3. Gate Evaluation: confirm no strong gate, selected executor, allowed/forbidden paths and verification commands.
4. APPLY: if no strong gate, update only `src/main/ipc/bootstrap.js` to remove unused direct `tabManager` from registration context.
5. APPLY: do not change `adapterBridge.js` unless PLAN finds non-compliance.
6. Verification: run initiative/workpack validators, syntax checks, `npm test`, git checks and forbidden path scope check.
7. REVIEW: verify no public IPC contract drift, no forbidden path changes, response shape preserved and tests recorded.
8. Fixpack: only Must Fix inside existing allowed files.

## Acceptance criteria
- [x] Workpack validates with `validate-workpack`.
- [x] Initiative validates with `validate-initiative`.
- [x] `registerAdapterBridgeIpc` uses context `{ getTabManager }`.
- [x] `IPC_ADAPTER_EXEC` resolves `tabManager` per invocation.
- [x] Missing `tabManager` path returns `{ ok: false, error, code }`.
- [x] `IPC_ADAPTER_PING` remains `{ ok: true, data: true }`.
- [x] `bootstrap.js` does not pass direct `tabManager` to `registerAdapterBridgeIpc`.
- [x] `IPC_ADAPTER_EXEC` and `IPC_ADAPTER_PING` names unchanged.
- [x] Preload/renderer/shared/package/lockfile unchanged in pre-APPLY check.
- [x] Verification commands completed and recorded.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/workpack.md`
- `node --check src/main/browserViews/adapterBridge.js`
- `node --check src/main/ipc/bootstrap.js`
- `npm test`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/preload src/renderer src/shared package.json package-lock.json`

Manual smoke checklist:
- [ ] Launch app manually.
- [ ] Create/switch/close tab.
- [ ] AdapterBridge `adapter:ping` returns ok.
- [ ] AdapterBridge `adapter:exec` happy path returns `{ ok: true, data }`.
- [ ] Closed/missing tab returns `{ ok: false, error, code }`.
- [ ] Missing TabManager path returns safe `{ ok: false, error, code }` if simulated.

## Security impact
- `contextIsolation` impact: none.
- `sandbox` impact: none.
- Preload bridge impact: none.
- Token/secrets impact: none.
- IPC boundary: existing channels only; no channel name or public contract change.
- Late-bound `getTabManager` reduces stale BrowserView lifecycle risk.

## IPC impact
Behavior-neutral lifecycle cleanup for existing channels:
- `adapter:exec`
- `adapter:ping`

No new channels. No shared/preload contract changes. Return shape remains unchanged.

## Docs impact
PLAN confirms no update needed to `docs/_indexes/ipc-index.md` or `docs/architecture/service-catalog.md`, because both already describe late-bound AdapterBridge registration. Initiative/workpack docs are updated as delivery artifacts.

## Rollback
- Revert `src/main/ipc/bootstrap.js` to include the unused `tabManager` destructured parameter if needed.
- Remove `docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle/**`.
- Remove `docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/**`.
- Re-run syntax checks and validators.

## Done criteria
- [x] PLAN completed and Gate Evaluation finds no strong gate.
- [x] APPLY diff stays inside allowed files.
- [x] Verification commands run and results are recorded.
- [x] REVIEW confirms forbidden paths unchanged.
- [x] REVIEW Gate = GO or bounded fixpack completed.
- [x] Manual smoke checklist is recorded as pending or completed.

## Risks
- `src/main/browserViews/adapterBridge.ts` still has old direct-tabManager signature and may need a separate scope if maintained.
- Manual Electron smoke is not run automatically.
- Existing untracked initiative/workpack docs from `IN-2026-001` may appear in `git status` but are unrelated.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
