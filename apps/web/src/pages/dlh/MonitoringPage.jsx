import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, Filter, Search, Settings2, WifiOff } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getMonitoring } from '../../services/monitoringService.js';

const deviceStatusLabels = { active: 'Active', unstable: 'Unstable', offline: 'Offline' };
const deviceStatusIcons = { active: CheckCircle2, unstable: CircleAlert, offline: WifiOff };

function DeviceStatus({ status }) {
  const Icon = deviceStatusIcons[status] || Settings2;
  return <span className={`status-badge status-${status}`}><Icon size={13} aria-hidden="true" />{deviceStatusLabels[status]}</span>;
}

export default function MonitoringPage() {
  const [monitoring, setMonitoring] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('summary');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    let active = true;
    getMonitoring().then((data) => active && setMonitoring(data)).catch(() => active && setError('Unable to load monitoring data.'));
    return () => { active = false; };
  }, []);

  const devices = useMemo(() => {
    if (!monitoring) return [];
    const term = query.trim().toLowerCase();
    return monitoring.devices.filter((device) => (status === 'all' || device.status === status) && (!term || `${device.id} ${device.industry} ${device.station}`.toLowerCase().includes(term)));
  }, [monitoring, query, status]);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!monitoring) return <PageContainer><LoadingState label="Loading monitoring data…" /></PageContainer>;

  return <PageContainer>
    <div className="monitoring-page">
      <header className="monitoring-page-header"><div><p className="eyebrow">DLH · MONITORING</p><h1>Regional Monitoring</h1><p>Stations, device health, and configured water-quality ranges across Pekalongan.</p></div><span className="monitoring-live"><Activity size={16} aria-hidden="true" />Live station overview</span></header>
      <div className="monitoring-tabs" role="tablist" aria-label="Monitoring sections">
        {[['summary', 'Ringkasan Monitoring'], ['devices', 'IoT Devices'], ['parameters', 'Batas Parameter']].map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>)}
      </div>

      {tab === 'summary' && <section className="monitoring-summary-grid" aria-label="Monitoring summary"><article className="monitoring-summary-card"><Activity size={20} aria-hidden="true" /><strong>{monitoring.devices.length}</strong><span>Registered IoT devices</span></article><article className="monitoring-summary-card"><CheckCircle2 size={20} aria-hidden="true" /><strong>{monitoring.devices.filter((device) => device.status === 'active').length}</strong><span>Active connections</span></article><article className="monitoring-summary-card"><CircleAlert size={20} aria-hidden="true" /><strong>{monitoring.devices.filter((device) => device.status === 'unstable').length}</strong><span>Needs attention</span></article><article className="monitoring-summary-card"><WifiOff size={20} aria-hidden="true" /><strong>{monitoring.devices.filter((device) => device.status === 'offline').length}</strong><span>Offline stations</span></article></section>}

      {tab === 'devices' && <section className="web-card" aria-labelledby="devices-title"><div className="web-card-heading"><div><p className="eyebrow">STATION HEALTH</p><h2 id="devices-title">IoT Devices</h2></div><span className="card-meta">{devices.length} of {monitoring.devices.length} shown</span></div><div className="monitoring-toolbar"><label className="monitoring-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search devices, industries, or stations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search device, industry, or station" /></label><label className="monitoring-status-filter"><Filter size={15} aria-hidden="true" /><span className="sr-only">Filter by device status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="unstable">Unstable</option><option value="offline">Offline</option></select></label></div><div className="table-scroll"><table><caption className="sr-only">Regional IoT devices</caption><thead><tr><th>Device ID</th><th>Industry</th><th>Station / site</th><th>Connection</th><th>Last ping</th><th>Firmware</th></tr></thead><tbody>{devices.map((device) => <tr key={device.id}><td><strong>{device.id}</strong></td><td>{device.industry}</td><td>{device.station}</td><td><DeviceStatus status={device.status} /></td><td>{device.lastPing}</td><td>{device.firmware}</td></tr>)}{devices.length === 0 && <tr><td colSpan="6" className="empty-row">No devices match the current filters.</td></tr>}</tbody></table></div></section>}

      {tab === 'parameters' && <section className="web-card" aria-labelledby="parameter-title"><div className="web-card-heading"><div><p className="eyebrow">MONITORING CONFIGURATION</p><h2 id="parameter-title">Batas Parameter</h2></div><span className="card-meta">{monitoring.parameters.length} parameters</span></div><p className="section-note">Configured operational ranges for the monitoring system. Values are demo configuration, not regulatory limits.</p><div className="parameter-grid">{monitoring.parameters.map((parameter) => <article className="parameter-card" key={parameter.key}><div><strong>{parameter.name}</strong><small>{parameter.unit || 'Unitless'}</small></div><b>{parameter.range}</b><span>{parameter.status} · {parameter.basis}</span></article>)}</div></section>}
    </div>
  </PageContainer>;
}
