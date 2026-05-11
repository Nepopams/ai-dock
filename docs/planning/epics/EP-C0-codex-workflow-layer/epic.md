# EP-C0 — Codex Workflow Layer

## Зачем нужен Workflow Layer
Workflow Layer нужен, чтобы все изменения в VR AI Dock проходили управляемый цикл:
Idea → Triage → Workpack → PLAN → Human Gate → APPLY → Verification → REVIEW → Merge.
Это снижает риск ad-hoc правок, scope creep и security-дрейфа.

## Что входит
- Governance и source-of-truth контур.
- Шаблоны workpack и prompt-pack.
- Минимальные workflow-скрипты для валидации workpack и статуса.
- Pilot-workpack для безопасного следующего шага.

## Что не входит
- Runtime-рефакторинг main/preload/renderer/shared.
- Изменения IPC реализаций на этом этапе.
- Добавление зависимостей.

## Stories
1. Создать шаблонный слой workpacks и prompt-pack.
2. Создать структуру epic/sprint/workpack для прозрачного планирования.
3. Добавить скрипты проверки качества workpack-артефактов.
4. Подготовить pilot-workpack для IPC registration audit.

## Dependencies
- AGENTS.md / CODEX.md
- DoR/DoD governance
- source-of-truth index
- существующие prompt/workflow документы в `.codex`

## Risks
- Избыточная документация без практического применения.
- Рассинхронизация шаблонов и реального процесса.
- Неполная дисциплина Human Gate.

## Success criteria
- Есть reusable workpack template и prompt templates.
- Есть sprint/epic структура для phase 0.
- Скрипты `vibe-status` и `validate-workpack` работают без зависимостей.
- Есть pilot-workpack, готовый к следующему PLAN.
