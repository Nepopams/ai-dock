# Prompt Review: WP-JUDGE-007C EvaluationRun History UI Integration

Review the `WP-JUDGE-007C` diff against the workpack.

## Checks
- No main/preload/shared/storage/IPC/package/dependency/build config changes.
- Save uses existing `window.evaluationRuns.save`.
- Save uses existing `mapJudgeExportPayloadToEvaluationRun`.
- Open saved run does not call `runJudge`.
- Delete uses existing `window.evaluationRuns.delete`.
- Existing Export MD/JSON still uses the existing exporter methods.
- Saved list renders summaries only.
- Minimal Zustand hydration action does not start a Judge run.
- Build/tests pass or failures are recorded.
- EP-JUDGE roadmap/workpack-map and architecture note are updated.
- Delivery report includes manual smoke checklist.

## Verdict
Return GO, CONDITIONAL GO, or NO-GO with Must Fix items.
