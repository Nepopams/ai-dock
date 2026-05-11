# IN-2026-003 - AdapterBridge TypeScript Parity

## Initiative ID
`IN-2026-003-adapter-bridge-typescript-parity`

## Title
AdapterBridge TypeScript Parity

## Status
Done

## Owner
Human + Codex

## Goal
Synchronize the TypeScript counterpart `src/main/browserViews/adapterBridge.ts` with the current late-bound getter lifecycle implemented by `src/main/browserViews/adapterBridge.js`, or record an architectural decision if the TypeScript file is not a maintained source.

## User value
Reduce architectural drift in the BrowserView AdapterBridge, prevent accidental reintroduction of the old direct `tabManager` lifecycle pattern, and keep future TypeScript-oriented work honest about source ownership.

## Problem
After IN-2026-002, the runtime JavaScript AdapterBridge uses `registerAdapterBridgeIpc({ getTabManager })` and resolves the current `TabManager` per `adapter:exec` call. The TypeScript counterpart still accepts a direct `tabManager` and can mislead future changes or imports.

## Success criteria
- [x] Initiative artifacts exist and pass `validate-initiative`.
- [x] One scoped workpack exists and passes `validate-workpack`.
- [x] PLAN answers whether `adapterBridge.ts` participates in current runtime/build.
- [x] PLAN classifies `adapterBridge.ts` as source, future source, stale counterpart, unused artifact, generated file, or remnant.
- [x] If no strong gate is triggered, `adapterBridge.ts` is synchronized to the getter lifecycle.
- [x] `adapterBridge.js`, `bootstrap.js`, preload, renderer, shared contracts, package metadata, and lockfile remain unchanged.
- [x] REVIEW records GO/NO-GO and residual manual smoke needs.

## In scope
- Create initiative artifacts under this initiative directory.
- Create one scoped workpack and prompt-pack.
- Execute PLAN, gate evaluation, APPLY, verification, REVIEW, and delivery report.
- Change only `src/main/browserViews/adapterBridge.ts` if PLAN confirms no strong gate.
- Update docs/indexes only if PLAN confirms a docs impact.

## Out of scope
- Migrating the main process to TypeScript.
- Configuring a TypeScript build pipeline.
- Changing package scripts or dependency metadata.
- Deleting `adapterBridge.ts` without explicit PLAN justification and Human Gate.
- Changing IPC channel names, preload exposure, renderer consumers, shared contracts, or runtime JavaScript behavior.

## Constraints
- Do not change `package.json` or `package-lock.json`.
- Do not add dependencies.
- Do not change `src/preload/**`, `src/renderer/**`, or `src/shared/**`.
- Do not change IPC channel names.
- Preserve response shapes: `{ ok: true, data }` and `{ ok: false, error, code }`.
- Do not change `adapterBridge.js` or `bootstrap.js` if PLAN confirms they are already correct.
- Autonomy level: L3 scoped runtime APPLY autonomy.

## Strong human gate triggers
- Runtime APPLY without a valid workpack and PLAN.
- Need to change `package.json`, `package-lock.json`, dependencies, build pipeline, or `tsconfig`.
- PLAN recommends deleting `adapterBridge.ts`.
- Need to change shared, preload, renderer, IPC channel names, or response shape.
- PLAN finds `adapterBridge.ts` is current runtime source-of-truth and the required change expands scope.
- Any executor path outside the workpack allowed files.
- REVIEW Must Fix changes scope, risk profile, or routing.

## Candidate epics
- Epic 1: Runtime/build role discovery for `adapterBridge.ts`.
- Epic 2: Scoped TypeScript parity update, if no strong gate is triggered.
- Epic 3: Verification, review, and delivery report.

## Risks
- `adapterBridge.ts` may remain outside the current build pipeline, so TypeScript validation may be limited.
- Type drift can recur while the project maintains both JS runtime files and TS counterparts.
- Manual Electron smoke is still needed to prove live BrowserView behavior.

## Links
- `orchestration-plan.md`
- `task-queue.md`
- `run-state.md`
- `gates.md`
- `delivery-report.md`
- `docs/planning/workpacks/WP-IN-2026-003-adapter-bridge-typescript-parity/workpack.md`
