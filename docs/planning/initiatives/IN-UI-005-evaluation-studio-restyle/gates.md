# Gates: IN-UI-005 Evaluation Studio Restyle

## Soft gates
- Canonical export filename `docs/design/ui-v2/exports/03-judge-evaluation-studio.png` is missing.
- Numeric export `docs/design/ui-v2/exports/3.png` exists and was visually checked as the Judge Evaluation Studio reference.
- Manual Electron smoke is required after automated checks.

## Strong human gates
- No active strong gate.
- Strong gate would trigger if changes require forbidden paths, store shape changes, Judge IPC/preload/main/shared changes, EvaluationRun storage/export changes, package/dependency changes, or Judge runtime behavior changes.

## Stop-the-line events
None.

## Approval log
- Human explicitly approved `WP-UI-005 Evaluation Studio Restyle` as L3 scoped renderer Evaluation Studio UI APPLY.

## Decisions log
- Proceed without canonical PNG filename because design mapping can be derived from `3.png`, design tokens, implementation notes, and screen map.
- Keep changes visual-only and scoped to allowed Evaluation/Compare renderer files plus related CSS.
- Prefer no changes to `views/evaluation/scoreCriteria.ts` because dynamic criteria behavior is already isolated and visual restyle can be done in CSS.
- Use CSS-only Evaluation/Compare selectors because existing component markup already exposes stable class hooks and preserves handlers.
