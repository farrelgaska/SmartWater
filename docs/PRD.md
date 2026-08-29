# Product Requirements Document

## Product overview

SmartWater Analytics Platform is a decision-support frontend for wastewater monitoring in Pekalongan's batik/textile sector. Its flow is **Monitor -> Detect -> Predict -> Warn -> Recommend -> Support Decision**. IoT measurements, alerts, and AI analyses give people evidence and recommended actions; people remain responsible for decisions and equipment operation.

## Problem and objectives

Water-quality information can be fragmented, late, or difficult to interpret across individual businesses and regional oversight. The MVP should:

- make current and historical water quality understandable;
- surface device or data-health problems;
- expose anomalies and pollution-risk forecasts early;
- connect alerts to explanations and actionable mitigation checklists;
- support industry operators, DLH, and administrators without crossing role boundaries.

## Target users and value

| Role | Needs | Frontend value |
| --- | --- | --- |
| Administrator | Manage users and IoT devices; inspect offline, failed, or unstable nodes; provision devices; manage relevant configuration | One system-management view with clear operational status |
| DLH | Monitor industries, regional status, compliance, incidents, stations, GIS, WQI trends, and risk | A desktop-first regional overview for prioritizing investigation |
| Industry / batik owner | Understand its own discharge, readings, history, alerts, forecasts, and responses | A mobile-first operational view and clear next-step checklist |

## RBAC requirements

Route and service access must enforce the three roles and Industry ownership boundaries described in ROUTES.md and DATA_MODEL.md. A hidden navigation item is not an authorization check.

## Functional requirements

### Shared

- Authenticate through a responsive login entry point and route users according to role. Authentication mechanics are not part of the current documentation phase.
- Enforce role-based route and data access.
- Represent loading, empty, error, freshness, and unavailable-data states.
- Show human-readable timestamps and measurement units.

### Administrator

- List and manage users and relevant role assignments.
- List, provision, and inspect IoT devices and monitoring-node health.
- Distinguish Active, Offline, and Unstable device states and surface failed nodes.
- Manage only system configuration justified by current requirements.

### DLH

- Summarize regional water quality, industries, compliance, incidents, and stations.
- Display industry-level status and allow movement into justified monitoring context.
- Present GIS/map context, Water Quality Index trends, and AI pollution-risk predictions.
- Use a potentially broader forecast window than Industry; the proposed 24-hour DLH horizon requires confirmation.

### Industry

- Summarize current pH, temperature, turbidity, and TDS while retaining access to all supported parameters.
- Display measurement history and monitoring-station context.
- List alerts and open alert details with severity, anomaly explanation, and state.
- Present AI risk prediction and linked anomaly factors.
- Present mitigation/recommendation items as a human-operated checklist.
- Use a proposed 6-hour forecast horizon, pending confirmation from the mockup/product owner.

## Water-quality parameters

The domain must support all eight proposal parameters:

| Parameter | Canonical key | Unit policy |
| --- | --- | --- |
| pH | `ph` | unitless |
| Temperature | `temperature` | `°C` |
| Total Dissolved Solids | `tds` | `mg/L` |
| Turbidity | `turbidity` | `NTU` |
| Dissolved Oxygen (DO) | `do` | `mg/L` |
| Chemical Oxygen Demand (COD) | `cod` | `mg/L` |
| Biochemical Oxygen Demand (BOD) | `bod` | `mg/L` |
| Total Suspended Solids (TSS) | `tss` | `mg/L` |

Limits shown in future demos are configurable mock thresholds, not verified legal or regulatory limits.

## AI, IoT, warnings, and reporting

- **AI:** provide risk level, forecast horizon, confidence if available, anomaly factors, plain-language explanation, and recommendations. Do not imply autonomous treatment control.
- **IoT:** identify stations/devices, last contact, health, and readings. The proposal context includes ESP32 nodes communicating through HTTP or MQTT; protocol choice and ingestion are backend/device concerns, outside this frontend scope. The product is a web-based application whose future frontend integration uses a REST API.
- **AI capabilities:** detect anomalies, predict pollution risk over a stated horizon, explain contributing factors, and recommend human mitigation steps. Model training/inference is outside this frontend scope.
- **Early Warning System:** connect abnormal readings or forecasts to a severity, timestamp, affected parameter/station, lifecycle state, and recommended response.
- **Reporting:** the MVP exposes dashboard summaries, trends, compliance/status information, and incident context. Export or formal statutory-report generation is deferred unless supported by the proposal.

## Nonfunctional requirements

- Responsive according to role strategy; usable with keyboard and screen readers; status is not color-only.
- Clear data freshness, safe handling of failures, and no cross-role data leakage.
- Deterministic demos with consistent units and reconciled totals.
- Maintainable MVP architecture with components separated from data access.
- Reasonable performance on competition-demo hardware and common mobile connections; numeric targets are pending a runnable application.

## MVP scope

Seven screens: Login, DLH Dashboard, Admin System Management, Industry Dashboard, Monitoring Detail, Alerts/Alert Detail, and AI Analysis. Supporting role-aware navigation, services, deterministic mock data, and essential UI states are included.

## Out of scope

Autonomous IPAL control, AI model training/inference implementation, device firmware, sensor ingestion, real authentication/backend implementation, unverified regulatory enforcement, payments, public portals, native mobile apps, enterprise microfrontends, and additional speculative screens.

## Success criteria

- All seven reference screens are reproduced with verified hierarchy and responsive behavior once assets are available.
- Each role sees only its routes and domain data.
- The eight parameters are representable; readings, alerts, analyses, and overview totals reconcile.
- The UI distinguishes normal, warning, critical, device-health, and alert-lifecycle states accessibly.
- Mock services can be replaced by the provisional REST contract without rewriting presentation components.
- AI copy and actions consistently communicate decision support.

## Evidence gaps and assumptions

The original proposal PDF remains authoritative and its machine-readable PROPOSAL_SOURCE.md mirror was read completely. The mirror confirms the product, roles, parameters, IoT/AI context, web/REST architecture context, MVP scope, and DSS boundary recorded here. PDF binary text extraction remains unavailable locally, so the mirror is retained as the practical reading aid.

