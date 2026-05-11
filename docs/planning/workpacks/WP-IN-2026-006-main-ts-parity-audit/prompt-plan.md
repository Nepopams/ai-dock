# PLAN Prompt - WP-IN-2026-006

Perform read-only analysis for the main TS parity audit.

Required answers:
- How many `src/main/**/*.js` files exist?
- How many `src/main/**/*.ts` files exist?
- Which TS files have JS counterparts?
- Are any TS files included by `tsconfig.json`?
- Which JS files are runtime reachable from `src/main/main.js`?
- Which TS counterparts are wrappers, parity counterparts, stale, migration candidates, retirement candidates, parallel implementations, or unknown?
- Are strong gates triggered?

Expected PLAN conclusion:
- Runtime source remains JS under ADR-002.
- No runtime/build/package changes are required.
- Docs-only APPLY can create the audit report and source-of-truth link.
