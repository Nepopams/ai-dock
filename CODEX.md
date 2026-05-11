# CODEX Operating Guide — VR AI Dock

## Режимы задач
- **PLAN**: анализ репозитория, границ, рисков, подготовка file-level плана без изменений.
- **APPLY**: реализация только в разрешённых путях и строго в рамках утверждённого плана/workpack.
- **REVIEW**: верификация diff, соответствия DoD, проверка рисков и готовности к merge.

## Когда использовать каждый режим
- Используй **PLAN**, если scope не зафиксирован или есть архитектурная неопределённость.
- Используй **APPLY**, только когда scope, пути и критерии успеха утверждены человеком (Human Gate).
- Используй **REVIEW**, когда изменения уже внесены и нужны контроль качества/комплаенс.

## Development task lifecycle
1. Workpack created.
2. PLAN generated.
3. Human Gate approves plan.
4. Orchestrator selects executor subagent.
5. Executor receives APPLY prompt.
6. Executor modifies code within allowed paths.
7. Test/QA executor may be invoked.
8. Documentation updater may be invoked.
9. Review Gate checks diff.
10. Fixpack if NO-GO.

## Initiative Runner mode
**Initiative Runner** используется, когда пользователь даёт не готовый workpack, а инициативу: цель, проблему или направление delivery.

Он работает поверх ручного workpack flow и ведёт полный цикл:

`initiative -> epics -> sprint -> workpacks -> prompt-packs -> PLAN -> APPLY -> REVIEW -> fixpack -> delivery-report`.

### Как запустить инициативу
1. Используй prompt `.codex/prompts/initiative-runner-template.md`.
2. Передай initiative input: title, goal, problem, user value, constraints, in/out scope и желаемый autonomy level.
3. Codex создаёт file-backed артефакты в `docs/planning/initiatives/<initiative-id>/`.
4. Для scoped delivery Codex создаёт workpack'и в `docs/planning/workpacks/<workpack-id>/`.

### Отличие от ручного workpack flow
- Ручной workpack flow начинается с уже подготовленного workpack.
- Initiative Runner начинается с инициативы и сам создаёт decomposition, orchestration plan, task queue, workpack'и, prompt-pack'и и delivery report.
- `codex-plan-apply-review.md` остаётся inner loop для каждого workpack.

### Когда Codex может продолжать без подтверждения
- Создание и обновление initiative docs.
- Создание epics/sprint mapping/workpack drafts/prompt-pack drafts.
- Docs-only и workflow-only APPLY в явно разрешённых путях, если нет strong human gate.
- Soft gates: naming, ordering, queue/run-state updates, targeted docs validation.

### Когда Codex обязан остановиться
- Runtime APPLY без валидного workpack и PLAN.
- Неясные allowed/forbidden paths, selected executor или verification commands.
- Новый dependency, изменение `package.json` или lockfile.
- Новый IPC/preload bridge/channel без contract plan.
- Security invariant risk: sandbox/contextIsolation/renderer Node access/secrets.
- Data migration, history/profile format changes или неясный rollback.
- Giant APPLY вместо очереди scoped workpack'ов.

### Где смотреть состояние
- `docs/planning/initiatives/<initiative-id>/run-state.md` — текущая фаза, blockers, commands и next action.
- `docs/planning/initiatives/<initiative-id>/task-queue.md` — очередь workpack'ов и статусы PLAN/APPLY/REVIEW.
- `docs/planning/initiatives/<initiative-id>/gates.md` — soft/strong gates и решения.
- `docs/planning/initiatives/<initiative-id>/delivery-report.md` — итог, verification, risks и merge recommendation.

## Routing examples
- IPC task → `preload-ipc-implementer` + `main-process-implementer`.
- UI task → `renderer-ui-implementer`.
- Store task → `state-store-implementer`.
- Chat provider task → `chat-completions-implementer`.
- Web client task → `web-adapter-implementer`.
- Export/history task → `history-exporter-implementer`.
- n8n task → `n8n-integration-implementer`.
- Build task → `release-build-implementer`.
- Test task → `test-qa-implementer`.
- Security task → `security-hardening-implementer`.

