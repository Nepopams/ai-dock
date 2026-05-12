# Prompt Apply: WP-JUDGE-006 Evaluation Studio UI Shell

## Objective
Implement the scoped renderer UI shell.

## Apply scope
- Create `src/renderer/react/views/EvaluationStudioView.tsx`.
- Update `src/renderer/react/App.tsx` to render `EvaluationStudioView` for the compare route.
- Add minimal CSS in `src/renderer/react/styles/global.css`.
- Update initiative/workpack and epic status docs.

## Guardrails
- Reuse existing `CompareView`; do not duplicate Judge run logic.
- Use `actions.prepareJudgeComparison` for manual start.
- Validate both answer texts before starting.
- Keep planned mode cards static/non-actionable.
- Do not change main/preload/shared/IPC/package/dependency/provider settings.
- Do not implement history/storage, research source picking, file import, BrowserView extraction, or n8n integration.
