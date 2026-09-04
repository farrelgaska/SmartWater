import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, CircleHelp, Settings2, Users, X } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getAdminSystem } from '../../services/adminService.js';

function SummaryCard({ label, value, detail, tone }) {
  const Icon = tone === 'health' ? Activity : tone === 'users' ? Users : tone === 'failed' ? CircleAlert : Settings2;
  return <article className={`admin-summary-card admin-summary-${tone}`}><div className="admin-summary-icon"><Icon size={18} aria-hidden="true" /></div><p>{label}</p><strong>{value}</strong><small>{detail}</small></article>;
}

export default function SystemPage() {
  const [system, setSystem] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('users');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getAdminSystem().then((data) => active && setSystem(data)).catch(() => active && setError('Unable to load system administration data.'));
    return () => { active = false; };
  }, []);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!system) return <PageContainer><LoadingState label="Loading system administration…" /></PageContainer>;

  const notify = (text) => { setMessage(text); window.setTimeout(() => setMessage(''), 2800); };

  return <PageContainer><div className="admin-system-page"><header className="admin-page-header"><div><p className="eyebrow">ADMINISTRATOR · SYSTEM ADMIN</p><h1>System Admin</h1><p>Manage platform users, access roles, and system health for SmartWater.</p></div><span className="admin-scope"><CheckCircle2 size={16} aria-hidden="true" />Administrator scope</span></header><section className="admin-summary-grid" aria-label="System summary"><SummaryCard label="Connected Nodes" value={system.summary.connectedNodes.value} detail={system.summary.connectedNodes.detail} tone="devices" /><SummaryCard label="System Health" value={system.summary.systemHealth.value} detail={system.summary.systemHealth.detail} tone="health" /><SummaryCard label="Failed Nodes" value={system.summary.failedNodes.value} detail={system.summary.failedNodes.detail} tone="failed" /><SummaryCard label="Active Users" value={system.summary.activeUsers.value} detail={system.summary.activeUsers.detail} tone="users" /></section><section className="admin-card" aria-labelledby="management-title"><div className="admin-card-heading"><div><p className="eyebrow">PLATFORM ACCESS</p><h2 id="management-title">Management console</h2></div></div><div className="admin-tabs" role="tablist" aria-label="System administration sections"><button type="button" role="tab" aria-selected={tab === 'users'} className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>User Management</button><button type="button" role="tab" aria-selected={tab === 'access'} className={tab === 'access' ? 'active' : ''} onClick={() => setTab('access')}>Access Configuration</button></div>{tab === 'users' && <div role="tabpanel" className="admin-tab-panel"><div className="admin-panel-intro"><Users size={20} aria-hidden="true" /><p>Active platform accounts and role assignments for the SmartWater platform.</p></div><div className="admin-user-grid">{system.users.map((user) => <article className="admin-user-row" key={user.id}><div><strong>{user.name}</strong><small>{user.email}</small></div><span>{user.role}</span><span className="status-badge status-active"><CheckCircle2 size={13} aria-hidden="true" />Active</span></article>)}</div></div>}{tab === 'access' && <div role="tabpanel" className="admin-tab-panel"><div className="admin-panel-intro"><Settings2 size={20} aria-hidden="true" /><p>Role access is limited to the documented Administrator, DLH, and Industry responsibilities.</p></div><button type="button" className="admin-row-action" onClick={() => notify('Access configuration is ready for administrator review.')}>Review access policy</button></div>}</section>{message && <div className="admin-toast" role="status"><CircleHelp size={16} aria-hidden="true" />{message}<button type="button" aria-label="Dismiss message" onClick={() => setMessage('')}><X size={14} aria-hidden="true" /></button></div>}</div></PageContainer>;
}
