import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, BarChart3, Info, MoreVertical, ShieldCheck } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getMonitoring } from '../../services/monitoringService.js';
import { mobileRoutes } from '../../routes/routePaths.js';

const tabs = [
  { key: 'ph', label: 'pH' },
  { key: 'temperature', label: 'Suhu' },
  { key: 'turbidity', label: 'Kekeruhan' },
  { key: 'tds', label: 'TDS' },
];

function Chart({ parameter }) {
  const values = parameter.history;
  const min = Math.min(...values.map((point) => point.value));
  const max = Math.max(...values.map((point) => point.value));
  const span = max - min || 1;
  const points = values.map((point, index) => (20 + index * (280 / (values.length - 1))) + ',' + (126 - ((point.value - min) / span) * 92)).join(' ');
  return <div className="monitor-chart" role="img" aria-label={'Grafik fluktuasi ' + parameter.label + '. Nilai berkisar ' + parameter.minimum + ' hingga ' + parameter.maximum + ' ' + parameter.unit + '.'}><svg viewBox="0 0 320 150" preserveAspectRatio="none" aria-hidden="true"><path className="monitor-chart-band" d="M0 58 H320 V126 H0 Z" /><path className="monitor-chart-grid" d="M0 58 H320 M0 92 H320 M0 126 H320" /><polyline className="monitor-chart-line" points={points} />{values.map((point, index) => <circle className={point.critical ? 'monitor-chart-dot monitor-chart-dot-critical' : 'monitor-chart-dot'} key={point.label} cx={20 + index * (280 / (values.length - 1))} cy={126 - ((point.value - min) / span) * 92} r="3.4" />)}</svg><div className="monitor-chart-labels">{values.map((point) => <span key={point.label}>{point.label}</span>)}</div></div>;
}

export default function MonitoringPage() {
  const { stationId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [monitoring, setMonitoring] = useState(null);
  const [error, setError] = useState('');
  const [range, setRange] = useState('Hari ini');

  useEffect(() => {
    let active = true;
    getMonitoring(stationId).then((data) => {
      if (active) setMonitoring(data);
    }).catch(() => {
      if (active) setError('Data monitoring belum dapat dimuat.');
    });
    return () => { active = false; };
  }, [stationId]);

  const selectedKey = searchParams.get('parameter');
  const parameter = useMemo(() => {
    const available = monitoring?.parameters ?? [];
    return available.find((item) => item.key === selectedKey) ?? available[0];
  }, [monitoring, selectedKey]);

  function selectParameter(key) {
    setSearchParams({ parameter: key });
  }

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!monitoring || !parameter) return <PageContainer><LoadingState label="Memuat detail monitoring" /></PageContainer>;

  return (
    <PageContainer>
      <header className="monitor-header"><Link className="monitor-back" to={mobileRoutes.industry} aria-label="Kembali ke dashboard industri"><ArrowLeft size={22} /></Link><div><h1>Detail Monitoring</h1><p>{monitoring.station.deviceId.toUpperCase()}</p></div><button className="monitor-menu" type="button" aria-label="Opsi monitoring"><MoreVertical size={21} /></button></header>
      <div className="monitor-tabs" role="tablist" aria-label="Pilih parameter"><div className="monitor-tabs-scroll">{tabs.map((tab) => <button className={'monitor-tab' + (parameter.key === tab.key ? ' monitor-tab-active' : '')} key={tab.key} type="button" role="tab" aria-selected={parameter.key === tab.key} onClick={() => selectParameter(tab.key)}>{tab.label}</button>)}</div></div>
      <div className="monitor-range" aria-label="Rentang waktu"><div className="monitor-range-scroll">{['Hari ini', '7 Hari', '30 Hari'].map((option) => <button className={'range-chip' + (range === option ? ' range-chip-active' : '')} key={option} type="button" onClick={() => setRange(option)}>{option}</button>)}</div></div>
      <section className="monitor-reading-card" aria-labelledby="reading-title"><p id="reading-title">Pembacaan Terakhir</p><strong>{parameter.current} <span>{parameter.unit}</span></strong><span className={'monitor-state monitor-state-' + (parameter.state === 'NORMAL' ? 'normal' : 'warning')}><span aria-hidden="true">△</span> {parameter.state} <b>{parameter.context}</b></span><div className="monitor-wave" aria-hidden="true">〰〰〰</div></section>
      <section className="monitor-chart-card" aria-labelledby="chart-title"><div className="monitor-card-heading"><h2 id="chart-title">Grafik Fluktuasi {parameter.label}</h2><span>Batas: {parameter.band}</span></div><Chart parameter={parameter} /></section>
      <section className="monitor-stats" aria-label="Ringkasan statistik"><div className="monitor-stat-card"><ArrowDown size={18} aria-hidden="true" /><span>Minimum</span><strong>{parameter.minimum}<small> {parameter.unit}</small></strong></div><div className="monitor-stat-card"><ArrowUp size={18} aria-hidden="true" /><span>Maximum</span><strong>{parameter.maximum}<small> {parameter.unit}</small></strong></div><div className="monitor-stat-card"><BarChart3 size={18} aria-hidden="true" /><span>Rata-rata</span><strong>{parameter.average}<small> {parameter.unit}</small></strong></div><div className="monitor-stat-card monitor-stat-health"><ShieldCheck size={18} aria-hidden="true" /><span>Sensor Health</span><strong>{parameter.health}%</strong></div></section>
      <section className="monitor-recommendation" aria-labelledby="recommendation-title"><Info size={21} aria-hidden="true" /><div><h2 id="recommendation-title">Saran Penanganan</h2><p>{parameter.recommendation}</p></div></section>
    </PageContainer>
  );
}
