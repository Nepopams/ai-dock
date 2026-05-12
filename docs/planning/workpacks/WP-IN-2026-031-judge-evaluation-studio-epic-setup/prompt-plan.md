# Prompt Plan: WP-IN-2026-031 Judge Evaluation Studio Epic Setup

## Mode
PLAN.

## Objective
Plan a docs/governance-only epic setup for Judge Mode / Evaluation Studio MVP before `WP-JUDGE-006 Evaluation Studio UI Shell`.

## Required PLAN answers
- Why Judge Mode needs an epic: it now spans completed foundation workpacks, an entry point, a future UI shell, history/export, QA, research, and n8n preflight. A capability-level source of truth prevents scope loss and giant APPLY drift.
- Why sprint folder is not needed now: sprint layer is optional and should be used only for a release or delivery slice. The current need is roadmap clarity, so epic roadmap slices are enough.
- Existing workpacks in epic: `WP-JUDGE-001`, `WP-JUDGE-002`, `WP-JUDGE-003`, `WP-JUDGE-004`, `WP-JUDGE-005`, and `IN-2026-028`.
- Future MVP roadmap workpacks: `WP-JUDGE-006`, `WP-JUDGE-007`, `WP-JUDGE-008`, `WP-JUDGE-009`, and `WP-JUDGE-010`.
- Docs files to change: IN-2026-031 artifacts, `WP-IN-2026-031` workpack/prompt-pack, `EP-JUDGE-001` epic files, optional planning README notes, and index links.
- Strong gate: none for docs-only L2 scope. Runtime/package/build/script changes would trigger stop-the-line.
- Verification: run initiative/workpack validators, diff check, status/stat review, and forbidden-path scope check.
