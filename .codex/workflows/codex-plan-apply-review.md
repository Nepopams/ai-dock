# Codex PLAN → APPLY → REVIEW Workflow

## Relationship to Initiative Runner
Этот workflow остаётся базовым inner loop для scoped workpack'ов.

- Для одиночных задач используется ручной workpack-runner flow: `Workpack -> PLAN -> Human Gate -> APPLY -> REVIEW`.
- Для multi-task delivery используется initiative-runner flow из `.codex/workflows/initiative-to-delivery.md`.
- Initiative Runner создаёт инициативу, decomposition, task queue, workpack'и и prompt-pack'и, а затем запускает этот workflow по каждому workpack отдельно.
- Runtime APPLY по-прежнему запрещён без валидного workpack, валидного PLAN, ясных allowed/forbidden paths, selected executor и verification commands.
- Giant APPLY запрещён: multi-layer runtime scope должен быть разбит на последовательные workpack'и.

## 1) Idea
- Зафиксировать идею/проблему и ожидаемый результат.

## 2) Triage
- Определить тип изменения (docs-only / runtime / mixed).
- Оценить риски и security impact.

## 3) Workpack
- Подготовить scoped workpack: цель, границы, пути, критерии, верификация, rollback.
- Для runtime-задач обязательно указать affected modules.

## 4) PLAN
- Использовать шаблон: `.codex/prompts/plan-template.md`.
- При необходимости orchestration: `ai-dock-orchestrator`.
- Провести repo-aware анализ без внесения изменений.

## 5) Human Gate
- Пройти Gate A/B из `.codex/workflows/human-gates.md`.
- Получить подтверждение плана, scope и путей.

## 6) Executor Selection (новая стадия)
### Workpack classification
- Классифицировать задачу: single-layer / multi-layer / docs-only.
- Проверить runtime impact и обязательность QA/review chain.

### Affected module detection
- Зафиксировать затронутые модули (`main`, `preload`, `shared`, `renderer`, `tests`, `scripts/release`).
- Сверить модули с allow-list в workpack.

### Executor selection matrix
- Main process → `main-process-implementer` + `ai-dock-main-process-executor`
- Preload/IPC → `preload-ipc-implementer` + `ai-dock-preload-ipc-executor`
- Shared contracts → `preload-ipc-implementer` + `ai-dock-preload-ipc-executor`
- Renderer UI → `renderer-ui-implementer` + `ai-dock-renderer-react-executor`
- Zustand store → `state-store-implementer` + `ai-dock-zustand-state-executor`
- Chat/Completions → `chat-completions-implementer` + `ai-dock-chat-completions-executor`
- Web Adapters → `web-adapter-implementer` + `ai-dock-web-adapter-executor`
- History/Exporter → `history-exporter-implementer` + `ai-dock-history-exporter-executor`
- n8n → `n8n-integration-implementer` + `ai-dock-n8n-integration-executor`
- Test/QA → `test-qa-implementer` + `ai-dock-test-qa-executor`
- Release/Build → `release-build-implementer` + `ai-dock-release-build-executor`
- Security hardening → `security-hardening-implementer` + `ai-dock-security-hardening-executor`

### Handoff to executor
- Orchestrator передаёт утверждённый workpack, PLAN summary, allowed/forbidden paths, stop-the-line triggers.

## 7) APPLY
- Использовать шаблон: `.codex/prompts/apply-template.md`.
- Executor вносит только минимальный diff в рамках своего слоя.
- Любой выход за scope = stop-the-line и возврат на Human Gate.

## 8) Handoff to QA
- При runtime или contract impact вызывается `test-qa-implementer`.
- QA фиксирует verification commands и результаты.

## 9) Handoff to Review Gate
- Использовать шаблон: `.codex/prompts/review-template.md`.
- REVIEW проверяет соответствие executor выбору и path discipline.
- Для системного ревью подключать `ai-dock-code-reviewer`.

## 10) Fixpack loop
- При NO-GO использовать: `.codex/prompts/fixpack-template.md`.
- Fixpack должен сохранять того же executor или явно фиксировать re-routing.
- После fixpack повторить REVIEW Gate.

## 11) Merge
- Пройти Gate C/D и подтвердить DoD.
- Merge только после GO.
