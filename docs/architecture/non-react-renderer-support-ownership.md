# Non-React Renderer Support Ownership Audit

## Status
Audit complete. Runtime APPLY, file moves, and file deletion are not authorized by this report.

## Summary
This audit exists because ADR-003 makes the React renderer the default development and runtime UI, while the legacy plain renderer remains only as an explicit fallback. That change makes it tempting to treat everything outside `src/renderer/react/**` as legacy, but the current dependency graph does not support that assumption.

Analyzed directories and files:
- `src/renderer/react/**`
- `src/renderer/store/**`
- `src/renderer/adapters/**`
- `src/renderer/components/**`
- `src/renderer/utils/**`
- `src/renderer/index.html`
- `src/renderer/index.js`
- `src/renderer/index.css`
- `src/renderer/tabs.js`
- `src/renderer/prompts.js`
- `src/renderer/icons/**`

Main conclusion: top-level renderer support modules under `src/renderer/store/**`, `src/renderer/adapters/**`, `src/renderer/components/**`, and `src/renderer/utils/**` are active React dependencies, not legacy renderer code. They must not be deleted or archived as part of legacy entrypoint retirement.

## Inventory
Observed tracked renderer source:
- 81 tracked files under `src/renderer/**`.
- 45 tracked React renderer source files under `src/renderer/react/**`.
- 22 tracked top-level support files under `src/renderer/store/**`, `src/renderer/adapters/**`, `src/renderer/components/**`, and `src/renderer/utils/**`.
- 14 tracked legacy entrypoint/support files outside React and outside the support directories: `index.html`, `index.js`, `index.css`, `tabs.js`, `prompts.js`, and `icons/**`.
- 3 generated React dist files observed on disk under `src/renderer/react/dist/**`; they are not tracked by `git ls-files`.

### `src/renderer/store/**`
- `src/renderer/store/adapterStateSlice.ts`
- `src/renderer/store/formProfilesSlice.ts`
- `src/renderer/store/formRunSlice.ts`
- `src/renderer/store/formStreamSlice.ts`
- `src/renderer/store/historySlice.ts`
- `src/renderer/store/judgeSlice.ts`
- `src/renderer/store/mediaPresetsSlice.ts`
- `src/renderer/store/promptHistorySlice.ts`
- `src/renderer/store/registrySlice.ts`
- `src/renderer/store/templatesSlice.ts`

These are Zustand slice modules composed into the React store by `src/renderer/react/store/useDockStore.ts`.

### `src/renderer/adapters/**`
- `src/renderer/adapters/adapterBridgeClient.ts`
- `src/renderer/adapters/adapters.ts`
- `src/renderer/adapters/IAgentAdapter.ts`
- `src/renderer/adapters/impl/chatgpt.adapter.ts`
- `src/renderer/adapters/impl/claude.adapter.ts`
- `src/renderer/adapters/impl/deepseek.adapter.ts`
- `src/renderer/adapters/selectorHeuristics.ts`
- `src/renderer/adapters/selectorHeuristics.js`

The TypeScript adapter modules are runtime support for React-driven BrowserView interactions. The JavaScript `selectorHeuristics.js` file is currently a test-facing parity/migration file.

### `src/renderer/components/**`
- `src/renderer/components/ConfirmDialog.tsx`
- `src/renderer/components/KeyValueEditor.tsx`

These are top-level React component support files used by React form views.

### `src/renderer/utils/**`
- `src/renderer/utils/disposables.ts`
- `src/renderer/utils/domScriptTemplates.ts`

`disposables.ts` supports React chat lifecycle cleanup. `domScriptTemplates.ts` supports adapter DOM execution logic.

### Other top-level renderer files
- `src/renderer/index.html`
- `src/renderer/index.js`
- `src/renderer/index.css`
- `src/renderer/tabs.js`
- `src/renderer/prompts.js`
- `src/renderer/icons/alisa.svg`
- `src/renderer/icons/claude.svg`
- `src/renderer/icons/deepseek.svg`
- `src/renderer/icons/exit.svg`
- `src/renderer/icons/gpt.svg`
- `src/renderer/icons/info.svg`
- `src/renderer/icons/logo.svg`
- `src/renderer/icons/prompts.svg`
- `src/renderer/icons/settings.svg`

