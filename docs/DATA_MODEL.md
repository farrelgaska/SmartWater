# Frontend Data Model

Use JavaScript objects with `camelCase` fields, stable opaque string IDs, ISO 8601 timestamps with explicit offsets, and canonical parameter keys from `PRD.md`. Keep display labels outside entity identity. Models are deliberately small and frontend-facing.

## User

Represents an authenticated person and role.

```js
{ id, name, email, role: 'admin' | 'dlh' | 'industry', industryId: null | string, status: 'active' | 'inactive' }
```

An Industry user has one authorized `industryId`; Administrator and DLH users do not.

## Industry

Represents a Pekalongan batik/textile business monitored by the platform.

```js
{ id, name, businessType, address, location: { latitude, longitude }, complianceStatus, stationIds }
```

`complianceStatus` references the separate compliance vocabulary below. Do not infer legal compliance solely from unverified demo thresholds.

## MonitoringStation

Groups measurements at an industry location.

```js
{ id, industryId, name, location, deviceIds, status: 'active' | 'offline' | 'unstable', lastReadingAt }
```

## IoTDevice

Represents an administrator-managed node or sensor device.

```js
{ id, stationId, serialNumber, name, parameterKeys, status: 'active' | 'offline' | 'unstable', lastSeenAt, firmwareVersion }
```

`firmwareVersion` is informational only; firmware management is out of frontend MVP scope.

## DeviceStatus

A shared vocabulary for IoT health, separate from water-condition and alert-lifecycle status.

{ code: 'active' | 'offline' | 'unstable', label, lastSeenAt, detail }

IoTDevice.status references this vocabulary; keep it distinct from reading condition and alert severity.

## WaterQualityParameter

Defines display metadata and configurable demo bands for one of the eight canonical keys.

```js
{ key, name, shortName, unit, demoThresholds: null | { warning, critical }, thresholdNote }
```

Threshold shape may differ by parameter (range versus upper/lower bound) and should be finalized from real requirements. `thresholdNote` must identify unverified demo configuration.

## SensorReading

One measured value at a time and station/device.

```js
{ id, stationId, deviceId, parameterKey, value, unit, measuredAt, condition: 'normal' | 'warning' | 'critical', quality: 'valid' | 'suspect' | 'missing' }
```

Condition is meaningful only with its configured demo threshold. Suspect/missing data must not be presented as Normal.

## Alert

Connects a detected or predicted concern to an Industry station.

```js
{ id, industryId, stationId, title, source: 'reading' | 'prediction', severity: 'warning' | 'critical', status: 'new' | 'acknowledged' | 'resolved', parameterKeys, message, triggeredAt, acknowledgedAt, resolvedAt, aiAnalysisId }
```

## AIAnalysis

Represents a time-bound decision-support result, not an equipment command.

```js
{ id, industryId, stationId, generatedAt, horizonHours, riskLevel: 'normal' | 'warning' | 'critical', riskScore: null | number, confidence: null | number, summary, anomalyFactors, recommendationIds, relatedAlertId }
```

`confidence` is nullable and must not be fabricated. `horizonHours` is explicit because Industry and DLH views may differ.

## AnomalyFactor

Embedded in an AI analysis to explain contributing evidence.

```js
{ rank, parameterKey, label, observedValue, unit, direction: 'high' | 'low' | 'rapid-change', contribution: null | number, explanation }
```

## Recommendation

A human-performed mitigation or investigation item.

```js
{ id, analysisId, title, description, priority: 'normal' | 'warning' | 'critical', status: 'pending' | 'completed', completedAt, completedBy, executionMode: 'human-checklist' }
```

Completion records work; it must never trigger an IPAL control action.

## ComplianceStatus

Use a conservative frontend vocabulary until authoritative compliance rules exist.

```js
{ code: 'compliant' | 'attention' | 'unknown', label, assessedAt, basis: 'demo' | 'verified' }
```

Avoid `noncompliant` unless a verified business rule and data source justify it.

## Relationships and derived views

```text
Industry 1 ── * MonitoringStation 1 ── * IoTDevice
                         │
                         ├── * SensorReading ── 1 WaterQualityParameter
                         ├── * Alert ── 0..1 AIAnalysis ── * AnomalyFactor
                         │                         └── * Recommendation
                         └── latest records feed dashboard summaries
```

Dashboard totals and overall statuses are derived service results, not additional mutable entities. The model supports Admin device tables, DLH station summaries and compliance/incident views, Industry monitoring history, alert detail, AI analysis, and recommendation checklists. Services must scope Industry data by the authenticated industry and should not make components join raw entity arrays.

