# WP-UI-010 FIXPACK Prompt

Use only if review finds issues in the docs triage.

Allowed fixes:
- Clarify matrix evidence.
- Add missing owner-file references.
- Correct fixpack priority or sequence.
- Update delivery report with verification results.
- Fix markdown formatting or validator failures.

Forbidden:
- Runtime UI changes.
- Screenshot edits.
- Package/config/script/dependency changes.

After fix:
- Re-run initiative validator.
- Re-run workpack validator.
- Re-run `git diff --check`.
- Re-run forbidden-path status check.
