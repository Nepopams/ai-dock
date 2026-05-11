# Orchestration Plan - IN-2026-008

## Initiative summary
This L2 architecture/docs initiative records the current dual renderer mode and proposes a target strategy where React is the primary Dock UI and the legacy renderer is retained only as an explicit fallback until a separate retirement workpack.

## Assumptions
- Runtime source remains unchanged in this initiative.
- React renderer is the intended current product UI because Vite is rooted at `src/renderer/react` and the React app contains the active feature views.
- Legacy renderer still exists and remains packaged unless a later approved workpack changes runtime or packaging behavior.

## Selected delivery mode
Docs-only PLAN/APPLY/REVIEW.

## Epic breakdown
- E1: Renderer mode inventory.
- E2: Options and recommendation.
- E3: ADR draft.
- E4: Follow-up implementation workpack proposals.

## Sprint mapping
Architecture cleanup before next product features.

## Workpack queue
1. `WP-IN-2026-008-renderer-mode-consolidation` - planning and architecture decision draft.

## Executor routing
- Selected executor: `ai-dock-frontend-architecture-executor`.
- Secondary executor: `ai-dock-main-process-executor` for renderer selection context only.
- Security reviewer: `ai-dock-ipc-security-reviewer` only if future work changes preload/IPC boundaries.

## Gate plan
- Soft gate: document ambiguity and proceed with docs-only ADR.
- Strong gate: stop before any runtime, package, build, renderer source, or deletion change.

## Verification strategy
- Validate initiative artifact shape.
- Validate workpack artifact shape.
- Run git diff checks.
- Confirm forbidden runtime/config path status remains empty.

## Risk register
- Risk: Current `start` path can still launch legacy UI. Mitigation: follow-up runtime/build workpack.
- Risk: `electron:build` does not run `vite build` or set `AI_DOCK_REACT_UI`. Mitigation: follow-up build strategy workpack.
- Risk: Legacy renderer deletion may be premature. Mitigation: require a separate retirement workpack and smoke evidence.