## Как читать workpack
1. Цель и контекст.
2. In-scope / out-of-scope.
3. Allowed / forbidden paths.
4. Acceptance criteria.
5. Verification и rollback.

Если любого пункта нет — задача не готова к APPLY.

## Соблюдение allowed/forbidden paths
- Изменяй только файлы из явного allow-list.
- Любое отклонение от allow-list требует остановки и возврата на Human Gate.
- Запрещённые пути не трогать даже для «маленьких правок».

## Действия при отклонении от плана
- Немедленно зафиксировать отклонение в отчёте.
- Остановить внесение дополнительных изменений.
- Вернуться в PLAN и запросить обновлённый workpack/подтверждение.

## Stop-the-line rule
Остановить задачу немедленно, если:
- обнаружена потенциальная утечка секретов;
- требуется правка runtime вне разрешённого scope;
- нарушаются security invariants (sandbox/contextIsolation/bridge discipline);
- нельзя верифицировать результат безопасными проверками.

## Итоговый отчёт
Минимальные секции:
- Что создано/обновлено
- Files consulted
- Files changed
- Commands run
- Что не трогалось
- Risks
- Follow-ups

## Windows/npm/PowerShell практики
- Не предлагать PowerShell-only шаги как единственный вариант.
- Предпочитать кроссплатформенные команды (`npm`, `node`, нейтральные shell-паттерны).
- Если ОС-специфика неизбежна — давать альтернативы и явно помечать ограничения.

## Анти-галлюцинация по зависимостям
- Перед любым утверждением о пакетах сверять `package.json` и lockfile.
- Не придумывать пакеты/скрипты, которых нет в репозитории.
- Новые зависимости — только с обоснованием, review и отдельным workpack.

## Workpack quick start
- Создай новый workpack из шаблона: `docs/planning/workpacks/_template/workpack.md`.
- Добавь prompt-pack рядом с workpack: `prompt-plan.md`, `prompt-apply.md`, `prompt-review.md`.
- Для проверки структуры запусти:
  - `node scripts/workflow/validate-workpack.mjs <path-to-workpack.md>`
  - `node scripts/workflow/vibe-status.mjs`
- Запуск режимов:
  - PLAN: через `.codex/prompts/plan-template.md`
  - APPLY: через `.codex/prompts/apply-template.md`
  - REVIEW: через `.codex/prompts/review-template.md`
- Pilot-workpack для ориентира: `docs/planning/workpacks/ST-C0-001-ipc-registration-audit/workpack.md`.


## Runtime-development workpack quick start
- Скопируй шаблон из `docs/planning/workpacks/_dev-template/workpack.md`.
- Заполни: selected executor, primary/secondary executors, affected modules, allowed/forbidden paths, verification commands.
- Добавь prompt-pack: `prompt-plan.md`, `prompt-apply.md`, `prompt-review.md`, `prompt-fixpack.md`.
- Проверь структуру: `npm run workflow:validate-workpack <path>` и `npm run workflow:status`.

## Как выбрать executor
- Используй `docs/_indexes/executor-index.md` и `.codex/workflows/executor-routing.md`.
- Для multi-layer задач назначай primary executor + secondary handoff executors.
- При конфликте allow-list — stop-the-line и возврат к Human Gate.

## Как запускать PLAN/APPLY/REVIEW
- PLAN: read-only анализ и проверка executor selection.
- APPLY: только approved workpack + allow-list discipline + verification.
- REVIEW: diff vs workpack, path discipline, executor correctness, GO/NO-GO.

## Pilot reference
- Для первого runtime-development сценария используй: `docs/planning/workpacks/ST-DEV-001-executor-pilot-ipc-modular-registration/workpack.md`.
