# Gates - IN-2026-004

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Artifact naming | Approved | User supplied stable initiative and workpack IDs. | Codex |
| 2026-05-11 | ADR numbering | Approved | `docs/architecture/decisions/` did not exist; user-requested `ADR-002` was free. | Codex |
| 2026-05-11 | Source-of-truth index link | Approved | ADR is an architecture source and should be discoverable from source-of-truth map. | Codex |
| 2026-05-11 | Service catalog no-op | Approved | Existing service catalog already identifies main/BrowerView owned files; ADR holds source strategy detail. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | None | No runtime/build/package/delete/migration change required | None | Closed | Codex |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | None | None | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | L2 docs autonomy | `IN-2026-004-main-process-typescript-source-strategy` | Human request | Runtime APPLY forbidden. |
| 2026-05-11 | Plan Gate | `WP-IN-2026-004-main-process-typescript-source-strategy` | Codex under L2 autonomy | PLAN resulted in docs-only ADR and future gated workpacks. |
| 2026-05-11 | Review Gate | `WP-IN-2026-004-main-process-typescript-source-strategy` | Codex under L2 autonomy | REVIEW = GO. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Recommended now: JS runtime files are source-of-truth | Current Electron entry and build use JS; main TS is excluded from tsconfig | Future main-process runtime edits should target JS unless a migration workpack is approved |
| 2026-05-11 | Keep TS counterparts as non-runtime reference/parity artifacts for now | Deletion or migration is out of scope and requires strong gates | No file deletions; no build changes |
| 2026-05-11 | Target state: staged TypeScript migration only after explicit build strategy | Dual files are drift-prone | Create future migration/parity workpacks before broad feature work |
