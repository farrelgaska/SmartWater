import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronRight, Clock3, Search, Thermometer, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getAlerts } from '../../services/alertsService.js';
import { mobileRoutes } from '../../routes/routePaths.js';

const filters = [
  { key: 'all', label: 'Semua' },
  { key: 'critical', label: 'Merah' },
  { key: 'warning', label: 'Amber' },
  { key: 'resolved', label: 'Terselesa(i)' },
];

const lifecycleLabels = { new: 'BARU', acknowledged: 'DIKETAHUI', resolved: 'SELESAI' };

function AlertIcon({ alert }) {
  if (alert.parameterKeys[0] === 'temperature') return <Thermometer size={22} />;
  if (alert.parameterKeys[0] === 'turbidity') return <Waves size={22} />;
  return <Bell size={22} />;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    getAlerts().then((data) => {
      if (active) setAlerts(data);
    }).catch(() => {
      if (active) setError('Peringatan belum dapat dimuat.');
    });
    return () => { active = false; };
  }, []);

  const filteredAlerts = useMemo(() => {
    if (!alerts) return [];
    const normalizedQuery = query.trim().toLowerCase();
    return alerts.filter((alert) => {
      const matchesFilter = filter === 'all' || (filter === 'resolved' ? alert.status === 'resolved' : alert.severity === filter);
      const searchable = [alert.id, alert.title, alert.sensorLabel, alert.parameterLabel].join(' ').toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [alerts, filter, query]);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!alerts) return <PageContainer><LoadingState label="Memuat peringatan" /></PageContainer>;

  return (
    <PageContainer>
      <header className="alerts-page-header"><div><p className="alerts-eyebrow">SmartWater</p><h1>Daftar Peringatan</h1></div><Bell size={21} aria-hidden="true" /></header>
      <label className="alerts-search"><Search size={19} aria-hidden="true" /><span className="sr-only">Cari peringatan</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari ID Peringatan..." /></label>
      <div className="alert-filters" role="tablist" aria-label="Filter peringatan">{filters.map((item) => <button className={'alert-filter' + (filter === item.key ? ' alert-filter-active alert-filter-' + item.key : '')} key={item.key} type="button" role="tab" aria-selected={filter === item.key} onClick={() => setFilter(item.key)}>{item.key === 'critical' && '! '}{item.key === 'warning' && '△ '}{item.label}</button>)}</div>
      <section className="alerts-list" aria-live="polite" aria-label="Daftar peringatan tersaring">
        {filteredAlerts.length ? filteredAlerts.map((alert) => <Link className={'alert-list-card alert-list-' + alert.severity} key={alert.id} to={mobileRoutes.alertDetail.replace(':alertId', alert.id)}><div className="alert-list-top"><strong>#{alert.id}</strong><span className={'lifecycle-badge lifecycle-' + alert.status}>{lifecycleLabels[alert.status]}</span></div><div className="alert-list-main"><span className={'alert-icon alert-icon-' + alert.severity}><AlertIcon alert={alert} /></span><span className="alert-list-copy"><strong>{alert.title}</strong><span>Sensor: {alert.sensorLabel}</span></span><ChevronRight size={19} aria-hidden="true" /></div><div className="alert-list-footer"><span><Clock3 size={13} aria-hidden="true" /> {alert.relativeTime}</span>{alert.value !== null && <strong className={'alert-value alert-value-' + alert.severity}>{alert.value} {alert.unit}</strong>}</div></Link>) : <p className="feedback">Tidak ada peringatan yang sesuai.</p>}
      </section>
    </PageContainer>
  );
}

