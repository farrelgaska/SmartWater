---
name: smartwater-frontend
description: Implement or review SmartWater Analytics Platform frontend work while preserving its role boundaries, mockup-led UX, water-quality domain rules, service boundary, and decision-support constraint. Use for SmartWater React UI, routes, mock data, services, responsiveness, or frontend tests; not for backend, AI-model, or IoT firmware work.
---

# SmartWater Frontend

Deliver the smallest coherent frontend change supported by the current MVP and supplied UI references.

## Read before editing

1. `.agents/rules/ponytail.md`, if present.
2. `AGENTS.md`.
3. `docs/PRD.md`, `docs/UI_SPEC.md`, and `docs/DESIGN_SYSTEM.md`.
4. The route, data, API, or mock-data document relevant to the task.
5. The referenced mockup and the existing implementation, including callers of shared code being changed.

Do not implement a SmartWater screen without checking its corresponding mockup when the mockup is available.

If a mockup or proposal named by the task is unavailable, say so and implement only documented behavior. Do not infer precise spacing, colors, regulatory limits, or interactions.

## Workflow

1. Identify the target role, screen, route, data, and mockup.
2. Trace the existing page-to-service-to-data flow and find reusable patterns.
3. Implement the smallest complete change; reuse before adding abstractions or dependencies.
4. Verify role access, relevant viewport behavior, and loading, empty, and error states.
5. Validate the result against the corresponding source mockup when it is available.
6. Run the smallest existing check that would catch a regression; add one focused check for new non-trivial logic.
7. Report changed files, checks run, assumptions, and unresolved decisions. Do not commit or push.

## Product invariants

- Keep Administrator, DLH, and Industry navigation and data access separate.
- AI explains risk and recommends human actions. It never sends control commands to IPAL or treatment equipment.
- The domain supports pH, temperature, TDS, turbidity, DO, COD, BOD, and TSS. Summary cards may feature the first four without removing the rest.
- Treat thresholds in mock data as demo configuration, never as regulatory truth.
- Do not add features or routes outside `docs/PRD.md` and `docs/ROUTES.md` without an explicit requirement.

## UI and responsiveness

- Preserve the supplied mockup's information hierarchy, navigation intent, card priority, and severity semantics.
- Industry screens are mobile-first. Administrator and DLH screens are desktop-first but must remain usable at narrow widths. Login is responsive.
- Use semantic status labels alongside color; do not rely on color alone.
- Prefer shared components only after real repetition appears. Keep page-specific composition in its page.
- Use the semantic design roles in `docs/DESIGN_SYSTEM.md`; exact visual values remain pending mockup inspection.

## Data and services

- Presentation imports services, not files under `data/mock`.
- Services expose domain-shaped results that can later be backed by REST without changing components.
- Keep mock entities reusable, deterministic, internally linked, and Pekalongan/batik-specific.
- Use stable IDs, ISO 8601 timestamps with explicit offsets, documented units, and logically reconciled readings, statuses, alerts, and analyses.
- Start with native `fetch` for a real API unless an existing installed client already provides needed behavior.

## Keep it small

Use local component state and simple Context where genuinely shared. Do not add Redux, Zustand, TanStack Query, state machines, a design-system framework, or speculative generic layers without a documented measured need.

