---
name: ai-dock-initiative-runner
description: "Use for running AI Dock initiatives from intake through workpacks, file-backed run state, verification, and delivery reports."
---

# AI Dock Initiative Runner Skill

## Purpose
Вести инициативу от пользовательской формулировки до delivery report поверх существующего workpack workflow.

Initiative Runner не заменяет `ai-dock-orchestrator` и не отменяет `PLAN -> Human Gate -> APPLY -> REVIEW`. Он добавляет верхний автономный слой:

`initiative -> epics -> sprint -> workpacks -> prompt-packs -> PLAN -> APPLY -> REVIEW -> fixpack -> delivery report`.

Skill может создавать документы, workpack'и, prompt-pack'и и run-state артефакты. Runtime APPLY разрешён только при соблюдении всех preconditions из этого skill, `AGENTS.md`, `CODEX.md`, `.codex/workflows/initiative-to-delivery.md` и текущего workpack.

## Required inputs
- Текст инициативы: цель, проблема, ожидаемый результат.
- Ограничения пользователя: сроки, запреты, приоритеты, допустимые зоны изменений.
- Уровень автономности, если пользователь его явно задал.
- Известные links: текущие workpack'и, issues, архитектурные документы, sprint/epic контекст.
- Human approval context: какие решения уже утверждены человеком.

Если вход неполный, Initiative Runner делает разумные assumptions и фиксирует их в `orchestration-plan.md`, кроме случаев strong human gate.

## Workflow
1. Прочитать обязательные источники:
   - `AGENTS.md`
   - `CODEX.md`
   - `.codex/workflows/initiative-to-delivery.md`
   - `.codex/workflows/codex-plan-apply-review.md`
   - `.codex/workflows/human-gates.md`
   - `.codex/workflows/executor-routing.md`
   - `docs/_governance/dor.md`
   - `docs/_governance/dod.md`
   - `docs/_indexes/executor-index.md`
2. Создать или обновить initiative folder в `docs/planning/initiatives/<initiative-id>/`.
3. Заполнить file-backed run-state:
   - `initiative.md`
   - `orchestration-plan.md`
   - `task-queue.md`
   - `run-state.md`
   - `gates.md`
   - `delivery-report.md`
4. Классифицировать инициативу:
   - docs-only,
   - workflow/governance,
   - runtime single-layer,
   - runtime multi-layer,
   - security-sensitive,
   - data/migration-sensitive,
   - dependency/build/release.
5. Разложить инициативу на epics, sprint slices и workpack queue.
6. Для каждого workpack создать scoped `workpack.md` и prompt-pack:
   - `prompt-plan.md`
   - `prompt-apply.md`
   - `prompt-review.md`
   - `prompt-fixpack.md`, если нужен NO-GO loop.
7. Запустить inner loop по очереди:
   - PLAN,
   - Gate Evaluation,
   - APPLY,
   - QA/Verification,
   - REVIEW,
   - Fixpack Loop при NO-GO.
8. После каждого значимого шага обновить `task-queue.md`, `run-state.md`, `gates.md` и при необходимости `delivery-report.md`.
9. Завершить инициативу delivery report и merge recommendation.

## Autonomy levels
- **L0 - Intake only**: только зафиксировать инициативу и вопросы. Любые планы и workpack'и требуют подтверждения.
- **L1 - Planning autonomy**: можно создавать initiative artifacts, epics, sprint mapping, workpack drafts и prompt-pack drafts без отдельного подтверждения.
- **L2 - Docs/workflow APPLY autonomy**: можно выполнять docs-only и workflow-only APPLY в разрешённых путях, если нет strong human gate.
- **L3 - Scoped runtime APPLY autonomy**: можно выполнять runtime APPLY по одному workpack за раз, только если workpack и PLAN валидны, selected executor указан, allowed/forbidden paths ясны, verification commands определены, strong human gate отсутствует.
- **L4 - Blocked autonomy**: работа остановлена до решения человека. Используется при strong human gate, stop-the-line или невалидном scope.

Если пользователь не задал уровень, по умолчанию используется L2 для docs/workflow задач и L1 для runtime инициатив до явного Plan Gate.

## Soft gates
Soft gate можно пройти автономно, если решение не меняет риск-профиль инициативы и фиксируется в `gates.md`.

- Уточнение названия initiative/workpack.
- Выбор file naming и папки артефактов.
- Разделение крупной задачи на меньшие workpack'и.
- Выбор docs-only verification команд.
- Обновление task queue/run-state после выполненного шага.
- Создание fixpack для уже найденного REVIEW Must Fix, если пути и executor не меняются.

