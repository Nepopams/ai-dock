# APPLY Prompt - WP-IN-2026-005

Apply the docs-only ADR acceptance.

Allowed changes:
- Change `docs/architecture/decisions/ADR-002-main-process-typescript-source-strategy.md` status from Proposed to Accepted.
- Update `docs/_indexes/source-of-truth.md` wording to show ADR-002 is the accepted strategy.
- Create/update IN-2026-005 initiative and workpack artifacts.

Forbidden changes:
- Runtime files.
- Build, package, tsconfig, scripts, dependencies.
- IPC/preload/shared/renderer contracts.
- ADR decision content beyond the status change.

After APPLY:
- Run validators.
- Run diff and forbidden-path checks.
- Update delivery report with IN-2026-006 Main TS Parity Audit as next action.
