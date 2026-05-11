# Initiative Runner Template

## Режим
AUTONOMOUS INITIATIVE RUNNER.

Веди инициативу от intake до delivery report через file-backed артефакты. Не удаляй существующий workflow. Используй `PLAN -> Human Gate -> APPLY -> REVIEW` как inner loop для каждого workpack.

## Instruction sources to read
Обязательно прочитать перед действиями:

- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/human-gates.md`
- `.codex/workflows/executor-routing.md`
- `.codex/skills/ai-dock-orchestrator/SKILL.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/executor-index.md`
- `docs/_indexes/source-of-truth.md`

Если инициатива затрагивает runtime, также читать релевантные architecture/index/runtime файлы в read-only режиме до PLAN.

## Initiative input block
Заполни перед запуском:

```text
Initiative ID:
Title:
Owner:
Goal:
Problem:
User value:
Constraints:
In scope:
Out of scope:
Known links:
Autonomy level:
Strong gate preferences:
Deadline or sprint:
```

Если поле пустое, зафиксируй assumption. Не выдумывай business approval, secrets, dependency approval или runtime approval.

## Autonomy policy
- Можно автономно создавать docs, initiative artifacts, workpack drafts и prompt-packs.
- Можно автономно выполнять docs-only/workflow-only APPLY в разрешённых путях, если нет strong human gate.
- Runtime APPLY разрешён только если:
  - workpack валиден;
  - PLAN валиден;
  - нет strong human gate;
  - allowed/forbidden paths ясны;
  - selected executor указан;
  - verification commands определены;
  - workpack не является giant APPLY.
- Если пользователь не указал уровень автономности, используй L2 для docs/workflow инициатив и L1 для runtime инициатив до Plan Gate.

## Strong gate policy
Остановись и запроси решение человека, если:

- Требуется runtime-код без approved workpack.
- Нужны изменения в `src/main/**`, `src/preload/**`, `src/renderer/**`, `src/shared/**`, но workpack/PLAN невалидны.
- Нужно изменить `package.json`, lockfile или добавить dependency.
- Нужен новый IPC/preload bridge/channel без явного contract plan.
- Есть риск нарушения sandbox/contextIsolation или прямого Node-доступа в renderer.
- Нужно менять data format, history indexes, profiles или migration/rollback.
- Needed paths выходят за allowed paths.
- Forbidden paths должны быть изменены.
- REVIEW Must Fix меняет scope.
- Verification не определена или небезопасна.

## Artifact creation requirements
Создать или обновить:

- `docs/planning/initiatives/<initiative-id>/initiative.md`
- `docs/planning/initiatives/<initiative-id>/orchestration-plan.md`
- `docs/planning/initiatives/<initiative-id>/task-queue.md`
- `docs/planning/initiatives/<initiative-id>/run-state.md`
- `docs/planning/initiatives/<initiative-id>/gates.md`
- `docs/planning/initiatives/<initiative-id>/delivery-report.md`

Для каждого workpack:

- `docs/planning/workpacks/<workpack-id>/workpack.md`
- `docs/planning/workpacks/<workpack-id>/prompt-plan.md`
- `docs/planning/workpacks/<workpack-id>/prompt-apply.md`
- `docs/planning/workpacks/<workpack-id>/prompt-review.md`
- `docs/planning/workpacks/<workpack-id>/prompt-fixpack.md`, если нужен fixpack loop.

## Workpack generation rules
- Один workpack - один bounded scope.
- Для runtime задач использовать `_dev-template`.
- Для docs/workflow задач использовать `_template`.
- Всегда фиксировать sources of truth, in/out scope, allowed/forbidden paths, acceptance criteria, verification, rollback и risks.
- Runtime workpack обязан иметь affected modules, selected executor, primary skill и expected file changes.
- Multi-layer runtime scope разбивать на последовательные workpack'и.
- Giant APPLY запрещён.

## Execution queue rules
- `task-queue.md` управляет порядком исполнения.
- Не выполнять APPLY workpack'а, если он не current или blocked.
- После каждого шага обновлять queue status, gate status, PLAN/APPLY/REVIEW status и next action.
- Dependency workpack должен пройти REVIEW before dependent APPLY.
- Независимые docs-only workpack'и можно готовить заранее, но отчётность вести отдельно.

## PLAN/APPLY/REVIEW loop rules
Для каждого workpack:

1. PLAN read-only.
2. Gate Evaluation.
3. APPLY только при валидных preconditions.
4. Verification commands.
5. REVIEW read-only.
6. Fixpack loop при NO-GO.
7. Обновление run-state и delivery report.

Остановиться при strong human gate или stop-the-line.

## Final report format
Ответить на русском:

1. Что создано.
2. Что обновлено.
3. Files consulted.
4. Files changed.
5. Commands run.
6. Runtime scope check.
7. Verification.
8. Risks.
9. Как продолжить initiative-runner.
10. Recommended next action.
