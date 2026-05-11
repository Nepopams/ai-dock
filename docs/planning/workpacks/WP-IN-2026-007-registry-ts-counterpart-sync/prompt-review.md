# REVIEW Prompt - WP-IN-2026-007

Review the scoped registry TS counterpart sync.

Checks:
- `registry.js` is unchanged.
- `registry.ts` is a typed wrapper over `registry.js`.
- `registry.ts` exposes the full JS runtime export surface.
- No forbidden paths changed.
- No package, lockfile, tsconfig, build, scripts, dependency, IPC, shared, preload, or renderer changes.
- `docs/architecture/main-ts-parity-audit.md` marks `registry.ts` as wrapper, not stale.
- Validators pass.
- `npm test` passes.
- Targeted TypeScript check passes or records a no-build limitation.

Expected verdict:
- GO if all checks pass.
- NO-GO only for missing export surface, forbidden path changes, verification failure, or audit mismatch.
