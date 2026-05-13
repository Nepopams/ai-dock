# IN-UI-011A Orchestration Plan

## Initiative summary
Apply the first evidence-backed runtime fixpack from IN-UI-010 by recomposing the Connections screen owner JSX and scoped CSS.

## Classification
- Initiative type: L3 scoped renderer runtime UI APPLY.
- Runtime layer: React renderer views/styles only.
- Selected executor: `ai-dock-renderer-react-executor`.
- Secondary executors: Zustand read-only confirmation, test/QA, and security review for token redaction.

## Assumptions
- Human approval context authorizes WP-UI-011A runtime APPLY.
- Existing completions, registry, and adapter APIs remain unchanged.
- Fresh screenshot capture will be performed after implementation.

## Selected delivery mode
Single bounded runtime workpack: `WP-UI-011A-connections-recomposition-fixpack`.

## Epic breakdown
- Connections profile layout recomposition.
- Connections status and registry preview visual surface.
- UI v2 visual gap tracking.

## Sprint mapping
- Current sprint item: implement WP-UI-011A.
- Follow-up sprint item: capture fresh screenshot and re-assess Connections.
- Next runtime item: WP-UI-011B Shell / PromptRouter Layout Breakthrough.

## Workpack queue
| Order | Workpack | Type | Status |
| --- | --- | --- | --- |
| 1 | `WP-UI-011A-connections-recomposition-fixpack` | L3 renderer UI | Completed |
| 2 | `WP-UI-011B Shell / PromptRouter Layout Breakthrough` | L3 renderer UI | Recommended next |

## Executor routing
- Primary executor: `ai-dock-renderer-react-executor`.
- `ai-dock-zustand-state-executor`: read-only confirmation that no store change is needed.
- `ai-dock-test-qa-executor`: verification and smoke checklist.
- `ai-dock-security-hardening-executor`: token redaction/readability review.

## Gate plan
- No strong gate active.
- Stop if provider schema, token/auth behavior, store shape, IPC, dependency, or broad app restyle becomes required.

## Verification strategy
- Initiative validator.
- Workpack validator.
- `npm test`.
- `npm run build`.
- `git diff --check`.
- Forbidden-path status check.

## Risk register
| Risk | Mitigation |
| --- | --- |
| Token value exposure | Render only token status labels, never `tokenRef` or token input content outside password field. |
| Behavior drift | Reuse existing handlers for save, set active, test, clear token, registry data, and adapter tabs. |
| Visual acceptance still blocked by shell | Mark Connections as pending re-screenshot, not unconditional GO. |

## PLAN
1. Inspect visual evidence and owner files.
2. Confirm `CompletionsSettings.tsx` owns visible old UI strings.
3. Recompose owner JSX around profile list/editor/status rail.
4. Add registry preview from existing registry state.
5. Add scoped CSS only for Connections.
6. Update UI v2 fixpack docs and delivery report.
7. Run verification.

## REVIEW
Review confirms meaningful `CompletionsSettings.tsx` changes, no forbidden paths, no schema/store/auth behavior changes, and successful automated verification.
