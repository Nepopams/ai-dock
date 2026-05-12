## Workpack ID
WP-UI-006-connections-form-profiles-restyle

## Title
AI Dock UI v2 Connections and Form Profiles Restyle

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped renderer Connections/Form Profiles UI APPLY

## Sources of truth
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/skills/ai-dock-renderer-react-executor/SKILL.md`
- `docs/design/ui-v2/design-tokens.md`
- `docs/design/ui-v2/implementation-notes.md`
- `docs/design/ui-v2/screen-map.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/design/ui-v2/exports/README.md`
- `docs/design/ui-v2/exports/4.png`
- `docs/design/ui-v2/exports/5.png`

## Goal
Apply UI v2 visual treatment to Connections and Form Profiles settings surfaces without changing settings/profile/registry/form behavior.

## User value
Connections and Form Profiles become visually consistent with the UI v2 shell, Chat, and Evaluation Studio, while existing settings and form workflows remain intact.

## In scope
- Restyle Connections tab shell.
- Restyle CompletionsSettings profile list/editor/forms/test states.
- Restyle ClientsAndCategories registry list/editor/validation states.
- Restyle AdapterOverrides service list/editor/health states.
- Restyle FormProfilesManager list/search/actions/dirty/delete surfaces.
- Restyle FormEditor Profile, Request Template, Schema, preview, validation, and footer surfaces.
- Update scoped CSS in `global.css`.
- Update UI v2 roadmap.
- Create initiative/workpack artifacts and prompt-pack.

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
- New dependencies or UI libraries.
- Chat/Judge/History/Presets/Prompts content restyles.

## Current architecture context
- `ConnectionsSettings` owns local tab state and composes `CompletionsSettings`, `ClientsAndCategories`, and `AdapterOverrides`.
- `CompletionsSettings` uses `window.completions` and existing toast/focus actions.
- `ClientsAndCategories` and `AdapterOverrides` use registry and adapter actions through `useDockStore`.
- `FormProfilesManager` uses form profile actions from `useDockStore`, dirty-state confirm, delete confirm, and composes `FormEditor`.
- `FormEditor` is UI-heavy and uses Tailwind-like class strings; it must remain behavior-preserving.

## Allowed files
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/settings/ClientsAndCategories.tsx`
- `src/renderer/react/views/settings/AdapterOverrides.tsx`
- `src/renderer/react/views/forms/FormProfilesManager.tsx`
- `src/renderer/react/views/forms/FormEditor.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-006-connections-form-profiles-restyle/**`
- `docs/planning/workpacks/WP-UI-006-connections-form-profiles-restyle/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/components/chat/**`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/history/**`
- `src/renderer/react/views/presets/**`
- `src/renderer/react/views/prompts/**`
- `src/renderer/react/views/forms/FormRunView.tsx`
- `src/renderer/adapters/**`
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

## Step-by-step plan
1. Verify exports and handoff docs.
2. Read Connections/Form Profiles runtime context and store/shared context as read-only.
3. Record PLAN and split decision.
4. Create initiative and workpack artifacts.
5. Apply scoped visual changes to allowed renderer files.
6. Update UI v2 roadmap.
7. Run validators, tests, build, diff, and forbidden-path checks.
8. Update run-state and delivery report.

## Acceptance criteria
- Connections and Form Profiles are visually aligned with UI v2.
- Existing behavior remains unchanged.
- No forbidden files changed.
- Validators, tests, build, and diff checks pass.
- Manual smoke checklist is recorded.
- Next workpack is identified as `WP-UI-007 Remaining Views Restyle`.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-006-connections-form-profiles-restyle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-006-connections-form-profiles-restyle/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/store src/renderer/react/store src/renderer/react/views/ChatView.tsx src/renderer/react/components/chat src/renderer/react/views/EvaluationStudioView.tsx src/renderer/react/views/CompareView.tsx src/renderer/react/views/history src/renderer/react/views/presets src/renderer/react/views/prompts src/renderer/react/views/forms/FormRunView.tsx src/renderer/adapters package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Security impact
No new IPC, no dependency changes, no direct Node access in renderer, no secret display changes. Token fields remain password/redacted flows.

## IPC impact
None.

## Docs impact
Update UI v2 roadmap and initiative/workpack artifacts.

## Rollback
Revert this workpack's changes to allowed renderer CSS/markup and planning docs. No migrations or data changes are introduced.

## Done criteria
- Scoped visual changes are complete.
- Provider/profile/form/registry behavior remains unchanged.
- Automated verification passes or failures are documented.
- Manual smoke checklist is recorded.
- Delivery report recommends merge/no-merge.

## Risks
- Numeric exports are used instead of canonical names.
- FormEditor utility-like markup can make CSS scope brittle.
- Manual Electron smoke remains required for visual QA.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`

## PLAN answers
1. Connections and Form Profiles canonical exports are not present as `04-connections.png` and `05-form-profiles.png`; numeric `4.png` and `5.png` are present and viewed as the design source with handoff docs.
2. `ConnectionsSettings` tab shell and page framing will be restyled.
3. `CompletionsSettings` profile sidebar, selected profile editor, generic HTTP section, headers, test states, active/dirty/save/test controls will be restyled.
4. `ClientsAndCategories` registry table/list, editor panel, validation and empty/error states will be restyled.
5. `AdapterOverrides` service list, selector grid, editor header/actions, health and tab-state states will be restyled.
6. `FormProfilesManager` header/search/actions, profile list, error state, editor layout, confirm triggers and empty/loading states will be restyled.
7. `FormEditor` root/editor panel, tabs, content sections, request/schema controls, preview/test panel, validation/footer actions and empty state will be restyled.
8. ClassName changes are visual-only and limited to semantic wrappers/variants needed for scoped CSS; no handlers or data logic are changed.
9. Completions load/save/setActive/test, registry add/edit/delete/validate/save, adapter reset/clear/save/health-check, form profile fetch/select/new/duplicate/delete/save/test/open-run, dirty confirm, delete confirm, filtering, and editor callbacks must remain unchanged.
10. CSS touched: Connections/Completions, settings registry, adapter overrides, Form Profiles/FormEditor, and scoped confirm/key-value output under Form Profiles. Shell/chat/judge CSS remains intact.
11. Split is not required because Connections can be CSS-first and Form Profiles changes are visual-only semantic classNames plus scoped CSS, not a broad business-logic rewrite.
12. Planned changed files are the allowed runtime docs/CSS/view files listed above; store/shared/package/config files are read-only context.
13. No strong gate is active.
