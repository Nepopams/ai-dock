# Gates - IN-2026-011

## Soft gates
- Naming accepted: `IN-2026-011-legacy-renderer-retirement-plan`.
- One docs-only workpack accepted.
- Source-of-truth index update accepted because it only adds the architecture report link.

## Strong human gates
None triggered.

## Stop-the-line events
None.

## Approval log
- User explicitly requested L2 architecture/docs planning initiative.
- Runtime APPLY and deletion are forbidden.
- Docs-only APPLY is allowed under the provided L2 autonomy.

## Decisions log
- Recommended staged retirement, Option D.
- Do not delete or move legacy files now.
- Classify top-level `store/**`, `adapters/**`, `components/**`, and `utils/**` as shared renderer support, not legacy.
- Treat `src/renderer/icons/**` as high-risk legacy support because one icon path is referenced by `src/main/services.js`.
