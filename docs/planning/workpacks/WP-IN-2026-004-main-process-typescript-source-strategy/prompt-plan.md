# PLAN Prompt - WP-IN-2026-004

MODE: PLAN ONLY.

## Task
Perform read-only architecture analysis for main-process JavaScript and TypeScript source strategy.

## Required PLAN answers
1. Which files under `src/main/**` are current runtime source-of-truth?
2. Is there a current TypeScript build for `src/main/**`?
3. Are JS files generated from TS?
4. Which `.ts` files are wrappers, parity-only counterparts, stale counterparts, or migration candidates?
5. What options exist for source strategy?
6. What recommendation should be recorded?
7. Are any strong human gates triggered?

## PLAN result - 2026-05-11

### Inventory
- `src/main/**/*.js`: 34 files.
- `src/main/**/*.ts`: 24 files.
- JS/TS pairs: 24.
- JS-only files: 10.
- TS-only files: 0.
- Runtime-reachable JS from `package.json` main: all 34 JS files.
- Main TS files included by `tsconfig.json`: 0.

### JS-only files
- `src/main/historyStore`
- `src/main/ipc/bootstrap`
- `src/main/ipc/chat`
- `src/main/ipc/completions`
- `src/main/ipc/shell`
- `src/main/main`
- `src/main/services`
- `src/main/services/chatBridge`
- `src/main/store`
- `src/main/tabManager`

### TS wrappers over JS runtime
- `src/main/ipc/export.ipc.ts`
- `src/main/ipc/formProfiles.ipc.ts`
- `src/main/ipc/formRunner.ipc.ts`
- `src/main/ipc/history.ipc.ts`
- `src/main/ipc/judge.ipc.ts`
- `src/main/ipc/mediaPresets.ipc.ts`
- `src/main/providers/genericHttp.ts`
- `src/main/providers/openaiCompatible.ts`
- `src/main/services/exporter.ts`
- `src/main/services/formRunner.ts`
- `src/main/services/historyStore.ts`
- `src/main/services/ingest.ts`
- `src/main/services/judgePipeline.ts`
- `src/main/services/mediaPresets.ts`
- `src/main/services/settings.ts`
- `src/main/storage/historyFs.ts`
- `src/main/utils/httpHelpers.ts`
- `src/main/utils/streamParsers.ts`

### TS parallel implementations or type-bearing counterparts
- `src/main/browserViews/adapterBridge.ts`
- `src/main/ipc/registry.ipc.ts`
- `src/main/ipc/templates.ipc.ts`
- `src/main/services/formProfiles.ts`
- `src/main/services/registry.ts`
- `src/main/services/templates.ts`

### Source-of-truth analysis
Current runtime source-of-truth is JavaScript under `src/main/**`. There is no current main-process TypeScript build, no TS-to-JS generation rule, and no package script that compiles `src/main/**`. Drift risk is real because TS files are excluded from `tsconfig.json`, some are wrappers, and some are parallel implementations. `adapterBridge.ts` already drifted and was manually synchronized in IN-2026-003.

### Recommendation
- Recommended now: JS runtime files are source-of-truth for `src/main/**`; TS counterparts are non-runtime reference/parity artifacts.
- Target state: staged main-process TypeScript migration with explicit build, entrypoint, tests, rollback, and one-source-of-truth policy.
- Not now: immediate TS migration, TS deletion, package/tsconfig/build changes, runtime import changes.
- Next workpacks: parity audit, build strategy spike, parity-check strategy, stale counterpart retirement plan, and feature preflight for n8n/Judge/cross-history.

### Gate evaluation
No strong human gate triggered because this workpack performs docs-only APPLY and defers runtime/build/deletion/migration work.
