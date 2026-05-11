# Prompt - APPLY - WP-IN-2026-014

MODE: APPLY.

Preconditions:
- This is L2 docs-only APPLY.
- Runtime APPLY is forbidden.
- File moves and deletion are forbidden.
- Allowed/forbidden paths are fixed in `workpack.md`.

Implement only:
- initiative artifacts under `docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit/**`;
- workpack and prompt-pack under `docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/**`;
- architecture report at `docs/architecture/non-react-renderer-support-ownership.md`;
- source-of-truth index link, if needed.

Report requirements:
- Summary.
- Inventory.
- Dependency map.
- Ownership classification model.
- Classification table.
- Recommendations.
- Follow-up workpacks IN-2026-017 through IN-2026-022.
- Rules for future workpacks.

Stop immediately if any implementation requires:
- runtime/source edits;
- import changes;
- Vite/TypeScript/package/script changes;
- file moves or deletion;
- dependency changes;
- security or IPC boundary changes.

Run verification:
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-014-non-react-renderer-support-ownership-audit`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-014-non-react-renderer-support-ownership-audit/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
