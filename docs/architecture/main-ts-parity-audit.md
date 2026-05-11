# Main TS Parity Audit

## Summary
ADR-002 is Accepted: `src/main/**/*.js` files are the current Electron main-process runtime source-of-truth. `src/main/**/*.ts` files are non-runtime parity/reference artifacts until a separately approved TypeScript migration changes the build strategy.

Inventory:
- Total JS files in `src/main/**`: 34.
- Total TS files in `src/main/**`: 24.
- JS/TS pairs: 24.
- JS-only files: 10.
- TS-only files: 0.
- Runtime reachable JS files from `src/main/main.js`: 34.
- TS files included by `tsconfig.json`: 0.

High risk drift candidates:
- `src/main/services/formProfiles.ts` - large parallel parity implementation with data normalization/storage behavior.
- `src/main/browserViews/adapterBridge.ts` - parity counterpart for BrowserView IPC lifecycle; recently required manual parity repair in IN-2026-003.

Resolved drift candidates:
- `src/main/services/registry.ts` - remediated by IN-2026-007; now a typed wrapper over `registry.js` with the complete JS export surface.

## Classification model
- `wrapper` - TS requires the JS runtime counterpart and re-exports a typed surface. Behavioral drift risk is low, but type drift is still possible.
- `parity-counterpart` - TS contains a non-runtime implementation that appears intentionally mirrored with JS. These files need explicit handling whenever the JS source changes.
- `parallel-implementation` - TS contains a full implementation whose parity with JS is uncertain and should not be trusted as source-of-truth.
- `stale-counterpart` - TS counterpart is known to differ from JS runtime behavior or export surface.
- `migration-candidate` - TS counterpart is a good future source candidate, but not runtime today.
- `retirement-candidate` - TS artifact may be more misleading than useful and should be removed only through a gated follow-up.
- `unknown` - insufficient evidence to classify.

## Classification table
| TS file | JS counterpart | Classification | Runtime reachable JS | Drift risk | Recommended action | Proposed follow-up workpack | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `src/main/browserViews/adapterBridge.ts` | `src/main/browserViews/adapterBridge.js` | parity-counterpart | yes | high | Keep as parity artifact; require explicit TS handling on every adapter bridge JS change. | `WP-FUTURE-main-ts-adapter-bridge-parity-guard` | Full duplicate of BrowserView IPC lifecycle; IN-2026-003 fixed prior getter-lifecycle drift. |
| `src/main/ipc/export.ipc.ts` | `src/main/ipc/export.ipc.js` | wrapper | yes | low | Keep as typed wrapper; no behavior sync needed now. | `WP-FUTURE-main-ts-wrapper-contract-audit` | TS requires JS runtime and re-exports `registerExportIpc`. |
| `src/main/ipc/formProfiles.ipc.ts` | `src/main/ipc/formProfiles.ipc.js` | wrapper | yes | medium | Keep as wrapper; verify type surface when form profile IPC changes. | `WP-FUTURE-main-ts-form-profile-ipc-type-audit` | JS IPC has several handlers and token-preview behavior; TS only exposes registration. |
| `src/main/ipc/formRunner.ipc.ts` | `src/main/ipc/formRunner.ipc.js` | wrapper | yes | low | Keep as wrapper; no action until form runner IPC changes. | `WP-FUTURE-main-ts-wrapper-contract-audit` | TS re-exports `registerFormRunnerIpc`. |
| `src/main/ipc/history.ipc.ts` | `src/main/ipc/history.ipc.js` | wrapper | yes | medium | Keep as wrapper; review type surface before history/cross-history work. | `WP-FUTURE-main-ts-history-contract-audit` | History IPC is data-sensitive; TS wrapper has no behavior. |
| `src/main/ipc/judge.ipc.ts` | `src/main/ipc/judge.ipc.js` | wrapper | yes | medium | Keep as wrapper; verify before Judge feature work. | `WP-FUTURE-main-ts-judge-contract-audit` | TS re-exports registration plus Judge response/result types. |
| `src/main/ipc/mediaPresets.ipc.ts` | `src/main/ipc/mediaPresets.ipc.js` | wrapper | yes | low | Keep as wrapper; no action until media preset IPC changes. | `WP-FUTURE-main-ts-wrapper-contract-audit` | TS re-exports `registerMediaPresetsIpc`. |
| `src/main/ipc/registry.ipc.ts` | `src/main/ipc/registry.ipc.js` | parity-counterpart | yes | medium | Keep temporarily; prefer converting to wrapper or adding parity checklist. | `WP-FUTURE-main-ts-registry-ipc-parity` | Full IPC implementation; currently close to JS runtime. |
| `src/main/ipc/templates.ipc.ts` | `src/main/ipc/templates.ipc.js` | parity-counterpart | yes | medium | Keep temporarily; prefer converting to wrapper or adding parity checklist. | `WP-FUTURE-main-ts-templates-ipc-parity` | Full IPC implementation; currently close to JS runtime. |
| `src/main/providers/genericHttp.ts` | `src/main/providers/genericHttp.js` | wrapper | yes | medium | Keep as wrapper; audit before n8n/Judge provider work. | `WP-FUTURE-main-ts-provider-type-audit` | JS runtime has complex streaming/buffer behavior; TS only types `send`. |
| `src/main/providers/openaiCompatible.ts` | `src/main/providers/openaiCompatible.js` | wrapper | yes | medium | Keep as wrapper; audit before Judge/provider work. | `WP-FUTURE-main-ts-provider-type-audit` | JS runtime owns streaming, timeout, usage, and finish reason behavior. |
| `src/main/services/exporter.ts` | `src/main/services/exporter.js` | wrapper | yes | medium | Keep as wrapper; verify when export/history artifacts change. | `WP-FUTURE-main-ts-exporter-type-audit` | TS types markdown/export functions but behavior is JS. |
| `src/main/services/formProfiles.ts` | `src/main/services/formProfiles.js` | parity-counterpart | yes | high | Treat JS as source; create sync or wrapper-conversion workpack before form-profile changes. | `WP-FUTURE-main-ts-form-profiles-parity` | Large full duplicate of data normalization/storage behavior. |
| `src/main/services/formRunner.ts` | `src/main/services/formRunner.js` | wrapper | yes | medium | Keep as wrapper; audit before form runner streaming changes. | `WP-FUTURE-main-ts-form-runner-type-audit` | JS runtime has large fetch/stream/abort implementation; TS only types runtime exports. |
| `src/main/services/historyStore.ts` | `src/main/services/historyStore.js` | wrapper | yes | medium | Keep as wrapper; audit before cross-history work. | `WP-FUTURE-main-ts-history-contract-audit` | TS wraps legacy history service surface. |
| `src/main/services/ingest.ts` | `src/main/services/ingest.js` | wrapper | yes | medium | Keep as wrapper; verify before adapter/history ingest work. | `WP-FUTURE-main-ts-history-ingest-audit` | TS types adapter import surface; behavior is JS. |
| `src/main/services/judgePipeline.ts` | `src/main/services/judgePipeline.js` | wrapper | yes | medium | Keep as wrapper; audit before Judge work. | `WP-FUTURE-main-ts-judge-contract-audit` | JS runtime owns model/provider/export composition. |
| `src/main/services/mediaPresets.ts` | `src/main/services/mediaPresets.js` | wrapper | yes | medium | Keep as wrapper; verify typed import options when media presets change. | `WP-FUTURE-main-ts-media-presets-type-audit` | Runtime supports duplicate import strategy; TS export type already exposes it. |
| `src/main/services/registry.ts` | `src/main/services/registry.js` | wrapper | yes | low | Keep as typed wrapper; JS remains source-of-truth under ADR-002. | `WP-FUTURE-main-ts-wrapper-contract-audit` | Synced in IN-2026-007; wrapper exports `getRegistryPath`, `loadRegistry`, `saveRegistry`, `clearRegistryCache`, `watchRegistry`, `stopRegistryWatcher`, `serviceCategories`, `isServiceCategory`, `isServiceClient`. |
| `src/main/services/settings.ts` | `src/main/services/settings.js` | wrapper | yes | medium | Keep as wrapper; audit before completions/provider profile changes. | `WP-FUTURE-main-ts-settings-type-audit` | TS owns type mirrors for profile config while JS owns sanitization/storage. |
| `src/main/services/templates.ts` | `src/main/services/templates.js` | parity-counterpart | yes | medium | Keep temporarily; consider converting to wrapper to reduce duplicate storage logic. | `WP-FUTURE-main-ts-templates-service-parity` | Full implementation close to JS runtime. |
| `src/main/storage/historyFs.ts` | `src/main/storage/historyFs.js` | wrapper | yes | medium | Keep as wrapper; audit before cross-history data work. | `WP-FUTURE-main-ts-history-storage-type-audit` | TS exports storage interfaces and wraps JS behavior. |
| `src/main/utils/httpHelpers.ts` | `src/main/utils/httpHelpers.js` | wrapper | yes | low | Keep as wrapper; no action unless helper API changes. | `WP-FUTURE-main-ts-wrapper-contract-audit` | Small typed wrapper over JS helper functions. |
| `src/main/utils/streamParsers.ts` | `src/main/utils/streamParsers.js` | wrapper | yes | medium | Keep as wrapper; audit if streaming parser behavior changes. | `WP-FUTURE-main-ts-stream-parser-type-audit` | Streaming helpers are small but used by higher-risk form/provider flows. |

