# Human Gates — VR AI Dock

## Gate A — Scope Gate
Проверяется:
- цель,
- in/out scope,
- allowed/forbidden paths,
- тип задачи (docs/runtime).

Результат: допускается переход к PLAN.

## Gate B — Plan Gate
Проверяется:
- file-level план,
- acceptance criteria,
- verification/rollback,
- security impact.

Результат: допускается переход к APPLY.

## Gate C — Apply Gate
Проверяется:
- фактический diff соответствует plan/workpack,
- нет несанкционированных изменений в forbidden paths,
- нет добавленных зависимостей вне scope.

Результат: допускается переход к REVIEW.

## Gate D — Review Gate
Проверяется:
- выполнение DoD,
- качество документации/индексов,
- полнота отчёта (consulted/changed/commands/risks/follow-ups),
- готовность к merge.

Результат: merge-ready.
