# Design System Baseline

This document captures semantic design rules observed in the seven supplied mockups. Exact CSS tokens remain **Proposed** where screenshots cannot establish reliable implementation values.

## Principles

- Operational clarity before decoration: current status, risk, freshness, and next action are prominent.
- Preserve hierarchy across overview cards, trends, alerts, explanations, and recommendations.
- Keep role experiences recognizable while sharing basic visual primitives.
- Never communicate severity with color alone; pair it with text and, where useful, an icon.

## Foundations

- **Typography:** use one readable sans-serif family already supported by the implementation. Define page title, section heading, card label, body, numeric metric, and helper-text levels. Large measurements require adjacent parameter name and unit.
- **Spacing:** adopt a small consistent scale when Tailwind is configured. Use tighter spacing inside related metric content and larger gaps between sections.
- **Radius:** use one modest control radius and one card radius. Avoid a separate radius for every component.
- **Elevation and borders:** cards use a subtle boundary or elevation, not both heavily. Focus and selected states must remain obvious.
- **Color:** define semantic roles before hex values. Derive exact palette, contrast pairs, and chart series from the actual mockups during implementation.

## Components

- **Cards:** title/label, primary value or content, context/status, and optional action. Summary cards outrank supporting cards.
- **Buttons:** primary for the screen's main safe action, secondary for alternatives, and quiet/icon buttons for local actions. Destructive actions require explicit labels and confirmation appropriate to risk.
- **Fields:** persistent labels, visible focus, concise validation, and suitable native input behavior.
- **Icons:** Lucide React is proposed. Icons support labels rather than replace unfamiliar actions or statuses.
- **Navigation:** desktop Admin/DLH may use persistent side/top navigation; Industry uses a mobile-first compact pattern consistent with its mockups. Preserve visible current location.
- **Tables:** clear headers, aligned numeric/unit columns, status text, and a narrow-screen alternative such as horizontal scrolling or stacked records based on actual content.
- **Charts:** always include title, period, units, readable axes/legend, and an accessible text summary. Threshold lines must be labeled as demo configuration unless verified.

## Semantic status tokens

| Token | Meaning | Suggested treatment, pending visual verification |
| --- | --- | --- |
| Normal | Reading or water state is within configured demo bounds | calm/positive color + `Normal` label |
| Warning | Attention is needed; not yet highest severity | caution color + warning icon/label |
| Critical | Immediate human review is needed | strong danger color + critical icon/label |
| Offline | Device is not communicating | neutral/danger treatment + last-seen context |
| Active | Device/user/system entity is enabled and operating | positive treatment + label |
| Unstable | Device communication or readings are unreliable | caution treatment + explanation |
| Resolved | Alert lifecycle is complete | subdued positive/neutral treatment |
| New | Alert has not been reviewed | prominent indicator + label |
| Acknowledged | A person has reviewed/owned the alert | informational treatment + actor/time when available |

Reading condition (`Normal`, `Warning`, `Critical`), device health (`Active`, `Offline`, `Unstable`), and alert lifecycle (`New`, `Acknowledged`, `Resolved`) are separate dimensions and must not be collapsed into one field.

## Responsive behavior

- **Industry:** start at narrow widths; stack cards and sections, keep critical readings/actions early, and avoid desktop tables where cards suffice.
- **Administrator/DLH:** start with efficient desktop dashboards; at narrower widths collapse navigation, wrap summary grids, and preserve access to all content without clipping.
- **Login:** center a readable form with sensible width and adapt supporting branding without obstructing authentication.

Breakpoints, exact spacing, radii, typography sizes, shadows, colors, and chart palette remain implementation decisions after mockup inspection.



## Observed mockup evidence (source reconciliation)

The inspected PNGs show a pale blue-gray page canvas, white cards, dark charcoal text, and a blue/teal primary family. Blue is used for active navigation and primary actions; green for Normal/Active; amber/yellow for Warning, Waspada, Rendah/Tinggi parameter states, and Amber alerts; red for Critical/Merah/high-risk states; muted gray for Offline, Resolved, and supporting metadata. Exact hex values are not reliable from screenshots: **Implementation approximation required.**

Desktop Admin/DLH use a persistent left rail with a highlighted item and a wide content canvas. Mobile Industry screens use a compact top bar and fixed bottom navigation (Home, Alerts, Analysis, Profile). Cards have rounded corners, subtle borders/shadows, generous internal spacing, and clear metric-label/value/status groupings. Tables use pale header rows, search/filter controls, status pills, and pagination. Charts are lightweight bar/line presentations with explicit periods and labels. Primary actions are filled blue (“Masuk Ke Platform,” “Provision New,” “Generate Report,” “Execute Actions”); secondary actions are white/outlined or quiet controls. Indonesian UI copy is prominent in Industry screens while desktop shells mix English headings and Indonesian data labels.

The AI mockup’s “Execute Actions” control must remain a human-confirmed workflow; the visual treatment does not override the Decision Support System constraint.
