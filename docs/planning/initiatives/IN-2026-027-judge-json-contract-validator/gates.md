# Gates: IN-2026-027 Judge JSON Contract Validator Mode

## Soft gates
| Gate | Status | Notes |
| --- | --- | --- |
| Use canonical mode name | Passed | Use `json_contract_check` to match catalog direction. |
| Defer Markdown export formatting | Passed | Export IPC is forbidden; JSON export carries sanitized result. |
| Implement enum values only if simple | Passed | Limit to top-level exact string enum checks. |

## Strong human gates
| Gate | Status | Decision |
| --- | --- | --- |
| Runtime APPLY requires approved workpack | Passed | Human approved `WP-JUDGE-004`. |
| New IPC channel needed | Not triggered | Existing `window.judge.run(input)` carries optional validation config. |
| Dependency/package/lockfile needed | Not triggered | Validators are dependency-free. |
| Full schema engine needed | Not triggered | Scope is parse/required keys/simple enum only. |
| Provider settings change needed | Not triggered | Not needed. |
| Prompt source edit needed | Not triggered | Prompt context assembled in pipeline code. |
| Preset catalog runtime import needed | Not triggered | Catalog remains static and disconnected. |
| Large CompareView redesign needed | Not triggered | Planned UI is a small fieldset. |

## Stop-the-line events
Stop and ask Human if implementation requires any strong gate above.

## Approval log
| Date | Approval | Source |
| --- | --- | --- |
| 2026-05-12 | APPROVED | User explicitly approved `WP-JUDGE-004 JSON / Schema Validator Mode`. |

## Decisions log
| Decision | Rationale |
| --- | --- |
| Use `json_contract_check` | Matches preset catalog and avoids parallel naming. |
| Keep validators inside `judgePipeline.js` | Allowed path and no new service path required. |
| Keep result findings separate from scores | Preserves deterministic vs LLM distinction. |
| Do not modify exporter IPC | `src/main/ipc/**` is forbidden. |
