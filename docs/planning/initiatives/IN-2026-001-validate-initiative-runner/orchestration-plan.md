# Orchestration Plan

## Initiative summary
Инициатива проверяет новый Initiative Runner pipeline на docs/workflow-only smoke scenario: Codex создаёт инициативу, очередь, один workpack, prompt-pack, проходит inner loop и формирует delivery report.

## Assumptions
- Safe assumption: один workpack достаточен для L2 smoke, потому что scope ограничен docs/workflow артефактами.
- Safe assumption: selected executor для smoke workpack - `ai-dock-initiative-runner`, так как это orchestration-only задача.
- Safe assumption: verification ограничена `validate-initiative`, `validate-workpack`, `git status --short`, `git diff --stat`, `git diff --check`.
- Blocking assumption: отсутствует. Runtime, dependency, package/lockfile и security policy изменения не требуются.

## Selected delivery mode
Docs-only / Workflow-governance, L2 docs/workflow APPLY autonomy.

## Epic breakdown
- Epic ID: `EP-IN-2026-001-A`
  Title: File-backed initiative artifacts.
  Scope: `initiative.md`, `orchestration-plan.md`, `task-queue.md`, `run-state.md`, `gates.md`, `delivery-report.md`.
  Risk profile: низкий, docs-only.
  Success criteria: initiative validation passes.
- Epic ID: `EP-IN-2026-001-B`
  Title: Workpack and prompt-pack smoke.
  Scope: один docs-only workpack и `prompt-plan/apply/review/fixpack`.
  Risk profile: низкий, docs-only.
  Success criteria: workpack validation passes.
- Epic ID: `EP-IN-2026-001-C`
  Title: Delivery report and review verdict.
  Scope: записать результаты verification и REVIEW = GO.
  Risk profile: низкий, docs-only.
  Success criteria: delivery report содержит commands, risks, follow-ups и merge recommendation.

## Sprint mapping
- Sprint / slice: Initiative Runner smoke pilot.
- Workpack candidates: `WP-IN-2026-001-initiative-runner-smoke`.
- Dependencies: все действия sequential; workpack REVIEW завершает инициативу.
- Exit criteria: validators PASS, runtime scope check чистый, delivery report updated.

## Workpack queue
- Workpack ID: `WP-IN-2026-001-initiative-runner-smoke`
- Type: docs-only / workflow-governance.
- Purpose: доказать, что Initiative Runner создаёт и ведёт file-backed delivery loop.
- Dependency: none.
- Expected status: Done.

## Executor routing
- Workpack ID: `WP-IN-2026-001-initiative-runner-smoke`
- Selected executor: `ai-dock-initiative-runner`
- Primary skill: `ai-dock-initiative-runner`
- Secondary executors: none.
- Rationale: задача orchestration-only и не затрагивает runtime слои.

## Gate plan
- Soft gates:
  - выбор ID workpack;
  - выбор порядка queue;
  - фиксация docs-only validation команд;
  - запись REVIEW verdict в delivery report.
- Strong human gates:
  - runtime/package/dependency/security policy/forbidden path scope не возник.
- Gate owner: Codex для soft gates, Human для strong gates.
- Expected decision point: strong gate не требуется при сохранении docs-only scope.

## Verification strategy
- Docs/workflow validation:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-001-validate-initiative-runner`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/workpack.md`
- Runtime tests: не применимо, runtime не менялся.
- Smoke/manual QA: проверить `git status --short`, `git diff --stat`, `git diff --check`.
- Commands: см. `run-state.md` и `delivery-report.md`.

## Risk register
- Risk: L2 smoke не доказывает L3 runtime APPLY.
  Impact: средний для будущего runtime autonomy.
  Mitigation: следующий pilot должен быть отдельной инициативой с explicit runtime workpack и human gate.
  Owner: Human + Codex.
  Status: Accepted residual risk.
- Risk: структурные validators не проверяют качество всех текстовых решений.
  Impact: низкий.
  Mitigation: REVIEW вручную сопоставляет scope, paths, DoR/DoD и delivery report completeness.
  Owner: Codex.
  Status: Mitigated.
