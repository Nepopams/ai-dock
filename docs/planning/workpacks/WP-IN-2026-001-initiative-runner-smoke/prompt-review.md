# REVIEW Prompt - Initiative Runner Smoke Workpack

## Режим
REVIEW ONLY по смыслу: проверить diff и delivery artifacts. В рамках initiative allowed записать REVIEW verdict в `run-state.md` и `delivery-report.md`.

## Checklist
1. Сравнить diff с workpack.
2. Проверить allowed/forbidden paths.
3. Проверить соответствие DoD.
4. Проверить отсутствие runtime/package/dependency drift.
5. Проверить полноту validation.
6. Проверить, что selected executor `ai-dock-initiative-runner` не выполнял runtime работу.
7. Проверить, что `task-queue.md`, `run-state.md`, `gates.md`, `delivery-report.md` синхронизированы.

## Expected verdict
GO, если:
- validators PASS;
- forbidden paths не изменены;
- no giant APPLY;
- strong gates не сработали;
- delivery report содержит risks/follow-ups/merge recommendation.

## Output
1. Summary.
2. Must fix.
3. Should fix.
4. Nice to have.
5. Tests.
6. GO/NO-GO.
7. Files consulted.
8. Commands run.
