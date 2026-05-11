# Codex PLAN → APPLY → REVIEW Workflow

## 1) Idea
- Зафиксировать идею/проблему и ожидаемый результат.

## 2) Triage
- Определить тип изменения (docs-only / runtime / mixed).
- Оценить риски и security impact.

## 3) Workpack
- Подготовить scoped workpack: цель, границы, пути, критерии, верификация, rollback.

## 4) PLAN
- Использовать шаблон: `.codex/prompts/plan-template.md`.
- При необходимости orchestration: `ai-dock-orchestrator`.
- Провести repo-aware анализ без внесения изменений.

## 5) Human Gate
- Пройти Gate A/B из `.codex/workflows/human-gates.md`.
- Получить подтверждение плана, scope и путей.

## 6) APPLY
- Использовать шаблон: `.codex/prompts/apply-template.md`.
- Подключать профильные skills по типу задачи:
  - product: `ai-dock-product-planner`
  - architecture: `ai-dock-electron-architect`
  - ui/state: `ai-dock-react-engineer`
  - ipc/security: `ai-dock-ipc-security-reviewer`
  - chat/completions: `ai-dock-chat-completions-engineer`
  - adapters: `ai-dock-web-adapter-engineer`

## 7) Verification
- Выполнить безопасные проверки по workpack.
- Для docs-only: проверки читаемости, ссылок, scope/path discipline.
- Для runtime: targeted tests/smokes без лишнего расширения scope.

## 8) REVIEW
- Использовать шаблон: `.codex/prompts/review-template.md`.
- При NO-GO использовать: `.codex/prompts/fixpack-template.md`.
- Для системного ревью подключать `ai-dock-code-reviewer`.

## 9) Merge
- Пройти Gate C/D и подтвердить DoD.
- Merge только после GO.
