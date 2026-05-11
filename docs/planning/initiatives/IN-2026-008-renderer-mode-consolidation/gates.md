# Gates - IN-2026-008

## Soft gates
- Renderer mode ambiguity documented.
- Production build uncertainty documented from existing script and config evidence.

## Strong human gates
- Package script changes: not attempted.
- `src/main/main.js` renderer selection changes: not attempted.
- Legacy renderer removal: not attempted.
- Build/release script changes: not attempted.

## Stop-the-line events
None.

## Approval log
- Human request authorized L2 docs planning only.
- Human request prohibited runtime APPLY without a separate Human Gate.

## Decisions log
- Draft decision: React renderer should become the default development/runtime UI through a later implementation workpack.
- Draft decision: Legacy renderer should remain temporarily as an explicit fallback until React start/build smoke is stable.
- Draft decision: `dev:new-ui` should be renamed or replaced by a clearer script through a later package/build workpack.
- Review decision: docs-only initiative is GO; runtime/build changes remain gated.
