# Executor Index — VR AI Dock

Этот индекс фиксирует executor subagents, их primary skills и routing-паттерны.

## 1) Main process
- **Executor subagent:** `main-process-implementer`
- **Primary skill:** `ai-dock-main-process-executor`
- **Owned paths:** `src/main/**`
- **Typical tasks:** lifecycle, IPC registration, BrowserView/WebContents, main services.
- **Handoff partners:** `preload-ipc-implementer`, `test-qa-implementer`, `security-hardening-implementer`.
- **Review focus:** path discipline, security flags, external links, cleanup.

## 2) Preload / IPC / Shared contracts
- **Executor subagent:** `preload-ipc-implementer`
- **Primary skill:** `ai-dock-preload-ipc-executor`
- **Owned paths:** `src/preload/**`, `src/shared/ipc/**`, `src/shared/types/**`
- **Typical tasks:** bridge APIs, validation, event naming, unsubscribe cleanup.
- **Handoff partners:** `main-process-implementer`, `renderer-ui-implementer`, `security-hardening-implementer`.
- **Review focus:** contract consistency, no Node primitives in renderer, IPC docs sync.

## 3) Renderer UI
- **Executor subagent:** `renderer-ui-implementer`
- **Primary skill:** `ai-dock-renderer-react-executor`
- **Owned paths:** `src/renderer/react/**`
- **Typical tasks:** views, components, styles, UI interactions.
- **Handoff partners:** `state-store-implementer`, `preload-ipc-implementer`, `test-qa-implementer`.
- **Review focus:** no direct Node access, layout stability, preload-only IPC usage.

## 4) Zustand state
- **Executor subagent:** `state-store-implementer`
- **Primary skill:** `ai-dock-zustand-state-executor`
- **Owned paths:** `src/renderer/react/store/**`, `src/renderer/store/**`
- **Typical tasks:** slice decomposition, selectors, async actions, coupling reduction.
- **Handoff partners:** `renderer-ui-implementer`, `test-qa-implementer`.
- **Review focus:** backward compatibility, no big-bang rewrite, state transition safety.

## 5) Chat / Completions
- **Executor subagent:** `chat-completions-implementer`
- **Primary skill:** `ai-dock-chat-completions-executor`
- **Owned paths:** `src/main/services/chatBridge.*`, `src/main/providers/**`, related IPC/preload/shared by workpack.
- **Typical tasks:** providers, retries/timeouts, streaming, profile validation.
- **Handoff partners:** `preload-ipc-implementer`, `test-qa-implementer`, `security-hardening-implementer`.
- **Review focus:** token safety, abort cleanup, timeout behavior, history impact.

## 6) Web adapters
- **Executor subagent:** `web-adapter-implementer`
- **Primary skill:** `ai-dock-web-adapter-executor`
- **Owned paths:** `src/main/browserViews/**`, registry IPC/services (по workpack).
- **Typical tasks:** isReady/injectPrompt/extractConversation/openInSource, selector fallback.
- **Handoff partners:** `main-process-implementer`, `test-qa-implementer`.
- **Review focus:** volatile DOM resilience, graceful fallback, registry discipline.

## 7) History / Exporter
- **Executor subagent:** `history-exporter-implementer`
- **Primary skill:** `ai-dock-history-exporter-executor`
- **Owned paths:** history/exporter services и IPC (по workpack).
- **Typical tasks:** ingestion, normalization, markdown export, metadata flow.
- **Handoff partners:** `test-qa-implementer`, `security-hardening-implementer`.
- **Review focus:** deterministic export, PII control, migration/rollback notes.

## 8) n8n integration
- **Executor subagent:** `n8n-integration-implementer`
- **Primary skill:** `ai-dock-n8n-integration-executor`
- **Owned paths:** integration docs и runtime allow-list workpack.
- **Typical tasks:** connector contract, request/response schema, error mapping.
- **Handoff partners:** `chat-completions-implementer`, `security-hardening-implementer`, `test-qa-implementer`.
- **Review focus:** no dependency drift, safe credentials handling, user-visible network errors.

## 9) Tests / QA
- **Executor subagent:** `test-qa-implementer`
- **Primary skill:** `ai-dock-test-qa-executor`
- **Owned paths:** `tests/**`, `scripts/smoke/**`, QA docs.
- **Typical tasks:** unit/smoke/integration coverage, regression checklists.
- **Handoff partners:** любой runtime executor.
- **Review focus:** behavior-based naming, no flaky tests, no unauthorized prod changes.

## 10) Release / Build
- **Executor subagent:** `release-build-implementer`
- **Primary skill:** `ai-dock-release-build-executor`
- **Owned paths:** `package.json`, `scripts/**`, `electron-builder.yml`, release docs.
- **Typical tasks:** build scripts, packaging workflow, release smoke checklists.
- **Handoff partners:** `test-qa-implementer`, `security-hardening-implementer`.
- **Review focus:** no signing/secrets edits, cross-platform commands, rollback.

## 11) Security hardening
- **Executor subagent:** `security-hardening-implementer`
- **Primary skill:** `ai-dock-security-hardening-executor`
- **Owned paths:** security-relevant allow-list из workpack + governance docs.
- **Typical tasks:** IPC validation hardening, isolation checks, CSP/link safety.
- **Handoff partners:** любой runtime executor + review roles.
- **Review focus:** minimal testable changes, no relaxed security flags, explicit residual risks.


## Development workpack references
- Dev template: `docs/planning/workpacks/_dev-template/workpack.md`
- Dev template prompts: `docs/planning/workpacks/_dev-template/prompt-plan.md`, `prompt-apply.md`, `prompt-review.md`, `prompt-fixpack.md`
- Pilot: `docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/workpack.md`
- Pilot prompts: `prompt-plan.md`, `prompt-apply.md`, `prompt-review.md`, `prompt-fixpack.md`
