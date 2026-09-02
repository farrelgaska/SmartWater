# MVP Routes

These routes are a proposed mapping for the seven supplied screen concepts. They are documentation, not implemented behavior. Every row below is an EXISTING MVP SCREEN mapping; no FUTURE / DEFERRED SCREEN route is added.

| Route | Role | Screen | Navigation source | Access behavior |
| --- | --- | --- | --- | --- |
| `/login` | Public | Login | Direct entry or signed-out redirect | Authenticated users should be redirected to their role home |
| `/dlh` | DLH | DLH Dashboard | Role home | Reject other roles; show only authorized regional/industry data |
| `/admin/system` | Administrator | Admin System Management | Role home/navigation | Reject other roles |
| `/industry` | Industry | Industry Dashboard | Role home | Reject other roles; scope data to the user's industry |
| `/industry/monitoring/:stationId` | Industry | Monitoring Detail | Dashboard parameter/station action | Require station ownership; invalid/inaccessible IDs show a safe not-found state |
| `/industry/alerts` | Industry | Alerts list/state of Peringatan screen | Dashboard/navigation | Scope alerts to the user's industry |
| `/industry/alerts/:alertId` | Industry | Alert Detail | Alert row/card | Require alert ownership; safe not-found for invalid/inaccessible IDs |
| `/industry/ai-analysis/:analysisId` | Industry | AI Analysis | Dashboard, monitoring detail, or alert detail | Require analysis ownership; safe not-found for invalid/inaccessible IDs |

DLH forecasts and industry compliance remain sections of `/dlh` because no separate supplied screens justify more routes. Admin user/device management remains within `/admin/system` until the reference UI or requirements establish separate pages.

## Access and fallback behavior

- Authentication and authorization are separate: hiding a navigation item is not access control.
- A signed-out visit to a protected route returns to `/login`, preserving the intended destination only if implemented safely.
- An authenticated wrong-role visit returns to that role's home or a dedicated forbidden state; choose once the application shell exists.
- Unknown routes use one not-found view. Do not reveal whether another role's entity exists.
- Route labels may display Indonesian UI copy while code paths stay stable English identifiers.

## Pending confirmation

The inspected mockups show an alerts list, monitoring detail, and AI Analysis destination, but do not establish additional standalone DLH/Admin drill-down screens. Keep the current route set unless a new supplied screen or explicit requirement justifies expansion.



## Visible navigation note

The web primary navigation is now Dashboard, Monitoring, AI Analysis, and System Admin. Alert and incident information remains contextual within Dashboard/Monitoring; the legacy `/dlh/alerts` path redirects to `/dlh/monitoring`.


## Application ownership

- apps/web: /login, /dlh, and /admin/system shells.
- apps/mobile: /login, /industry, /industry/monitoring/:stationId, /industry/alerts, /industry/alerts/:alertId, and /industry/ai-analysis/:analysisId shells.

The /login concept is intentionally present in both independent apps; authentication remains unimplemented in Phase 1.


## Phase 8.5 navigation shells

The desktop DLH navigation exposes `/dlh/monitoring` and `/dlh/ai-analysis` alongside the `/dlh` dashboard. `/dlh/alerts` remains only as a compatibility redirect. Administrator navigation remains limited to `/admin/system`, with user/access management inside that screen.

