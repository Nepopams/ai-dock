# IN-2026-008 Renderer Mode Consolidation

## Initiative ID
IN-2026-008-renderer-mode-consolidation

## Title
Renderer Mode Consolidation

## Status
Complete

## Owner
Human + Codex

## Goal
Document the renderer mode strategy for VR AI Dock so the React renderer becomes the intended primary UI path and the legacy plain renderer has an explicit fallback, archive, or retirement path.

## User value
Developers and Codex can run, test, and modify the intended Dock UI without accidentally validating the legacy renderer path.

## Problem
The repository currently has two renderer paths:

- Legacy renderer files under `src/renderer/index.html`, `src/renderer/index.js`, and `src/renderer/index.css`.
- React renderer files under `src/renderer/react/**`.

`src/main/main.js` selects the React renderer only when `AI_DOCK_REACT_UI === "true"`. `package.json` has `dev:new-ui` for that mode, but `start` and `electron:build` do not set the flag. This creates launch and verification ambiguity.

## Success criteria
- Renderer mode inventory is documented.
- Current script behavior is documented.
- Options A through D are evaluated.
- A proposed ADR is created for renderer mode strategy.
- Follow-up workpacks are listed for implementation.
- No runtime, package, build, or renderer source files are changed.

## In scope
- Initiative artifacts.
- One planning workpack and prompt pack.
- Read-only audit of renderer modes.
- Options analysis and recommendation.
- ADR draft.
- Source-of-truth index link to the ADR.

## Out of scope
- Runtime code changes.
- `package.json` changes.
- `src/main/main.js` changes.
- Legacy renderer deletion.
- Build script changes.
- Production build refactor.

## Constraints
- Do not change `src/main/**`.
- Do not change `src/renderer/**`.
- Do not change `src/preload/**`.
- Do not change `src/shared/**`.
- Do not change `package.json`, `package-lock.json`, `vite.config.*`, or `scripts/**`.
- Do not add dependencies.

## Strong human gate triggers
- Any package or lockfile change.
- Any `main.js` or runtime entrypoint change.
- Any renderer source change.
- Any legacy renderer deletion.
- Any Electron build or release script change.

## Candidate epics
- Renderer default mode switch.
- Legacy renderer fallback documentation.
- Legacy renderer retirement plan.
- Build/start smoke validation for React renderer.

## Risks
- Production packaging may continue to resolve legacy UI by default until a runtime/build workpack changes launch semantics.
- Keeping dual modes without a clear default can cause future test evidence to validate the wrong UI.
- Removing legacy too early could lose a fallback before React start/build smoke is stable.

## Links
- Workpack: `docs/planning/workpacks/WP-IN-2026-008-renderer-mode-consolidation/workpack.md`
- ADR draft: `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- Source-of-truth index: `docs/_indexes/source-of-truth.md`
