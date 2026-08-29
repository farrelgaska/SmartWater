import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, CalendarDays, CheckCircle2, CircleAlert, CircleHelp, Filter, Map, Plus, Search, Satellite, ShieldCheck, WifiOff, X } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getDlhDashboard } from '../../services/dlhService.js';

const statusIcons = { normal: CheckCircle2, warning: AlertTriangle, critical: CircleAlert, offline: WifiOff };
const statusLabels = { normal: 'Normal', warning: 'Warning', critical: 'Critical', offline: 'Offline' };

function KpiCard({ item }) {
  const Icon = statusIcons[item.tone] || Activity;
  return <article className={`dlh-kpi-card dlh-tone-${item.tone}`}><div className="dlh-kpi-icon"><Icon size={18} aria-hidden="true" /></div><p>{item.label}</p><strong>{item.value}</strong><small>{item.detail}</small></article>;
}

function IncidentCard({ incident, onAction }) {
  const Icon = incident.severity === 'critical' ? CircleAlert : incident.severity === 'warning' ? AlertTriangle : CheckCircle2;
  return <article className={`dlh-incident dlh-incident-${incident.severity}`}><div className="dlh-incident-heading"><span><Icon size={16} aria-hidden="true" />{incident.severity === 'info' ? 'System Update' : incident.severity}</span><time>{incident.time}</time></div><h3>{incident.title}</h3><p>{incident.summary}</p><button type="button" className="dlh-text-button" onClick={() => onAction(incident.action)}>{incident.action}</button></article>;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [mapMode, setMapMode] = useState('2D');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getDlhDashboard().then((data) => active && setDashboard(data)).catch(() => active && setError('Unable to load the regional dashboard.'));
    return () => { active = false; };
  }, []);

  const industries = useMemo(() => {
    if (!dashboard) return [];
    const search = query.trim().toLowerCase();
    return dashboard.industries.filter((industry) => (!attentionOnly || industry.status !== 'normal') && (!search || `${industry.name} ${industry.idLabel} ${industry.location}`.toLowerCase().includes(search)));
  }, [dashboard, query, attentionOnly]);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!dashboard) return <PageContainer><LoadingState label="Loading regional dashboard…" /></PageContainer>;

  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2800); };

  return <PageContainer>
    <div className="dlh-dashboard">
      <header className="dlh-page-header"><div><p className="eyebrow">DLH · REGIONAL OVERSIGHT</p><h1>Pekalongan Regional Overview</h1><p>Real-time environmental monitoring and industrial compliance dashboard.</p></div><button type="button" className="dlh-date-control"><CalendarDays size={17} aria-hidden="true" />Oct 24, 2023 - Live</button></header>
      <section className="dlh-kpi-grid" aria-label="Station summary">{dashboard.kpis.map((item) => <KpiCard key={item.label} item={item} />)}</section>
      <div className="dlh-main-grid">
        <section className="dlh-card dlh-map-card" aria-labelledby="map-title"><div className="dlh-card-header"><div><p className="eyebrow">REGIONAL GIS MAP</p><h2 id="map-title">Pekalongan</h2></div><div className="dlh-toggle" role="group" aria-label="Map view"><button type="button" className={mapMode === '2D' ? 'active' : ''} onClick={() => setMapMode('2D')}><Map size={15} aria-hidden="true" />2D</button><button type="button" className={mapMode === 'Satellite' ? 'active' : ''} onClick={() => setMapMode('Satellite')}><Satellite size={15} aria-hidden="true" />Satellite</button></div></div><div className={`dlh-map-visual dlh-map-${mapMode.toLowerCase()}`} role="img" aria-label={`Pekalongan station map in ${mapMode} view`}><span className="dlh-map-label dlh-map-label-north">NORTH COASTAL</span><span className="dlh-map-label dlh-map-label-city">PEKALONGAN</span>{dashboard.stations.map((station) => { const Icon = statusIcons[station.status]; return <span key={station.id} className={`dlh-map-marker dlh-marker-${station.status}`} style={{ left: `${station.x}%`, top: `${station.y}%` }} title={station.name}><Icon size={13} aria-hidden="true" /></span>; })}<div className="dlh-map-scale">2 km</div></div><div className="dlh-map-legend">{Object.entries(statusLabels).map(([key, label]) => <span key={key}><i className={`dlh-legend-dot dlh-marker-${key}`} />{label}</span>)}</div></section>
        <section className="dlh-card dlh-incident-card" aria-labelledby="incident-title"><div className="dlh-card-header"><div><p className="eyebrow">LIVE INCIDENT FEED</p><h2 id="incident-title">Latest activity</h2></div><span className="dlh-live-dot">LIVE</span></div><div className="dlh-incident-list">{dashboard.incidents.map((incident) => <IncidentCard key={incident.id} incident={incident} onAction={(action) => notify(`${action} queued for human follow-up.`)} />)}</div></section>
      </div>
      <section className="dlh-card dlh-compliance-card" aria-labelledby="compliance-title"><div className="dlh-card-header"><div><p className="eyebrow">INDUSTRIAL COMPLIANCE</p><h2 id="compliance-title">Monitored facilities</h2></div><div className="dlh-table-tools"><label className="dlh-search"><Search size={15} aria-hidden="true" /><span className="sr-only">Search facilities</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search facilities" /></label><button type="button" className={`dlh-filter-button ${attentionOnly ? 'active' : ''}`} onClick={() => setAttentionOnly((value) => !value)}><Filter size={15} aria-hidden="true" />{attentionOnly ? 'Attention only' : 'Filter'}</button></div></div><div className="dlh-table-scroll"><table><thead><tr><th>Industry</th><th>Location</th><th>Status</th><th>Latest parameters</th><th>Updated</th></tr></thead><tbody>{industries.map((industry) => <tr key={industry.id}><td><strong>{industry.name}</strong><small>{industry.idLabel}</small></td><td>{industry.location}</td><td><span className={`status-badge status-${industry.status}`}>{industry.statusLabel}</span></td><td><div className="dlh-parameter-list">{industry.parameters.map((parameter) => <span key={parameter.label}><b>{parameter.label}</b> {parameter.value}</span>)}</div></td><td>{industry.lastUpdate}</td></tr>)}{industries.length === 0 && <tr><td colSpan="5" className="dlh-empty-row">No facilities match this view.</td></tr>}</tbody></table></div><div className="dlh-table-footer"><span>Showing {industries.length} of {dashboard.industries.length} facilities</span><span>Page 1 of 1</span></div></section>
      <div className="dlh-bottom-grid"><section className="dlh-card dlh-wqi-card" aria-labelledby="wqi-title"><div className="dlh-card-header"><div><p className="eyebrow">WATER QUALITY INDEX</p><h2 id="wqi-title">Regional trend</h2></div><span className="dlh-card-meta">Last 7 Days</span></div><div className="dlh-chart" role="img" aria-label="Water Quality Index trend for the last seven days">{dashboard.wqiTrend.map((point) => <div className="dlh-bar-column" key={point.label}><span className="dlh-bar-value">{point.value}</span><div className="dlh-bar-track"><span style={{ height: `${point.value}%` }} /></div><small>{point.label}</small></div>)}</div></section><section className="dlh-card dlh-ai-card" aria-labelledby="risk-title"><div className="dlh-ai-icon"><ShieldCheck size={21} aria-hidden="true" /></div><div><p className="eyebrow">AI PREDICTED RISK</p><h2 id="risk-title">Next {dashboard.aiRisk.horizonHours} Hours Forecast</h2><p>{dashboard.aiRisk.summary}</p><button type="button" className="dlh-ai-button" onClick={() => notify('Mitigation plan opened for review.')}>{dashboard.aiRisk.actionLabel}</button></div><div className="dlh-risk-score" aria-label={`${dashboard.aiRisk.riskScore}% ${dashboard.aiRisk.label}`}><strong>{dashboard.aiRisk.riskScore}%</strong><span>{dashboard.aiRisk.label}</span></div></section></div>
      <button type="button" className="dlh-fab" aria-label="Create regional follow-up" onClick={() => notify('Follow-up action queued for human review.')}><Plus size={22} aria-hidden="true" /></button>
      {message && <div className="dlh-toast" role="status"><CircleHelp size={16} aria-hidden="true" />{message}<button type="button" aria-label="Dismiss message" onClick={() => setMessage('')}><X size={14} aria-hidden="true" /></button></div>}
    </div>
  </PageContainer>;
}


