# ADR-003: Renderer Mode Strategy

## Status
Accepted

## Context
VR AI Dock currently contains two renderer paths.

The legacy plain renderer is rooted at:

- `src/renderer/index.html`
- `src/renderer/index.js`
- `src/renderer/index.css`
- `src/renderer/tabs.js`
- `src/renderer/prompts.js`
- `src/renderer/icons/**`

There are also non-React renderer support modules under `src/renderer/store/**`, `src/renderer/components/**`, `src/renderer/adapters/**`, and `src/renderer/utils/**`. Those modules are not themselves the plain HTML entrypoint, but future renderer consolidation work should classify whether each one is React-owned shared renderer support, legacy support, or migration residue.

The React renderer is rooted at:

- `src/renderer/react/index.html`
- `src/renderer/react/main.tsx`
- `src/renderer/react/App.tsx`
- `src/renderer/react/components/**`
- `src/renderer/react/views/**`
- `src/renderer/react/store/**`
- `src/renderer/react/hooks/**`
- `src/renderer/react/styles/global.css`

`vite.config.js` uses `src/renderer/react` as its Vite root and builds to `src/renderer/react/dist`.

`src/main/main.js` selects renderer mode through explicit fallback/runtime flags:

- `AI_DOCK_LEGACY_UI === "true"` loads `src/renderer/index.html`.
- Dev default mode loads React from `http://localhost:5173`.
- `AI_DOCK_REACT_DIST === "true"` and packaged/runtime mode load `src/renderer/react/dist/index.html`.

`package.json` currently has:

- `dev`: starts Vite only.
- `dev:app`: builds preload, sets `AI_DOCK_SKIP_AUTOTABS=1`, then runs preload watch, Vite, and Electron dev concurrently.
- `dev:new-ui`: compatibility alias for `dev:app`.
- `start`: builds preload and React renderer, then runs Electron with `AI_DOCK_REACT_DIST=true`.
- `start:legacy`: builds preload and runs Electron with `AI_DOCK_LEGACY_UI=true`.
- `electron:build`: builds preload and React renderer before packaging.

This removes the old ambiguity where a developer or Codex could easily validate the legacy UI by default when the React renderer is the current active product UI.

## Decision
React renderer is the intended default development and runtime UI for VR AI Dock.

Legacy plain renderer is retained temporarily only as an explicit fallback until the React start/build path has stable smoke coverage and a separate retirement decision. This ADR records the accepted strategy; IN-2026-009 implemented the initial runtime/build default switch, and future behavior changes still require separate implementation workpacks.

## Options considered
### Option A: Keep current dual mode
Benefits:
- No runtime or package changes.
- Legacy fallback remains available.

Risks:
- Continued ambiguity in launch and verification.
- Codex may validate legacy UI by mistake.
- Production packaging may keep loading legacy by default.

Required workpacks:
- Documentation-only guardrails.

Strong gates:
- None for docs-only continuation.

Verification:
- Confirm docs state the ambiguity.

### Option B: React as default, legacy as explicit fallback
Benefits:
- Aligns default launch with active React product surface.
- Keeps fallback until React smoke is stable.
- Reduces accidental legacy validation.

Risks:
- Requires package and main process changes.
- Needs clear fallback env/script semantics.
- Requires start/build smoke coverage.

Required workpacks:
- Renderer default runtime/build switch.
- Script naming cleanup.
- React start/build smoke checklist.

Strong gates:
- `package.json` changes.
- `src/main/main.js` changes.
- Build/release path changes.

Verification:
- `npm run dev` or new chosen dev script.
- `npm start`.
- `npm run build`.
- `npm run electron:build` or documented dry-run equivalent.
- Manual Electron smoke for React UI and fallback legacy UI.

### Option C: React only, remove legacy
Benefits:
- Removes dual-mode drift.
- Simplifies renderer ownership.

Risks:
- Removes fallback before React production smoke is proven.
- Requires deletion of legacy files.
- Higher rollback cost.

Required workpacks:
- Legacy renderer removal.
- Production packaging verification.
- Documentation/index cleanup.

Strong gates:
- Renderer source deletion.
- Package/build/runtime updates.

Verification:
- Full React runtime smoke.
- Packaging smoke.
- Git check that legacy references are removed.

### Option D: Keep legacy until one release, then remove
Benefits:
- Conservative transition.
- Allows evidence-based retirement.
- Keeps fallback while React default matures.

Risks:
- Still carries dual-mode overhead for one release.
- Requires a tracked retirement date and owner.

Required workpacks:
- React default switch.
- Fallback documentation.
- Release-plus-one retirement workpack.

Strong gates:
- Same as Option B for default switch.
- Same as Option C for eventual deletion.

Verification:
- React default smoke.
- Legacy fallback smoke until retirement.

## Recommendation
Accepted strategy: Adopt Option B. React renderer is the default development/runtime UI, and legacy remains temporarily available only through explicit fallback mode.

Target state: React is the normal Dock UI for development, `start`, and packaged runtime. Legacy can be invoked only through an explicit fallback mode or is removed after a stable React smoke period.

Implementation note: IN-2026-009 implemented the React default runtime/build switch. Further behavior changes, including legacy renderer deletion or retirement, still require separate gated workpacks.

Next workpacks:
- Legacy renderer fallback/archive/retirement plan.
- React renderer manual smoke closure for release confidence.
- Non-React renderer support module ownership audit.

## Consequences
- Codex and developers should treat React as the intended UI when planning renderer work.
- Workpacks touching renderer startup must explicitly state whether they affect React default, legacy fallback, or both.
- Legacy renderer remains present until a separate approved workpack changes or removes it.
- Non-React renderer support modules need explicit ownership classification before deletion or migration.
- ADR acceptance itself does not authorize additional runtime behavior changes beyond completed approved workpacks.

## Follow-up workpacks
- Legacy renderer fallback/archive/retirement decision.
- React manual smoke closure.
- Production packaging path validation.
- Non-React renderer support module ownership audit.

## Strong gates
- Any `package.json` or lockfile change.
- Any `src/main/main.js` change.
- Any `src/renderer/**` deletion or runtime source change.
- Any `vite.config.*` or `scripts/**` build change.
- Any release packaging change.

## Validation strategy
- Before changing defaults, prove React dev launch, `npm start`, and packaged build behavior.
- Keep a manual smoke checklist for Electron window load, preload bridge availability, sidebar navigation, BrowserView tabs, local views, and fallback legacy launch.
- For docs-only work, validate initiative/workpack artifacts and confirm no forbidden path changes.
