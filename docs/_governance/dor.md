# Definition of Ready (DoR)

Задача считается готовой к APPLY только если выполнены все пункты:

1. Есть чёткая цель и ожидаемый результат.
2. Определён source-of-truth (документы/файлы/контракты).
3. Явно зафиксированы in-scope и out-of-scope.
4. Есть allow-list и forbidden paths.
5. Есть измеримые acceptance criteria.
6. Есть test/smoke plan (или обоснование, почему не запускается).
7. Есть rollback strategy.
8. Оценён security impact:
   - sandbox/contextIsolation;
   - IPC boundary;
   - риск утечки секретов/токенов.

## Дополнительно для runtime tasks
9. Явно перечислены affected modules.
10. Выбран executor subagent.
11. Allowed paths и forbidden paths зафиксированы явно и без двусмысленности.
12. Зафиксирован expected IPC impact (`none` допустимо).
13. Зафиксирован expected state impact (`none` допустимо).
14. Зафиксирован expected tests (unit/smoke/manual QA).
15. Rollback strategy детализирована для runtime-изменений.

Если хотя бы один пункт не выполнен — сначала PLAN и Human Gate.
