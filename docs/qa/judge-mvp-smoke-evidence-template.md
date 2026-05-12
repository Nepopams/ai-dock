# Judge MVP Smoke Evidence Template

Use one copy or linked record per Human QA run.

## Run metadata
| Field | Value |
| --- | --- |
| Date/time |  |
| Branch |  |
| Commit |  |
| OS |  |
| Node version |  |
| npm version |  |
| Electron/dev command | `npm run dev:app` |
| Test profile used |  |
| Cloud backend used |  |
| Local backend used |  |
| QA owner |  |

## Automated baseline
| Command | PASS/FAIL/BLOCKED | Notes |
| --- | --- | --- |
| `node scripts/workflow/validate-initiative.mjs docs/planning/initiatives/IN-2026-037-judge-tests-smoke-suite` |  |  |
| `node scripts/workflow/validate-workpack.mjs docs/planning/workpacks/WP-JUDGE-008-tests-smoke-suite/workpack.md` |  |  |
| `node --test tests/judgeQaDocs.test.js` |  |  |
| `npm test` |  |  |
| `npm run build` |  |  |
| `git diff --check` |  |  |

## Smoke scenarios
| Scenario | PASS/FAIL/BLOCKED | Evidence | Notes |
| --- | --- | --- | --- |
| A. App startup / navigation |  |  |  |
| B. Manual start |  |  |  |
| C. Basic Judge run |  |  |  |
| D. Custom rubric/instructions |  |  |  |
| E. JSON contract check |  |  |  |
| F. Save/list/open/delete EvaluationRun |  |  |  |
| G. Export |  |  |  |
| H. Dynamic criteria |  |  |  |
| I. Backend labels |  |  |  |
| J. Regression |  |  |  |

## Screenshots/files generated
| Artifact | Path or note |
| --- | --- |
| Screenshot: Evaluation Studio open |  |
| Screenshot: Judge result |  |
| Screenshot: JSON validator findings |  |
| Screenshot: saved EvaluationRun list |  |
| Exported Markdown |  |
| Exported JSON |  |
| Log excerpt, if relevant |  |

## Defects found
| ID | Severity | Scenario | Description | Owner | Status |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## GO/NO-GO verdict
| Field | Value |
| --- | --- |
| Verdict | GO / CONDITIONAL GO / NO-GO |
| Hard blockers present | Yes / No |
| Soft blockers present | Yes / No |
| Waivers |  |
| Required follow-ups |  |
| Sign-off |  |
