# PLAN Prompt - WP-IN-2026-008

Plan the renderer mode consolidation without runtime changes.

Required answers:
- What legacy renderer files exist?
- What React renderer files exist?
- How does `main.js` choose renderer mode?
- What do `npm run dev`, `npm run dev:new-ui`, `npm start`, and `npm run electron:build` currently do?
- What is the recommended now state?
- What is the target state?
- What is not allowed in this initiative?
- What follow-up workpacks are required?

PLAN conclusion:
- React should be the intended primary UI.
- Legacy should be retained temporarily as explicit fallback.
- Runtime/package/build changes require a separate Human Gate.
