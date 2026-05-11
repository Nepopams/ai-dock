# IN-2026-005 - Accept ADR-002 Main Process TypeScript Source Strategy

## Initiative ID
IN-2026-005-accept-adr-002-main-ts-source-strategy

## Title
Accept ADR-002 Main Process TypeScript Source Strategy

## Status
Completed

## Owner
Human + Codex

## Goal
Accept ADR-002 as the active governance rule for `src/main/**` JavaScript and TypeScript source-of-truth.

## User value
Future Codex and human workpacks have a clear rule: current main-process runtime changes target JavaScript files, while TypeScript counterparts remain non-runtime parity/reference artifacts until a separate staged migration is approved.

## Problem
ADR-002 was created as Proposed. Follow-up n8n, Judge, cross-history, and main-process work needs the decision to be Accepted so `.js` and `.ts` files are not edited as competing runtime sources.

## Success criteria
- ADR-002 status is changed from Proposed to Accepted.
- The source-of-truth index points at ADR-002 as the accepted strategy.
- No runtime, build, package, or TypeScript configuration files are changed.
- Initiative and workpack validators pass.
- Delivery report records the next action: IN-2026-006 Main TS Parity Audit.

## In scope
- Create file-backed initiative artifacts.
- Create one docs-only workpack and prompt-pack.
- Accept ADR-002 by changing only its status.
- Update source-of-truth index wording if needed.
- Run docs/workflow verification and runtime scope checks.

## Out of scope
- Runtime code changes.
- `src/main/**` changes.
- TypeScript migration.
- Build, package, tsconfig, or scripts changes.
- Deleting or editing TypeScript counterparts.
- Parity audit implementation.

## Constraints
- Runtime APPLY is forbidden.
- Do not change `src/main/**`, `src/preload/**`, `src/renderer/**`, or `src/shared/**`.
- Do not change `package.json`, `package-lock.json`, `tsconfig.json`, Vite config, or scripts.
- Do not add dependencies.
- Preserve ADR decision meaning; only status acceptance is allowed.

## Strong human gate triggers
- A governance/source-of-truth conflict is found.
- Acceptance requires changing ADR decision content rather than status.
- Any runtime, build, package, tsconfig, scripts, IPC, preload, shared, renderer, or dependency change is needed.

## Candidate epics
- Main-process source-of-truth governance acceptance.
- Main TypeScript parity audit follow-up.

## Risks
- ADR acceptance can be misread as approval to migrate main-process runtime to TypeScript; the ADR explicitly says that is not approved yet.
- The existing TS counterparts still require a follow-up parity audit.

## Links
- `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md`
- `docs/_indexes/source-of-truth.md`
- `docs/planning/workpacks/WP-IN-2026-005-accept-adr-002-main-ts-source-strategy/workpack.md`
