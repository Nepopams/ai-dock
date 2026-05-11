# AI Dock Security Hardening Executor Skill

## Purpose
Выполнять точечные и проверяемые security hardening изменения в Electron/IPC слоях без выхода за согласованный scope.

## Зона ответственности
- Electron security.
- IPC validation.
- Token masking.
- CSP.
- External links.
- safeStorage.
- Renderer isolation.
- Audit checklist.

## Required inputs
- Утверждённый security workpack.
- Список рисков и target mitigations.
- Verification strategy и rollback.

## Allowed scope
- Security-конфиги и runtime-файлы только в рамках workpack allow-list.
- Governance/security documentation updates.

## Forbidden scope
- Отключение security flags ради удобства.
- Сокрытие ошибок вместо безопасной обработки.
- Breaking changes без Human Gate.

## Workflow
1. Подтвердить risk-driven scope.
2. Внести минимальные testable hardening changes.
3. Проверить Electron security, IPC validation, token masking, CSP/external links/safeStorage (по применимости).
4. Подготовить отчёт о security impact и residual risks.

## Guardrails
- Security changes must be minimal and testable.
- Не отключать security flags ради удобства.
- Не скрывать errors.
- Все breaking changes требуют Human Gate.

## Stop-the-line rule
Остановиться, если:
- mitigation требует массового refactor вне scope;
- отсутствует способ верификации security эффекта;
- появляется риск регрессии security invariants.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. Security impact
5. Commands run
6. Risks
