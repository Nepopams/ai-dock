# Gates - IN-2026-006

## Soft gates
- Added `docs/architecture/main-ts-parity-audit.md` to the source-of-truth index as an architecture analysis reference.

## Strong human gates
- Runtime, build, package, lockfile, tsconfig, script, dependency, IPC, preload, shared, or renderer changes would require stopping.
- Immediate deletion of TS counterparts would require stopping.
- Immediate main-process TypeScript migration would require stopping.

## Stop-the-line events
None.

## Approval log
- Autonomy level: L2 architecture/docs autonomy from user request.
- Runtime APPLY explicitly forbidden.

## Decisions log
- Classified all main-process TS files without modifying `src/main/**`.
- Identified `src/main/services/registry.ts` as the first sync-needed follow-up.
- Preserved ADR-002: JS runtime files remain source-of-truth.
