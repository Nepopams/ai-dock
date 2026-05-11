# React Renderer Smoke Report

## Summary
Human-provided manual smoke evidence closes the pending React renderer default smoke from IN-2026-009.

Verdict: GO for React renderer default confidence.

React remains the default development/runtime UI according to ADR-003. Legacy remains an explicit fallback until a separate gated retirement decision.

## Scope
This report records manual UI smoke evidence only.

In scope:
- React default dev launch.
- Local React views.
- BrowserView tab basics.
- Prompt Router and Prompt Drawer.
- Production-style React dist launch.
- Console fatal/blocking error status.

Out of scope:
- Runtime code changes.
- Package or build script changes.
- Legacy archive, move, or deletion.
- ADR-003 changes.
- New automated tests.

## Environment assumptions
- Evidence was provided by the human operator after UI smoke testing.
- The tested baseline is after IN-2026-009 React Renderer Default Switch and IN-2026-010 Form Profiles crash fix.
- ADR-003 is Accepted and treats React renderer as the default UI.
- IN-2026-011 retirement planning remains docs-only; legacy deletion is still forbidden.

## Commands manually tested
| Command | Result | Notes |
| --- | --- | --- |
| `npm run dev:app` | PASS | React UI loaded in dev app path. |
| `npm start` | PASS | React dist loaded in production-style start path. |
| `npm run start:legacy` | PASS / NOT TESTED | Human input was ambiguous. Treat as non-blocking for React default confidence and keep as remaining fallback check if not actually exercised. |

## Local views result table
| View | Result |
| --- | --- |
| Chat | PASS |
| Completions / Connections | PASS |
| Form Profiles | PASS |
| Form Run | PASS |
| Prompts / Templates | PASS |
| History | PASS |
| Presets | PASS |
| Compare | PASS |

## BrowserView tabs result table
| Action | Result |
| --- | --- |
| Create tab | PASS |
| Switch tab | PASS |
| Close tab | PASS |

## Prompt tools result table
| Tool | Result |
| --- | --- |
| Prompt Router | PASS |
| Prompt Drawer | PASS |

## Production-style start result
`npm start`: PASS.

React dist loaded: PASS.

## Legacy fallback result
`npm run start:legacy`: PASS / NOT TESTED as provided by human input.

This is not blocking for React default confidence. If the fallback was not actually exercised, it remains a manual check before any legacy archive, namespace move, or deletion workpack.

## Console errors/warnings
| Category | Result |
| --- | --- |
| Fatal React errors | none |
| Blocking preload errors | none |
| Known warnings | only existing non-blocking warnings if present |

## Blocking defects
None reported in the provided manual smoke evidence.

## Remaining risks
- Legacy fallback status is ambiguous in the provided evidence (`PASS / NOT TESTED`), so fallback smoke should be repeated before any fallback retirement action.
- This report records human-provided manual evidence; it does not add automated UI smoke coverage.
- Existing non-blocking warnings may still exist and should be tracked separately if they become noisy or blocking.

## Merge/release confidence
IN-2026-009 React default smoke confidence: GO.

Legacy retirement readiness: planning only. Legacy deletion remains forbidden until a separate gated workpack.

## Next actions
- Treat React renderer default path as the baseline for renderer planning.
- Keep legacy fallback available until a separate retirement decision.
- Use IN-2026-011 follow-ups for archive, ownership audit, deletion candidate, and script cleanup work.
