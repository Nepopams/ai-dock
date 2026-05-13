# IN-UI-011A Delivery Report

## Summary
Implemented the Connections recomposition fixpack. The visible owner `CompletionsSettings.tsx` now renders a UI v2-style model profile list, profile editor, right status rail, and Service Registry Preview. Runtime behavior, schemas, token handling, stores, IPC, package files, and unrelated views were not changed.

## Workpacks completed
- `WP-UI-011A-connections-recomposition-fixpack` - completed with automated verification passing; manual Electron smoke and fresh screenshot pending.

## Files consulted
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/skills/ai-dock-renderer-react-executor/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/executor-routing.md`
- `.codex/workflows/human-gates.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/design/ui-v2/exports/04-connections.png`
- `docs/design/ui-v2/current-screenshots/04-connections.current.png`
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-visual-triage-report.md`
- `docs/design/ui-v2/ui-v2-runtime-root-cause.md`
- `docs/design/ui-v2/ui-v2-fixpack-sequence.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/views/settings/ClientsAndCategories.tsx`
- `src/renderer/react/views/settings/AdapterOverrides.tsx`
- `src/renderer/react/styles/global.css`
- `src/renderer/react/store/useDockStore.ts`
- `src/renderer/store/registrySlice.ts`
- `src/shared/types/registry.ts`
- `src/shared/utils/completionsProfileLabels.ts`
- `package.json`

## Files changed
- `src/renderer/react/views/ConnectionsSettings.tsx`
- `src/renderer/react/views/CompletionsSettings.tsx`
- `src/renderer/react/styles/global.css`
- `docs/design/ui-v2/visual-gap-matrix.md`
- `docs/design/ui-v2/ui-v2-fixpack-sequence.md`
- `docs/design/ui-v2/ui-v2-fixpack-backlog.md`
- `docs/design/ui-v2/ui-v2-workpack-roadmap.md`
- `docs/planning/initiatives/IN-UI-011A-connections-recomposition-fixpack/**`
- `docs/planning/workpacks/WP-UI-011A-connections-recomposition-fixpack/**`

## PLAN conclusion
APPLY was allowed. Visual evidence showed Connections was NO-GO because the current screenshot still rendered the old Completion Profiles editor. Strings such as `New Profile`, `Back to Chat`, `Custom Headers`, `Test Connection`, and `Saved` proved `CompletionsSettings.tsx` owned the visible screen. CSS-only was insufficient because the target required a different React composition.

## Connections recomposition
- Added a compact top routing strip in `ConnectionsSettings.tsx`.
- Reworked `CompletionsSettings.tsx` around a profile list, profile editor, right status rail, and registry preview.
- Added profile search as local UI state only.
- Added status cards for active profile, driver/backend, token status, stream status, dirty/saved state, and last test state.
- Added Service Registry Preview from existing `registryClients` data.
- Fixed low-height layout overlap by resetting the inherited absolute `.chat-shell` positioning only inside `.connections-panel`.
- Added a compact-height Connections mode that reduces spacing and hides secondary status cards while keeping profile editing, test/save actions, and registry preview reachable.
- Fixed small-window flow by preventing the profile workspace and registry preview from shrinking over each other inside the scroll container.
- Allowed profile editor actions to wrap in narrow editor columns.

## Behavior preservation
- Existing add, remove, save, set active, test connection, clear token, generic HTTP, custom headers, Back to Chat, registry tab, and adapter tab flows remain wired to existing handlers.
- No provider profile schema changes.
- No registry schema changes.
- No adapter override behavior changes.
- No store shape changes.

## Token/security assessment
Token values are not rendered. The UI displays only status labels such as `Stored securely`, `Not configured`, `New token staged`, or `Token clear staged`. The token input remains `type="password"` and existing `hasToken`, `tokenChanged`, and `tokenRef` serialization logic remains unchanged.

## Commands run
- `git pull`
- `git checkout -b workflow/in-ui-011a-connections-recomposition-fixpack`
- `Get-Content` / `rg` source and docs reads
- Image inspection for target/current Connections PNGs
- `npm run build` (early)
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-UI-011A-connections-recomposition-fixpack`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-UI-011A-connections-recomposition-fixpack/workpack.md`
- `npm test`
- `npm run build`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer/store src/renderer/react/store src/renderer/react/views/ChatView.tsx src/renderer/react/views/EvaluationStudioView.tsx src/renderer/react/views/CompareView.tsx src/renderer/react/views/forms src/renderer/react/views/history src/renderer/react/views/presets src/renderer/react/views/prompts src/renderer/adapters package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
- Follow-up layout inspection after low-height screenshot feedback.

## Test results
- Initiative validator: PASS.
- Workpack validator: PASS.
- `npm test`: PASS.
- `npm run build`: PASS.
- `git diff --check`: PASS.
- Forbidden-path status check: clean.

## Review results
- `CompletionsSettings.tsx` changed meaningfully.
- Connections is not CSS-only.
- The first low-height overlap was caused by global `.chat-shell` absolute positioning leaking into the nested Connections surface and was fixed with a scoped reset.
- The remaining small-window overlap was caused by flex children shrinking below their content height and was fixed by making the major Connections sections non-shrinking scroll-document sections.
- Provider/profile/token/registry/adapter behavior preserved.
- No forbidden runtime/package/config paths changed.
- Manual screenshot still required before final visual GO.

## Runtime scope check
Only allowed renderer Connections files, `global.css`, and UI v2 planning docs changed. No main/preload/shared/store/package/config/script/unrelated-view changes.

## Manual smoke checklist
- [ ] Run `npm run dev:app`.
- [ ] Open Connections.
- [ ] Confirm Completion Profiles tab no longer looks like old full-page editor.
- [ ] Resize the Electron window to a low-height viewport and confirm the header, tabs, editor, status cards, and registry preview do not overlap.
- [ ] Confirm the Connections panel scrolls vertically in a small window instead of visually stacking registry preview over the profile editor/status rail.
- [ ] Confirm model profile list visible.
- [ ] Confirm profile editor visible.
- [ ] Confirm right status cards visible.
- [ ] Add profile.
- [ ] Edit profile name/baseUrl/model.
- [ ] Save profile.
- [ ] Set active profile.
- [ ] Test profile works or fails safely.
- [ ] Generic HTTP section usable.
- [ ] Custom headers usable.
- [ ] Token remains redacted and is not displayed as secret.
- [ ] Clear token behavior unchanged.
- [ ] Service Registry tab opens.
- [ ] Service Registry preview/full editor usable.
- [ ] Adapter Overrides tab opens.
- [ ] Adapter Overrides save/reset/clear/health-check works or fails safely.
- [ ] Chat/Shell/Judge/Form Profiles/History still open.
- [ ] Capture new `04-connections.current.png`.
- [ ] Re-run visual gap assessment for Connections.

## Risks
- Full-screen visual acceptance may still be limited by the old shell until WP-UI-011B.
- Registry preview depends on local registry availability and may show empty/error state.

## Follow-ups
- Capture a fresh Connections screenshot.
- Reassess `visual-gap-matrix.md`.
- Start WP-UI-011B Shell / PromptRouter Layout Breakthrough.

## Merge recommendation
GO after automated verification. Manual smoke and fresh screenshot remain required before visual acceptance.
