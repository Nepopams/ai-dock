# Prompt Template — APPLY (Implementation)

РЕЖИМ: APPLY.

Предусловия:
- PLAN утверждён (Human Plan Gate пройден).
- Allowed/forbidden paths зафиксированы.

Инструкция для Codex:
1. Выполняй только утверждённый план.
2. Делай минимальный diff, без скрытого расширения scope.
3. При отклонении от плана включай stop-the-line:
   - остановись,
   - зафиксируй отклонение,
   - верни задачу на Human Gate.
4. Выполни только верификационные команды из workpack.
5. В отчёте обязательно укажи:
   - что создано/обновлено,
   - files consulted,
   - files changed,
   - commands run,
   - verification results,
   - risks.
6. Не добавляй зависимости без отдельного согласования.
