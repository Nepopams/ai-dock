# IN-UI-011A Connections Recomposition Fixpack

## Initiative ID
`IN-UI-011A-connections-recomposition-fixpack`

## Title
Connections Recomposition Fixpack

## Status
Delivered - automated verification passed; manual Electron smoke and fresh screenshot pending.

## Owner
Human + Codex

## Goal
Recompose the Connections screen to approximate the UI v2 target composition while preserving existing provider profile, registry, adapter, token, and store behavior.

## Problem
IN-UI-010 showed Connections as `NO-GO`: the current screen still looked like the old Completion Profiles editor because IN-UI-006 did not meaningfully change `CompletionsSettings.tsx`, the main visible owner component.

## User value
Connections becomes a real UI v2 surface with model profiles, a compact profile editor, right-side status cards, and a Service Registry Preview instead of the old full-page editor.

## Type
L3 scoped renderer runtime UI APPLY.

## Constraints
- Do not change main, preload, shared, store, package, config, script, build, or release files.
- Do not change provider profile schema, registry schema, adapter override semantics, token/auth storage behavior, or Zustand state shape.
- Do not add dependencies.
- Do not touch unrelated local views.
- Do not ship a CSS-only fix.

## In scope
- Create initiative artifacts and WP-UI-011A prompt-pack.
- Recompose `ConnectionsSettings.tsx` and `CompletionsSettings.tsx`.
- Add profile list/editor/status rail and registry preview.
- Update scoped Connections CSS in `global.css`.
- Update UI v2 visual gap/fixpack docs.
- Run validators, tests, build, diff, and forbidden-path checks.

## Out of scope
- Provider/profile persistence changes.
- Token reveal or auth behavior changes.
- Registry migration or adapter behavior changes.
- Shell/PromptRouter, Chat, Judge, Form, Prompts, Presets, or History fixes.

## Success criteria
- `CompletionsSettings.tsx` changes meaningfully.
- Connections is no longer the old full-page Completion Profiles editor.
- Existing save, set active, test, delete, clear token, registry tab, and adapter tab behavior is preserved.
- Token values are not rendered.
- No forbidden paths changed.
- Validators, tests, build, and diff checks pass.
- Delivery report records fresh screenshot still required.

## Candidate workpack
- `WP-UI-011A-connections-recomposition-fixpack`

## Strong human gate triggers
- Provider schema, registry schema, token/auth behavior, store shape, IPC/main/preload/shared, package/dependency, or broad app restyle changes become required.
- Meaningful layout changes in `CompletionsSettings.tsx` cannot be made.

## Candidate epics
- UI v2 visual fixpack sequence.
- Connections settings recomposition.

## Risks
- Shell mismatch remains a separate blocker for full-screen visual acceptance.
- Registry preview uses existing registry state and may show empty/error states depending on local data.

## Links
- Workpack: `docs/planning/workpacks/WP-UI-011A-connections-recomposition-fixpack/workpack.md`
- Target PNG: `docs/design/ui-v2/exports/04-connections.png`
- Current screenshot evidence: `docs/design/ui-v2/current-screenshots/04-connections.current.png`
- Gap matrix: `docs/design/ui-v2/visual-gap-matrix.md`
