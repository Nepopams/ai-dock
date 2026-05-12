# EP-JUDGE-001: Judge Mode / Evaluation Studio MVP

## Epic ID
`EP-JUDGE-001`

## Title
Judge Mode / Evaluation Studio MVP

## Product goal
Make Judge Mode a first-class Evaluation Studio capability for evaluating AI outputs across comparison, custom rubric, JSON contract validation, backend/profile selection, export/history, and future workflow integration.

## User value
Users can evaluate generated answers and structured outputs with explicit criteria, deterministic checks, visible backend context, and a staged path toward reusable evaluation history and workflow automation.

## Scope
- Preserve and connect completed foundation work:
  - `WP-JUDGE-001 Current Contract Hardening`
  - `WP-JUDGE-002 Evaluation Preset Catalog`
  - `WP-JUDGE-003 Custom Rubric / Custom Judge Prompt`
  - `WP-JUDGE-004 JSON / Schema Validator Mode`
  - `WP-JUDGE-005 Local LLM Backend Labeling and UX`
- Include the completed `IN-2026-028 Judge Sidebar Entry`.
- Prepare `WP-JUDGE-006 Evaluation Studio UI Shell` as the next bounded runtime workpack.
- Keep later history/export, QA/smoke, research comparison, and n8n preflight as separate slices.

## Non-goals
- Do not implement the Studio UI inside this epic setup.
- Do not change runtime code without a separate approved workpack.
- Do not change Judge architecture or ADR-005 meaning.
- Do not add dependencies or provider settings migrations.
- Do not add n8n runtime integration in MVP shell work.
- Do not make sprint folders mandatory for every workpack.

## MVP definition
The MVP is complete when:
- Existing Judge comparison flow remains compatible.
- Evaluation presets exist as static shared catalog foundation.
- Custom rubric/custom judge prompt are available in the compatibility flow.
- JSON contract validation produces deterministic findings without new dependencies.
- Existing completions profiles show conservative backend labels in Connections/Judge UI.
- Judge has a discoverable entry point.
- Evaluation Studio UI shell exists as a first-class view with bounded source/preset/profile/result states.
- Export/history and deeper research/n8n work remain explicitly staged after the shell.

## Dependencies
- `docs/architecture/judge-mode-evaluation-studio.md`
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md`
- `docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture/delivery-report.md`
- `docs/planning/initiatives/IN-2026-024-judge-current-contract-hardening/delivery-report.md`
- `docs/planning/initiatives/IN-2026-025-judge-evaluation-preset-catalog/delivery-report.md`
- `docs/planning/initiatives/IN-2026-026-judge-custom-rubric-prompt/delivery-report.md`
- `docs/planning/initiatives/IN-2026-027-judge-json-contract-validator/delivery-report.md`
- `docs/planning/initiatives/IN-2026-028-judge-sidebar-entry/delivery-report.md`
- `docs/planning/initiatives/IN-2026-030-judge-local-llm-backend-labeling-ux/delivery-report.md`

## Strong gates
Stop and request Human decision before:
- changing `src/shared/**` Judge/evaluation contracts;
- adding or changing IPC channels;
- changing preload bridge exposure;
- changing `src/main/**` Judge pipeline/provider behavior;
- changing `src/renderer/**` Judge/Studio UI or store;
- changing completions provider settings format;
- adding dependencies or modifying package/lock files;
- adding history/storage format for EvaluationRun;
- exporting raw/sensitive evaluation inputs by default;
- combining multiple runtime layers into one APPLY.

## Current status
| Area | Status | Notes |
| --- | --- | --- |
| Architecture direction | Done | Architecture report and ADR-005 exist. |
| Contract hardening | Done | `WP-JUDGE-001`; manual smoke pending. |
| Preset catalog | Done | `WP-JUDGE-002`; static catalog/test scope. |
| Custom rubric/prompt | Done | `WP-JUDGE-003`; manual smoke pending. |
| JSON validator mode | Done | `WP-JUDGE-004`; manual smoke pending. |
| Local LLM backend labels | Done | `WP-JUDGE-005`; manual smoke pending. |
| Sidebar entry | Done | `IN-2026-028`; manual smoke pending. |
| Studio shell | Next | Must be `WP-JUDGE-006`, separate workpack. |
| History/export | Later | Requires storage/privacy gate. |
| Tests/smoke suite | Later | Should consolidate manual smoke gaps. |
| Research/multi-agent/n8n | Later | Requires stable EvaluationRun direction. |

## Next recommended workpack
`WP-JUDGE-006 Evaluation Studio UI Shell`

This must be a separate initiative/workpack with explicit renderer/store allowed paths, verification commands, rollback, and manual smoke checklist. It must not include EvaluationRun history/export, n8n integration, provider settings migration, or new dependencies.
