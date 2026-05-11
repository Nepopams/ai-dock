# Gates - IN-2026-010

## Soft gates
- Naming: initiative and workpack folder names accepted.
- Decomposition: single renderer-only workpack accepted.
- Executor routing: renderer React executor with QA secondary accepted.

## Strong human gates
None pending.

## Stop-the-line events
None.

## Approval log
- L3 scoped renderer bugfix APPLY autonomy was provided in the user request.
- Gate A: passed based on explicit in/out scope and allowed/forbidden paths.
- Gate B: eligible for autonomous pass because PLAN does not require shared/main/preload/package/schema changes.
- Gate C: passed. Runtime diff is limited to the two allowed renderer files.
- Gate D: passed with manual smoke pending. Automated validators, tests, build, and diff checks are recorded.

## Decisions log
- Use individual `useDockStore((state) => state.x)` selectors rather than adding `useShallow`; no dependency or import pattern expansion required.
- Fix the JSX placeholder by rendering `{{variable}}` as string text, preserving preview copy behavior.
- Do not add an ErrorBoundary in this workpack; track it as a follow-up only if desired.
