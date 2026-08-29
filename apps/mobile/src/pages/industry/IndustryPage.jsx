import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, BrainCircuit, ChevronRight, Droplets, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getIndustryDashboard } from '../../services/monitoringService.js';
import { mobileRoutes } from '../../routes/routePaths.js';

const parameterCards = [
  { key: 'ph', label: 'pH Air', statusLabel: 'RENDAH', tone: 'warning', icon: '↘' },
  { key: 'temperature', label: 'Suhu', statusLabel: 'NORMAL', tone: 'normal', icon: '—' },
  { key: 'turbidity', label: 'Kekeruhan', statusLabel: 'TINGGI', tone: 'warning', icon: '↗' },
  { key: 'tds', label: 'TDS', statusLabel: 'NORMAL', tone: 'normal', icon: '—' },
];

export default function IndustryPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getIndustryDashboard().then((data) => {
      if (active) setDashboard(data);
    }).catch(() => {
      if (active) setError('Dashboard belum dapat dimuat. Coba lagi nanti.');
    });
    return () => { active = false; };
  }, []);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!dashboard) return <PageContainer><LoadingState label="Memuat dashboard" /></PageContainer>;

  const { industry, station, readings, alerts, analysis, trend } = dashboard;
  const readingByKey = Object.fromEntries(readings.map((reading) => [reading.parameterKey, reading]));
  const latestAlert = alerts[0];

  return (
    <PageContainer>
      <header className="industry-welcome">
        <p className="industry-greeting">Selamat pagi, Pak Budi</p>
        <p className="industry-name"><Droplets size={15} aria-hidden="true" /> {industry.name}, {industry.city}</p>
      </header>
      <section className="industry-condition-card" aria-labelledby="condition-title">
        <div className="industry-condition-meta"><span className="industry-status-pill warning"><AlertTriangle size={14} aria-hidden="true" /> STATUS: WASPADA</span><span className="industry-online"><Radio size={12} aria-hidden="true" /> ONLINE ({station.deviceId.toUpperCase()})</span></div>
        <h1 id="condition-title">Kualitas air menurun karena tingkat kekeruhan meningkat.</h1>
      </section>
      <section aria-labelledby="parameter-title">
        <h2 className="sr-only" id="parameter-title">Parameter kualitas air saat ini</h2>
        <div className="parameter-grid">
          {parameterCards.map((card) => {
            const reading = readingByKey[card.key];
            return <Link className={'parameter-card parameter-card-' + card.tone} key={card.key} to={mobileRoutes.monitoring.replace(':stationId', station.id) + '?parameter=' + card.key} aria-label={'Buka detail ' + card.label}><div className="parameter-card-top"><span>{card.label}</span><span className="parameter-trend" aria-hidden="true">{card.icon}</span></div><strong>{reading.value} {reading.displayUnit ?? reading.unit}</strong><span className={'parameter-status ' + card.tone}>{card.statusLabel}</span></Link>;
          })}
        </div>
      </section>
      <section className="industry-ai-card" aria-labelledby="ai-summary-title">
        <div className="industry-ai-heading"><BrainCircuit size={19} aria-hidden="true" /><span id="ai-summary-title">RINGKASAN AI</span></div>
        <p>Risiko tinggi dalam {analysis.horizonHours} jam ke depan</p>
        <Link className="industry-ai-link" to={mobileRoutes.aiAnalysis.replace(':analysisId', analysis.id)}>Lihat Analisis AI <ArrowRight size={19} aria-hidden="true" /></Link>
      </section>
      <section className="industry-section" aria-labelledby="trend-title">
        <div className="industry-section-heading"><h2 id="trend-title">TREN KEKERUHAN (24 JAM)</h2></div>
        <div className="trend-card" role="img" aria-label="Grafik batang tren kekeruhan selama 24 jam, meningkat hingga 87 NTU pada pembacaan terakhir."><div className="trend-bars">{trend.map((point) => <span className={'trend-bar' + (point.highlight ? ' trend-bar-highlight' : '')} key={point.label} style={{ height: Math.max(18, point.value) + '%' }} title={point.label + ': ' + point.value + ' NTU'} />)}</div></div>
      </section>
      <section className="industry-section" aria-labelledby="alerts-title">
        <div className="industry-section-heading"><h2 id="alerts-title">PERINGATAN TERBARU</h2><Link to={mobileRoutes.alerts}>Lihat Semua</Link></div>
        {latestAlert && <Link className="recent-alert-card" to={mobileRoutes.alertDetail.replace(':alertId', latestAlert.id)}><span className="recent-alert-icon" aria-hidden="true"><AlertTriangle size={20} /></span><span className="recent-alert-content"><strong>{latestAlert.title}</strong><span>{latestAlert.status === 'new' ? 'Belum Ditangani' : latestAlert.statusLabel}</span></span><time dateTime={latestAlert.triggeredAt}>{latestAlert.relativeTime}</time><ChevronRight size={17} aria-hidden="true" /></Link>}
      </section>
    </PageContainer>
  );
}


