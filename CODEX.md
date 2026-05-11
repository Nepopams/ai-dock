# CODEX Operating Guide — VR AI Dock

## Режимы задач
- **PLAN**: анализ репозитория, границ, рисков, подготовка file-level плана без изменений.
- **APPLY**: реализация только в разрешённых путях и строго в рамках утверждённого плана/workpack.
- **REVIEW**: верификация diff, соответствия DoD, проверка рисков и готовности к merge.

## Когда использовать каждый режим
- Используй **PLAN**, если scope не зафиксирован или есть архитектурная неопределённость.
- Используй **APPLY**, только когда scope, пути и критерии успеха утверждены человеком (Human Gate).
- Используй **REVIEW**, когда изменения уже внесены и нужны контроль качества/комплаенс.

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
