# Gates - IN-2026-007

## Soft gates
- Updated `docs/architecture/main-ts-parity-audit.md` to classify `registry.ts` as a wrapper after sync.

## Strong human gates
- Would stop before editing `src/main/services/registry.js`.
- Would stop before editing registry IPC, shared, preload, renderer, package, lockfile, tsconfig, build config, scripts, or dependencies.
- Would stop if TypeScript verification required build pipeline changes.

## Stop-the-line events
None.

## Approval log
- Autonomy level: L3 scoped parity APPLY from user request.
- Runtime JS behavior changes explicitly forbidden.

## Decisions log
- Preferred wrapper model selected.
- `registry.ts` no longer duplicates registry storage/watch implementation.
- No shared type changes were required.
