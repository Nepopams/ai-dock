# REVIEW Prompt - WP-IN-2026-006

Review the docs-only audit.

Checks:
- Audit report exists.
- Classification table covers all 24 main TS files.
- Follow-up workpacks are proposed.
- ADR-002 is respected.
- No runtime/config/package paths changed.
- Initiative validator passes.
- Workpack validator passes.

Expected verdict:
- GO if all checks pass.
- NO-GO only for missing coverage, validator failure, forbidden path changes, or ADR-002 conflict.
