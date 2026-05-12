# Prompt Plan: WP-JUDGE-003 Custom Rubric / Custom Prompt

## Mode
PLAN, read-only except file-backed initiative/workpack state.

## Required answers
1. How does optional rubric currently work?
2. What field name should be used for custom judge prompt/instructions?
3. Can the field be added backward-compatibly?
4. Are new IPC channels needed?
5. Are prompt/rubric source file edits needed?
6. Is preset catalog runtime integration needed?
7. How will customPrompt be inserted without losing strict JSON output?
8. How will prompt injection risk be limited?
9. Which exact files may change?
10. Which tests are added?
11. How is current CompareView behavior preserved?

## PLAN conclusion
Use optional `customPrompt` on `JudgeInput`; no new IPC channel, prompt source edit, provider setting change, package change, or preset catalog integration is needed. Insert custom instructions as a bounded additional guidance block in `judgePipeline.js`, then restate that strict JSON output remains required. Update shared guards, preload sanitizer, metadata flags, minimal CompareView state/UI, and targeted tests.
