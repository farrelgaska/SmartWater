# UI Specification

The seven supplied mockups have now been inspected. This specification preserves their visible information hierarchy and marks only details that still require product or implementation confirmation. It must not be used to justify a redesign.

## Shared behavior

- Every data screen communicates freshness plus loading, empty, error, and unavailable states.
- Measurement values include parameter and unit; severity includes text, not color alone.
- Role navigation exposes only that role's functions.
- AI results identify their forecast period and remain advice for human decision-making.

## 1. Login — SmartWater Analytics

- **Purpose/role:** entry for Administrator, DLH, and Industry users.
- **Hierarchy:** product identity/supporting message, login form, validation/help feedback. Exact illustration/branding placement awaits the mockup.
- **Components/data:** identity field, password field, submit action, authentication error; no role picker unless the mockup or authentication design requires it.
- **Actions/navigation:** submit credentials; on success go to the authenticated role home. Do not let a user select an unauthorized role.
- **Status behavior:** disable or show progress during submission; keep errors actionable without exposing account existence.
- **Responsive:** responsive form with a readable maximum width; branding must not push the form off-screen.
- **Route/relationships:** `/login`; gateway to all role homes.
- **States:** loading on submit, invalid input, rejected credentials, and unavailable service.

## 2. DLH Dashboard

- **Purpose/role:** regional oversight and prioritization for DLH.
- **Hierarchy:** role navigation/header; regional status and KPI summary; industry compliance/status; incidents/alerts; monitoring stations and GIS/map; WQI trend; AI pollution-risk forecast.
- **Components/data:** totals by status, industry rows/cards, compliance state, incident severity/time, station location/health, map markers, WQI series, forecast horizon/risk.
- **Actions/navigation:** filter or select justified dashboard data and inspect visible industry/station/incident context. No unreferenced management actions.
- **Status behavior:** distinguish water condition, compliance, incident severity, and device health; totals should reconcile with underlying entities.
- **Responsive:** desktop-first grids and efficient table/map use; collapse navigation and stack panels at narrow widths while retaining labels and map alternatives.
- **Route/relationships:** `/dlh`; forecast stays embedded unless a separate DLH analysis screen is supplied.
- **States:** skeleton/placeholder panels, no monitored industries/stations/incidents, partial map/chart failure, stale station data.

## 3. Manajemen Sistem — Administrator

- **Purpose/role:** administer users, devices, provisioning, health, and relevant configuration.
- **Hierarchy:** admin navigation/header; system-health summary; device/node management; user management; relevant configuration.
- **Components/data:** device/station identity, assignment, status, last seen, failure/instability; user identity/role/status; provisioning and safe configuration controls.
- **Actions/navigation:** inspect, filter, provision, enable/disable, or update only capabilities supported by the eventual mockup/API. Risky actions require confirmation and feedback.
- **Status behavior:** emphasize Active, Offline, and Unstable nodes and failed operations; do not reuse water-quality severity as device health.
- **Responsive:** desktop-first summaries and tables; provide narrow-width scrolling/stacking and accessible action menus.
- **Route/relationships:** `/admin/system`; currently one consolidated screen.
- **States:** no users/devices, pending action, validation error, action failure, partial system-health data.
- **Content note:** replace unrelated placeholder industries with plausible Pekalongan batik/textile demo entities.

## 4. Dashboard Industri

- **Purpose/role:** fast understanding of the signed-in industry's wastewater condition.
- **Hierarchy:** industry identity/current status and freshness; four prominent parameter cards (pH, temperature, turbidity, TDS); trend or monitoring summary; active/recent alerts; AI risk summary; recommended next actions.
- **Components/data:** industry/station, latest readings and units, reading condition, timestamps, short trends, alert severity/state, forecast horizon/risk, recommendation preview.
- **Actions/navigation:** open monitoring detail, alerts, an alert detail, or AI analysis. Recommendations remain human actions.
- **Status behavior:** overall status must derive consistently from available reading/alert data; missing/stale readings are not shown as Normal.
- **Responsive:** mobile-first, single-column priority flow at narrow widths; summary cards may form a compact two-column grid when readable; expand for desktop without changing priority.
- **Route/relationships:** `/industry`; links to the other Industry routes.
- **States:** no station/readings, stale or partial sensors, no alerts, unavailable forecast, loading/error.

