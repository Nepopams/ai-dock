## Workpack ID
WP-UI-007A-form-runner-restyle

## Title
AI Dock UI v2 Form Runner Restyle

## Status
Done

## Owner
Human + Codex

## Mode
L3 scoped renderer Form Runner UI APPLY

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
- `docs/design/ui-v2/exports/6.png`
- `docs/planning/initiatives/IN-UI-006-connections-form-profiles-restyle/delivery-report.md`

## Goal
Apply UI v2 visual treatment to Form Runner without changing form execution behavior.

## User value
Form Runner becomes visually consistent with Form Profiles and UI v2 shell, with clearer generated fields, request preview, timeout controls, stream output, response panels, and copy/error states.

## In scope
- Restyle Form Runner header and profile selector.
- Restyle Back button.
- Restyle generated form fields, required/error/help states, and file placeholder.
- Restyle timeout controls.
- Restyle Clear, Run, Run Stream, and Abort action area.
- Restyle request preview cards and copy actions.
- Restyle stream response, scroll-to-latest, and copy actions.
- Restyle sync response/error panels.
- Add scoped Form Runner CSS in `global.css`.
- Update UI v2 roadmap and initiative/workpack artifacts.

## Out of scope
- Form profile schema changes.
- Form runner IPC/preload/main changes.
- Shared `formRender` changes.
- Sync/stream/abort/copy execution behavior changes.
- Store changes.
- Form Profiles, Prompt Templates, Media Presets, or History restyles.
- New dependencies or UI libraries.

## Current architecture context
- `FormRunView` selects form profiles and builds initial field values from the selected profile.
- It validates required, number, select, checkbox, and file fields before execution.
- It builds a redacted request preview through `renderTemplate` and `sanitizePreview`.
- It uses existing store actions for sync run, stream start, stream abort, clearing run state, focusing Form Profiles, and toast copy feedback.
- Runtime store/shared files are read-only context for this workpack.

## Allowed files
- `src/renderer/react/views/forms/FormRunView.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-007A-form-runner-restyle/**`
- `docs/planning/workpacks/WP-UI-007A-form-runner-restyle/**`

## Forbidden files
- `src/main/**`
- `src/preload/**`
- `src/shared/**`
- `src/renderer/store/**`
- `src/renderer/react/store/**`
- `src/renderer/react/views/forms/FormProfilesManager.tsx`
- `src/renderer/react/views/forms/FormEditor.tsx`
- `src/renderer/react/views/ChatView.tsx`
- `src/renderer/react/components/chat/**`
- `src/renderer/react/views/EvaluationStudioView.tsx`
- `src/renderer/react/views/CompareView.tsx`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/history/**`
- `src/renderer/react/views/presets/**`
- `src/renderer/react/views/prompts/**`
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
1. Verify Form Runner export availability and design handoff.
2. Read Form Runner runtime context and adjacent form context as read-only.
3. Record PLAN and gate status.
4. Create initiative and workpack artifacts.
5. Replace utility-heavy Form Runner className clusters with scoped semantic classes.
6. Add scoped Form Runner CSS using `--aid-*` tokens.
7. Update UI v2 roadmap for `WP-UI-007A`.
8. Run validators, tests, build, diff, and forbidden-path checks.
9. Update run-state and delivery report.

## Acceptance criteria
- Form Runner is visually aligned with UI v2.
- Existing form execution behavior remains unchanged.
- Redaction behavior remains unchanged.
- No forbidden files changed.
- Validators, tests, build, and diff checks pass.
- Manual smoke checklist is recorded.
- Next workpack is identified as `WP-UI-007B Prompt Templates / Media Presets Restyle`.

## Test plan
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-007A-form-runner-restyle`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-007A-form-runner-restyle/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/store src/renderer/react/store src/renderer/react/views/forms/FormProfilesManager.tsx src/renderer/react/views/forms/FormEditor.tsx src/renderer/react/views/ChatView.tsx src/renderer/react/components/chat src/renderer/react/views/EvaluationStudioView.tsx src/renderer/react/views/CompareView.tsx src/renderer/react/views/ConnectionsSettings.tsx src/renderer/react/views/history src/renderer/react/views/presets src/renderer/react/views/prompts src/renderer/adapters package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Security impact
No new IPC, no direct Node access, no dependency changes, and no secret display changes. Existing header redaction remains in `redactHeaders`.

## IPC impact
None.

## Docs impact
Update UI v2 roadmap and create initiative/workpack artifacts.

## Rollback
Revert this workpack's changes to `FormRunView.tsx`, `global.css`, roadmap docs, and planning artifacts. No migrations or data changes are introduced.

## Done criteria
- Scoped visual changes are complete.
- Form runner behavior remains unchanged.
- Automated verification passes or failures are documented.
- Manual smoke checklist is recorded.
- Delivery report recommends merge/no-merge.

## Risks
- Numeric export is used instead of canonical `06-form-runner.png`.
- Manual Electron smoke remains required for visual QA.
- Scoped CSS must be checked in the actual shell viewport.

## Prompt pack links
- `prompt-plan.md`
- `prompt-apply.md`
- `prompt-review.md`
- `prompt-fixpack.md`

## PLAN answers
1. Form Runner canonical export `06-form-runner.png` is missing; numeric `6.png` is present and was used with handoff docs as the design source.
2. Restyled FormRunView elements: top header, Back button, profile selector, parameters panel, generated fields, timeout controls, validation/error messages, Clear/Run/Run Stream/Abort action area, request preview, current inputs/headers/body preview cards, sync response, stream response, error panels, copy buttons, and stream scroll controls.
3. Runtime behaviors unchanged: profile selection, initial values, field validation, redaction, request preview rendering, sync run, stream run, abort, copy, clear, back navigation, timeout parsing, and toast feedback.
4. `FormRunView` needed markup-only className changes plus a minimal declaration-order hygiene fix so `profile` is initialized before dependent stream constants.
5. Replaced utility-like clusters such as `flex h-full`, `rounded border`, `space-y-*`, `text-slate-*`, `bg-slate-*`, `grid ... lg:grid-cols-2`, and button variant strings with scoped `form-runner-*` semantic classes.
6. CSS touched: new scoped Form Runner block in `global.css`, plus existing responsive media queries extended for `.form-runner-*`.
7. Deferred to `WP-UI-007B`: Prompt Templates and Media Presets. Deferred to `WP-UI-007C`: History Hub.
8. Changed files are limited to allowed runtime/docs paths listed above.
9. No strong gate is active.
