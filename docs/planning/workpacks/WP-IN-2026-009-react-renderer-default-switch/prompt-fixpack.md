# FIXPACK Prompt - WP-IN-2026-009

Use only if REVIEW is NO-GO.

Allowed fixes:
- Correct script names or env flags in `package.json`.
- Correct renderer selection in `src/main/main.js`.
- Correct README/service-catalog wording.
- Fix missing initiative/workpack sections.

Forbidden fixes:
- Dependency additions.
- Lockfile changes.
- Preload/shared/IPC changes.
- React component changes.
- Legacy renderer deletion.

Stop for Human Gate if a fix requires forbidden paths.
