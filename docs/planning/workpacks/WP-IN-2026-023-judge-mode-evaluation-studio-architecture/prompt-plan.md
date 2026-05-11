# Prompt Plan: WP-IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Mode
PLAN, read-only analysis except initiative/run-state docs allowed by Initiative Runner workflow.

## Task
Analyze current Judge prototype and plan Judge Mode / Evaluation Studio architecture without changing runtime files.

## Required reads
- `AGENTS.md`
- `CODEX.md`
- `.codex/skills/ai-dock-initiative-runner/SKILL.md`
- `.codex/workflows/initiative-to-delivery.md`
- `.codex/workflows/codex-plan-apply-review.md`
- `.codex/workflows/human-gates.md`
- `.codex/workflows/executor-routing.md`
- `docs/_governance/dor.md`
- `docs/_governance/dod.md`
- `docs/_indexes/source-of-truth.md`
- `docs/_indexes/feature-index.md`
- `docs/_indexes/ipc-index.md`
- `docs/_indexes/executor-index.md`
- `docs/architecture/service-catalog.md`
- ADR-002, ADR-003, ADR-004
- Current Judge files listed in the workpack sources of truth
- Relevant provider/export/history/tests context listed in the workpack

## PLAN output
Produce a file-backed plan that identifies:
- current implementation snapshot;
- target capability model;
- evaluation modes;
- API/local/deterministic/hybrid backend strategy;
- preset catalog;
- next-generation contract concept;
- UX model;
- architecture flow;
- risks;
- MVP and phased roadmap;
- bounded implementation workpacks;
- recommended first runtime workpack;
- manual smoke checklist.

## Stop conditions
Stop and request Human decision if the plan requires runtime/source/package/dependency changes during this initiative.

## Verification plan
Plan to run:
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/shared src/preload package.json package-lock.json tsconfig.json vite.config.js scripts`
