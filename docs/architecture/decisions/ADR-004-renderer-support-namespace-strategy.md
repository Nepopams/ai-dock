# ADR-004: Renderer Support Namespace Strategy

## Status
Proposed

## Context
ADR-003 makes the React renderer the default development and runtime UI. The legacy plain renderer remains available only as an explicit fallback until separately retired.

IN-2026-011 created the renderer retirement plan and recommended staged legacy retirement. IN-2026-014 then proved that the top-level renderer support modules are active React dependencies, not legacy code:

- `src/renderer/store/**` - active Zustand slice support.
- `src/renderer/adapters/**` - active BrowserView/Web adapter support.
- `src/renderer/components/**` - active React component support outside the React app root.
- `src/renderer/utils/**` - active renderer utility support.

The current React app source is rooted at `src/renderer/react/**`. Vite is rooted at `src/renderer/react`, builds to `src/renderer/react/dist`, and exposes `@renderer/*` as an alias to `src/renderer/react/*`. `tsconfig.json` includes `src/renderer/react` and `src/types`; top-level support modules are reached through relative imports from React source.

The problem is not runtime breakage today. The problem is ownership ambiguity: files outside `src/renderer/react/**` can look legacy-adjacent during future legacy retirement or new feature work, even though React imports and uses them.

## Decision
Recommended now: Option A - keep active top-level renderer support modules in their current paths and document ownership.

This ADR does not authorize any file move, import update, Vite alias change, TypeScript config change, runtime change, or deletion.

Target state remains open:
- Option C (`src/renderer/shared/**`) may become attractive if additional renderer surfaces need shared support.
- Option D (split ownership) may become attractive if support-module churn grows enough to justify staged migration.

For now, preserve the current paths and make the rule explicit: legacy renderer retirement must not include top-level `src/renderer/store/**`, `src/renderer/adapters/**`, `src/renderer/components/**`, or `src/renderer/utils/**`.

## Options considered
### Option A - Keep top-level renderer support as-is
Summary:
- Keep `store/adapters/components/utils` in the current top-level paths.
- Document that they are active renderer support, not legacy.

Benefits:
- No import churn.
- No Vite alias or TypeScript config changes.
- Lowest regression risk.
- Avoids blocking near-term work such as n8n, Judge, and cross-history improvements.
- Keeps namespace decisions reversible.

Risks:
- The top-level placement can continue to confuse contributors unless docs and workpacks are explicit.
- React-owned components remain outside `src/renderer/react/**`.
- Future migration can become larger if the support surface grows.

Migration cost:
- None now.

Import churn:
- None now.

Impact on Vite/tsconfig:
- None now.

Verification needs:
- Docs validators and forbidden-path checks for this ADR.
- Future runtime work still needs React build/test/smoke per workpack.

Required future workpacks:
- Optional/deferred migration plans only if maintainability gain becomes concrete.
- IN-2026-023 pre-n8n renderer support preflight.

Strong gates:
- None for this docs-only decision.
- Any future import/path/config change requires Human Gate.

### Option B - Move everything active to `src/renderer/react/shared/**`
Summary:
- Move all active support modules under the React app root.

Benefits:
- Makes active ownership visibly React-owned.
- Aligns with the current Vite root and `@renderer/*` alias.
- Reduces "outside React root means legacy" confusion.

Risks:
- Overstates React ownership for adapter runtime and store support that may be renderer-shared rather than React-only.
- Large import churn across store composition, views, adapter implementations, tests, and docs.
- Can make future non-React renderer/shared surfaces harder.

Migration cost:
- High.

Import churn:
- High: `useDockStore.ts`, form/chat/settings/preset views, adapter implementations, and tests need updates.

Impact on Vite/tsconfig:
- Likely favorable because files move under `src/renderer/react`, but config review is still required.

Verification needs:
- React build.
- Focused smoke for Chat, Forms, Presets, History, Compare/Judge, adapter insert/send/read flows.
- Selector heuristics test strategy update if JS parity file moves.

Required future workpacks:
- Store slice migration.
- Adapter support migration.
- Shared component migration.
- SelectorHeuristics parity cleanup.

Strong gates:
- `src/renderer/**` moves.
- Import updates.
- Test updates.
- Possible config adjustments.

### Option C - Move active support to `src/renderer/shared/**`
Summary:
- Move active support modules to an explicit renderer-shared namespace outside React app root.

Benefits:
- Names the support layer clearly as renderer-shared.
- Preserves room for future renderer surfaces.
- Avoids treating adapter runtime/store slices as purely React-owned.

Risks:
- Still outside the current Vite root.
- May require TypeScript include/path review if stricter type checking is added.
- Import churn remains significant.
- Contributors must still distinguish `src/renderer/shared/**` from legacy entrypoint files.

