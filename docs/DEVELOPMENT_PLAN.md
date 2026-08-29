# Incremental Development Plan

No calendar dates are assigned. Each phase depends on the prior phase's completion criteria. Phase 1 is foundation-only; final mockup screens begin later.

| Phase | Objective | Deliverables | Dependencies | Completion criteria |
| --- | --- | --- | --- | --- |
| 0 | Documentation baseline | `AGENTS.md`, skill, PRD, UI/design/route/data/API/mock/decision docs | None | Documents cross-checked; missing evidence recorded |
| 1 | Bootstrap dual web apps and base language | Independent apps/web and apps/mobile React/Vite apps, JavaScript, Tailwind, Lucide, route shells, tokens, feedback primitives, service/mock seams, lint/build scripts | Phase 0; accepted dual-app decision | Each app has an installable manifest, shell routes, separated role scope, and documented commands; build/lint pass when dependencies are installed |
| 2 | Shells and routes | React Router map, session placeholder, Admin/DLH/Industry shells, role guards | Phase 1; confirm route decisions | Deep links render correct shell and wrong-role access is blocked |
| 3 | Login | Login screen and mock session flow | Phase 2; session decision | Responsive validation/error/loading states work; role home is selected |
| 4 | Industry Dashboard | Mobile-first overview using service data | Phase 3; mock fixtures | Four summary parameters, alerts, risk, freshness, and states match UI spec |
| 5 | Monitoring Detail | Station view and parameter histories for all eight keys | Phase 4; chart choice | Owned station detail, units, trends, and missing/offline states work |
| 6 | Alerts + detail | Alert list/detail and confirmed lifecycle actions | Phase 4/5; lifecycle decision | Severity/lifecycle are distinct and links preserve ownership |
| 7 | AI Analysis | Risk explanation, factors, forecast horizon, checklist | Phase 5/6; horizon/recommendation decisions | Copy never implies autonomous control; uncertainty and unavailable data are clear |
| 8 | DLH Dashboard | Desktop-first regional overview, map context, compliance, WQI, forecast | Phase 2; regional mock data and compliance basis | Totals reconcile and authorized multi-industry view works |
| 9 | Admin System Management | Desktop-first devices/users/health/provisioning view | Phase 2; Admin action decisions | Active/Offline/Unstable health and action states are usable |
| 10 | Responsive polish | Cross-role breakpoint and navigation refinement | Phases 3–9; mockup assets | Representative narrow/desktop checks show no clipping or lost actions |
| 11 | Accessibility and resilient states | Keyboard/focus, labels, color-independent status, loading/empty/error states | Phases 3–10 | Manual accessibility pass and regression checks pass |
| 12 | Integration readiness | Service adapters for provisional REST contract, environment-independent config | Phases 4–9; backend contract decisions | Mock and HTTP adapters share view shapes; no component imports fixtures |
| 13 | Testing and demo stabilization | Focused tests, deterministic demo reset, content polish | Phases 10–12 | Critical flows pass repeatably and demo data is credible/consistent |

Keep each phase small. If a new capability is not required for a phase's screen or completion criterion, defer it and record the reason in `DECISIONS.md`.

