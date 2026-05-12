# Judge MVP Release Confidence

Status: GO/NO-GO checklist created by `IN-2026-037` / `WP-JUDGE-008`.

## Release readiness criteria
- Required automated commands pass on the release branch.
- Manual smoke scenarios A-J are PASS or explicitly waived by the Human owner.
- No runtime source, dependency, package, IPC, preload, shared, renderer, export, storage, provider, or build config drift is introduced by `WP-JUDGE-008`.
- No raw response, token, auth header, stack trace, or private debug data is exposed in UI labels, Markdown export, JSON sanitizer paths, or IPC errors.
- Saved EvaluationRun open/delete and export flows are product-smoked before Judge MVP is called release-ready.

## Hard blockers
- App does not start with `npm run dev:app`.
- Duplicate IPC handler errors appear on startup.
- Sidebar Judge route does not open Evaluation Studio.
- Manual start cannot open CompareView with two answers.
- Basic Judge run cannot complete with a configured working profile.
- JSON contract check cannot show validator findings.
- Save/open/delete EvaluationRun flow is broken.
- Export MD/JSON flow is broken or exported Markdown includes `rawResponse`.
- Dynamic non-default criteria are not displayed.
- Cloud/local/generic HTTP backend labels are misleading or expose secrets.
- Chat, Form Profiles, History, Connections, or BrowserView tab basics regress.
- Any forbidden runtime/package/dependency path changes in this QA workpack.

## Soft blockers
- Optional local LLM endpoint is unavailable, while cloud profile smoke passes.
- Visual polish issues that do not block Judge task completion.
- Minor copy issues in QA docs or evidence notes.
- Known model quality variability when provider behavior is otherwise functional.
- Manual smoke scenario blocked by a documented environment limitation and waived by the Human owner.

## Acceptable known risks
- Automated tests do not cover real Electron UI navigation.
- Automated tests do not perform real provider calls.
- Automated tests do not drive OS save/file dialogs.
- Automated tests do not create/switch/close BrowserView tabs.
- Automated tests do not prove local LLM endpoint availability.
- Backend labels are inferred and are not privacy guarantees.

## Required automated commands
- `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-037-judge-tests-smoke-suite`
- `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-008-tests-smoke-suite/workpack.md`
- `node --test tests/judgeQaDocs.test.js`
- `npm test`
- `npm run build`
- `git diff --check`
- `git status --short -- src/main src/preload src/shared src/renderer package.json package-lock.json tsconfig.json vite.config.js scripts electron-builder.yml`

## Required manual smoke scenarios
- A. App startup / navigation.
- B. Manual start.
- C. Basic Judge run.
- D. Custom rubric/instructions.
- E. JSON contract check.
- F. Save/list/open/delete EvaluationRun.
- G. Export.
- H. Dynamic criteria.
- I. Backend labels.
- J. Regression.

## Rollback notes
- `WP-JUDGE-008` is docs/test-only. Rollback is limited to removing the QA docs, docs QA test, planning artifacts, EP-JUDGE updates, architecture note, and index links.
- If manual smoke finds runtime defects, fix them through separate scoped runtime workpacks with explicit PLAN, Human Gate, APPLY, and REVIEW.
- Do not patch runtime behavior inside the QA suite workpack.

## Next workpacks
- Research Comparison Mode.
- n8n EvaluationRun preflight.
- Optional UI polish.

## Merge recommendation policy
- GO: automated commands pass, manual smoke A-J pass, no hard blockers.
- CONDITIONAL GO: automated commands pass and QA suite is complete, but manual smoke has not yet been executed or has waived soft blockers.
- NO-GO: any hard blocker is present, verification fails, forbidden paths changed, or manual smoke finds an unwaived product blocker.
