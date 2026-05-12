# IN-UI-003 Orchestration Plan

## Initiative summary
This initiative applies UI v2 visuals to the shared Dock shell only. It follows `WP-UI-002`, which added the token/primitives foundation, and precedes view-level restyles.

## Assumptions
- Human approval for `WP-UI-003 Shell Restyle` is recorded in the chat context.
- Exact canonical PNG names are missing, but numeric exports `0.png` through `10.png` are present.
- The shell restyle can proceed safely using the UI v2 markdown handoff, tokens, roadmap, and current code structure without pixel-perfect PNG implementation.
- No state-shape, IPC, BrowserView, or package change is required.

## Selected delivery mode
L3 scoped renderer shell UI APPLY.

## Epic breakdown
- Shell chrome: root app frame, dock rail, tab strip, and content chrome.
- Prompt surface: prompt router, adapter status, recent inserts, and router controls.
- Overlay shell: prompt drawer and toast chrome.
- Documentation: initiative/workpack artifacts and roadmap status.

## Sprint mapping
Single scoped workpack: `WP-UI-003 Shell Restyle`. Follow-up workpack is `WP-UI-004 Chat View Restyle`.

## Workpack queue
1. `WP-UI-003 Shell Restyle` - current.
2. `WP-UI-004 Chat View Restyle` - next.
3. `WP-UI-005 Evaluation Studio Restyle`.
4. `WP-UI-006 Connections/Form Profiles Restyle`.
5. `WP-UI-007 Remaining Views Restyle`.

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary verification: `ai-dock-test-qa-executor`.
- Accessibility/security review: `ai-dock-security-hardening-executor` only for focus, disabled, and readability state review.
- Zustand executor not needed because no state-shape changes are planned.

## Gate plan
- Gate A/B are satisfied by explicit human approval, allowed/forbidden paths, and verification commands.
- Canonical PNG filename mismatch is a soft gate because this work can map shell style safely from markdown/tokens without screen-level pixel matching.
- No strong gate is open.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run `npm test`.
- Run `npm run build`.
- Run `git diff --check`.
- Run forbidden-path status check.
- Record manual Electron smoke as required if not run in this pass.

## Risk register
- Top inset/layout visual regression: keep 72px rail and 44px tabstrip tokens and preserve `useTopInsetSync`.
- Prompt router behavior regression: keep existing handlers and store actions unchanged.
- Broad CSS bleed: scope restyle selectors to shell IDs/classes and defer view CSS.
