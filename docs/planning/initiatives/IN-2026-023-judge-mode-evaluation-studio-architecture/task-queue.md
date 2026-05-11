# Task Queue: IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Queue status
Done

| Workpack ID | Type | Selected executor | Status | Gate status | PLAN status | APPLY status | REVIEW status | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `WP-IN-2026-023-judge-mode-evaluation-studio-architecture` | docs-only | `ai-dock-initiative-runner` | Done | Soft gates logged | Done | Done | GO | Human review of planning output |
| `WP-JUDGE-001 Current Contract Hardening` | runtime multi-layer, staged | `preload-ipc-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Human approves/revises runtime workpack |
| `WP-JUDGE-002 Evaluation Preset Catalog` | runtime/docs/data | `preload-ipc-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait for `WP-JUDGE-001` |
| `WP-JUDGE-003 Custom Rubric / Custom Judge Prompt` | runtime multi-layer, staged | `renderer-ui-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait for preset/contract decision |
| `WP-JUDGE-004 JSON / Schema Validator Mode` | runtime multi-layer, staged | `main-process-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait for result/validator contract |
| `WP-JUDGE-005 Local LLM Backend Labeling and UX` | renderer/settings planning | `renderer-ui-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait for profile labeling decision |
| `WP-JUDGE-006 Evaluation Studio UI Shell` | renderer/store | `renderer-ui-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait for core contract/presets |
| `WP-JUDGE-007 EvaluationRun History and Export` | history/export multi-layer | `history-exporter-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait for result model |
| `WP-JUDGE-008 Tests and Smoke Suite` | tests/QA | `test-qa-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Add after runtime slices |
| `WP-JUDGE-009 Research Comparison Mode` | runtime/UI staged | `renderer-ui-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait for Studio/history support |
| `WP-JUDGE-010 n8n EvaluationRun integration preflight` | docs/API planning | `n8n-integration-implementer` | Queued | Strong gate pending | Not started | Not started | Not started | Wait until EvaluationRun shape stabilizes |

## Workpack ID
`WP-IN-2026-023-judge-mode-evaluation-studio-architecture`

## Type
Docs-only / architecture planning.

## Selected executor
`ai-dock-initiative-runner`

## Status
Done

## Gate status
Soft gate logged. Strong gates are recorded for all future runtime workpacks.

## PLAN status
Done.

## APPLY status
Done for docs-only allowed paths. Runtime APPLY is not applicable and was not performed.

## REVIEW status
GO for docs-only planning scope, pending validator results in `delivery-report.md`.

## Next action
Human reviews this planning output and either approves `WP-JUDGE-001 Current Contract Hardening` as the first runtime workpack or asks Codex to refine the decomposition.
