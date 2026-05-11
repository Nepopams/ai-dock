# Orchestration Plan - IN-2026-005

## Initiative summary
Accept ADR-002 so the main-process JavaScript runtime source-of-truth rule becomes active governance.

## Assumptions
- Human approval exists for accepting ADR-002.
- ADR-002 exists and currently has status Proposed.
- No runtime or build changes are required to accept the ADR.

## Selected delivery mode
L2 docs/governance initiative with runtime APPLY forbidden. One docs-only workpack is sufficient.

## Epic breakdown
- Governance acceptance: validate ADR and source-of-truth context.
- Docs-only apply: update ADR status and source-of-truth wording.
- Review: verify no runtime/config scope changes and validators pass.

## Sprint mapping
Architecture cleanup / governance gate.

## Workpack queue
1. `WP-IN-2026-005-accept-adr-002-main-ts-source-strategy` - docs-only PLAN/APPLY/REVIEW.

## Executor routing
- Selected executor: Codex Initiative Runner.
- Secondary reviewer posture: governance/docs review.
- Runtime executors are not used.

## Gate plan
- Soft gate: source-of-truth index wording can be updated docs-only.
- Strong gate: stop if runtime/build/package/tsconfig/script changes are required.
- Strong gate: stop if ADR acceptance requires changing the decision content.
- Strong gate: stop if governance documents conflict with accepting ADR-002.

## Verification strategy
- Validate initiative artifacts.
- Validate workpack artifact.
- Run `git diff --check`.
- Check forbidden runtime/config paths with scoped `git status`.
- Confirm ADR-002 status is Accepted.

## Risk register
- Residual drift risk remains until IN-2026-006 audits main-process TS parity.
- Acceptance does not implement migration or automated parity enforcement.
