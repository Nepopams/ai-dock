# WP-IN-2026-008 Renderer Mode Consolidation

## Workpack ID
WP-IN-2026-008-renderer-mode-consolidation

## Title
Renderer Mode Consolidation

## Status
Complete

## Owner
Human + Codex

## Mode
L2 architecture/docs planning. Runtime APPLY prohibited.

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/service-catalog.md`
- `package.json`
- `src/main/main.js`
- `src/renderer/index.html`
- `src/renderer/index.js`
- `src/renderer/index.css`
- `src/renderer/react/**`
- `vite.config.js`
- `scripts/build-preload.js`
- `electron-builder.yml`

## Goal
Document the current renderer mode split and propose a consolidation strategy where React is the intended default UI and legacy is treated as explicit fallback or retirement candidate.

## User value
Future development and verification targets the correct UI path and avoids accidental validation of the legacy renderer.

## In scope
- Renderer inventory.
- Current script and build behavior analysis.
- Options A through D.
- Recommendation.
- ADR draft.
- Follow-up workpack proposals.

## Out of scope
- Runtime changes.
- Package script changes.
- `main.js` changes.
- Renderer source changes.
- Legacy deletion.
- Build pipeline changes.

## Current architecture context
`src/main/main.js` resolves the renderer through `AI_DOCK_REACT_UI`. In development, React mode loads `http://localhost:5173`; in packaged mode with the flag it loads `src/renderer/react/dist/index.html`; otherwise it loads `src/renderer/index.html`. Vite is rooted at `src/renderer/react`, while `npm start` and `npm run electron:build` do not set the React UI flag.

## Allowed files
- `docs/planning/initiatives/IN-2026-008-renderer-mode-consolidation/**`
- `docs/planning/workpacks/WP-IN-2026-008-renderer-mode-consolidation/**`
- `docs/architecture/decisions/**`
- `docs/_indexes/source-of-truth.md`

## Forbidden files
- `src/main/**`
- `src/renderer/**`
- `src/preload/**`
- `src/shared/**`
- `package.json`
- `package-lock.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Step-by-step plan
1. Read governance and source-of-truth files.
2. Inventory legacy and React renderer files.
3. Inspect package scripts, Vite config, preload build script, and main renderer selection logic.
4. Document current behavior for `npm run dev`, `npm run dev:new-ui`, `npm start`, and `npm run electron:build`.
5. Evaluate options A through D.
6. Draft ADR-003.
7. Add ADR link to source-of-truth index.
8. Run validators and git scope checks.

## Acceptance criteria
- ADR draft exists.
- Initiative and workpack validators pass.
- No forbidden runtime/config/source path changes exist.
- Recommendation includes now, target state, not now, and next workpacks.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-008-renderer-mode-consolidation`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-008-renderer-mode-consolidation/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json vite.config.js scripts`

## Security impact
No direct security impact. Future renderer default changes must preserve `contextIsolation`, `sandbox`, preload-only renderer access, and IPC boundary rules.

## IPC impact
No IPC contract or channel changes.

## Docs impact
Creates ADR-003 and planning artifacts. Adds ADR-003 to the source-of-truth index.

## Rollback
Revert the created initiative/workpack artifacts, ADR draft, and source-of-truth index link.

## Done criteria
- Validators pass.
- Scope check confirms no runtime/config/package changes.
- Delivery report records follow-up implementation workpacks.

## Risks
- Docs can clarify intent, but current scripts continue to permit legacy launch until implementation follow-ups.
- Production packaging behavior needs smoke validation before changing defaults.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
