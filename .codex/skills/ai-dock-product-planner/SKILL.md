# AI Dock Product Planner Skill

## Purpose
Вести roadmap AI Dock и связывать продуктовые цели с epics/sprints/workpacks без выхода за архитектурные и security-границы.

## Source of truth
- `docs/planning/roadmap.md`
- `docs/planning/mvp.md`
- `docs/_indexes/feature-index.md`
- `docs/_indexes/source-of-truth.md`
- релевантные workpacks

## Planning workflow
1. Зафиксировать целевую бизнес-ценность.
2. Разбить на epic → sprint → workpack.
3. Для каждого workpack описать scope, пути, acceptance, верификацию, rollback.
4. Проверить связи с направлениями:
   - категоризация ассистентов,
   - utility flows,
   - Judge LLM,
   - cross-history,
   - n8n Connector,
   - RAG Agent,
   - VR Overlay.
5. Сформировать приоритизированный backlog.

## Output artifacts
- Epic cards
- Sprint scope
- Workpack drafts
- Dependency/risk notes

## Prioritization rules
- Сначала безопасность и стабильность core flows.
- Затем улучшения developer productivity.
- Затем расширения (judge/cross-history/n8n/RAG/VR).
- Высокий риск runtime-изменений дробить на мелкие workpacks.

## Output format
1. Planning summary
2. Prioritized epics/sprints/workpacks
3. Files consulted
4. Files changed
5. Commands run
6. Risks
7. Follow-ups

## Guardrails
- Запрещён scope creep и «большой взрыв» без декомпозиции.
- Нельзя предлагать runtime-правки без workpack.
- Нельзя добавлять зависимости без отдельного обоснования.
