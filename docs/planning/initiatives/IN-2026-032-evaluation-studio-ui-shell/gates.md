# Gates: IN-2026-032 Evaluation Studio UI Shell

## Soft gates
- Keep the shell concise and product-oriented without redesigning the whole app.
- Prefer composition over rewriting `CompareView`.
- Keep planned Evaluation Studio modes visible but non-actionable.
- Record manual smoke explicitly if it cannot be run.

## Strong human gates
- Missing `EP-JUDGE-001` epic artifacts.
- Any required change to `src/main/**`, `src/preload/**`, `src/shared/**`, IPC contracts, provider/settings schema, packages, dependencies, build config, or scripts.
- Any need to implement EvaluationRun history/storage.
- Any need for a large `CompareView` rewrite.
- Any scope expansion into research source picking, file import, BrowserView extraction, or n8n integration.

## Stop-the-line events
None.

## Approval log
| Date | Approval | Notes |
| --- | --- | --- |
| 2026-05-12 | Human approved `WP-JUDGE-006 Evaluation Studio UI Shell` | L3 scoped renderer UI APPLY |

## Decisions log
| Decision | Rationale |
| --- | --- |
| Use `EvaluationStudioView` for the `compare` route | Keeps existing sidebar and prepared comparison flows stable while adding a product shell |
| Reuse `CompareView` inside the shell | Avoids duplicating Judge run, JSON validation, rubric, prompt, and export logic |
| Use `prepareJudgeComparison` for manual start | Existing store action already creates a valid compare draft and focuses the compare view |
| Do not create a sprint folder | Epic roadmap slices are sufficient for this MVP workpack |
