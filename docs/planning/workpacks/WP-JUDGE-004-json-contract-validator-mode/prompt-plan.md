# Prompt Plan: WP-JUDGE-004 JSON Contract Validator Mode

## Mode
PLAN, read-only except file-backed initiative/workpack state.

## Required answers
1. What canonical mode name should be used?
2. How should `JudgeInput` be extended backward-compatibly?
3. What validation config format should be used?
4. What validator result format should be used?
5. Where should deterministic validators run?
6. How are validator findings included in the LLM prompt?
7. How is the existing IPC channel preserved?
8. How is current CompareView behavior preserved?
9. How is preset catalog runtime integration avoided?
10. Which exact files change?
11. Which tests are added?
12. Is any strong gate triggered?

## PLAN conclusion
Use `json_contract_check`; add optional `validation` config to `JudgeInput`; add optional `validatorResults` to `JudgeResult`; run dependency-free parse/required-key/simple-enum validators in `judgePipeline.js`; pass findings as bounded prompt evidence; keep existing IPC and preset catalog isolation; update CompareView minimally. No strong gate is triggered.
