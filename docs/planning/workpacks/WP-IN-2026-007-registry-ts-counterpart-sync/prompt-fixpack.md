# FIXPACK Prompt - WP-IN-2026-007

Use only if REVIEW returns NO-GO.

Permitted fixes:
- Correct `registry.ts` wrapper type/export surface.
- Correct `docs/architecture/main-ts-parity-audit.md` classification/action for `registry.ts`.
- Add missing required sections to IN-2026-007 artifacts.

Forbidden fixes:
- Any edit to `registry.js`, registry IPC, shared, preload, renderer, package, lockfile, tsconfig, Vite config, scripts, dependencies, build artifacts, or runtime behavior.

Stop for a strong human gate if any fix requires forbidden paths or scope expansion.
