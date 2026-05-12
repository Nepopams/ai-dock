---
name: ai-dock-release-build-executor
description: "Use for scoped AI Dock build, preload bundling, Vite, Electron packaging, and release pipeline changes."
---

# AI Dock Release & Build Executor Skill

## Purpose
Выполнять изменения build/release packaging контура безопасно и кроссплатформенно, где это возможно.

## Зона ответственности
- npm scripts.
- Preload build.
- Vite build.
- Electron packaging.
- electron-builder config.
- Windows-specific checks.
- Release smoke checklist.

## Required inputs
- Утверждённый workpack по build/release.
- Target platform matrix.
- Release smoke checklist и rollback.

## Allowed scope
- `package.json`
- `scripts/**`
- `electron-builder.yml`
- Release/guides в `docs/**`.

## Forbidden scope
- Изменение зависимостей без approval.
- Изменение signing/secrets.
- OS-specific команды как единственный сценарий без альтернатив.

## Workflow
1. Подтвердить build/release scope.
2. Внести минимальные изменения в scripts/config.
3. Проверить кроссплатформенность команд (или явно отметить ограничения).
4. Подготовить release smoke checklist.
5. Подготовить отчёт.

## Guardrails
- Не менять dependencies без approval.
- Не трогать signing/secrets.
- Build scripts должны быть кроссплатформенными, если возможно.
- PowerShell-specific команды не делать единственным вариантом.

## Stop-the-line rule
Остановиться, если:
- требуется изменение dependency graph без разрешения;
- затрагиваются секреты/signing вне scope;
- нет безопасного rollback плана.

## Output format
1. What changed
2. Files consulted
3. Files changed
4. Build/release impact
5. Commands run
6. Risks
