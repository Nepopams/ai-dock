# Initiative to Delivery Workflow

## Назначение
Этот workflow описывает верхнеуровневый автономный слой над существующим `codex-plan-apply-review.md`.

Он используется, когда пользователь даёт инициативу, а не готовый workpack. Цель - довести инициативу до delivery report через file-backed планирование, очередь workpack'ов и последовательные inner loops.

Существующий `PLAN -> Human Gate -> APPLY -> REVIEW` остаётся обязательным inner loop для каждого workpack.

## 1) Initiative Intake
- Принять исходный запрос пользователя как инициативу.
- Зафиксировать goal, user value, problem, constraints и ожидаемый результат.
- Создать или выбрать папку `docs/planning/initiatives/<initiative-id>/`.
- Если ID не задан, выбрать стабильный ID в формате `IN-YYYY-NNN-short-slug`.
- Заполнить `initiative.md`.

Codex может продолжать сам, если вход позволяет сформировать цель и ограничения без риска runtime drift.

Codex обязан остановиться, если инициатива требует бизнес-решения, доступа к секретам, изменения лицензий, зависимости или runtime scope без понятного владельца.

## 2) Assumptions
- Сформулировать assumptions явно в `orchestration-plan.md`.
- Разделить assumptions на безопасные и blocking.
- Безопасные assumptions можно принимать автономно.
- Blocking assumptions переводят инициативу в strong human gate.

Примеры безопасных assumptions:
- naming для папок и документов;
- порядок обработки docs-only workpack'ов;
- выбор read-only validation команд.

Примеры blocking assumptions:
- изменение runtime архитектуры;
- изменение security policy;
- миграция данных;
- добавление зависимости.

## 3) Initiative Triage
Классифицировать инициативу:

- `docs-only`
- `workflow/governance`
- `runtime single-layer`
- `runtime multi-layer`
- `security-sensitive`
- `data/migration-sensitive`
- `release/build`
- `mixed`

Результат triage фиксируется в `orchestration-plan.md` и `task-queue.md`.

Codex может продолжать сам для `docs-only` и `workflow/governance`, если нет strong human gate.

Для `runtime*`, `security-sensitive`, `data/migration-sensitive`, `release/build` Codex может готовить артефакты автономно, но runtime APPLY возможен только после валидного workpack, валидного PLAN и отсутствия strong human gate.

## 4) Epic Decomposition
- Разбить инициативу на candidate epics.
- Каждый epic должен иметь user value, scope и risk profile.
- Epic не должен быть giant APPLY. Если epic затрагивает несколько runtime слоёв, он должен быть разложен на workpack'и по слоям.

Результат фиксируется в `initiative.md` и `orchestration-plan.md`.

## 5) Sprint Planning
- Сформировать delivery slices, которые можно выполнять последовательно.
- Для каждого slice определить dependency order.
- Не смешивать unrelated workpack'и в один APPLY.
- Для multi-workpack инициативы сделать workpack queue с явным `Next action`.

Результат фиксируется в `orchestration-plan.md` и `task-queue.md`.

## 6) Workpack Generation
Для каждого элемента queue создать workpack в `docs/planning/workpacks/<workpack-id>/`.

Docs/workflow workpack может использовать `docs/planning/workpacks/_template/workpack.md`.

Runtime workpack должен использовать `docs/planning/workpacks/_dev-template/workpack.md` и обязательно содержать:
- affected modules;
- selected executor;
- primary skill;
- secondary executors, если нужны;
- allowed paths;
- forbidden paths;
- expected file changes;
- acceptance criteria;
- verification commands;
- rollback plan;
- security impact.

Codex может создавать workpack drafts самостоятельно. Runtime APPLY по draft запрещён.

## 7) Task Queue Creation
`task-queue.md` является source-of-truth для порядка исполнения.

Минимальные статусы:
- `Queued`
- `Planning`
- `Plan Ready`
- `Blocked`
- `Applying`
- `Applied`
- `Reviewing`
- `Fixpack`
- `Done`
- `Skipped`

После каждого шага Codex обновляет queue, gate status, PLAN/APPLY/REVIEW status и next action.

## 8) PLAN Loop
Для текущего workpack:

1. Проверить DoR.
2. Сформировать `prompt-plan.md`.
3. Выполнить read-only PLAN.
4. Зафиксировать inspected files, file-level plan, verification plan, risks и blocking questions.
5. Обновить `run-state.md`.

