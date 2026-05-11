# Prompt - PLAN - WP-IN-2026-014

MODE: PLAN ONLY.

You are Codex Initiative Runner for VR AI Dock.

Read:
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/architecture/decisions/ADR-003-renderer-mode-strategy.md`
- `docs/architecture/renderer-retirement-plan.md`
- `docs/planning/initiatives/IN-2026-009-react-renderer-default-switch/delivery-report.md`
- this `workpack.md`

Plan a docs-only audit of top-level renderer support modules:
- `src/renderer/store/**`
- `src/renderer/adapters/**`
- `src/renderer/components/**`
- `src/renderer/utils/**`

Use read-only commands only. Do not edit runtime/source/package/build files. Do not move or delete files.

PLAN output must include:
1. inspected files;
2. inventory approach;
3. dependency/reference scan approach;
4. classification model;
5. planned docs changes;
6. verification plan;
7. risks;
8. strong gates, if any.

Allowed files for future APPLY:
- `docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit/**`
- `docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/**`
- `docs/architecture/non-react-renderer-support-ownership.md`
- `docs/_indexes/source-of-truth.md` only for the report link

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
