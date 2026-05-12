# WP-UI-003 REVIEW Prompt

You are reviewing `WP-UI-003 Shell Restyle`.

## Review checks
- Shell components are restyled.
- No local view content restyle occurred beyond shell boundaries.
- No main/preload/shared changes.
- No package/dependency changes.
- No state-shape changes.
- No BrowserView lifecycle changes.
- PromptRouter behavior remains wired to existing handlers.
- Tests/build pass.
- Manual smoke checklist is recorded.
- Next workpack is identified as `WP-UI-004 Chat View Restyle`.

## Must-fix triggers
- Any forbidden-path change.
- Any behavior/store/IPC change outside scope.
- Broad view CSS rewrite.
- Missing shell focus/readability states.
- Build/test failure caused by this workpack.
