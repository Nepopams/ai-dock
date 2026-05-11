# Prompt Review: WP-IN-2026-023 Judge Mode / Evaluation Studio Architecture

## Mode
REVIEW, read-only.

## Review checks
- Initiative artifacts exist and validate.
- Workpack and prompt-pack exist and validate.
- `docs/architecture/judge-mode-evaluation-studio.md` exists and covers all requested report sections.
- `docs/architecture/decisions/ADR-005-judge-mode-evaluation-architecture.md` exists.
- Source-of-truth and feature index changes are limited to new links/reference.
- No runtime/source/package/build files were changed by this initiative.
- Current Judge snapshot is grounded in audited files.
- API judge, local OpenAI-compatible, generic HTTP, deterministic validators, and hybrid evaluator are covered.
- Presets, custom prompt/rubric, JSON/structured validation, history/export, and n8n future handoff are covered.
- Workpack decomposition is bounded and avoids giant APPLY.
- Recommended first runtime workpack is clear.
- Verification commands pass or failures are recorded with risk.

## Commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-023-judge-mode-evaluation-studio-architecture`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-IN-2026-023-judge-mode-evaluation-studio-architecture/workpack.md`
- `git status --short`
- `git diff --stat`
- `git diff --check`
- `git status --short -- src/main src/renderer src/shared src/preload package.json package-lock.json tsconfig.json vite.config.js scripts`

## REVIEW output
Return GO, CONDITIONAL GO, or NO-GO with:
- files consulted;
- files changed;
- commands run;
- verification results;
- runtime scope check;
- risks;
- follow-ups;
- merge recommendation.
