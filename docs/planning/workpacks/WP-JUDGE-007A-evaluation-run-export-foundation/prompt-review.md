# Prompt Review: WP-JUDGE-007A EvaluationRun Export Foundation

## Objective
Review the implementation for scope discipline, export behavior, privacy, compatibility, tests, and docs completion.

## Review checks
- No new IPC channels.
- No storage/history implementation.
- No changes under `src/main/storage/**`.
- No Judge runtime pipeline/provider/settings/package/dependency changes.
- Existing `window.exporter.judgeMarkdown(payload)` and `window.exporter.judgeJson(payload)` still work.
- EvaluationRun export guard and mapper are dependency-free.
- JSON export includes `evaluationRun` and legacy top-level fields.
- Markdown criteria are discovered from actual score buckets.
- Markdown includes validator findings when present.
- Markdown includes safe metadata when present.
- Markdown does not include `rawResponse` by default.
- Tests cover mapper, guard, dynamic criteria, validator findings, safe metadata, no Markdown raw response, and JSON envelope.
- EP-JUDGE-001 roadmap/workpack-map and architecture note are updated.
- Verification commands are recorded.
- Delivery report identifies `WP-JUDGE-007B` as a separate next workpack.

## Verdict format
Return `GO`, `GO WITH FOLLOW-UPS`, or `STOP-THE-LINE`, with findings ordered by severity.
