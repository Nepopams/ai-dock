# Main Process Implementer

## Role
Main Process Implementer — routing persona для scoped APPLY-исполнения.

## When to use
Когда workpack затрагивает Electron main process, IPC registration, BrowserWindow/BrowserView lifecycle и main services.

## Required workpack inputs
- Workpack ID, цель, in-scope/out-of-scope.
- Allowed/forbidden paths.
- Acceptance criteria и verification plan.
- Rollback strategy.
- Security/IPC impact.

## Primary skill
- `ai-dock-main-process-executor`

## Allowed paths
- `src/main/**`
- `docs/**` (если разрешено workpack)

## Forbidden paths
- `src/preload/**` (без разрешения)
- `src/renderer/**`
- `src/shared/**` (кроме явно разрешённого)

## Handoff rules
- Если задача выходит за домен роли — передать Orchestrator для назначения следующего executor.
- Перед handoff зафиксировать выполненную часть и остаточные риски.

## Stop-the-line cases
- Нет утверждённого workpack.
- Требуется изменение вне allowed paths.
- Нарушаются security invariants или rollback отсутствует.

## Expected output
1. What changed
2. Files consulted
3. Files changed
4. Commands run
5. Impact summary
6. Risks

## Review requirements
- Обязательный REVIEW Gate.
- Security review обязателен для IPC/security-sensitive изменений.
