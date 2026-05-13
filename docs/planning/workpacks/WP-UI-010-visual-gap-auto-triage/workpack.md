# WP-UI-010 Visual Gap Auto-Triage

## Workpack ID
`WP-UI-010-visual-gap-auto-triage`

## Title
UI v2 Visual Gap Auto-Triage

## Status
Done - docs/design triage completed; runtime APPLY not performed.

## Owner
Human + Codex

## Mode
L2 visual QA / design triage / docs APPLY. Runtime APPLY forbidden.

## Sources of truth
- `docs/design/ui-v2/visual-acceptance.md`
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
- `docs/design/ui-v2/ui-v2-final-smoke-checklist.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/*.png`
- `docs/design/ui-v2/current-screenshots/*.current.png`
- UI v2 delivery reports from IN-UI-002 through IN-UI-009.

## Goal
Fill the visual gap matrix and produce evidence-backed fixpack planning from screenshots, design exports, code ownership, and previous workpack history.

## User value
The user gets a concrete diagnosis of why UI v2 did not visibly apply and which scoped runtime fixpack should run next.

## In scope
- Create initiative artifacts.
- Create prompt-pack.
- Inspect design/current screenshots.
- Inspect owner files and prior changed-file evidence.
- Update visual gap matrix.
- Create triage, runtime root cause, and fixpack sequence docs.
- Update fixpack backlog and roadmap.
- Run docs-only validators and forbidden-path checks.

## Out of scope
- Runtime UI changes.
- CSS or React changes.
- Store, IPC, preload, main, shared, package, dependency, config, script, build, or release changes.
- Screenshot automation or visual diff tooling.
- Running runtime fixpacks.

## Allowed files
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-visual-triage-report.md`
- `docs/design/ui-v2/ui-v2-runtime-root-cause.md`
- `docs/design/ui-v2/ui-v2-fixpack-sequence.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-010-visual-gap-auto-triage/**`
- `docs/planning/workpacks/WP-UI-010-visual-gap-auto-triage/**`

## Forbidden files
- `src/**`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.*`
- `scripts/**`
- `electron-builder.yml`
- `node_modules/**`
- `dist/**`
- `build/**`
- `release/**`

## Affected modules
- UI v2 design QA docs.
- Initiative and workpack planning artifacts.
- No runtime modules.

## Selected executor
`ai-dock-product-planner`

## Secondary executors
- `ai-dock-renderer-react-executor` read-only for code ownership.
- `ai-dock-test-qa-executor` for acceptance criteria.
- `ai-dock-code-reviewer` for changed-files vs owner-files analysis.

## Current architecture context
The UI v2 chain already created design handoff, token primitives, shell/view restyles, visual acceptance docs, and shared component-state styling. Current screenshots show that visual fidelity was not accepted by automated checks alone. This workpack routes future runtime fixpacks to actual owner files without changing runtime.

## Step-by-step plan
1. Read governance, UI v2 context, current matrix/backlog/roadmap, delivery reports, and runtime owner files.
2. Confirm target and current screenshot coverage.
3. Confirm Codex can visually inspect PNG files.
4. Compare design/current screenshots for screens 01-08 and record History screenshot absence.
5. Inspect changed-file history for previous UI workpacks.
6. Fill `visual-gap-matrix.md`.
7. Create visual triage and runtime root-cause reports.
8. Create ordered fixpack sequence and update backlog/roadmap.
9. Run validators and docs-only forbidden-path checks.
10. Update delivery report.

## PLAN answers
1. Current screenshots present for Main Dock Shell, Local Chat, Judge Evaluation Studio, Connections, Form Profiles, Form Runner, Prompt Templates, and Media Presets.
2. `09-history-hub.current.png` is missing.
3. Codex can visually inspect PNG files in this environment.
4. Full NO-GO by composition: Main Dock Shell, Local Chat, Judge Evaluation Studio, Connections, Form Runner, Prompt Templates, Media Presets.
5. GO with polish: Form Profiles.
6. Pending screenshot: History Hub.
7. React layout changes are required for Connections, Shell/PromptRouter, Chat, Judge, and likely Form Runner. CSS-only is insufficient for those targets.
8. Previous owner misses include `CompletionsSettings.tsx` for Connections, Chat owner components for IN-UI-004, and Judge owner components for IN-UI-005.
9. Exact changed docs are listed in Allowed files.
10. No strong gate is active because image inspection is available and runtime changes are not needed for this workpack.

## Acceptance criteria
- Matrix has concrete statuses and evidence for all screens with current screenshots.
- Missing History screenshot is explicitly marked.
- Root-cause report links visual gaps to owner-file and prior workpack evidence.
- Fixpack sequence is actionable and bounded.
- No runtime files are changed.
- Validators and `git diff --check` pass.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-010-visual-gap-auto-triage`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-010-visual-gap-auto-triage/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Manual smoke
- Not applicable to this docs-only triage.
- Follow-up: capture `09-history-hub.current.png`.
- Follow-up: recapture Prompt Templates and Media Presets with representative data/editor states.

## Security impact
None. No runtime, IPC, preload, main, shared, storage, secret, or dependency changes.

## IPC impact
None.

## State impact
None.

## Package impact
None.

## Docs impact
Adds IN-UI-010 planning artifacts and updates UI v2 visual QA/fixpack docs.

## Rollback
Revert IN-UI-010 initiative/workpack artifacts and the UI v2 docs changed by this workpack. No runtime rollback is needed.

## Done criteria
- Initiative validator passes.
- Workpack validator passes.
- `git diff --check` passes.
- Forbidden runtime/package/config status check is clean.
- Delivery report states runtime APPLY was not performed.

## Risks
- Triage can route fixes but cannot make the app visually correct.
- Empty screenshots can lead to provisional NO-GO until representative data screenshots are captured.
- Future runtime fixpacks must preserve behavior while changing layout.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`
