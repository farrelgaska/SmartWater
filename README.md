# SmartWater Analytics Platform

SmartWater is a frontend for monitoring, detecting, predicting, warning about, and recommending responses to wastewater-quality risks. Its primary case is batik/textile industry wastewater in Pekalongan. Recommendations support human decisions; they do not control treatment equipment.

## Status

Phase 0 only: the repository contains a documentation and agent-guidance baseline. No React application, package manifest, commands, or dependencies exist yet. The seven mockup PNGs are now present and inspected. The proposal PDF is present but still needs a PDF reader for reliable text extraction; proposal-dependent details remain explicitly provisional.

## Intended architecture

The MVP now uses two independent React + Vite JavaScript web applications: apps/web for Administrator/DLH desktop-first work and apps/mobile for the Industry/Batik Owner mobile-first browser experience. Each app has role-aware routes and a small service boundary:

```text
page/component -> service -> deterministic mock data
                              (later: REST API)
```

React Router and Tailwind CSS are included in each app foundation. A chart library remains deferred. Local React state and Context should be enough until measured needs prove otherwise.

## Applications

- apps/web: independent desktop-first React + Vite web app for Administrator and DLH.
- apps/mobile: independent mobile-first React + Vite web app for Textile Industry / Batik Owner; not React Native.

## Roles

- **Administrator:** users, devices, provisioning, configuration, and system health.
- **DLH:** regional and multi-industry monitoring, compliance, incidents, stations, GIS, WQI trends, and pollution-risk forecasts.
- **Industry:** its own readings, history, alerts, anomaly explanations, forecasts, and mitigation checklists.

## Documentation

- [Product requirements](docs/PRD.md)
- [UI specification](docs/UI_SPEC.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Folder structure](docs/FOLDER_STRUCTURE.md)
- [Routes](docs/ROUTES.md)
- [Data model](docs/DATA_MODEL.md)
- [Provisional API contract](docs/API_CONTRACT.md)
- [Mock data specification](docs/MOCK_DATA_SPEC.md)
- [Terminology baseline](docs/TERMINOLOGY.md)
- [Development plan](docs/DEVELOPMENT_PLAN.md)
- [Decisions and open questions](docs/DECISIONS.md)

Future implementation should begin by reading `AGENTS.md` and `.agents/skills/smartwater-frontend/SKILL.md`, then completing Phase 1 in the development plan. Do not document or run development commands until the project actually defines them.



## Commands

Run each application independently from its directory:

~~~sh
cd apps/web
npm install
npm run dev
npm run lint
npm run build

cd ../mobile
npm install
npm run dev
npm run lint
npm run build
~~~

The two apps intentionally have separate manifests and dependency trees.
#