These are legacy plain renderer entrypoint/support files. `src/main/services.js` also references `src/renderer/icons/deepseek.svg`, so even legacy icons are not safe for blind renderer-only deletion.

### Generated output
- `src/renderer/react/dist/index.html`
- `src/renderer/react/dist/assets/index-6p60w6qM.css`
- `src/renderer/react/dist/assets/index-D5As7zz2.js`

These files were observed on disk as generated React build output. They are not top-level support modules and were not changed by this initiative.

## Dependency Map
### Store slices
- Imported by React: `src/renderer/react/store/useDockStore.ts` imports every top-level store slice.
- Additional React usage: `src/renderer/react/views/forms/FormProfilesManager.tsx` imports `validateProfile` from `src/renderer/store/formProfilesSlice.ts`.
- Legacy usage: no imports found from `src/renderer/index.js`, `tabs.js`, or `prompts.js`.
- Main/preload usage: no direct imports found.
- Test usage: no direct test import found in the current scan.

### Adapter modules
- Imported by React: `src/renderer/react/store/useDockStore.ts` imports `IAgentAdapter`, `getAdapterById`, and `resolveAdapterId`.
- Additional React usage: `AdapterOverrides.tsx` imports `AdapterSelectors` and `resolveAdapterId`; `PresetsGallery.tsx` imports `resolveAdapterId`.
- Store usage: `adapterStateSlice.ts` imports `getAdapterById`, `updateAdapterOverrides`, and `resolveAdapterId`; `registrySlice.ts` imports `AdapterSelectors`, `updateAdapterOverrides`, and `resolveAdapterId`.
- Internal adapter usage: `adapters.ts` imports the three concrete adapter implementations; implementations import `selectorHeuristics.ts`, `domScriptTemplates.ts`, and `adapterBridgeClient.ts`.
- Legacy usage: no imports found from the legacy plain renderer entrypoint.
- Main/preload usage: no direct imports found. The adapter runtime calls `window.adapterBridge`, which is exposed through preload and handled by main IPC, so the dependency is runtime-coupled but not source-imported by main/preload.
- Test usage: `tests/selectorHeuristics.test.js` imports `src/renderer/adapters/selectorHeuristics.js`.

### Top-level components
- Imported by React: `FormProfilesManager.tsx` imports `ConfirmDialog`; `FormEditor.tsx` imports `KeyValueEditor`.
- Legacy usage: no imports found.
- Main/preload usage: no direct imports found.
- Test usage: no direct test import found.

### Top-level utils
- `disposables.ts` imported by React `ChatView.tsx`, `MessageItem.tsx`, and `MessageList.tsx`.
- `domScriptTemplates.ts` imported by adapter implementations, which are reached through React store/actions and adapter registry usage.
- Legacy usage: no imports found.
- Main/preload usage: no direct imports found.
- Test usage: no direct test import found.

### Legacy entrypoint/support
- `src/main/main.js` loads `src/renderer/index.html` only when `AI_DOCK_LEGACY_UI === "true"`.
- `src/renderer/index.html` imports `./index.js` and references `./icons/**`.
- `src/renderer/index.js` imports `./tabs.js` and `./prompts.js`.
- React usage: no React imports found for `index.html`, `index.js`, `index.css`, `tabs.js`, `prompts.js`, or top-level `icons/**`.
- Main usage: `src/main/services.js` references `src/renderer/icons/deepseek.svg`.

## Ownership Classification Model
- `react-owned-shared-support`: non-React-root files that are React components or React-only helper modules, currently placed outside `src/renderer/react/**`.
- `renderer-shared-support`: renderer-side helpers that can reasonably serve more than one renderer surface and are not tied to legacy entrypoint semantics.
- `adapter-runtime-support`: renderer-side web adapter runtime modules used by React actions to drive BrowserView/WebContents interactions through preload/main APIs.
- `store-slice-support`: top-level Zustand slices composed into the React dock store.
- `legacy-only`: files used only by the legacy plain renderer/fallback path, except for explicitly noted external references.
- `migration-residue`: parity, compatibility, or transitional files that may be removable only after separate evidence and gate approval.
- `generated-output`: build output that should be governed by generated artifact policy, not source ownership.
- `unknown`: insufficient evidence from current imports/reference scans.

