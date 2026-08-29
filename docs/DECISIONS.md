# Architecture Decisions

Lightweight ADR record. Status values are `Accepted`, `Proposed`, or `Deferred`; proposed choices are not installed or final until implementation confirms them.

## ADR-001 — React + Vite

- **Decision:** Proposed React with Vite for the JavaScript frontend.
- **Reason:** Matches the requested direction and suits an MVP SPA with role-specific screens.
- **Consequences:** Fast client-side development and a simple deployment artifact; no SSR or framework-specific backend assumptions.
- **Status:** Proposed; no project files or dependencies exist yet.

## ADR-002 — JavaScript

- **Decision:** Proposed JavaScript/JSX rather than adding a type-system migration during the competition MVP.
- **Reason:** Explicit project direction and smallest bootstrap.
- **Consequences:** Keep domain shapes documented and validated at service boundaries; reconsider if runtime complexity warrants types.
- **Status:** Proposed.

## ADR-003 — Tailwind CSS

- **Decision:** Proposed Tailwind CSS for implementation tokens/utilities.
- **Reason:** Efficient responsive styling and consistent semantic token use.
- **Consequences:** Exact palette and tokens must be derived from mockups; avoid building a second custom design-system framework.
- **Status:** Proposed.

## ADR-004 — Chart library

- **Decision:** Recharts or Chart.js remains a choice for the first chart that needs it.
- **Reason:** Both fit the requested direction; the repository has no installed dependency and no chart requirement can be validated yet.
- **Consequences:** Select the smallest accessible option after inspecting chart complexity and existing ecosystem; document the choice then.
- **Status:** Deferred.

## ADR-005 — React Router

- **Decision:** Proposed React Router for the documented route map and role-aware navigation.
- **Reason:** The MVP has multiple role screens and deep links.
- **Consequences:** Route guards must enforce role/ownership, not just hide links.
- **Status:** Proposed.

## ADR-006 — Lightweight state

- **Decision:** Start with component state and small React Context only for genuinely shared session/UI state.
- **Reason:** Current screens do not justify Redux, Zustand, TanStack Query, or state machines.
- **Consequences:** Less ceremony; add a library only after a measured cross-screen synchronization need.
- **Status:** Accepted for MVP baseline.

## ADR-007 — Service abstraction

- **Decision:** Presentation calls domain services; services select deterministic mock data now and can call REST later.
- **Reason:** Keeps UI independent of fixture layout and enables backend integration without a rewrite.
- **Consequences:** Do not import `data/mock` from pages/components; avoid speculative generic repositories.
- **Status:** Accepted for MVP baseline.

## ADR-008 — Mock-first development

- **Decision:** Build screens against deterministic Pekalongan/batik fixtures before a backend exists.
- **Reason:** The backend does not exist and competition UI feedback can proceed independently.
- **Consequences:** Every demo value needs clear mock/demo semantics and a migration path to `API_CONTRACT.md`.
- **Status:** Accepted.

## ADR-009 — Responsive strategy by role

- **Decision:** Industry is mobile-first; Admin and DLH are desktop-first responsive; Login is responsive.
- **Reason:** Explicit product context and mockup intent.
- **Consequences:** Shared primitives cannot force one layout strategy; verify each screen at representative widths.
- **Status:** Accepted.

## ADR-010 — AI decision support only

- **Decision:** AI output is explanatory risk prediction and human recommendation, never autonomous IPAL control.
- **Reason:** Product safety and explicit scope constraint.
- **Consequences:** Copy, actions, API, and models must contain no treatment-control command path.
- **Status:** Accepted.

## Open decisions

- Confirm exact palette, typography, breakpoints, charts, copy, and interactions from the inspected mockups.
- Confirm whether Industry's 6-hour and DLH's 24-hour forecast horizons are intentional.
- Confirm whether Industry users may acknowledge/resolve alerts and complete recommendations.
- Select Recharts versus Chart.js after the first chart requirement.
- Confirm backend session transport, verified compliance basis, and Admin writable fields.



## ADR-011 — AI action semantics

- **Decision:** Proposed implementation treats “Execute Actions” and checklist completion as explicit human workflow/logging only; no direct equipment command path exists.
- **Reason:** The AI mockup contains “Execute Actions” and a checked “Initial system auto-purge initiated,” which conflicts with the product constraint that AI is decision support only.
- **Consequences:** Replace or clarify safety-sensitive copy, require human confirmation/audit context, and never model auto-purge as an AI capability.
- **Status:** Proposed pending product-owner confirmation of the mockup copy.


## ADR-012 — Separate web and mobile web applications

- **Decision:** Accepted: keep apps/web and apps/mobile as independent React + Vite browser applications.
- **Reason:** Desktop-first Administrator/DLH and mobile-first Industry responsibilities need isolated navigation, testing, maintenance, and future deployment scope without introducing a workspace tool.
- **Consequences:** Small duplicated foundations are acceptable; do not create a shared package until repetition is proven. apps/mobile is not React Native.
- **Status:** Accepted for Phase 1.