## 5. Detail Monitoring

- **Purpose/role:** inspect an Industry monitoring station and parameter history.
- **Hierarchy:** back/context header; station/current status; latest measurements; selectable parameter/time context; trend chart; supporting metadata.
- **Components/data:** the four mockup tabs (pH, temperature, turbidity, TDS), value/unit/condition/time, series points, station/device health, demo threshold metadata; services must still support all eight system parameters.
- **Actions/navigation:** choose an available parameter/time range using mockup-supported controls; move to related alert or AI analysis when linked; return to Industry Dashboard.
- **Status behavior:** plot/label warning or critical events; clearly separate configured demo thresholds from readings and device-health problems.
- **Responsive:** mobile-first stacked metrics and horizontally usable chart; wider screens may place summary and trend side by side.
- **Route/relationships:** `/industry/monitoring/:stationId`; owned station only.
- **States:** invalid station, no readings for range, missing parameter, offline device, chart/service error.

## 6. Peringatan & Detail

- **Purpose/role:** let an Industry user find, understand, acknowledge, and resolve relevant warnings if lifecycle actions are confirmed.
- **Hierarchy:** alert summary/list or list context; selected alert severity/state; affected station/parameters and time; anomaly explanation; linked readings/forecast; mitigation checklist.
- **Components/data:** alert ID/title, severity, lifecycle state, timestamps, station, parameter values, message, related analysis, recommendations/checklist.
- **Actions/navigation:** open alert detail, navigate back/list, open monitoring/AI context, and perform only confirmed lifecycle/checklist actions. Checklist completion records a human action; it does not operate equipment.
- **Status behavior:** severity (`Warning`, `Critical`) is distinct from lifecycle (`New`, `Acknowledged`, `Resolved`). Normal informational history may appear only if the mockup supports it.
- **Responsive:** mobile-first cards/detail sections; maintain alert context while actions remain reachable.
- **Routes/relationships:** `/industry/alerts` and `/industry/alerts/:alertId`; links to monitoring and AI analysis.
- **States:** no alerts, invalid/inaccessible alert, missing linked analysis/readings, action pending/failure.

## 7. Analisis AI

- **Purpose/role:** explain an Industry pollution-risk forecast and support a response decision.
- **Hierarchy:** forecast risk and horizon; explanatory summary; anomaly factors/contributions; relevant trends; recommendations/mitigation checklist; model/data context where available.
- **Components/data:** generated time, horizon (written brief suggests 6 hours), risk/severity, confidence if actually provided, factor name/value/unit/direction/contribution, explanation, recommendation priority/status.
- **Actions/navigation:** inspect linked monitoring or alert, mark human checklist progress if supported, and return to prior Industry context.
- **Status behavior:** express uncertainty and data freshness; never display a control-equipment action or claim guaranteed outcomes.
- **Responsive:** mobile-first, explanation before detailed visuals; charts/factor lists remain labeled and usable without hover.
- **Route/relationships:** `/industry/ai-analysis/:analysisId`; related to readings, anomaly factors, alert, and recommendations.
- **States:** analysis pending, unavailable/insufficient data, stale analysis, invalid/inaccessible analysis, partial factor data.

## Cross-screen and mockup checks before implementation

The supplied images establish the navigation labels, ordering, visible copy, actions, example values, and responsive patterns recorded above. Before implementation, recheck those details against the assets. Industry visibly uses a 6-hour AI forecast and DLH visibly uses a 24-hour forecast; retain these as role-specific UI behavior pending product confirmation.



## Observed mockup evidence (source reconciliation)

The seven PNGs under references/mockups were inspected individually. These observations supersede earlier “pending asset” assumptions where they are specific; exact CSS values remain an implementation approximation.

