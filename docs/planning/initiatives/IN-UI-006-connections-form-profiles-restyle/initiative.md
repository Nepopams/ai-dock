## Initiative ID
IN-UI-006-connections-form-profiles-restyle

## Title
AI Dock UI v2 Connections and Form Profiles Restyle

## Status
Done

## Owner
Human + Codex

## Goal
Apply UI v2 visual treatment to Connections and Form Profiles settings surfaces without changing completions profile, service registry, adapter override, form profile, or form editor behavior.

## User value
Users get consistent settings and form-heavy UI for provider profiles, service registry, adapter overrides, and Form Profiles with clearer panels, tabs, validation, dirty states, confirm states, and action buttons.

## Problem
Shell, Chat, and Evaluation Studio are aligned to UI v2, but Connections and Form Profiles still use older mixed styling and Tailwind-like utility markup.

## Success criteria
- Connections tab shell, Completion Profiles, Service Registry, and Adapter Overrides are visually aligned with UI v2.
- Form Profiles manager and FormEditor are visually aligned with UI v2.
- Existing save, test, set active, add, edit, delete, duplicate, open run, dirty confirm, and validation behavior remains unchanged.
- No provider/profile/form/registry schema, IPC, preload, main, shared, package, or dependency changes.
- Automated validators, tests, build, diff checks, and forbidden-path scope checks pass.
- Manual smoke checklist is recorded in the delivery report.

## In scope
- Create initiative artifacts.
- Create `WP-UI-006-connections-form-profiles-restyle` and prompt-pack.
- Plan Connections/Form Profiles visual restyle against UI v2 handoff.
- Apply visual changes to the allowed Connections and Form Profiles renderer files.
- Update scoped CSS for Connections/Form/Profile/FormEditor surfaces.
- Use existing `--aid-*` tokens and primitives where useful.
- Preserve all event handlers and runtime behavior.
- Update UI v2 roadmap status.
- Add delivery report.

## Out of scope
- Provider settings migration.
- Token/auth handling changes.
- Completion profile schema changes.
- Generic HTTP request/response schema changes.
- Registry persistence changes.
- Adapter selector semantics changes.
- Form profile schema changes.
- Form test/run behavior changes.
- Form Runner restyle.
- n8n, research, Judge, Chat, History, Presets, or Prompts changes.
- New component library or new dependencies.

## Constraints
- Do not change `src/main/**`, `src/preload/**`, or `src/shared/**`.
- Do not change `package.json` or `package-lock.json`.
- Do not change IPC contracts.
- Do not change provider profile, form profile, or registry schemas.
- Do not change Zustand state shape.
- Do not add dependencies or UI libraries.
- Do not do a broad CSS rewrite.
- Do not rewrite FormEditor business logic.

## Strong human gate triggers
- Stop if Connections/Form Profiles visual sources cannot support a safe bounded restyle.
- Stop if implementation requires main/preload/shared/package/dependency changes.
- Stop if implementation requires formProfilesSlice, registrySlice, or useDockStore state-shape changes.
- Stop if implementation alters save/test/delete/duplicate/open-run behavior.
- Stop if implementation requires provider/form/registry schema changes.
- Stop if FormEditor rewrite becomes large enough to require WP-UI-006A/006B split.
- Stop if build errors require unrelated view/store changes.

## Candidate epics
- UI v2 Design Handoff and Runtime Adoption.

## Risks
- Canonical PNG export names are absent; numeric `4.png` and `5.png` are used with markdown handoff.
- FormEditor uses Tailwind-like class strings without Tailwind dependency, so scoped CSS and minimal semantic classNames must be carefully verified.
- Manual Electron smoke remains required for visual and behavior confirmation.

## Links
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/workpacks/WP-UI-006-connections-form-profiles-restyle/workpack.md`
