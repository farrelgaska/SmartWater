# Provisional Frontend Contract

> **PROVISIONAL FRONTEND CONTRACT** — these endpoints do not exist. They describe the minimum frontend-facing REST shape needed to replace mock services later. Authentication transport and backend error schema require backend agreement.

Base path proposed: `/api`. JSON uses the models and naming conventions in `DATA_MODEL.md`.

## Common behavior

- Protected requests return only entities authorized for the authenticated role.
- Success responses use `{ "data": ... }`; collections may add `{ "meta": { "nextCursor": null } }` when pagination becomes necessary.
- Errors use `{ "error": { "code": "...", "message": "...", "fieldErrors": {} } }` with suitable HTTP status (`400`, `401`, `403`, `404`, `409`, `422`, `500`, `503`).
- Timestamps include an explicit timezone offset. Unknown or unavailable values are `null`, not invented zeroes.

## Auth

| Method and endpoint | Role | Purpose | Request / response |
| --- | --- | --- | --- |
| `POST /auth/session` | Public | Start a session | Request `{ email, password }`; response `{ data: { user } }` plus agreed secure session transport |
| `GET /auth/session` | Any signed-in role | Restore current user | `{ data: { user } }` |
| `DELETE /auth/session` | Any signed-in role | End session | `204` |

Invalid credentials return a generic `401`; do not expose whether an account exists.

## Industry dashboard and monitoring

| Method and endpoint | Role | Purpose | Response data |
| --- | --- | --- | --- |
| `GET /industry/dashboard` | Industry | Get signed-in industry's assembled overview | `{ industry, station, overallCondition, latestReadings, recentAlerts, latestAnalysis, generatedAt }` |
| `GET /industry/stations/:stationId` | Industry owner | Get station and current health | `{ station, devices, latestReadings }` |
| `GET /industry/stations/:stationId/readings?parameter=&from=&to=` | Industry owner | Get deterministic time series | `{ stationId, parameter, readings }` |

The backend must reject a station owned by another industry. Invalid ranges/parameters return `422`; unavailable sensor data may return an empty readings array with context rather than an error.

## Alerts

| Method and endpoint | Role | Purpose | Request / response |
| --- | --- | --- | --- |
| `GET /industry/alerts?status=&severity=` | Industry | List own alerts | `{ data: { alerts }, meta }` |
| `GET /industry/alerts/:alertId` | Industry owner | Get alert context | `{ data: { alert, station, readings, analysis, recommendations } }` |
| `PATCH /industry/alerts/:alertId` | Industry owner | Change confirmed lifecycle state | Request `{ status: 'acknowledged' \| 'resolved' }`; response `{ data: { alert } }` |

Lifecycle updates should return `409` for an invalid transition. Whether Industry users may resolve alerts requires product confirmation before implementation.

## AI analysis

| Method and endpoint | Role | Purpose | Request / response |
| --- | --- | --- | --- |
| `GET /industry/ai-analyses/:analysisId` | Industry owner | Retrieve decision-support analysis | `{ data: { analysis, station, relatedReadings, recommendations } }` |
| `PATCH /industry/recommendations/:recommendationId` | Industry owner | Record human checklist progress | Request `{ status: 'pending' \| 'completed' }`; response `{ data: { recommendation } }` |

No endpoint in this contract operates IPAL or other treatment equipment.

## DLH dashboard and compliance

| Method and endpoint | Role | Purpose | Response data |
| --- | --- | --- | --- |
| `GET /dlh/dashboard` | DLH | Get assembled regional overview | `{ summary, industries, incidents, stations, wqiTrend, riskForecast, generatedAt }` |
| `GET /dlh/industries?status=` | DLH | Get monitored industry summaries when the dashboard needs filtering | `{ industries }` |
| `GET /dlh/compliance` | DLH | Get demo/verified compliance assessments | `{ assessments, basisNote }` |

`basisNote` must clarify whether values are demo or based on verified rules. A map can use `stations[].location`; a separate GIS endpoint is unnecessary for the MVP.

## Administrator devices and users

| Method and endpoint | Role | Purpose | Request / response |
| --- | --- | --- | --- |
| `GET /admin/system` | Administrator | Get system-health summary | `{ data: { summary, devices, users } }` |
| `POST /admin/devices` | Administrator | Provision a device | Request minimum device assignment fields; response `{ data: { device } }` |
| `PATCH /admin/devices/:deviceId` | Administrator | Update supported assignment/status fields | Request changed fields; response `{ data: { device } }` |
| `GET /admin/users` | Administrator | List users if not included in system payload | `{ data: { users } }` |
| `POST /admin/users` | Administrator | Create a user when confirmed by UI | Request `{ name, email, role, industryId }`; response `{ data: { user } }` |
| `PATCH /admin/users/:userId` | Administrator | Update supported role/status fields | Request changed fields; response `{ data: { user } }` |

Validation returns field errors; duplicate identities return `409`; failed provisioning must leave a clear retryable state. Exact writable fields remain pending the Admin mockup and backend security design.


## Additional visible actions

| Method and endpoint | Role | Purpose | Response data |
| --- | --- | --- | --- |
| GET /admin/threshold-rules | Administrator | Load the visible Threshold Rules tab | data.rules and basisNote |
| PATCH /admin/threshold-rules/:ruleId | Administrator | Update a confirmed demo threshold rule | data.rule |
| POST /dlh/reports | DLH | Request the visible Generate Report action | data.reportId, status, and optional downloadUrl |

Threshold values require an explicit demo/verified basis. Report generation must not imply statutory compliance unless an authoritative source is connected.


## Safety interpretation for action-oriented mockup copy

The mockup labels “Execute Actions” and “Initial system auto-purge initiated” are not API permission for autonomous control. Any future action endpoint must record a human acknowledgement, recommendation-checklist completion, or explicitly confirmed operational guidance; this contract contains no IPAL actuator command.
