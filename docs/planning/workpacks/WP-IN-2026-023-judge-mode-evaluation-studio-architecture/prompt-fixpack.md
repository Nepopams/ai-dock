# Prompt Fixpack: WP-IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Mode
FIXPACK, docs-only.

## Scope
Use only if REVIEW finds Must Fix issues in docs-only artifacts created by this workpack.

## Allowed files
- `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`

## Forbidden files
- `src/main/**`
- `src/renderer/**`
- `src/shared/**`
- `src/preload/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Rules
- Fix only the REVIEW Must Fix items.
- Do not expand scope.
- Do not change runtime/source/package files.
- Re-run the same validators and scope checks.
- Update `run-state.md` and `delivery-report.md`.

## Stop condition
If the fix requires runtime/source/shared contract/provider settings/package changes, stop and request Human decision.