- **Login:** centered white card on a pale blue background with a droplet icon, “SmartWater Analytics Platform,” Indonesian subtitle “Pantau & Kelola Kualitas Air Limbah Industri Secara Real-Time,” fields “Email atau Username” and “Password,” remember-me checkbox “Ingat Saya,” “Lupa Password?,” primary “Masuk Ke Platform,” support link, help/globe/shield icons, and a pale-blue wave footer. Responsive intent is a focused single form.
- **DLH Dashboard:** desktop left navigation (Dashboard, Monitoring, Alerts, AI Analysis, System Admin), “Pekalongan Regional Overview,” date control “Oct 24, 2023 - Live,” KPI cards showing Total Stations 48, Normal 38 (79%), Warning 07 (+2), Critical 03 (Alert), Offline 02; Regional GIS Map with 2D/Satellite toggle; Live Incident Feed with “Dispatch Inspector,” “Remote Check,” and “View Log”; Industrial Compliance Tracking table with search/filter; WQI bar chart “Last 7 Days”; blue “AI Predicted Risk” card showing “Next 24 Hours Forecast,” 75%, “Medium-High Risk,” and “View Mitigation Plan”; “Generate Report” action. This is desktop-first.
- **Admin System Management:** desktop Admin shell with KPI cards Active Devices 52 (+4.2%), System Health 98.2% (Target 99%), Failed Nodes 1.8% (Critical), Active Users 124 (Session: 4h); tabs User Management, IoT Devices (Active), Threshold Rules; device search, Filters, Provision New; table columns Device ID, Assigned Industry, Connection Status, Last Ping, Firmware, Actions; pagination and support/logout/report actions. Visible assigned entities include “Agriculture - Sector B,” “Municipality - North,” and “Logistics Hub - C,” which are domain placeholders to replace in demo data.
- **Industry Dashboard:** mobile-first shell with “SWA,” greeting “Selamat pagi, Pak Budi,” “Batik Sejahtera, Pekalongan,” status “WASPADA,” “ONLINE (IOT-BATIK-001),” and message “Kualitas air menurun karena tingkat kekeruhan meningkat.” Four summary cards show pH Air 6.2 pH (RENDAH), Suhu 29.4°C (NORMAL), Kekeruhan 87 NTU (TINGGI), and TDS 620 ppm (NORMAL). AI card says “Risiko tinggi dalam 6 jam ke depan” with “Lihat Analisis AI”; chart is “TREN KEKERUHAN (24 JAM)”; latest alert is “Kekeruhan meningkat tajam,” “Belum Ditangani,” 10 min ago. Bottom navigation is Home, Alerts, Analysis, Profile.
- **Monitoring Detail:** mobile screen for IOT-BATIK-001 with tabs pH, Suhu, Kekeruhan, TDS only; range chips Hari ini, 7 Hari, 30 Hari; latest pH 6.2 with “WASPADA Batas Bawah”; chart “Grafik Fluktuasi pH” and displayed “Batas: 6.5 - 8.5”; minimum 5.9, maximum 7.1, average 6.5, Sensor Health 98%; “Saran Penanganan” recommends checking the wastewater filter at the main settling basin. Bottom Analysis tab is active. The mockup visibly presents four parameters; the data model still supports all eight.
- **Alerts:** mobile “Daftar Peringatan” with search “Cari ID Peringatan...,” filters Semua, Merah, Amber, and Terselesa(i); cards #ALT-882 (BARU, Kekeruhan Melebihi Batas, Sensor: Inlet Limbah 02, 87 NTU, 2 menit), #ALT-879 (DIKETAHUI, Suhu Air Meningkat, Sensor Kolam Aerasi, 38.2°C, 45 menit), and #ALT-875 (SELESAI, Penurunan Tekanan Pipa, Masalah telah diperbaiki). Bottom Alerts tab is active.
- **AI Analysis:** mobile “AI Analysis Report,” “Last updated: Just now,” current risk 68% with “TINGGI,” “Forecast: 6 Jam Ke Depan”; factors 1. Turbidity / Spike detected / +28%, 2. pH drop / Acidic shift / 6.8 → 6.2, 3. Abnormal duration / Sensor instability / 30 min; Mitigation Checklist with two unchecked items, one checked “Initial system auto-purge initiated,” and “Execute Actions”; disclaimer says results support decisions and must be verified by certified environmental engineers. The checked auto-purge and Execute Actions wording are safety-sensitive mock copy. Implement them only as a human-confirmed acknowledgement/checklist or operational-guidance workflow; never expose an actuator command or autonomous equipment-control path.

Exact values, labels, icons, and visual hierarchy above are reference/demo values, not regulatory thresholds.
