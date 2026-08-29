import { useEffect, useState } from 'react';
import { BrainCircuit, Clock3, Droplets, FlaskConical, History, ListChecks, Send, ShieldAlert } from 'lucide-react';
import { useParams } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getAIAnalysis } from '../../services/aiService.js';

function FactorIcon({ factor }) {
  if (factor.parameterKey === 'turbidity') return <Droplets size={20} />;
  if (factor.parameterKey === 'ph') return <FlaskConical size={20} />;
  return <History size={20} />;
}

export default function AIAnalysisPage() {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getAIAnalysis(analysisId).then((data) => {
      if (active) {
        setAnalysis(data);
        setChecked(Object.fromEntries((data?.recommendations ?? []).map((item) => [item.id, item.status === 'completed'])));
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [analysisId]);

  function toggleRecommendation(id) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
    setMessage('');
  }

  if (loading) return <PageContainer><LoadingState label="Memuat analisis AI" /></PageContainer>;
  if (!analysis) return <PageContainer><ErrorState message="Analisis AI tidak ditemukan atau tidak dapat diakses." /></PageContainer>;

  return (
    <PageContainer>
      <header className="ai-report-header"><span className="ai-report-icon"><BrainCircuit size={23} aria-hidden="true" /></span><div><h1>AI Analysis Report</h1><p>Last updated: Just now</p></div></header>

      <section className="ai-risk-card" aria-labelledby="risk-title">
        <p id="risk-title">CURRENT RISK LEVEL</p>
        <div className="ai-risk-meter" aria-hidden="true"><div className="ai-risk-score">{analysis.riskScore}%</div></div>
        <span className="ai-risk-label">{analysis.riskLabel}</span>
        <p className="ai-forecast"><Clock3 size={15} aria-hidden="true" /> Forecast: {analysis.horizonHours} Jam Ke Depan</p>
        <span className="sr-only">Risiko saat ini {analysis.riskScore} persen, tingkat {analysis.riskLabel}, untuk perkiraan {analysis.horizonHours} jam ke depan.</span>
      </section>

      <section className="ai-factors" aria-labelledby="factors-title">
        <h2 id="factors-title"><ShieldAlert size={21} aria-hidden="true" /> Anomaly Factors</h2>
        <div className="ai-factor-list">{analysis.anomalyFactors.map((factor) => <article className="ai-factor-card" key={factor.rank}><span className="ai-factor-icon" aria-hidden="true"><FactorIcon factor={factor} /></span><div><h3>{factor.rank}. {factor.label}</h3><p>{factor.detail}</p></div><strong>{factor.contribution !== null ? '+' + factor.contribution + '%' : factor.observedValue + ' ' + factor.unit}</strong></article>)}</div>
      </section>

      <section className="ai-checklist" aria-labelledby="checklist-title">
        <h2 id="checklist-title"><ListChecks size={21} aria-hidden="true" /> Mitigation Checklist</h2>
        <p className="ai-checklist-note">Tandai hanya setelah langkah manusia ditinjau atau dilakukan.</p>
        <div className="ai-checklist-items">{analysis.recommendations.map((item) => <label className="ai-checklist-item" key={item.id}><input type="checkbox" checked={Boolean(checked[item.id])} onChange={() => toggleRecommendation(item.id)} /><span className={checked[item.id] ? 'ai-checklist-complete' : ''}>{item.title}</span></label>)}</div>
        <button className="ai-review-button" type="button" onClick={() => setMessage('Checklist lokal telah dikonfirmasi untuk tinjauan operator.')}><Send size={18} aria-hidden="true" /> Konfirmasi Checklist</button>
        {message && <p className="ai-checklist-message" role="status">{message}</p>}
      </section>

      <aside className="ai-disclaimer"><strong>Decision Support Disclaimer:</strong> {analysis.disclaimer}</aside>
    </PageContainer>
  );
}
