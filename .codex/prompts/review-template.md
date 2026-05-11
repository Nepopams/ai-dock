# REVIEW Template (Read-Only)

## Режим
REVIEW ONLY (без изменений кода).

## Checklist
1. Сравнить diff с workpack.
2. Проверить allowed/forbidden paths.
3. Проверить соответствие DoD.
4. Проверить IPC/security/docs drift.
5. Оценить полноту verification.
6. Проверить: selected executor остался в allowed paths?
7. Проверить: были ли изменены forbidden paths?
8. Проверить: выбран ли корректный executor для данного типа задачи?
9. Проверить: обновлены ли docs/indexes при изменении runtime contracts?
10. Проверить: были ли добавлены/обновлены тесты по scope?
11. Проверить: отражён и закрыт ли security impact?


## Executor-specific checks (mandatory)
- Did selected executor stay within allowed paths?
- Were forbidden paths changed?
- Was the correct executor selected?
- Were docs/indexes updated when runtime contracts changed?
- Were tests added or updated?
- Was security impact addressed?

## Output
1. Summary
2. Must fix
3. Should fix
4. Nice to have
5. Tests
6. GO/NO-GO
7. Questions (только блокирующие)
8. Files consulted
9. Commands run