## Priority follow-ups
Sync-now candidates:
- None currently identified by this audit. `WP-FUTURE-main-ts-registry-service-sync` was completed by IN-2026-007.

Document-only candidates:
- `WP-FUTURE-main-ts-wrapper-contract-audit`: record the wrapper rule for low-risk wrappers and define how workpacks should verify type surfaces.
- `WP-FUTURE-main-ts-adapter-bridge-parity-guard`: document the adapter bridge parity requirement after IN-2026-003.

Migration-spike candidates:
- `WP-FUTURE-main-ts-provider-type-audit`: audit provider wrappers before n8n/Judge work.
- `WP-FUTURE-main-ts-history-contract-audit`: audit history IPC/service/storage wrappers before cross-history work.
- `WP-FUTURE-main-ts-build-strategy-spike`: design the staged migration path from ADR-002.

Retirement candidates:
- Full duplicate parity implementations are the main retirement candidates if the project chooses not to migrate soon: `adapterBridge.ts`, `registry.ipc.ts`, `templates.ipc.ts`, `formProfiles.ts`, `templates.ts`.
- Retirement requires a strong human gate and a separate workpack; this audit does not delete files.

No-action candidates:
- Low-risk wrappers can remain as reference artifacts until their JS counterpart changes: `export.ipc.ts`, `formRunner.ipc.ts`, `mediaPresets.ipc.ts`, `httpHelpers.ts`.

## Rules for future workpacks
- If a JS runtime file changes and a TS counterpart exists, the workpack must explicitly state TS counterpart handling: update, keep wrapper, mark stale, or route follow-up.
- If a TS counterpart is stale or high risk, it must not be treated as source-of-truth.
- If a feature touches n8n, Judge, providers, history, cross-history, registry, adapter bridge, or form runner, check this audit before PLAN.
- Runtime changes still target JS files first under ADR-002.
- Deleting TS counterparts, changing runtime imports, changing `package.json`, changing `tsconfig.json`, or adding a TypeScript main-process build remains a strong human gate.
