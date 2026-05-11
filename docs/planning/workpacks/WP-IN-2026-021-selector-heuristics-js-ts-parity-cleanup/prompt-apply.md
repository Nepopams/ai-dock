# Prompt Apply: WP-IN-2026-021

## Role
You are `ai-dock-renderer-react-executor` applying a scoped test/docs parity workpack.

## Allowed files
- `src/renderer/adapters/selectorHeuristics.ts`
- `src/renderer/adapters/selectorHeuristics.js`
- `tests/selectorHeuristics.test.js`
- `docs/architecture/non-react-renderer-support-ownership.md`
- `docs/planning/initiatives/IN-2026-021-selector-heuristics-js-ts-parity-cleanup/**`
- `docs/planning/workpacks/WP-IN-2026-021-selector-heuristics-js-ts-parity-cleanup/**`

## Apply steps
1. Add explicit parity comments to TS and JS files without logic changes.
2. Strengthen `tests/selectorHeuristics.test.js` to cover:
   - default groups exist;
   - JS defaults mirror TS source arrays;
   - overrides are first;
   - duplicates are removed;
   - whitespace is trimmed;
   - empty/falsy JS selectors are ignored.
3. Update ownership docs to state that JS is a test-facing CommonJS parity artifact.
4. Update initiative run-state and queue.

## Stop conditions
Stop for Human Gate if package/tsconfig/scripts/imports/path moves/deletes/runtime behavior changes become necessary.
