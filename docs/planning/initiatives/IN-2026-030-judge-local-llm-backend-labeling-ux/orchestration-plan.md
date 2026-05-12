# Orchestration Plan: IN-2026-030 Judge Local LLM Backend Labeling UX

## Initiative summary
This initiative delivers `WP-JUDGE-005 Local LLM Backend Labeling and UX` as a bounded renderer/shared utility change. It adds derived labels for existing completions profiles and surfaces those labels in Connections and the Judge profile selector.

## Assumptions
- Existing completions profiles remain the MVP backend selection model.
- `openai-compatible` covers both hosted APIs and local OpenAI-compatible endpoints.
- `generic-http` covers custom/local HTTP services without a new provider system.
- Labels are derived from `driver`, `baseUrl`, and `defaultModel`; no data migration is needed.
- Inferred local/private labels are advisory and must not be phrased as privacy guarantees.

## Selected delivery mode
L3 scoped renderer/shared utility/test APPLY.

## Epic breakdown
| Epic | Scope |
| --- | --- |
| E1 | Initiative/workpack orchestration |
| E2 | Shared profile label helper |
| E3 | ConnectionsSettings label display |
| E4 | CompareView Judge selector label display |
| E5 | Tests and REVIEW |

## Sprint mapping
Single scoped workpack: `WP-JUDGE-005-local-llm-backend-labeling-ux`.

## Workpack queue
| Workpack | Status |
| --- | --- |
| `WP-JUDGE-005-local-llm-backend-labeling-ux` | Done |

## Executor routing
- Selected executor: `ai-dock-renderer-react-executor`
- Secondary executor: `ai-dock-test-qa-executor`
- Secondary executor: `ai-dock-security-hardening-executor` for privacy wording review only.

## Gate plan
- Stop if settings schema, main/preload/IPC, package/dependency metadata, provider code, or dedicated local provider changes become necessary.
- Stop if UI requires a broad redesign rather than inline labels/helper text.
- Stop if privacy copy cannot remain non-guaranteeing.

## Verification strategy
- Validate initiative/workpack artifacts.
- Syntax-check the shared JS helper.
- Run targeted helper tests.
- Run full tests and renderer build.
- Run diff and forbidden-path scope checks.

## Risk register
| Risk | Mitigation |
| --- | --- |
| False privacy confidence | Use "inferred" wording and explicit non-guarantee helper text |
| Misclassified endpoint | Keep labels advisory and show driver/model context |
| UI density in select | Compose concise option labels |
| Schema creep | Keep helper pure and do not persist labels |
