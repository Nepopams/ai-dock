# Prompt Fixpack: WP-JUDGE-007C EvaluationRun History UI Integration

Use only if REVIEW returns NO-GO with bounded Must Fix items.

## Fixpack rules
- Fix only REVIEW Must Fix items.
- Keep the same executor and allowed paths.
- Do not add main/preload/shared/storage/IPC/package/dependency changes.
- Do not add auto-save, search/filter, n8n, or a full CompareView redesign.
- Re-run targeted verification and REVIEW.

## Stop if
- The fix needs a new runtime layer, new API, new dependency, or expanded allow-list.
