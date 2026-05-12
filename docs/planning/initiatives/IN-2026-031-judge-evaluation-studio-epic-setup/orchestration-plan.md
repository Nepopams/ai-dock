# Orchestration Plan: IN-2026-031 Judge Evaluation Studio Epic Setup

## Initiative summary
This L2 docs/governance APPLY creates an epic-level source of truth for Judge Mode / Evaluation Studio MVP. It links completed foundation workpacks, explains why a capability epic is now needed, records the MVP roadmap, and keeps `WP-JUDGE-006 Evaluation Studio UI Shell` as the next bounded workpack.

## Assumptions
- Safe assumption: Judge Mode now meets the threshold for an epic because it spans several related workpacks and product slices, not one bugfix or cleanup.
- Safe assumption: The existing architecture report and ADR-005 remain the source of architecture direction; this initiative only adds planning containers and links.
- Safe assumption: A sprint folder is not needed now because there is no release/delivery slice being committed; roadmap slices inside the epic are enough.
- Blocking assumption: Any runtime, IPC, storage, package, dependency, or build change would exceed L2 scope and trigger a strong human gate.

## Selected delivery mode
Docs-only / workflow-governance L2 APPLY. Runtime APPLY is forbidden.

## Epic breakdown
| Epic ID | Title | Scope | Risk profile | Success criteria |
| --- | --- | --- | --- | --- |
| `EP-JUDGE-001` | Judge Mode / Evaluation Studio MVP | Foundation workpacks, Judge entry point, next Studio shell, later export/history, tests/smoke, research and n8n preflight planning | Medium as a capability, low for this docs-only setup | Epic folder, roadmap, workpack map, index links, and validation all complete |

Why the epic is needed:
- Judge Mode is now a capability-level product direction with architecture, contract, presets, rubric/custom prompt, validator, backend labels, UI shell, history/export, QA, research, and n8n slices.
- Without an epic source of truth, `WP-JUDGE-006` could absorb too much scope and become a giant APPLY.
- The epic preserves the completed foundation layers and makes future bounded workpack ordering explicit.

## Sprint mapping
No Judge sprint folder is created for this initiative.

Reason:
- Sprint layer is optional.
- Sprints are for release/delivery slices with concrete scheduling or coordination needs.
- The current Judge MVP only needs roadmap slices inside `EP-JUDGE-001`.
- A future sprint can reference the epic if the Human decides to package one or more slices for release.

## Workpack queue
| Workpack ID | Type | Purpose | Dependency | Expected status |
| --- | --- | --- | --- | --- |
| `WP-IN-2026-031-judge-evaluation-studio-epic-setup` | Docs/governance | Create epic container, roadmap, workpack map, README notes, and index links | Completed Judge delivery reports and ADR-005 | Done |
| `WP-JUDGE-006 Evaluation Studio UI Shell` | Future runtime/UI | Create first-class Studio shell without history/export or n8n scope | `WP-JUDGE-001` through `WP-JUDGE-005`, `IN-2026-028`, and this epic | Next |
| `WP-JUDGE-007 EvaluationRun History and Export` | Future runtime/data/export | Define save/export flow and privacy controls | UI shell and storage/privacy gate | Later |
| `WP-JUDGE-008 Tests and Smoke Suite` | Future QA | Consolidate automated and manual Judge smoke coverage | UI shell and core modes | Later |
| `WP-JUDGE-009 Research Comparison Mode` | Future runtime/UI | Add research/multi-output comparison flows | Studio shell and source selection | Later |
| `WP-JUDGE-010 n8n EvaluationRun Integration Preflight` | Future docs/integration preflight | Prepare workflow integration after EvaluationRun stabilizes | History/export contract | Later |

Existing workpacks included in the epic:
- `WP-JUDGE-001 Current Contract Hardening`
- `WP-JUDGE-002 Evaluation Preset Catalog`
- `WP-JUDGE-003 Custom Rubric / Custom Judge Prompt`
- `WP-JUDGE-004 JSON / Schema Validator Mode`
- `WP-JUDGE-005 Local LLM Backend Labeling and UX`
- `IN-2026-028 Judge Sidebar Entry`

## Executor routing
| Workpack ID | Selected executor | Primary skill | Secondary executors | Rationale |
| --- | --- | --- | --- | --- |
| `WP-IN-2026-031-judge-evaluation-studio-epic-setup` | `ai-dock-initiative-runner` | Initiative Runner | Workflow validation | Docs/governance setup only |
| `WP-JUDGE-006` | Future `ai-dock-renderer-react-executor` | Renderer React executor | Zustand/Test-QA as needed | UI shell is renderer/store dominant, but not part of this initiative |

## Gate plan
- Soft gate: Create `docs/planning/epics/_README.md` to clarify epic usage. Decision: approved because it documents existing planning semantics.
- Soft gate: Create `docs/planning/sprints/_README.md` to clarify optional sprint layer. Decision: approved because it prevents unnecessary sprint folders.
- Soft gate: Add epic links to `source-of-truth.md` and `feature-index.md`. Decision: approved for discoverability.
- Strong human gates: none triggered. Runtime/package/build/script changes are forbidden and not needed.
- Gate owner: Codex for L2 docs/governance APPLY; Human for any future runtime workpack approval.

## Verification strategy
- Docs/workflow validation:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-031-judge-evaluation-studio-epic-setup`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-031-judge-evaluation-studio-epic-setup/workpack.md`
- Runtime tests: not run; runtime is unchanged.
- Smoke/manual QA: not applicable to this docs-only setup. Manual smoke remains pending where prior Judge delivery reports already marked it pending.
- Scope checks:
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
  - `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js electron-builder.yml scripts`

## Risk register
| Risk | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Epic grows stale | Future work misses foundation context | Future Judge workpacks should update `roadmap.md` and `workpack-map.md` | Codex + Human | Open |
| `WP-JUDGE-006` expands into history/export/n8n | Giant APPLY risk | Keep later slices as `WP-JUDGE-007` through `WP-JUDGE-010` | Human + future executor | Open |
| Manual smoke remains pending | Confidence gap for UI-facing foundation | Track in workpack map and keep `WP-JUDGE-008` | Human + QA | Open |
