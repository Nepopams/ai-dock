# ADR-002: Main Process TypeScript Source Strategy

## Status
Accepted

## Context
The Electron main process currently starts from `package.json` `main = "src/main/main.js"`. Main-process modules are loaded through CommonJS `require`, and extensionless requires resolve to `.js` files in the current runtime. `tsconfig.json` includes `src/renderer/react` and `src/types`, but not `src/main/**`. `vite.config.js` builds the renderer, and `scripts/build-preload.js` bundles only `src/preload/index.ts`.

Inventory from IN-2026-004:
- `src/main/**/*.js`: 34 files.
- `src/main/**/*.ts`: 24 files.
- JS/TS pairs: 24.
- JS-only main files: 10.
- TS-only main files: 0.
- Runtime-reachable JS from `src/main/main.js`: 34 files.
- Main TS files included by `tsconfig.json`: 0.

The TypeScript files are not uniform. Some are thin typed wrappers over JS runtime modules. Others are parallel implementations or parity counterparts. IN-2026-003 found and fixed one drift case in `src/main/browserViews/adapterBridge.ts`, where the JS runtime had moved to late-bound `getTabManager` and the TS counterpart had not.

## Decision
Recommended now: `src/main/**/*.js` is the current runtime source-of-truth. Main-process `.ts` files are non-runtime reference/parity artifacts unless a future workpack explicitly changes the build pipeline and source-of-truth policy.

Target state: migrate toward one main-process source-of-truth through staged, gated workpacks. The preferred target is TypeScript source with a defined build output, runtime entrypoint, verification, and rollback plan. Until that target exists, feature work must edit the JS runtime files first and treat TS counterparts as secondary parity artifacts.

Not now:
- Do not delete TS counterparts in this ADR.
- Do not migrate main process to TypeScript in this ADR.
- Do not change `package.json`, `tsconfig.json`, Vite config, scripts, dependencies, or runtime imports in this ADR.

## Options considered
### Option A - JS as source-of-truth, TS counterparts legacy/parity-only
Benefits:
- Matches current runtime and package entrypoint.
- Avoids hidden build changes.
- Minimizes immediate risk before n8n/Judge/cross-history work.

Risks:
- TS counterparts can drift.
- Developers may read TS files as if they are active runtime.

Required workpacks:
- Update docs and ADR.
- Add a future parity audit/check workpack.

Strong gates:
- None for docs-only decision.
- Required if deleting or changing runtime/build files.

Verification:
- Inventory runtime reachability.
- Forbidden path diff checks.

### Option B - Staged migration main-process to TypeScript
Benefits:
- Gives one typed source-of-truth.
- Reduces dual-file drift.
- Enables stronger compile-time checks for main-process contracts.

Risks:
- Build and packaging changes affect Electron startup.
- IPC and preload boundaries need careful staged validation.
- Requires rollback strategy and migration slices.

Required workpacks:
- Build strategy spike.
- Main entrypoint migration plan.
- Per-layer migration slices.
- Runtime smoke and packaging verification.

Strong gates:
- Package/lockfile/build/tsconfig/runtime entrypoint changes.
- Any IPC contract or preload/shared/renderer changes.

Verification:
- TypeScript compile.
- Electron start.
- IPC smoke.
- Package/build smoke.

### Option C - Maintain dual files temporarily with parity checks
Benefits:
- Allows transition without immediate migration.
- Makes drift visible before feature work.

Risks:
- Adds process overhead.
- Parity checks can become brittle without a clear ownership policy.

Required workpacks:
- Parity audit.
- Decide lightweight checks or checklist.
- Add docs/runbook for TS counterpart updates.

Strong gates:
- Adding dependencies or package scripts.
- Any automated build/test pipeline change.

Verification:
- Docs validation.
- Optional no-new-dependency scripts only after approval.

### Option D - Delete TS counterparts as misleading artifacts
Benefits:
- Removes false source-of-truth.
- Reduces maintenance overhead.

Risks:
- Loses type documentation and migration scaffolding.
- Large deletion can hide missing contracts.
- Requires careful owner decision.

Required workpacks:
- File-by-file retirement plan.
- Human Gate approval.
- Docs/index cleanup.

Strong gates:
- File deletion.
- Any runtime import fallout.

Verification:
- Runtime import graph.
- Test suite.
- Electron smoke.

## Consequences
- Main-process runtime edits should target JS files unless a future approved workpack says otherwise.
- TS counterparts must not be treated as runtime source.
- If a JS file changes and a TS counterpart exists, the workpack must explicitly decide whether to update the TS counterpart, mark it stale, or route a follow-up.
- New main-process TS files should not be added as runtime sources until the build strategy is approved.
- Future migrations must be staged by layer and must preserve security invariants, IPC contracts, and rollback.

## Follow-up workpacks
- `WP-FUTURE-main-ts-parity-audit`: classify every main TS counterpart as wrapper, parity implementation, stale counterpart, or migration candidate.
- `WP-FUTURE-main-ts-build-strategy-spike`: design TypeScript build, Electron entrypoint, package script, artifact layout, and rollback.
- `WP-FUTURE-main-ts-parity-checks`: define drift checks without adding dependencies unless approved.
- `WP-FUTURE-main-ts-retirement-plan`: propose deletion or generation policy for stale counterparts.
- `WP-FUTURE-feature-preflight-main-source-policy`: apply this ADR before n8n/Judge/cross-history main-process feature work.

## Strong gates
Stop and request human decision before:
- Changing `package.json`, `package-lock.json`, dependencies, `tsconfig.json`, Vite config, or scripts.
- Changing Electron runtime entrypoint.
- Changing runtime imports from JS to TS.
- Deleting TS counterparts.
- Starting immediate main-process TS migration.
- Changing IPC contracts, preload bridge, shared contracts, renderer consumers, or security invariants.

## Validation strategy
For docs-only strategy changes:
- Validate initiative and workpack artifacts.
- Run `git diff --check`.
- Confirm forbidden runtime/config paths are unchanged.

For future runtime/build workpacks:
- Add TypeScript compile only through approved build strategy.
- Run `npm test`.
- Run Electron startup smoke.
- Run IPC/preload/security smoke for affected channels.
- Verify package/build artifacts if release flow changes.