## Classification Table
| Path | Classification | Imported by | Used by React | Used by legacy | Safe to move now | Safe to delete now | Recommended action | Risk | Proposed follow-up workpack |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `src/renderer/store/adapterStateSlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate only after namespace strategy and import plan. | high | IN-2026-018 |
| `src/renderer/store/registrySlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan. | high | IN-2026-018 |
| `src/renderer/store/templatesSlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan. | medium | IN-2026-018 |
| `src/renderer/store/mediaPresetsSlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan. | medium | IN-2026-018 |
| `src/renderer/store/formProfilesSlice.ts` | `store-slice-support` | `react/store/useDockStore.ts`, `FormProfilesManager.tsx` | yes | no | no | no | Keep; migrate with store slice namespace plan and form view smoke. | high | IN-2026-018 |
| `src/renderer/store/formStreamSlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan and streaming checks. | high | IN-2026-018 |
| `src/renderer/store/formRunSlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan and Form Run smoke. | high | IN-2026-018 |
| `src/renderer/store/promptHistorySlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan and Prompt flow checks. | medium | IN-2026-018 |
| `src/renderer/store/historySlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan and History Hub smoke. | high | IN-2026-018 |
| `src/renderer/store/judgeSlice.ts` | `store-slice-support` | `react/store/useDockStore.ts` | yes | no | no | no | Keep; migrate with store slice namespace plan and Compare/Judge checks. | medium | IN-2026-018 |
| `src/renderer/adapters/IAgentAdapter.ts` | `adapter-runtime-support` | `useDockStore.ts`, `AdapterOverrides.tsx`, adapter impls, store slices | yes | no | no | no | Keep; include in adapter namespace strategy. | high | IN-2026-019 |
| `src/renderer/adapters/adapters.ts` | `adapter-runtime-support` | `useDockStore.ts`, `AdapterOverrides.tsx`, `PresetsGallery.tsx`, store slices | yes | no | no | no | Keep; include in adapter namespace strategy. | high | IN-2026-019 |
| `src/renderer/adapters/adapterBridgeClient.ts` | `adapter-runtime-support` | adapter implementations | yes, indirectly | no | no | no | Keep; migration requires adapter smoke and preload/main IPC awareness. | high | IN-2026-019 |
| `src/renderer/adapters/impl/*.adapter.ts` | `adapter-runtime-support` | `adapters.ts` | yes, indirectly | no | no | no | Keep; migrate only with adapter import update and BrowserView smoke. | high | IN-2026-019 |
| `src/renderer/adapters/selectorHeuristics.ts` | `adapter-runtime-support` | adapter implementations | yes, indirectly | no | no | no | Keep; pair any move with JS parity decision. | medium | IN-2026-019 / IN-2026-021 |
| `src/renderer/adapters/selectorHeuristics.js` | `migration-residue` | `tests/selectorHeuristics.test.js` | no | no | unknown | no | Investigate JS/TS parity; do not delete while test imports it. | medium | IN-2026-021 |
| `src/renderer/components/ConfirmDialog.tsx` | `react-owned-shared-support` | `FormProfilesManager.tsx` | yes | no | no | no | Keep; candidate for `react/shared` or `react/components/shared` after strategy. | medium | IN-2026-020 |
| `src/renderer/components/KeyValueEditor.tsx` | `react-owned-shared-support` | `FormEditor.tsx` | yes | no | no | no | Keep; candidate for `react/shared` or `react/components/shared` after strategy. | medium | IN-2026-020 |
| `src/renderer/utils/disposables.ts` | `renderer-shared-support` | `ChatView.tsx`, `MessageItem.tsx`, `MessageList.tsx` | yes | no | no | no | Keep; namespace decision should decide React-owned vs renderer-shared. | medium | IN-2026-017 |
| `src/renderer/utils/domScriptTemplates.ts` | `adapter-runtime-support` | adapter implementations | yes, indirectly | no | no | no | Keep with adapter runtime support; migration requires adapter smoke. | high | IN-2026-019 |
| `src/renderer/index.html`, `index.css` | `legacy-only` | `src/main/main.js` fallback load for `index.html`; HTML links CSS | no | yes | no | no | Keep until legacy archive/deletion workpack. | high | legacy retirement track |
| `src/renderer/index.js` | `legacy-only` | `index.html` | no | yes | no | no | Keep until legacy archive/deletion workpack. | high | legacy retirement track |
| `src/renderer/tabs.js` | `legacy-only` | `index.js` | no | yes | no | no | Keep with legacy entrypoint until gated retirement. | medium | legacy retirement track |
| `src/renderer/prompts.js` | `legacy-only` | `index.js` | no | yes | no | no | Keep with legacy entrypoint until gated retirement. | medium | legacy retirement track |
| `src/renderer/icons/**` | `legacy-only` | `index.html`; `src/main/services.js` references `deepseek.svg` | no | yes | no | no | Do not delete with renderer-only work; split icon ownership first. | high | IN-2026-022 |
| `src/renderer/react/dist/**` | `generated-output` | packaged React runtime when built | yes, generated runtime output | no | no | no | Treat as generated build output; do not include in source namespace moves. | medium | generated artifact policy if needed |

