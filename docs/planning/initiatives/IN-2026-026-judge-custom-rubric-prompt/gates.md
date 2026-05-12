# Gates: IN-2026-026 Judge Custom Rubric / Custom Prompt

## Soft gates
| Gate | Status | Notes |
| --- | --- | --- |
| Keep CompareView change minimal | Active | One textarea plus payload/draft support only. |
| Keep architecture note short | Active | Do not recreate large absent architecture report on this branch. |
| Keep tests targeted | Active | Use shared/preload/pipeline pure helper tests. |

## Strong human gates
| Gate | Status | Decision |
| --- | --- | --- |
| Runtime APPLY requires approved workpack | Passed | Human approved `WP-JUDGE-003`. |
| New IPC channel needed | Not triggered | Existing `window.judge.run(input)` can carry optional field. |
| Package/dependency/config change needed | Not triggered | Planned changes use existing JS/TS and Node test runner. |
| Provider settings migration needed | Not triggered | Judge profile selection remains unchanged. |
| Prompt/rubric source file edit needed | Not triggered | Prompt assembly can bound custom instructions in code. |
| Large CompareView rewrite needed | Not triggered | Planned UI change is one textarea and payload field. |
| Preset catalog runtime integration needed | Not triggered | Catalog remains static and disconnected. |
| EvaluationRun/history/storage needed | Not triggered | Out of scope. |

## Stop-the-line events
Stop and ask Human if implementation requires any gate marked as forbidden by the initiative.

## Approval log
| Date | Approval | Source |
| --- | --- | --- |
| 2026-05-12 | APPROVED | User explicitly approved `WP-JUDGE-003 Custom Rubric / Custom Judge Prompt` in the initiative request. |

## Decisions log
| Decision | Rationale |
| --- | --- |
| Use `customPrompt` field name | Matches initiative preference and describes additional judge instructions. |
| No new IPC channel | Existing `window.judge.run(input)` supports optional payload extension. |
| Do not edit prompt/rubric source files | Prompt assembly can add a bounded block in `judgePipeline.js`. |
| Do not connect preset catalog | Separate future workpack. |
