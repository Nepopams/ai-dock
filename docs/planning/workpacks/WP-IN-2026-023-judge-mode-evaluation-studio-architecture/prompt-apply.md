# Prompt Apply: WP-IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Mode
APPLY for docs-only allowed paths. Runtime APPLY is forbidden.

## Allowed files
- `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/**`
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/**`
- `docs/_indexes/source-of-truth.md` only for report/ADR links
- `docs/_indexes/feature-index.md` only for Judge Mode feature reference

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

## APPLY steps
1. Create initiative artifacts.
2. Create planning workpack and prompt-pack.
3. Create architecture/product report.
4. Create ADR-005 draft.
5. Update allowed index links.
6. Run verification commands.
7. Update run-state and delivery report.

## Explicit non-goals
- Do not edit Judge pipeline, CompareView, shared contracts, preload bridge, provider settings, prompts, tests, package files, or dependencies.
- Do not implement local LLM provider code.
- Do not add history storage or migrations.

## Expected result
Docs-only planning diff that is ready for Human review and future workpack approval.
