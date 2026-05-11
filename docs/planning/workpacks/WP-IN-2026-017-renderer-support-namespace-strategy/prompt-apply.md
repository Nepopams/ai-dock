# Prompt - APPLY - WP-IN-2026-017

MODE: APPLY.

Preconditions:
- This is L2 docs-only APPLY.
- Runtime APPLY is forbidden.
- Path moves, import updates, config changes, package changes, and deletion are forbidden.
- Allowed/forbidden paths are fixed in `workpack.md`.

Implement only:
- initiative artifacts under `docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy/**`;
- workpack and prompt-pack under `docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/**`;
- ADR at `docs/architecture/decisions/ADR-004-renderer-support-namespace-strategy.md`;
- source-of-truth index link for ADR-004.

ADR requirements:
- Status: Proposed.
- Context.
- Decision.
- Options considered.
- Consequences.
- Rules for future workpacks.
- Strong gates.
- Follow-up workpacks.
- Validation strategy.

Stop immediately if any implementation requires:
- runtime/source edits;
- import changes;
- Vite/TypeScript/package/script changes;
- file moves or deletion;
- dependency changes;
- security or IPC boundary changes;
- immediate migration.

Run verification:
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-017-renderer-support-namespace-strategy`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-017-renderer-support-namespace-strategy/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/preload src/shared package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`
