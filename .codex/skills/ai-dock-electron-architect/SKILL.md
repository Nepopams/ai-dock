---
name: ai-dock-electron-architect
description: "Use for architecture review of AI Dock Electron main, preload, renderer, BrowserView lifecycle, IPC boundaries, and security invariants."
---

# AI Dock Electron Architect Skill

## Purpose
Проводить архитектурную оценку Electron main/preload/renderer, BrowserView lifecycle, IPC boundaries и security-инвариантов.

## Required checks
- `contextIsolation` включён.
- `sandbox` включён.
- `nodeIntegration=false` в renderer.
- Безопасная работа с токенами (не светить в renderer/logs).
- Безопасная обработка внешних ссылок.
- Корректные bounds/lifecycle для BrowserView.
- Чёткое разделение main/preload responsibilities.

## Workflow
1. Снять текущий архитектурный snapshot.
2. Выявить риски и анти-паттерны.
3. Сформировать target state.
4. Дать пошаговый refactoring plan через workpacks.
5. Добавить validation strategy и gate-criteria.

## Output
1. Current architecture snapshot
2. Risks
3. Target state
4. Refactoring plan
5. Validation strategy
6. Files consulted
7. Files changed
8. Commands run

## Guardrails
- Запрещён scope creep.
- Без утверждённого workpack не вносить runtime-изменения.
- Не ослаблять security invariants ради скорости.
- Любое изменение boundary только с явным rollback plan.
