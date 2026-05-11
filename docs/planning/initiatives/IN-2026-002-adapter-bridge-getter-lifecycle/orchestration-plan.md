# Orchestration Plan

## Initiative summary
Инициатива проводит первый L3 scoped runtime pilot для Initiative Runner. Scope ограничен main-process AdapterBridge lifecycle: проверить late-bound `getTabManager` handoff и выполнить минимальный runtime cleanup без изменения public IPC contract.

## Assumptions
- Safe assumption: `src/main/browserViews/adapterBridge.js` является runtime-файлом для Electron main entry (`package.json` main = `src/main/main.js`).
- Safe assumption: `src/main/browserViews/adapterBridge.ts` не входит в allowed files этой инициативы; его прямой `tabManager` signature фиксируется как residual risk.
- Safe assumption: `docs/_indexes/ipc-index.md` и `docs/architecture/service-catalog.md` уже описывают late-bound `getTabManager`, поэтому PLAN не требует их изменения.
- Blocking assumption: отсутствует; package/dependency/preload/renderer/shared changes не требуются.

## Selected delivery mode
Runtime single-layer, L3 scoped runtime APPLY autonomy.

## Epic breakdown
- Epic ID: `EP-IN-2026-002-A`
  Title: File-backed runtime initiative setup.
  Scope: initiative artifacts, workpack, prompt-pack.
  Risk profile: низкий, docs/workflow.
  Success criteria: `validate-initiative` и `validate-workpack` PASS.
- Epic ID: `EP-IN-2026-002-B`
  Title: Main-process AdapterBridge lifecycle cleanup.
  Scope: `src/main/ipc/bootstrap.js` and `src/main/browserViews/adapterBridge.js` inspection; minimal APPLY in bootstrap if needed.
  Risk profile: низкий/средний, runtime main-process.
  Success criteria: AdapterBridge registration uses `getTabManager`, no direct stale reference in handler.
- Epic ID: `EP-IN-2026-002-C`
  Title: Verification and REVIEW.
  Scope: syntax checks, `npm test`, git checks, delivery report.
  Risk profile: низкий.
  Success criteria: REVIEW = GO or bounded fixpack.

## Sprint mapping
- Sprint / slice: Runtime Initiative Runner pilot.
- Workpack candidates: `WP-IN-2026-002-adapter-bridge-getter-lifecycle`.
- Dependencies: PLAN -> Gate Evaluation -> APPLY -> Verification -> REVIEW.
- Exit criteria: validators pass, syntax checks pass, `npm test` result recorded, forbidden paths unchanged.

## Workpack queue
- Workpack ID: `WP-IN-2026-002-adapter-bridge-getter-lifecycle`
- Type: runtime-development / main-process.
- Purpose: validate L3 scoped runtime autonomy with AdapterBridge getter lifecycle.
- Dependency: none.
- Expected status: Done after REVIEW.

## Executor routing
- Workpack ID: `WP-IN-2026-002-adapter-bridge-getter-lifecycle`
- Selected executor: `ai-dock-main-process-executor`
- Primary skill: `ai-dock-main-process-executor`
- Secondary executors: `ai-dock-ipc-security-reviewer`
- Rationale: affected runtime files are main-process IPC bootstrap and BrowserView AdapterBridge.

## Gate plan
- Soft gates:
  - выбрать single workpack queue;
  - classify docs indexes as no-op if already current;
  - treat already-compliant `adapterBridge.js` as no runtime diff needed;
  - record manual smoke as pending if app launch is not run.
- Strong human gates:
  - package/dependency/preload/renderer/shared/new IPC/public contract changes.
- Gate owner: Codex for soft gates, Human for strong gates.
- Expected decision point: no strong gate if APPLY remains within `src/main/ipc/bootstrap.js`.

## Verification strategy
- Initiative/workpack validation:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-002-adapter-bridge-getter-lifecycle`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-002-adapter-bridge-getter-lifecycle/workpack.md`
- Runtime syntax:
  - `node --check src/main/browserViews/adapterBridge.js`
  - `node --check src/main/ipc/bootstrap.js`
- Test:
  - `npm test`
- Diff and scope:
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src/preload src/renderer src/shared package.json package-lock.json`
- Manual smoke: documented checklist, not auto-run.

## Risk register
- Risk: TS counterpart drift remains in `src/main/browserViews/adapterBridge.ts`.
  Impact: medium if TS becomes source for runtime generation.
  Mitigation: do not touch without gate; add follow-up.
  Owner: Human + Codex.
  Status: Open residual risk.
- Risk: `npm test` may fail on unrelated suites.
  Impact: medium.
  Mitigation: record full result and map failures to scope.
  Owner: Codex.
  Status: Pending verification.
- Risk: no interactive manual smoke.
  Impact: low/medium.
  Mitigation: delivery report checklist.
  Owner: Human.
  Status: Pending manual QA.
