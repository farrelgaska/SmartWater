# SmartWater Agent Rules

- Before implementation, read `.agents/rules/ponytail.md` when present, discover relevant repository skills, then read the relevant files in `docs/` and existing code.
- Read the original proposal, supplied mockup references, and relevant product docs before implementation.
- Source priority is: original proposal for product requirements, supplied mockups for visual/UX behavior, repository documentation for implementation interpretation, existing code for technical reality, and agent assumptions only as a last resort. Document conflicts instead of silently choosing.
- Treat proposal and mockup reference files as read-only evidence; do not rename, convert, resize, overwrite, or optimize them.
- Use `.agents/skills/smartwater-frontend/SKILL.md` for frontend work.
- Keep work inside the documented MVP. Do not silently change business requirements or invent regulations, thresholds, screens, or backend capabilities.
- Treat supplied mockups as the UI reference. Preserve their hierarchy, navigation intent, status semantics, and role-specific responsive strategy.
- Preserve role boundaries: Administrator, DLH, and Industry users must not gain access to one another's functions.
- Present AI as decision support. Never imply autonomous control of IPAL or wastewater-treatment equipment.
- Prefer the smallest coherent implementation. Reuse existing code and platform features; avoid premature abstractions and unnecessary dependencies.
- Keep presentation separate from data access: components consume services, and services select mock data or a future API.
- Industry experiences are mobile-first; Administrator and DLH experiences are desktop-first; login is responsive.
- Explain and record justified architecture changes in `docs/DECISIONS.md` before broad implementation.
- Do not commit, push, switch branches, stash, reset repository state, or modify environment configuration without explicit instruction.

