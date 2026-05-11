# Orchestration Plan - IN-2026-006

## Initiative summary
Audit all main-process TypeScript counterparts under accepted ADR-002 governance and document drift risk without modifying runtime files.

## Assumptions
- ADR-002 is Accepted.
- Runtime source-of-truth remains `src/main/**/*.js`.
- `src/main/**/*.ts` files are non-runtime parity/reference artifacts.
- Static analysis plus targeted file reads is sufficient for this docs-only audit.

## Selected delivery mode
L2 architecture/docs analysis initiative. Runtime APPLY is forbidden.

## Epic breakdown
- Inventory: count JS/TS files, pairs, TS-only files, and runtime reachability.
- Classification: assign each TS file a category and drift risk.
- Reporting: create `docs/architecture/main-ts-parity-audit.md` and link it from source-of-truth.
- Review: validate artifacts and forbidden-path discipline.

## Sprint mapping
Architecture cleanup / pre-feature refactoring.

## Workpack queue
1. `WP-IN-2026-006-main-ts-parity-audit` - docs-only analysis and report.

## Executor routing
- Selected executor: Codex Initiative Runner.
- Review posture: architecture/docs review against ADR-002.
- Runtime executors are not used.

## Gate plan
- Soft gate: add source-of-truth link to the new audit report.
- Strong gate: stop before runtime/build/package/tsconfig/script changes.
- Strong gate: stop before deletion or immediate migration recommendation that requires APPLY.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run `git diff --check`.
- Check forbidden runtime/config paths with scoped `git status`.
- Confirm audit table covers all 24 TS files.

## Risk register
- Static similarity does not replace behavioral tests.
- High-risk TS counterparts remain untouched by design.
- Follow-up workpacks are proposals, not approved runtime changes.
