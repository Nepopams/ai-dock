# Prompt: PLAN - WP-IN-2026-036 Judge Dynamic Criteria Display

MODE: PLAN ONLY.

## Task
Analyze the scoped renderer UI workpack for dynamic Judge criteria display and produce a file-level PLAN before runtime APPLY.

## Required questions
1. Where exactly hardcoded criteria are rendered in `CompareView`.
2. How to discover criteria from `judgeResult.scores`.
3. How to preserve preferred ordering for existing criteria.
4. How unknown/custom criteria labels should render.
5. How to behave if scores are empty.
6. Whether shared/types changes are needed. If yes, STOP.
7. Whether `judgeSlice` changes are needed. If yes, explain or STOP.
8. Exact files to change.
9. Tests/build commands to run.
10. Whether any strong gate is active.

## Sources
- `docs/planning/workpacks/WP-IN-2026-036-judge-dynamic-criteria-display/workpack.md`
- `src/renderer/react/views/CompareView.tsx`
- `src/shared/types/judge.ts`
- `src/shared/types/evaluationRun.ts`
- `tests/**/*`

## Output
1. PLAN summary
2. Executor decision
3. Proposed file changes
4. Verification plan
5. Risks
6. Files consulted
7. Commands run
