# Executor Subagents Registry

## Что такое executor subagents
Executor subagents — это project-level routing personas для этапа APPLY. Они не заменяют workpack, а определяют, кто именно должен выполнять scoped-изменение по конкретному слою.

## Чем отличаются от skills
- **Skill**: набор правил, guardrails, workflow и формата отчёта для роли.
- **Subagent definition**: routing-профиль, который говорит Orchestrator, когда вызывать роль, какие входы обязательны и куда передавать результат.

## Как Orchestrator выбирает subagent
1. Классифицирует задачу по затронутому слою (main / preload / renderer / state / chat / adapters / history / n8n / tests / release / security).
2. Проверяет workpack: in-scope/out-of-scope, allowed/forbidden paths, AC, rollback.
3. Назначает primary subagent по доминирующему слою.
4. Если затронуто несколько слоёв — строит последовательный handoff между subagents.

## Как workpack передаётся executor
Минимальный вход:
- Workpack ID и цель.
- Allowed/forbidden paths.
- Acceptance criteria.
- Verification plan.
- Rollback strategy.
- Security/IPC impact.

Без этих входов APPLY не начинается.

## Как executor передаёт результат в Review Gate
Каждый executor обязан вернуть структурированный отчёт:
- What changed
- Files consulted
- Files changed
- Commands run
- Impact (IPC/UI/Security/Data/Build)
- Risks

Далее результат уходит в REVIEW через соответствующие review роли (code-review + security review по необходимости).
