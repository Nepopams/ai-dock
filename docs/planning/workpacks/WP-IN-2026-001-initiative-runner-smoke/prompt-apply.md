# APPLY Prompt - Initiative Runner Smoke Workpack

## Preconditions
- Workpack создан и проходит DoR по docs-only scope.
- PLAN не выявил strong human gate.
- Allowed/forbidden paths зафиксированы.
- Selected executor: `ai-dock-initiative-runner`.

## Executor-aware context
- Selected executor: `ai-dock-initiative-runner`
- Primary skill: `ai-dock-initiative-runner`
- Allowed paths:
  - `docs/planning/initiatives/IN-2026-001-validate-initiative-runner/**`
  - `docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/**`
- Forbidden paths:
  - `src/main/**`
  - `src/preload/**`
  - `src/renderer/**`
  - `src/shared/**`
  - `package.json`
  - `package-lock.json`
  - `node_modules/**`
  - `dist/**`
  - `build/**`
  - `release/**`
- Approved PLAN summary: создать initiative artifacts, workpack, prompt-pack, run-state, gates, delivery-report, затем выполнить validation.
- Stop-the-line triggers: runtime/dependency/package/security policy/forbidden path changes.
- Verification commands:
  - `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-001-validate-initiative-runner`
  - `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-001-initiative-runner-smoke/workpack.md`
  - `git status --short`
  - `git diff --stat`
  - `git diff --check`
- Required docs/index updates: initiative/workpack artifacts only.
- Review Gate checklist: DoD, path discipline, no runtime/package/dependency drift, validators PASS.

## Execution rules
- Вносить только docs/workflow artifacts из allowed paths.
- Не менять runtime, package files или dependencies.
- Обновлять run-state/task-queue/gates/delivery-report после этапов.

## Verification
Выполнить команды из workpack и записать результаты в `run-state.md` и `delivery-report.md`.

## Report
Итоговый APPLY report должен содержать files consulted, files changed, commands run, verification results и risks.
