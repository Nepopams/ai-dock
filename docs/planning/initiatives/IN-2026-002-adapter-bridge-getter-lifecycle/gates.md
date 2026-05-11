# Gates

## Soft gates
| Date | Gate | Decision | Rationale | Recorded by |
| --- | --- | --- | --- | --- |
| 2026-05-11 | Workpack queue size | Approved | Один bounded runtime workpack достаточен; no giant APPLY. | Codex |
| 2026-05-11 | Executor routing | Approved | Affected runtime slice is main-process IPC/BrowserView; selected executor `ai-dock-main-process-executor`. | Codex |
| 2026-05-11 | Secondary review role | Approved | `ai-dock-ipc-security-reviewer` нужен как review focus, not separate APPLY executor. | Codex |
| 2026-05-11 | Docs indexes no-op | Approved pending final review | `ipc-index.md` и `service-catalog.md` уже описывают late-bound `getTabManager`; PLAN не требует изменения. | Codex |
| 2026-05-11 | Manual smoke handling | Approved | Dev app не запускается автоматически; checklist добавляется в delivery report. | Codex |
| 2026-05-11 | PLAN Gate | Approved | Workpack and initiative validators passed; selected executor, allowed paths and verification commands are explicit. | Codex |
| 2026-05-11 | REVIEW Gate | Approved | Automated verification passed; forbidden paths unchanged; manual smoke recorded as residual risk. | Codex |

## Strong human gates
| Date | Gate | Trigger | Required decision | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| 2026-05-11 | Package/dependency/preload/renderer/shared/new IPC/public contract scope | Not triggered | None | Closed | Human + Codex |

## Stop-the-line events
| Date | Event | Impact | Action taken | Status |
| --- | --- | --- | --- | --- |
| 2026-05-11 | None | No impact | Continued L3 scoped flow | Closed |

## Approval log
| Date | Approval | Scope | Approved by | Notes |
| --- | --- | --- | --- | --- |
| 2026-05-11 | L3 scoped runtime autonomy | `src/main/browserViews/adapterBridge.js`, `src/main/ipc/bootstrap.js`, initiative/workpack docs | User request | Stop only on strong human gates. |
| 2026-05-11 | Runtime APPLY | `src/main/ipc/bootstrap.js` cleanup only | Codex under L3 policy | No strong gate; no public IPC contract change. |
| 2026-05-11 | Review Gate | `WP-IN-2026-002-adapter-bridge-getter-lifecycle` | Codex under L3 policy | GO with manual smoke pending. |

## Decisions log
| Date | Decision | Context | Consequence |
| --- | --- | --- | --- |
| 2026-05-11 | Do not modify preload/renderer/shared/package files | User constraints and security invariants | Public IPC contract remains unchanged. |
| 2026-05-11 | Do not update docs indexes unless needed | PLAN found docs already describe late-bound access | Avoid docs churn. |
| 2026-05-11 | Keep `adapterBridge.js` unchanged | PLAN found JS AdapterBridge already compliant | Runtime diff limited to bootstrap cleanup. |
