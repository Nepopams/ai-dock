# IN-UI-009 Component States and Shared Dialogs Restyle

## Initiative ID
`IN-UI-009-component-states-shared-dialogs`

## Title
AI Dock UI v2 Component States and Shared Dialogs Restyle

## Status
Delivered - automated verification passed; manual smoke pending.

## Owner
Human + Codex

## Goal
Apply UI v2 treatment to shared dialogs, key-value editor fragments, and scoped component state classes without changing behavior.

## Problem
Most primary screens have UI v2 workpack coverage, but shared fragments such as confirm dialogs, key-value editor rows, and common state treatments can still look inconsistent when they appear inside Form Profiles, Presets, Prompts, and other surfaces.

## User value
Common dialogs and form fragments become visually consistent across the UI v2 rollout while keeping existing interactions, props, and runtime contracts stable.

## Type
L3 scoped renderer shared component states UI APPLY.

## Constraints
- Do not change `src/main/**`, `src/preload/**`, or `src/shared/**`.
- Do not change stores, IPC contracts, package files, config, scripts, dependencies, or build outputs.
- Do not change `ConfirmDialog` or `KeyValueEditor` props or behavior.
- Do not restyle whole screens or perform visual gap fixpacks.
- Do not add dependencies or UI libraries.

## In scope
- Create initiative artifacts and `WP-UI-009` prompt-pack.
- Restyle `ConfirmDialog` with semantic classes.
- Restyle `KeyValueEditor` with semantic classes.
- Add scoped shared CSS for confirm dialog, key-value editor, and common state classes.
- Preserve behavior and existing parent screen contracts.
- Update the UI v2 roadmap and visual acceptance notes.

## Out of scope
- Screen layout fixpacks.
- Shell, Chat, Judge, Connections, Form Runner, Prompts, Presets, or History view restyles.
- Store, IPC, preload, main, shared, schema, package, or dependency changes.
- Screenshot automation or visual diff tooling.

## Success criteria
- `ConfirmDialog` uses semantic UI v2 classes and preserves confirm/cancel behavior.
- `KeyValueEditor` uses semantic UI v2 classes and preserves add/update/remove/read-only behavior.
- Shared state CSS is scoped and tokenized.
- No forbidden runtime, package, or config paths change.
- Validators, tests, build, and diff checks pass.
- Delivery report records manual smoke still required.

## Candidate workpack
- `WP-UI-009-component-states-shared-dialogs`

## Strong human gate triggers
- Component props, parent screens, state shape, IPC, preload/main/shared, package, or dependency changes become required.
- Scoped CSS needs to become a broad screen restyle.
- ConfirmDialog or KeyValueEditor restyle requires parent screen rewrites.
- Build failures require unrelated view/store changes.

## Candidate epics
- UI v2 shared component states.
- UI v2 final visual acceptance readiness.

## Risks
- Shared CSS can affect multiple surfaces if selectors are too broad.
- Dialog and editor smoke still requires a running Electron app.
- This pass does not replace screenshot-based visual acceptance from IN-UI-008.

## Links
- Workpack: `docs/planning/workpacks/WP-UI-009-component-states-shared-dialogs/workpack.md`
- Component States Board: `docs/design/ui-v2/exports/10-component-states-board.png`
- Roadmap: `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- Visual acceptance: `docs/design/ui-v2/visual-acceptance.md`
