# SmartWater Ponytail Rules

- Inspect the repository, relevant docs, skills, and source references before editing.
- Understand the existing architecture and callers before changing shared code.
- Make the smallest coherent change; reuse existing patterns before creating new ones.
- Apply YAGNI: no speculative abstractions, dependencies, features, or unrelated cleanup.
- Preserve working behavior. Do not silently change architecture, product requirements, business rules, terminology, or thresholds.
- Keep presentation separate from data access and follow repository-specific skills.
- Preserve role separation, supplied UI information architecture, accessible semantic HTML, and intentional responsive behavior.
- Treat AI as decision support only; never imply autonomous IPAL or treatment-equipment control.
- Do not invent environmental or legal thresholds.
- Verify after changes. Report assumptions, limitations, and any unresolved source discrepancy.

## Git and environment safety

Never automatically commit, push, stash, reset, switch branches, or modify environment files unless explicitly requested.