PLAN не меняет runtime или docs, кроме заранее разрешённых initiative/run-state артефактов, если это часть orchestration update.

## 9) Gate Evaluation
Оценить gates после PLAN.

Soft gates можно закрыть автономно и записать в `gates.md`.

Strong human gates требуют остановки:
- scope/paths неясны;
- executor не выбран;
- verification не определена;
- security или data risk вырос;
- требуется новый dependency;
- нужен runtime APPLY без approval;
- требуется изменение forbidden paths;
- giant APPLY не разложен.

Если strong gate pending, `run-state.md` должен содержать blocker и next action для человека.

## 10) APPLY Loop
APPLY выполняется только для одного workpack за раз.

Перед APPLY Codex проверяет:
- workpack валиден;
- PLAN валиден;
- Gate Evaluation не выявил strong gate;
- selected executor указан;
- allowed/forbidden paths ясны;
- verification commands определены;
- no giant APPLY;
- task queue указывает именно этот workpack как current.

APPLY обязан быть минимальным diff внутри allowed paths. Любой выход за scope - stop-the-line.

## 11) QA/Verification
- Выполнить verification commands из workpack.
- Для docs-only workpack'ов запускать targeted docs/workflow validation.
- Для runtime workpack'ов запускать test/build/smoke команды, указанные в workpack, либо фиксировать невозможность.
- Результаты записать в `run-state.md`, `task-queue.md` и `delivery-report.md`.

## 12) REVIEW Loop
REVIEW всегда read-only.

Проверить:
- diff соответствует workpack и PLAN;
- changed files находятся в allowed paths;
- forbidden paths не изменены;
- DoD выполнен;
- docs/index updates выполнены;
- verification достаточна;
- selected executor не вышел за свой слой.

Результат:
- `GO`: workpack Done, перейти к следующему.
- `NO-GO`: создать fixpack или остановиться, если Must Fix меняет scope.

## 13) Fixpack Loop
Fixpack используется только для bounded исправлений после REVIEW NO-GO.

Правила:
- исправлять только Must Fix;
- не расширять scope;
- сохранять тот же executor, если routing не переутверждён;
- не менять allowed paths без strong human gate;
- повторить targeted verification;
- повторить REVIEW.

Если fixpack требует новый scope, новый executor или новые пути, Codex обязан остановиться.

## 14) Delivery Report
После завершения queue или остановки инициативы обновить `delivery-report.md`.

Отчёт содержит:
- summary;
- workpacks completed;
- files changed;
- commands run;
- test results;
- review results;
- risks;
- follow-ups;
- merge recommendation.

Если инициатива остановлена, report должен объяснить, что сделано и какой strong gate ждёт человека.

## 15) Merge Recommendation
Codex не делает merge автоматически, если пользователь явно не попросил и политика репозитория это не разрешает.

Merge recommendation может быть:
- `GO`: все workpack'и Done, verification пройдена, risks закрыты.
- `NO-GO`: есть Must Fix, failed verification или unresolved strong gate.
- `CONDITIONAL GO`: есть residual risks или manual QA pending, но scope завершён.

## Run-State Discipline
`run-state.md` должен обновляться после каждого значимого шага:
- current phase;
- last completed step;
- current workpack;
- blockers;
- strong gates pending;
- commands run;
- review verdicts;
- next action.

Run-state должен быть file-backed. Нельзя держать состояние только в чате.

## Multi-Workpack Initiative Handling
- Выполнять workpack'и по одному, в порядке dependency queue.
- Не начинать следующий APPLY до REVIEW результата текущего workpack, если между ними есть dependency.
- Независимые docs-only workpack'и можно планировать заранее, но APPLY всё равно фиксируется отдельно.
- Runtime multi-layer initiative разбивается по слоям: `shared/preload`, `main`, `renderer`, `store`, `tests/docs` или другой обоснованный порядок.
- Каждый workpack имеет собственные acceptance criteria, verification и rollback.

## No Giant APPLY Rule
Giant APPLY запрещён, если:
- меняются несколько runtime слоёв без отдельной очереди;
- есть security-sensitive или migration-sensitive изменения;
- меняются IPC contracts и consumers одновременно без staged plan;
- нет file-level rollback по каждому слою;
- verification невозможно локализовать.

Codex должен разложить такой scope на workpack queue или остановиться на Human Gate.
