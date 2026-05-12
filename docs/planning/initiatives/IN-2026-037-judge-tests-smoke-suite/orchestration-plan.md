# Orchestration Plan: IN-2026-037 Judge Tests and Smoke Suite

## Initiative summary
`IN-2026-037` consolidates Judge MVP QA evidence into one documentation suite and a small no-dependency docs test. The delivery is QA/docs-only and intentionally avoids runtime feature APPLY.

## Assumptions
- Existing unit tests are the automated source for Judge/EvaluationRun coverage.
- There is no existing Electron UI automation harness in the repo.
- Manual smoke execution requires a Human-operated Electron session and optional provider/local backend setup.
- `WP-JUDGE-008` should create the suite and gates, not claim that product smoke was executed.

## Selected delivery mode
L2 QA/docs APPLY with L3 limited to `tests/**` for a no-dependency documentation completeness test. No runtime source changes are allowed.

## Epic breakdown
| Epic | Slice | Status | Notes |
| --- | --- | --- | --- |
| `EP-JUDGE-001` | `WP-JUDGE-008 Tests and Smoke Suite` | Done | Consolidates QA docs and coverage inventory. |

## Sprint mapping
No separate sprint folder is required. This initiative updates the existing `EP-JUDGE-001` roadmap and workpack map.

## Workpack queue
| Order | Workpack | Type | Status |
| --- | --- | --- | --- |
| 1 | `WP-JUDGE-008-tests-smoke-suite` | QA/docs/test | Done |

## Executor routing
- Selected executor: `ai-dock-test-qa-executor`.
- Read-only UI flow context: `ai-dock-renderer-react-executor`.
- Checklist/security review context: `ai-dock-ipc-security-reviewer`.
- Runtime executors are not used for APPLY.

## Gate plan
- PLAN gate: pass if no runtime source, dependency, package, or automation harness change is needed.
- APPLY gate: limited to allowed docs, epic planning docs, architecture note, source-of-truth links, and optional no-dependency `tests/**`.
- REVIEW gate: verify docs completeness, no forbidden paths changed, validators/tests/build pass, and manual smoke is clearly marked as pending.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run targeted docs QA test.
- Run `npm test`.
- Run `npm run build`.
- Run diff, whitespace, and forbidden-path scope checks.
- Do not run manual Electron smoke unless Human explicitly does it.

## Risk register
| Risk | Mitigation |
| --- | --- |
| QA docs drift from expected scenarios | Add `tests/judgeQaDocs.test.js` to check required files, scenario headings, and inventory references. |
| Manual smoke is mistaken for completed product QA | Delivery report and release confidence doc explicitly distinguish suite creation from execution. |
| Scope creeps into runtime fixes | Strong gate requires stop before any `src/**`, package, IPC, storage, export, provider, or dependency change. |
