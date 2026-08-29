import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, CircleHelp, Filter, Plus, Search, Settings2, Users, WifiOff, X } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getAdminSystem } from '../../services/adminService.js';

const statusLabels = { active: 'Active', unstable: 'Unstable', offline: 'Offline' };
const statusIcons = { active: CheckCircle2, unstable: CircleAlert, offline: WifiOff };

function SummaryCard({ label, value, detail, tone }) {
  const Icon = tone === 'health' ? Activity : tone === 'users' ? Users : tone === 'failed' ? CircleAlert : Settings2;
  return <article className={`admin-summary-card admin-summary-${tone}`}><div className="admin-summary-icon"><Icon size={18} aria-hidden="true" /></div><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>;
}

function DeviceStatus({ status }) {
  const Icon = statusIcons[status] || Settings2;
  return <span className={`status-badge status-${status}`}><Icon size={13} aria-hidden="true" />{statusLabels[status]}</span>;
}

export default function SystemPage() {
  const [system, setSystem] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('devices');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [provisioning, setProvisioning] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getAdminSystem().then((data) => active && setSystem(data)).catch(() => active && setError('Unable to load system management data.'));
    return () => { active = false; };
  }, []);

  const devices = useMemo(() => {
    if (!system) return [];
    const term = query.trim().toLowerCase();
    return system.devices.filter((device) => (status === 'all' || device.status === status) && (!term || `${device.id} ${device.industry}`.toLowerCase().includes(term)));
  }, [system, query, status]);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!system) return <PageContainer><LoadingState label="Loading system management…" /></PageContainer>;

  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2800); };

  return <PageContainer>
    <div className="admin-system-page">
      <header className="admin-page-header"><div><p className="eyebrow">ADMINISTRATOR · SYSTEM MANAGEMENT</p><h1>System Management</h1><p>Platform health, connected devices, and access configuration for SmartWater.</p></div><button type="button" className="admin-provision-button" onClick={() => setProvisioning(true)}><Plus size={17} aria-hidden="true" />Provision New Device</button></header>

      <section className="admin-summary-grid" aria-label="System summary">
        <SummaryCard label="Active Devices" value={system.summary.activeDevices.value} detail={system.summary.activeDevices.detail} tone="devices" />
        <SummaryCard label="System Health" value={system.summary.systemHealth.value} detail={system.summary.systemHealth.detail} tone="health" />
        <SummaryCard label="Failed Nodes" value={system.summary.failedNodes.value} detail={system.summary.failedNodes.detail} tone="failed" />
        <SummaryCard label="Active Users" value={system.summary.activeUsers.value} detail={system.summary.activeUsers.detail} tone="users" />
      </section>

      <section className="admin-card" aria-labelledby="management-title"><div className="admin-card-heading"><div><p className="eyebrow">PLATFORM ADMINISTRATION</p><h2 id="management-title">Management console</h2></div></div><div className="admin-tabs" role="tablist" aria-label="System management sections"><button type="button" role="tab" aria-selected={tab === 'users'} className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>User Management</button><button type="button" role="tab" aria-selected={tab === 'devices'} className={tab === 'devices' ? 'active' : ''} onClick={() => setTab('devices')}>IoT Devices <span>Active</span></button><button type="button" role="tab" aria-selected={tab === 'thresholds'} className={tab === 'thresholds' ? 'active' : ''} onClick={() => setTab('thresholds')}>Threshold Rules</button></div>

      {tab === 'devices' && <div role="tabpanel" className="admin-tab-panel"><div className="admin-toolbar"><label className="admin-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search devices or industries</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search device or industry" /></label><label className="admin-status-filter"><span className="sr-only">Filter by device status</span><Filter size={15} aria-hidden="true" /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="unstable">Unstable</option><option value="offline">Offline</option></select></label></div><div className="admin-table-scroll"><table><caption className="sr-only">Connected IoT devices</caption><thead><tr><th>Device ID</th><th>Assigned Industry</th><th>Connection Status</th><th>Last Ping</th><th>Firmware</th><th>Actions</th></tr></thead><tbody>{devices.map((device) => <tr key={device.id}><td><strong>{device.id}</strong></td><td>{device.industry}</td><td><DeviceStatus status={device.status} /></td><td>{device.lastPing}</td><td>{device.firmware}</td><td><button type="button" className="admin-row-action" onClick={() => notify(`Inspecting ${device.id} locally.`)}>View details</button></td></tr>)}{devices.length === 0 && <tr><td colSpan="6" className="admin-empty-row">No devices match the current search and status filter.</td></tr>}</tbody></table></div><div className="admin-table-footer"><span>Showing {devices.length} of {system.devices.length} devices</span><span>Page 1 of 1</span></div></div>}

      {tab === 'users' && <div role="tabpanel" className="admin-tab-panel"><div className="admin-panel-intro"><Users size={20} aria-hidden="true" /><p>Active platform accounts and role assignments for the SmartWater platform.</p></div><div className="admin-user-grid">{system.users.map((user) => <article className="admin-user-row" key={user.id}><div><strong>{user.name}</strong><small>{user.email}</small></div><span>{user.role}</span><DeviceStatus status={user.status} /></article>)}</div></div>}

      {tab === 'thresholds' && <div role="tabpanel" className="admin-tab-panel"><div className="admin-panel-intro"><Settings2 size={20} aria-hidden="true" /><p>Threshold Rules are demo configuration metadata only and are not statutory or regulatory limits.</p></div><div className="admin-threshold-list">{system.thresholdRules.map((rule) => <div className="admin-threshold-row" key={rule.id}><strong>{rule.name}</strong><span>{rule.value}{rule.unit && ` ${rule.unit}`}</span><small>{rule.basis}</small></div>)}</div></div>}
      </section>

      {provisioning && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setProvisioning(false)}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="provision-title"><button type="button" className="admin-modal-close" aria-label="Close provisioning dialog" onClick={() => setProvisioning(false)}><X size={18} aria-hidden="true" /></button><p className="eyebrow">PROVISION DEVICE</p><h2 id="provision-title">Provision New Device</h2><p>Complete these details to prepare a provisioning request.</p><label>Device ID<input placeholder="e.g. SW-ESP32-060" /></label><label>Assign to industry<select><option>PT. Pekalongan Textindo</option><option>Batik Sejahtera Abadi</option><option>Mandiri Dyeworks</option></select></label><button type="button" className="admin-provision-button" onClick={() => { setProvisioning(false); notify('Provisioning request queued for review.'); }}>Save request</button></section></div>}

      {message && <div className="admin-toast" role="status"><CircleHelp size={16} aria-hidden="true" />{message}<button type="button" aria-label="Dismiss message" onClick={() => setMessage('')}><X size={14} aria-hidden="true" /></button></div>}
    </div>
  </PageContainer>;
}


