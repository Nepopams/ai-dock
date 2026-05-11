# Prompt - PLAN - WP-IN-2026-017

MODE: PLAN ONLY.

You are Codex Initiative Runner for VR AI Dock.

Read:
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/prompts/initiative-runner-template.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/renderer-retirement-plan.md`
- `docs/architecture/non-react-renderer-support-ownership.md`
- `package.json`
- `vite.config.js`
- `tsconfig.json`
- this `workpack.md`

Plan a docs-only namespace strategy for:
- `src/renderer/store/**`
- `src/renderer/adapters/**`
- `src/renderer/components/**`
- `src/renderer/utils/**`

Do not edit runtime/source/package/build files. Do not move/delete files. Do not update imports or config.

PLAN output must include:
1. inspected files;
2. current namespace snapshot;
3. options A-D analysis plan;
4. ADR creation plan;
5. verification plan;
6. risks;
7. strong gates, if any.

Allowed files:
- `docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy/**`
- `docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/**`
- `docs/architecture/decisions/**`
- `docs/_indexes/source-of-truth.md` only for the ADR link
- `docs/architecture/non-react-renderer-support-ownership.md` only for a short ADR link if needed

Forbidden files:
- `src/main/**`
- `src/renderer/**`
- `src/preload/**`
- `src/shared/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`