Migration cost:
- Medium to high.

Import churn:
- High for imports from React and internal adapter/store modules.

Impact on Vite/tsconfig:
- Needs explicit review. Current Vite root is `src/renderer/react`, and current `tsconfig.json` include does not broadly include `src/renderer/shared/**`.

Verification needs:
- React build.
- TypeScript/Vite import resolution check.
- Focused React local view smoke.
- Adapter BrowserView smoke.

Required future workpacks:
- Namespace strategy APPLY workpack.
- Store slice migration plan.
- Adapter support migration plan.
- Utility migration plan.

Strong gates:
- Path moves.
- Import updates.
- Possible Vite/TS config changes.

### Option D - Split ownership model
Summary:
- Move store, adapters, and broad utilities to `src/renderer/shared/**`.
- Move reusable React components to `src/renderer/react/shared/**`.
- Keep React app source in `src/renderer/react/**`.

Benefits:
- Most accurate long-term ownership model.
- Distinguishes renderer-shared runtime support from React-only reusable components.
- Gives future workpacks a cleaner map.

Risks:
- Highest migration complexity.
- Maximum import churn.
- Requires multiple sequential workpacks and smoke checks.
- Easy to accidentally create a giant APPLY if not decomposed.

Migration cost:
- Highest.

Import churn:
- Highest across store, adapters, utils, components, tests, and docs.

Impact on Vite/tsconfig:
- Requires explicit review for both under-root and outside-root namespaces.
- May require config changes, which are not authorized by this ADR.

Verification needs:
- React build.
- Unit tests.
- Focused smoke for Chat, Form Profiles, Form Run, Presets, History, Compare/Judge.
- Adapter BrowserView smoke for insert/send/read/export flows.

Required future workpacks:
- IN-2026-018 Store Slice Namespace Migration Plan.
- IN-2026-019 Adapter Support Namespace Migration Plan.
- IN-2026-020 Shared Components Namespace Migration Plan.
- IN-2026-021 SelectorHeuristics JS/TS Parity Cleanup.
- Additional utility split workpack if needed.

Strong gates:
- Multiple runtime path moves.
- Import updates.
- Possible config changes.
- No giant APPLY allowed.

## Consequences
- Top-level renderer support modules remain in place for now.
- Future workpacks must treat `src/renderer/store/**`, `src/renderer/adapters/**`, `src/renderer/components/**`, and `src/renderer/utils/**` as active support unless fresh import evidence proves otherwise.
- Legacy renderer retirement can plan archive/delete work only for true legacy entrypoint/support files, not active top-level support modules.
- Namespace migration is optional and deferred until it has a concrete maintainability or feature-delivery benefit.
- The next useful planning step is a preflight before n8n/Judge/cross-history work, not immediate file movement.

## Rules for future workpacks
- Never classify top-level `store/adapters/components/utils` as legacy without fresh import/reference checks.
- Any path move requires its own workpack, Human Gate, import update plan, rollback plan, and verification plan.
- Any Vite alias, TypeScript include/path, package, or script change requires a separate strong gate.
- Any delete requires fresh `git grep` evidence and Human Gate approval.
- Legacy entrypoint retirement must not include active support modules.
- Do not bundle store, adapter, component, utility, test, and config moves into one giant APPLY.
- Keep React smoke green after every namespace/migration step.

## Strong gates
- Any change to `src/renderer/**`.
- Any import update.
- Any file move or deletion.
- Any `vite.config.*`, `tsconfig.json`, `package.json`, or lockfile change.
- Any IPC/preload/security boundary change.
- Any dependency addition.
- Any recommendation that requires immediate migration rather than planning.

## Follow-up workpacks
- IN-2026-018 Store Slice Namespace Migration Plan - optional / deferred.
- IN-2026-019 Adapter Support Namespace Migration Plan - optional / deferred.
- IN-2026-020 Shared Components Namespace Migration Plan - optional / deferred.
- IN-2026-021 SelectorHeuristics JS/TS Parity Cleanup.
- IN-2026-022 Legacy Icons Ownership Cleanup.
- IN-2026-023 Pre-n8n Renderer Support Preflight.

## Validation strategy
For this docs-only ADR:
- Validate initiative artifacts.
- Validate workpack structure.
- Run `git diff --check`.
- Confirm forbidden runtime/source/package/build paths are not changed by this initiative.

For future namespace migration work:
- Run React build.
- Run relevant tests.
- Run focused manual smoke for affected local views and BrowserView adapter flows.
- Check old and new paths with `git grep`.
- Confirm rollback can restore imports and paths cleanly.
