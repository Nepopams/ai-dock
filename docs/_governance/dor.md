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

Если хотя бы один пункт не выполнен — сначала PLAN и Human Gate.
