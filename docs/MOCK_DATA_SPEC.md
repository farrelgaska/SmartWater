# Mock Data Specification

Mock services are the first backend replacement for the UI. They must be deterministic, domain-shaped, and replaceable without changing presentation components.

## Dataset rules

- Keep entities in reusable collections keyed by stable IDs (`industry-...`, `station-...`, `device-...`, `reading-...`, `alert-...`, `analysis-...`, `recommendation-...`).
- Use plausible Pekalongan batik/textile businesses, stations, and streets; avoid logistics, agriculture, or unrelated municipalities.
- Generate no random values during render. If variation is needed, commit fixed records or a seeded generator with a documented seed.
- Use ISO 8601 timestamps with an explicit `+07:00` offset and a small, understandable demo time window. Freeze `now` in the mock service or fixture rather than calling a clock from components.
- Keep parameter keys and units exactly as defined in `PRD.md`/`DATA_MODEL.md`: pH (unitless), temperature (°C), TDS/turbidity/DO/COD/BOD/TSS (mg/L except turbidity NTU).
- Keep reading conditions consistent with documented demo threshold metadata. A stale or suspect sensor must not appear Normal.
- Link every alert to its station and triggering parameter(s); link prediction alerts to a matching AI analysis and factors.
- Link each recommendation to its analysis and maintain a human-readable pending/completed state.
- Make DLH summaries and counts reconcile with the underlying industries, stations, devices, and alerts whenever practical.
- Include normal, warning, critical, offline, unstable, empty, and partial-data cases in fixtures without overwhelming the primary demo.

## Suggested fixture shape

```js
export const mockData = {
  users: [],
  industries: [],
  stations: [],
  devices: [],
  parameters: [],
  readings: [],
  alerts: [],
  analyses: [],
  recommendations: [],
};
```

Services should return assembled, role-scoped view data (for example, an Industry dashboard) rather than asking components to join these arrays. Keep fixture files implementation-local until the first service exists; do not create empty scaffolding now.

## Demo-data notes

The primary demo story should be traceable as: monitoring reading -> status -> anomaly -> alert -> AI risk -> human recommendation.

- The four summary parameters on the Industry dashboard are pH, temperature, turbidity, and TDS; all eight remain available in monitoring detail.
- Admin fixtures that still contain non-batik placeholder industries are a known defect to replace before a competition demo.
- Use labels such as `demo threshold` or a basis field for any threshold-like value. Never label a fixture number as an Indonesian regulatory limit.
- If Industry uses a 6-hour forecast and DLH a 24-hour forecast, encode `horizonHours` explicitly and document the product decision; do not hide it in chart copy.



## Observed placeholder entities

The Admin mockup visibly uses Agriculture - Sector B, Municipality - North, and Logistics Hub - C, while the DLH table includes Coastal Shrimp Farms. Preserve such records only as clearly marked fixture/test cases; replace them with Pekalongan batik/textile entities for the competition demo.
