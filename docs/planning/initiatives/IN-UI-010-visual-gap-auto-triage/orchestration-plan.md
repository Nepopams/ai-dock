# IN-UI-010 Orchestration Plan

## Initiative summary
Perform a docs-only, evidence-backed visual triage for UI v2 using design PNGs, current screenshots, previous delivery reports, changed-file history, and runtime owner files.

## Classification
- Initiative type: L2 visual QA / design triage / docs APPLY.
- Runtime APPLY: forbidden.
- Selected executor: `ai-dock-product-planner`.
- Secondary executors: `ai-dock-renderer-react-executor` read-only, `ai-dock-test-qa-executor`, `ai-dock-code-reviewer`.

## Assumptions
- Current screenshots are trusted as Human-provided evidence.
- Screenshot absence means visual verdict cannot be made for that screen.
- Visual inspection can be performed by Codex in this environment.
- Build/test success from previous workpacks does not imply visual acceptance.

## Selected delivery mode
Single docs/design workpack: `WP-UI-010-visual-gap-auto-triage`.

## Epic breakdown
- UI v2 visual acceptance triage.
- UI v2 runtime fixpack sequencing.
- UI v2 acceptance governance.

## Sprint mapping
- Sprint item: complete IN-UI-010 docs-only triage.
- Follow-up sprint item: run first scoped runtime fixpack after Human approval.

## PLAN
1. Confirm current screenshot availability.
2. Confirm image inspection availability.
3. Compare target/current PNGs for screens with screenshots.
4. Inspect owner files and previous changed-file evidence.
5. Fill visual gap matrix.
6. Create root-cause, triage, and fixpack sequence docs.
7. Update backlog and roadmap.
8. Run validators and docs-only forbidden-path checks.

## APPLY scope
Allowed docs only:
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-visual-triage-report.md`
- `docs/design/ui-v2/ui-v2-runtime-root-cause.md`
- `docs/design/ui-v2/ui-v2-fixpack-sequence.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- IN-UI-010 initiative artifacts
- WP-UI-010 workpack artifacts

## Workpack queue
| Order | Workpack | Type | Status |
| --- | --- | --- | --- |
| 1 | `WP-UI-010-visual-gap-auto-triage` | L2 docs/design triage | Completed |
| 2 | `WP-UI-011A Connections Recomposition Fixpack` | L3 runtime UI | Recommended next, requires Human approval |
| 3 | `WP-UI-011B Shell / PromptRouter Layout Breakthrough` | L3 runtime UI | Recommended after 011A |

## Executor routing
- Primary: `ai-dock-product-planner`.
- Read-only renderer context: `ai-dock-renderer-react-executor`.
- Acceptance criteria: `ai-dock-test-qa-executor`.
- Changed-files vs owner-files review: `ai-dock-code-reviewer`.

## Gate plan
- STOP if image inspection is unavailable.
- STOP if runtime files need changes.
- STOP if forbidden paths need changes.
- STOP if screenshot evidence is missing for a requested GO/NO-GO verdict.

## Verification strategy
- Initiative validator.
- Workpack validator.
- `git diff --check`.
- Forbidden-path status check.
- No npm build/test because runtime is untouched.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Missing History screenshot | Mark History as Pending screenshot. |
| Empty-state screenshots underrepresent Prompts/Presets | Require representative follow-up screenshots before final acceptance. |
| Future fixpacks overreach | Route each fixpack to explicit owner files and forbidden paths. |

## REVIEW
Review verifies that no runtime files changed, validators pass, the matrix is evidence-backed, and the first runtime fixpack is actionable.

## Strong gates
- STOP if PNG inspection is unavailable.
- STOP if runtime changes are needed.
- STOP if forbidden paths need modification.
