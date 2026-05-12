# IN-UI-002 Orchestration Plan

## Initiative summary
This initiative implements the approved `WP-UI-002 Global Design Tokens and UI Primitives` runtime foundation. It adds UI v2 CSS variables and opt-in primitive classes to `global.css` while deferring screen-level restyles to later workpacks.

## Assumptions
- Human approval for `WP-UI-002` is recorded in the chat context.
- The exact required PNG export names are missing, but numeric exports `0.png` through `10.png` are present.
- This work can proceed as token bootstrap from `docs/design/ui-v2/design-tokens.md` because no screen-level visual application is attempted.
- Existing shell dimensions already match UI v2 rail and tabstrip values.

## Selected delivery mode
L3 scoped renderer CSS/runtime APPLY.

## Epic breakdown
- Token foundation: add `--aid-*` variables under `:root`.
- Primitive foundation: add opt-in `.aid-*` classes for panels, cards, buttons, inputs, chips, empty states, tables, and focus.
- Conservative mapping: map body base colors, shell dimensions, prompt container offsets, content offset, and legacy pill button colors/radius.
- Documentation: record runtime mapping status and roadmap status.

## Sprint mapping
This initiative is a single scoped workpack in the UI v2 implementation sequence. Follow-up screen restyles remain separate workpacks.

## Workpack queue
1. `WP-UI-002 Global Design Tokens and UI Primitives` - selected and applied.
2. `WP-UI-003 Shell Restyle` - next recommended runtime workpack.
3. `WP-UI-004 Chat View Restyle`.
4. `WP-UI-005 Evaluation Studio Restyle`.
5. `WP-UI-006 Connections/Form Profiles Restyle`.
6. `WP-UI-007 Remaining Views Restyle`.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary verification: `ai-dock-test-qa-executor`.
- Security/readability check: `ai-dock-security-hardening-executor` only for focus, disabled, and readability states.

## Gate plan
- Human approval is present for `WP-UI-002`.
- Strong gate is not active because token values are available from `design-tokens.md`, no dependencies are needed, and allowed files are sufficient.
- Exact PNG filename mismatch is recorded as a risk, not a blocker for this token-only bootstrap.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run `npm test`.
- Run `npm run build`.
- Run `git diff --check`.
- Run forbidden-path status check for main/preload/shared, React component/view/store files, package/config, and scripts.
- Record manual Electron smoke as still required unless performed separately.

## Risk register
- Global CSS token changes can have wide visual reach; mitigated by limited mapping and opt-in primitives.
- Focus-visible rules apply to standard controls globally; mitigated by preserving visible focus rather than removing outlines globally.
- Exact PNG export names are missing; mitigated by deferring screen restyles until exports are aligned.
