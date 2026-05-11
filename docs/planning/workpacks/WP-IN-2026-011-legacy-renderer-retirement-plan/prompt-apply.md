# WP-IN-2026-011 Prompt - APPLY

MODE: DOCS-ONLY APPLY.

## Preconditions
- PLAN is complete.
- No strong gate is pending.
- Runtime APPLY and deletion remain forbidden.

## Required changes
- Create `docs/architecture/renderer-retirement-plan.md`.
- Create initiative/workpack artifacts.
- Update `docs/_indexes/source-of-truth.md` only to add the report link.

## Forbidden
- `src/main/**`
- `src/renderer/**`
- `src/preload/**`
- `src/shared/**`
- package files
- Vite/build/scripts
- deletion or file moves

## Verification
Run the validators and forbidden-path checks from the workpack.
