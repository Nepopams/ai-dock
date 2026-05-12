---
name: ai-dock-orchestrator
description: "Use for classifying AI Dock requests, selecting execution mode, routing executors, and producing orchestration briefs."
---

# AI Dock Orchestrator Skill

## Purpose
Классифицировать входящий запрос и выбрать режим исполнения: **portfolio**, **sprint**, **delivery**, **review**. Skill не пишет runtime-код и формирует единый **Orchestration Brief**.

## Required inputs
- Цель запроса.
- Ограничения и дедлайны.
- Workpack (если есть).
- Allowed/forbidden paths.
- Риск-профиль (security/runtime/docs-only).

## Workflow
1. Прочитать `AGENTS.md`, `CODEX.md`, anchor prompt и релевантный workpack.
2. Классифицировать тип задачи:
   - **portfolio**: roadmap/приоритизация,
   - **sprint**: планирование итерации,
   - **delivery**: реализация scoped изменений,
   - **review**: контроль качества и GO/NO-GO.
3. Зафиксировать in-scope/out-of-scope.
4. Выдать Orchestration Brief с этапами PLAN → Human Gate → APPLY → REVIEW.
5. Указать, какие skills делегируются и зачем.

## Delegation map
- Product planning → `ai-dock-product-planner`
- Архитектура Electron/IPC/security → `ai-dock-electron-architect` / `ai-dock-ipc-security-reviewer`
- UI/store → `ai-dock-react-engineer`
- Chat/Completions/Form Runner → `ai-dock-chat-completions-engineer`
- Web adapters → `ai-dock-web-adapter-engineer`
- Diff review → `ai-dock-code-reviewer`

## Human gates
- Gate A: scope/пути.
- Gate B: план и верификация.
- Gate C: соответствие apply плану.
- Gate D: review и merge-ready.

## Output format
1. Режим задачи (portfolio/sprint/delivery/review)
2. Orchestration Brief
3. Files consulted
4. Files changed (или `none` для read-only)
5. Commands run
6. Risks
7. Follow-ups

## Guardrails
- Запрещён scope creep.
- Запрещены runtime-правки вне workpack и Human Gate.
- Запрещено придумывать несуществующие пакеты/команды/каналы.
- Любое отклонение от плана = stop-the-line.

## Example prompts
- «Классифицируй задачу и подготовь Orchestration Brief для внедрения Judge LLM».
- «Определи delivery-план для безопасного изменения IPC слоя без runtime drift».