## Recommendations
1. Do not delete top-level `store/**`, `adapters/**`, `components/**`, or `utils/**` as legacy.
2. Treat those directories as shared active support until a dedicated migration/namespace workpack moves them.
3. Legacy entrypoint retirement must target only the plain renderer entrypoint/support files after separate gate approval.
4. Any move must include import updates, Vite/TypeScript path consideration, build/test/smoke, and rollback notes.
5. Any delete must include fresh `git grep` evidence, test impact analysis, and Human Gate approval.
6. React smoke must remain green after each namespace step.

Future namespace options:
- Option A: keep top-level renderer support in place and document ownership explicitly.
- Option B: move active support under `src/renderer/react/shared/**`.
- Option C: move active support under `src/renderer/shared/**`.
- Option D: split by ownership: adapters/store under `src/renderer/shared/**`, React components under `src/renderer/react/shared/**`, and utility files by consumer group.

Recommended path: decide the namespace policy first, then migrate in small workpacks. Option D is the most precise long-term ownership model, but it has the most import churn and therefore needs staged verification.

## Follow-up Workpacks
### IN-2026-017 Renderer Support Namespace Strategy
Decide whether top-level renderer support remains in place or moves to `src/renderer/react/shared/**`, `src/renderer/shared/**`, or a split model.

### IN-2026-018 Store Slice Namespace Migration Plan
Plan any movement of `src/renderer/store/**`, including React store imports, Zustand slice composition, view smoke, and rollback.

### IN-2026-019 Adapter Support Namespace Migration Plan
Plan any movement of `src/renderer/adapters/**` and adapter-coupled utils, including BrowserView adapter smoke and preload/main IPC awareness.

### IN-2026-020 Shared Components Namespace Migration Plan
Plan any movement of `ConfirmDialog` and `KeyValueEditor` into a React-owned shared component namespace.

### IN-2026-021 SelectorHeuristics JS/TS Parity Cleanup
Decide whether `selectorHeuristics.js` remains as a test-facing CommonJS parity file, moves to a generated/test helper path, or is replaced by a TS-compatible test strategy.

### IN-2026-022 Legacy Icons Ownership Cleanup
Separate legacy icon ownership from any main/service references, especially `src/renderer/icons/deepseek.svg`, before legacy icon archive or deletion.

## Rules For Future Workpacks
- Never classify top-level `store/adapters/components/utils` as legacy without checking imports.
- Any move requires import updates, Vite/TS path consideration, build/test/smoke, and rollback.
- Any delete requires fresh `git grep` evidence and Human Gate approval.
- Legacy entrypoint retirement must not include shared support modules.
- `selectorHeuristics.js` cannot be deleted while tests import it.
- Top-level icons cannot be deleted as a group while `src/main/services.js` references `src/renderer/icons/deepseek.svg`.
- Generated `src/renderer/react/dist/**` files must be governed as build output, not source ownership.

## Verification
This report was produced from read-only scans and docs-only changes. It does not authorize runtime changes. The Initiative Runner validation and workpack validation results are recorded in `docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit/delivery-report.md`.
