# APPLY Prompt - WP-IN-2026-006

Apply only docs/architecture changes.

Allowed:
- Create `docs/architecture/main-ts-parity-audit.md`.
- Create initiative and workpack artifacts.
- Update `docs/_indexes/source-of-truth.md` with an audit report link.

Forbidden:
- Any `src/main/**` change.
- Package, lockfile, tsconfig, build, scripts, dependency, IPC contract, preload, renderer, or shared changes.
- Any synchronization, deletion, migration, or runtime import change.

After APPLY:
- Run initiative/workpack validators.
- Run `git diff --check`.
- Run forbidden-path status check.
