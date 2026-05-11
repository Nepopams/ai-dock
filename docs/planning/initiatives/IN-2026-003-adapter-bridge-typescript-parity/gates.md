# Gates - IN-2026-003

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Artifact naming | Approved | User supplied stable initiative and expected workpack IDs. | Codex |
| 2026-05-11 | Single workpack decomposition | Approved | Scope is one main-process BrowserView TypeScript parity update. | Codex |
| 2026-05-11 | Docs/index no-op | Approved | PLAN found existing IPC index and service catalog already describe late-bound `getTabManager` for `adapterBridge.ts/js`; syncing TS makes docs accurate. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | None | No strong trigger during artifact creation | None | Closed | Codex |
| 2026-05-11 | Plan Gate | PLAN does not require package, build, tsconfig, deletion, shared/preload/renderer, IPC channel, or response-shape changes | Proceed with scoped `adapterBridge.ts` APPLY | Closed | Codex |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | None | None | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | L3 scoped runtime autonomy | `IN-2026-003-adapter-bridge-typescript-parity` | Human request | Stop only on strong human gates. |
| 2026-05-11 | Plan Gate | `WP-IN-2026-003-adapter-bridge-typescript-parity` | Human request via L3 autonomy | PLAN satisfied gate requirements and no strong trigger was found. |
| 2026-05-11 | Review Gate | `WP-IN-2026-003-adapter-bridge-typescript-parity` | Codex under L3 autonomy | REVIEW = GO; manual smoke remains recommended. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Create one runtime single-layer workpack | Initiative affects only `src/main/browserViews/adapterBridge.ts` if PLAN permits | No giant APPLY; single workpack queue |
| 2026-05-11 | Treat `adapterBridge.ts` as parity artifact | Current runtime/build uses JS, but docs list TS/JS bridge ownership | Synchronize TS without changing runtime JS or deleting the file |
| 2026-05-11 | Merge recommendation is conditional | Automated verification passed, but live Electron BrowserView smoke was not run | Recommend manual smoke before merge |
