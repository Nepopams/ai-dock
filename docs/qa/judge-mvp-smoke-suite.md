# Judge MVP Smoke Suite

Status: Human QA checklist created by `IN-2026-037` / `WP-JUDGE-008`.

## Preconditions
- Branch under test is recorded in `docs/qa/judge-mvp-smoke-evidence-template.md`.
- `npm test` and `npm run build` have passed for the branch.
- At least one working Judge-capable completions profile exists.
- Optional local LLM endpoint is running if local backend smoke is included.
- No new Playwright, Cypress, Spectron, or browser automation dependency is required for this suite.

## A. App startup / navigation
1. Run `npm run dev:app`.
2. Confirm app starts without duplicate IPC handler errors in the terminal.
3. Open the Sidebar.
4. Select Judge and confirm Evaluation Studio opens.
5. Open Chat.
6. Open Form Profiles.
7. Open History.
8. Open Connections.
9. Record PASS/FAIL/BLOCKED and screenshots if any route fails.

## B. Manual start
1. Open Judge / Evaluation Studio.
2. Enter a question.
3. Enter Answer A.
4. Enter Answer B.
5. Start comparison.
6. Confirm `CompareView` opens with both answers visible.
7. Confirm the question text is preserved.

## C. Basic Judge run
1. Choose a Judge profile.
2. Run Judge.
3. Confirm progress is visible while the run is active.
4. Confirm scores are visible after completion.
5. Confirm verdict is visible.
6. Confirm summary is visible.
7. Confirm failures show a bounded error without stack traces or secrets.

## D. Custom rubric/instructions
1. Add a custom rubric.
2. Add custom judge instructions.
3. Run Judge.
4. Confirm the result appears.
5. Confirm the custom rubric/instructions controls do not expose tokens or hidden debug data.

## E. JSON contract check
1. Enable JSON contract check.
2. Run a valid JSON case and confirm PASS findings.
3. Run an invalid JSON case and confirm FAIL findings.
4. Run a missing required key case and confirm FAIL findings.
5. Run a fenced JSON case and confirm parsing/finding behavior matches expectations.
6. Confirm validator findings are visible without requiring export.

## F. Save/list/open/delete EvaluationRun
1. Complete a Judge result.
2. Save evaluation.
3. Confirm the saved evaluation list refreshes.
4. Open the saved run.
5. Confirm the result appears without re-running Judge.
6. Delete the saved run.
7. Confirm the list updates.
8. Confirm delete/open errors are bounded if a missing run is selected.

## G. Export
1. Export Markdown.
2. Export JSON.
3. Open the JSON file and confirm it includes `evaluationRun`.
4. Open the Markdown file and confirm validator findings appear when present.
5. Confirm Markdown does not include `rawResponse`.
6. Confirm exported files do not expose tokens, auth headers, or hidden debug stacks.

## H. Dynamic criteria
1. Open a saved/custom run with non-default criteria such as `clarity`, `depth`, `evidence`, `json_validity`, `prompt_adherence`, or `security`.
2. Confirm all criteria rows appear in the score table.
3. Confirm legacy default criteria still appear in `coherence`, `factuality`, `helpfulness` order when present.
4. Confirm empty/no-score results show `No score criteria returned.` when applicable.

## I. Backend labels
1. Select a cloud/API profile and confirm the profile label reads as cloud/API.
2. Select a localhost or loopback profile and confirm it reads as local.
3. Select a generic HTTP profile and confirm it reads as Generic HTTP with the inferred endpoint type.
4. Confirm privacy hints remain conservative and do not guarantee locality.
5. Confirm tokens/auth material are not shown in labels.

## J. Regression
1. Open Chat.
2. Open Form Profiles.
3. Open History.
4. Open Connections.
5. Create a BrowserView tab.
6. Switch BrowserView tabs.
7. Close a BrowserView tab.
8. Confirm no route crashes, blank screens, or duplicate IPC handler errors appear.

## Evidence
Use `docs/qa/judge-mvp-smoke-evidence-template.md` for the smoke run record.