## Strong human gates
Initiative Runner обязан остановиться и запросить решение человека, если:

- Нужно менять runtime-код без утверждённого workpack.
- Workpack неполный: нет affected modules, allowed/forbidden paths, selected executor, acceptance criteria или verification commands.
- PLAN выявил изменение scope, security impact или архитектурный риск выше исходного.
- Требуется новый IPC канал, изменение preload bridge, ослабление sandbox/contextIsolation или доступ к Node из renderer.
- Требуется новая зависимость, изменение `package.json` или lockfile.
- Требуется data migration, изменение формата истории/профилей или rollback неясен.
- Нужен giant APPLY, затрагивающий несколько runtime слоёв без разбиения.
- Executor должен выйти за свой слой или за allowed paths.
- Verification не может быть выполнена безопасно и нет согласованного manual QA substitute.
- Обнаружен риск утечки секретов, токенов, приватных данных или unsafe logging.
- Есть конфликт между AGENTS/CODEX/governance/workpack.

## Artifact map
- `.codex/skills/ai-dock-initiative-runner/SKILL.md` - правила skill.
- `.codex/workflows/initiative-to-delivery.md` - полный workflow.
- `.codex/prompts/initiative-runner-template.md` - стартовый prompt.
- `docs/planning/initiatives/<initiative-id>/initiative.md` - source-of-truth инициативы.
- `docs/planning/initiatives/<initiative-id>/orchestration-plan.md` - decomposition и delivery mode.
- `docs/planning/initiatives/<initiative-id>/task-queue.md` - очередь workpack'ов.
- `docs/planning/initiatives/<initiative-id>/run-state.md` - текущая фаза и состояние.
- `docs/planning/initiatives/<initiative-id>/gates.md` - soft/strong gates и журнал решений.
- `docs/planning/initiatives/<initiative-id>/delivery-report.md` - итоговый отчёт.
- `docs/planning/workpacks/<workpack-id>/workpack.md` - scoped task source-of-truth.
- `docs/planning/workpacks/<workpack-id>/prompt-*.md` - prompt-pack для inner loop.

## Execution loop
Для каждого workpack из queue:

1. Проверить DoR и структуру workpack.
2. Сформировать или обновить `prompt-plan.md`.
3. Выполнить PLAN read-only.
4. Оценить gates:
   - soft gates зафиксировать и продолжить,
   - strong human gates остановить и записать blocker.
5. При валидном Plan Gate сформировать `prompt-apply.md`.
6. Выполнить APPLY только в allowed paths и только выбранным executor.
7. Выполнить verification commands.
8. Сформировать или обновить `prompt-review.md`.
9. Выполнить REVIEW read-only.
10. Если REVIEW = GO, перейти к следующему workpack.
11. Если REVIEW = NO-GO, создать fixpack и выполнить bounded fixpack loop.
12. После каждого шага обновить `task-queue.md`, `run-state.md`, `gates.md`.

## Stop-the-line rules
Остановить инициативу немедленно и записать событие в `run-state.md` и `gates.md`, если:

- Любой planned или фактический diff выходит за allowed paths.
- Изменяются forbidden paths.
- Нужен runtime APPLY без валидного workpack/PLAN.
- Выявлен security invariant risk.
- Добавляется dependency или package metadata drift.
- Workpack queue создаёт giant APPLY вместо независимых scoped workpack'ов.
- Требуется решение владельца продукта, которое нельзя вывести из текущих документов.
- REVIEW выявил Must Fix, который меняет scope или executor routing.

## Output format
В итоговом ответе Initiative Runner обязан указать:

1. Что создано.
2. Что обновлено.
3. Files consulted.
4. Files changed.
5. Commands run.
6. Runtime scope check.
7. Verification.
8. Risks.
9. Follow-ups.
10. Как продолжить инициативу или где смотреть run-state.

## Example prompts
- «Запусти Initiative Runner для инициативы: автоматизировать prompt router delivery pipeline без runtime изменений».
- «Возьми инициативу из `docs/planning/initiatives/IN-2026-001/initiative.md`, разложи на workpack'и и выполни docs-only delivery до отчёта».
- «Создай orchestration-plan и task-queue для улучшения History Hub, но остановись перед runtime APPLY».
- «Продолжи Initiative Runner с текущего `run-state.md` и обработай следующий workpack в queue».
