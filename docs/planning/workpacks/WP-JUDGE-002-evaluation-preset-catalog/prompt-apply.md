# Prompt Apply: WP-JUDGE-002 Evaluation Preset Catalog

## Mode
APPLY.

## Scope
Create the static Evaluation Preset Catalog v1, shared EvaluationPreset guards, and catalog tests only.

## Allowed paths
- `src/shared/presets/evaluation/**`
- `src/shared/types/evaluationPreset.ts`
- `src/shared/types/evaluationPreset.js`
- `tests/evaluationPresets.test.js`
- `docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog/**`
- `docs/planning/workpacks/WP-JUDGE-002-evaluation-preset-catalog/**`

## Forbidden paths
Do not edit `src/main/**`, `src/preload/**`, `src/renderer/**`, `src/shared/ipc/**`, `src/shared/types/judge.*`, `src/shared/prompts/judge/**`, package/lock/config/script/build/release paths.

## Implementation notes
- Validators are declarative only.
- Catalog is static data only.
- Current Judge runtime behavior must not change.
- Use Node built-ins for validation tests.
