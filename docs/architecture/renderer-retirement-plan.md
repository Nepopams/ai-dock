# Renderer Retirement Plan

## Status
Planning. Runtime APPLY and file deletion are forbidden in this plan.

## Sources
- `AGENTS.md`
- `CODEX.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- `package.json`
- `src/main/main.js`
- `src/renderer/**`
- `vite.config.js`

## Summary
React is now the default renderer path. The plain renderer remains available only through the explicit legacy fallback path (`AI_DOCK_LEGACY_UI=true` / `npm run start:legacy`). Immediate deletion is not recommended because several non-React `src/renderer/**` modules are actively used by the React renderer.

Recommended path: Option D, staged retirement.

1. Keep fallback intact while React smoke is completed.
2. Classify ownership and plan archive/delete steps.
3. Archive or namespace only the plain legacy entrypoint after a gated workpack.
4. Migrate or keep shared renderer support modules before any deletion.
5. Delete legacy entrypoint only after one stable React release and an explicit fallback decision.

## Inventory Summary
- Total files under `src/renderer/**`: 81 observed by filesystem scan.
- Tracked source files under `src/renderer/**`: 78.
- Generated ignored React dist files observed: 3 under `src/renderer/react/dist/**`.
- React source files: 42 tracked files under `src/renderer/react/**`.
- Legacy entrypoint/support files: 15 tracked files (`src/renderer/index.*`, `tabs.js`, `prompts.js`, `icons/**`).
- Shared renderer support files used by React: 22 tracked files (`adapters/**`, `components/**`, `store/**`, `utils/**`).

## Renderer Inventory
### Legacy Entry Point
- `src/renderer/index.html`
- `src/renderer/index.js`
- `src/renderer/index.css`
- `src/renderer/tabs.js`
- `src/renderer/prompts.js`

### Legacy Icons
- `src/renderer/icons/alisa.svg`
- `src/renderer/icons/claude.svg`
- `src/renderer/icons/deepseek.svg`
- `src/renderer/icons/exit.svg`
- `src/renderer/icons/gpt.svg`
- `src/renderer/icons/info.svg`
- `src/renderer/icons/logo.svg`
- `src/renderer/icons/prompts.svg`
- `src/renderer/icons/settings.svg`

### React-Owned Source
- `src/renderer/react/index.html`
- `src/renderer/react/main.tsx`
- `src/renderer/react/App.tsx`
- `src/renderer/react/styles/global.css`
- `src/renderer/react/assets/icons/alisa.svg`
- `src/renderer/react/assets/icons/chat.svg`
- `src/renderer/react/assets/icons/claude.svg`
- `src/renderer/react/assets/icons/connections.svg`
- `src/renderer/react/assets/icons/deepseek.svg`
- `src/renderer/react/assets/icons/exit.svg`
- `src/renderer/react/assets/icons/gpt.svg`
- `src/renderer/react/assets/icons/info.svg`
- `src/renderer/react/assets/icons/logo.svg`
- `src/renderer/react/assets/icons/prompts.svg`
- `src/renderer/react/assets/icons/settings.svg`
- `src/renderer/react/assets/icons/uxpilot.svg`
- `src/renderer/react/components/ApplyPresetDialog.tsx`
- `src/renderer/react/components/chat/ConversationList.tsx`
- `src/renderer/react/components/chat/MessageItem.tsx`
- `src/renderer/react/components/chat/MessageList.tsx`
- `src/renderer/react/components/CompareButton.tsx`
- `src/renderer/react/components/PromptDrawer.tsx`
- `src/renderer/react/components/PromptRouter.tsx`
- `src/renderer/react/components/Sidebar.tsx`
- `src/renderer/react/components/TabStrip.tsx`
- `src/renderer/react/components/Toast.tsx`
- `src/renderer/react/hooks/usePromptRouterSync.ts`
- `src/renderer/react/hooks/usePromptsSync.ts`
- `src/renderer/react/hooks/useTabsSync.ts`
- `src/renderer/react/hooks/useTopInsetSync.ts`
- `src/renderer/react/store/chatSlice.ts`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/forms/FormEditor.tsx`
- `src/renderer/react/views/forms/FormProfilesManager.tsx`
- `src/renderer/react/views/forms/FormRunView.tsx`
- `src/renderer/react/views/history/HistoryView.tsx`
- `src/renderer/react/views/presets/PresetsGallery.tsx`
- `src/renderer/react/views/prompts/InsertPromptDialog.tsx`
- `src/renderer/react/views/prompts/TemplatesManager.tsx`
- `src/renderer/react/views/settings/AdapterOverrides.tsx`
- `src/renderer/react/views/settings/ClientsAndCategories.tsx`

### React Generated Output
Observed but not tracked by `git ls-files`:
- `src/renderer/react/dist/index.html`
- `src/renderer/react/dist/assets/index-6p60w6qM.css`
- `src/renderer/react/dist/assets/index-D5As7zz2.js`

### Non-React Support Modules
Adapters:
- `src/renderer/adapters/adapterBridgeClient.ts`
- `src/renderer/adapters/adapters.ts`
- `src/renderer/adapters/IAgentAdapter.ts`
- `src/renderer/adapters/impl/chatgpt.adapter.ts`
- `src/renderer/adapters/impl/claude.adapter.ts`
- `src/renderer/adapters/impl/deepseek.adapter.ts`
- `src/renderer/adapters/selectorHeuristics.ts`
- `src/renderer/adapters/selectorHeuristics.js`

Components:
- `src/renderer/components/ConfirmDialog.tsx`
- `src/renderer/components/KeyValueEditor.tsx`

Store slices:
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

Utilities:
- `src/renderer/utils/disposables.ts`
- `src/renderer/utils/domScriptTemplates.ts`

## Ownership Classification
| Path / group | Classification | Used by React | Used by legacy | Safe to remove now | Candidate action | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| `src/renderer/react/**` source | react-owned | yes | no | no | keep | high |
| `src/renderer/react/dist/**` | migration-residue / generated build output | runtime dist, generated | no | no in this initiative | investigate generated-output policy | medium |
| `src/renderer/index.html` | legacy-entrypoint | no | yes | no | archive later | high |
| `src/renderer/index.js` | legacy-entrypoint | no | yes | no | archive later | high |
| `src/renderer/index.css` | legacy-entrypoint | no | yes | no | archive later | medium |
| `src/renderer/tabs.js` | legacy-support | no | yes, imported by `index.js` | no | archive later with legacy entrypoint | medium |
| `src/renderer/prompts.js` | legacy-support | no | yes, imported by `index.js` | no | archive later with legacy entrypoint | medium |
| `src/renderer/icons/**` | legacy-support | no direct React import | yes, referenced by legacy HTML; `deepseek.svg` also referenced by `src/main/services.js` | no | investigate before archive/delete | high |
| `src/renderer/components/ConfirmDialog.tsx` | shared-renderer-support | yes, Form Profiles | no known legacy import | no | keep / consider React namespace migration | medium |
| `src/renderer/components/KeyValueEditor.tsx` | shared-renderer-support | yes, Form Editor | no known legacy import | no | keep / consider React namespace migration | medium |
| `src/renderer/store/**` | shared-renderer-support | yes, imported by `react/store/useDockStore.ts` and React views | no known legacy import | no | keep / classify as React-owned shared store | high |
| `src/renderer/adapters/*.ts` and `impl/*.ts` | shared-renderer-support | yes, imported by React store/settings and adapter state | no known legacy import | no | keep / classify as React-owned adapter support | high |
| `src/renderer/adapters/selectorHeuristics.js` | migration-residue | unknown; TS impl uses `.ts`, tests may use JS parity | unknown | no | investigate JS/TS parity before deletion | medium |
| `src/renderer/utils/disposables.ts` | shared-renderer-support | yes, Chat and Message components | no known legacy import | no | keep | medium |
| `src/renderer/utils/domScriptTemplates.ts` | shared-renderer-support | yes, adapters | no known legacy import | no | keep | high |

## Reference Scan Findings
- `src/main/main.js` selects legacy only when `AI_DOCK_LEGACY_UI === "true"` and otherwise selects React dev or React dist.
- `package.json` has `start:legacy` as the explicit fallback script.
- `package.json` keeps `dev:new-ui` as a compatibility alias for `dev:app`.
- `AI_DOCK_REACT_DIST=true` is used by `npm start` to force React dist runtime.
- `vite.config.js` roots Vite at `src/renderer/react` and builds to `src/renderer/react/dist`.
- Legacy `src/renderer/index.html` imports `./index.js` and references `./icons/**`.
- Legacy `src/renderer/index.js` imports `./tabs.js` and `./prompts.js`.
- React does not import `src/renderer/index.html`, `index.js`, `tabs.js`, `prompts.js`, or `src/renderer/icons/**`.
- React does import top-level support modules:
  - `src/renderer/react/store/useDockStore.ts` imports all top-level store slices and adapter registry modules.
  - React settings and presets views import `src/renderer/adapters/**`.
  - React Form Profiles imports `src/renderer/components/ConfirmDialog.tsx`, `src/renderer/components/KeyValueEditor.tsx`, and `src/renderer/store/formProfilesSlice.ts`.
  - React chat views import `src/renderer/utils/disposables.ts`.
  - Adapter implementations import `src/renderer/utils/domScriptTemplates.ts`.
- `src/main/services.js` references `src/renderer/icons/deepseek.svg`, so legacy icon deletion needs a main-process/service catalog follow-up and is not safe as a renderer-only deletion.

## Retirement Options
### Option A - Keep explicit fallback indefinitely
Benefits:
- Lowest immediate regression risk.
- Preserves manual fallback for React default issues.

Risks:
- Legacy surface keeps drifting.
- Contributors may keep preserving dead code.
- More ownership ambiguity around icons and support modules.

Required workpacks:
- Documentation guardrails.
- Periodic fallback smoke checklist.

Strong gates:
- None for docs-only guardrails.
- Runtime/package gates for any fallback behavior change.

Verification:
- `npm run start:legacy` manual smoke.
- React default smoke remains primary.

### Option B - Archive legacy files under docs/archive or src/renderer/legacy
Benefits:
- Makes legacy ownership explicit without immediate deletion.
- Reduces accidental edits in active renderer root.

Risks:
- Requires runtime `main.js` and package path changes if fallback remains executable.
- Moving icons can affect `src/main/services.js`.
- Archive under `src/renderer/legacy` is still runtime source and needs smoke.

Required workpacks:
- Legacy namespace/archive workpack.
- Main/package fallback path update if executable fallback is preserved.
- Icon reference migration or duplication decision.

Strong gates:
- `src/main/**` changes.
- `src/renderer/**` moves.
- `package.json` changes if script semantics change.

Verification:
- React default smoke.
- Legacy fallback smoke from new path.
- `git grep` for old legacy paths.

### Option C - Delete legacy entrypoint after React smoke passes
Benefits:
- Removes fallback ambiguity quickly.
- Simplifies renderer entrypoint ownership.

Risks:
- Removes rollback/fallback before a stable release window.
- Requires package/main cleanup and docs updates.
- Can break service icon references if broad icon deletion is attempted.

Required workpacks:
- React manual smoke closure.
- Legacy deletion workpack.
- Main/package cleanup workpack.
- Icon/service reference cleanup workpack.

Strong gates:
- Renderer source deletion.
- `src/main/main.js` changes.
- `package.json` changes.
- Release packaging verification.

Verification:
- Full React smoke.
- Packaging smoke.
- Forbidden legacy references removed or documented.

### Option D - Staged retirement: classify, archive, delete after one release
Benefits:
- Best balance of safety and momentum.
- Keeps explicit fallback until React default has release evidence.
- Allows shared support modules to be separated from true legacy before deletion.

Risks:
- Legacy code remains temporarily.
- Requires disciplined follow-up workpack sequencing.

Required workpacks:
- This ownership plan.
- React smoke closure.
- Legacy archive/namespace move.
- Non-React support module ownership audit.
- Legacy deletion candidate after one stable React release.
- Dev script cleanup after fallback decision.

Strong gates:
- Same as Option B for moves/archive.
- Same as Option C for deletion.

Verification:
- Validators for docs work.
- React default smoke.
- Legacy fallback smoke until removed.
- `git grep` for old paths and stale scripts.

## Recommendation
Recommended now: Option D, staged retirement.

Do not delete legacy files now. Do not move legacy files now. Do not change `AI_DOCK_LEGACY_UI`, `main.js`, package scripts, Vite config, preload, shared contracts, or React runtime in this initiative.

Recommended sequence:
1. IN-2026-011: ownership audit and retirement plan.
2. IN-2026-012: Accept ADR-003 after React smoke, or close as already satisfied if the ADR-003 Accepted change is already merged.
3. IN-2026-013: Legacy Renderer Archive / Namespace Move.
4. IN-2026-014: Non-React Renderer Support Ownership Audit.
5. IN-2026-015: Legacy Renderer Deletion Candidate after one stable React release.
6. IN-2026-016: Dev Script Cleanup, including removal of deprecated `dev:new-ui` only after compatibility window ends.

## Follow-Up Workpacks
### IN-2026-012 - Accept ADR-003 after React smoke
Scope:
- Confirm React smoke status.
- Ensure ADR-003 is `Accepted`.
- If already accepted and merged, close as satisfied with evidence.

Forbidden:
- Runtime changes.

### IN-2026-013 - Legacy Renderer Archive / Namespace Move
Scope:
- Move or namespace legacy entrypoint only after deciding whether fallback must remain executable.
- Candidate files: `index.html`, `index.js`, `index.css`, `tabs.js`, `prompts.js`, and legacy icons.

Strong gates:
- Any `src/main/main.js`, package script, or renderer path move.

Verification:
- React smoke.
- Legacy fallback smoke if fallback remains executable.

### IN-2026-014 - Non-React Renderer Support Ownership Audit
Scope:
- Decide whether `src/renderer/store/**`, `adapters/**`, `components/**`, and `utils/**` remain in top-level renderer or move under `src/renderer/react/**` / shared renderer namespace.

Strong gates:
- Runtime imports and path moves.
- TS config or Vite alias changes.

Verification:
- React build and focused view smoke.

### IN-2026-015 - Legacy Renderer Deletion Candidate
Scope:
- Delete true legacy files only after one stable React release and fallback decision.
- Remove stale references and docs.

Strong gates:
- Source deletion.
- Main/package/build changes.

Verification:
- Full React smoke.
- Packaging smoke.
- `git grep` for removed paths.

### IN-2026-016 - Dev Script Cleanup: remove deprecated dev:new-ui
Scope:
- Remove compatibility alias only after communication window.

Strong gates:
- `package.json` / lockfile.

Verification:
- Dev command smoke.
- Docs updated.

## Review Verdict
GO for docs-only planning. No runtime/source/package/build changes are authorized by this report.
