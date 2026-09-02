import { useEffect, useState } from 'react';
import { AlertTriangle, Brain, CheckCircle2, MapPin } from 'lucide-react';
import PageContainer from '../../components/common/PageContainer.jsx';
import LoadingState from '../../components/feedback/LoadingState.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getDlhDashboard } from '../../services/dlhService.js';

export default function AIAnalysisPage() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getDlhDashboard().then((data) => active && setAnalysis(data.aiAnalysis)).catch(() => active && setError('Unable to load the regional AI analysis.'));
    return () => { active = false; };
  }, []);

  if (error) return <PageContainer><ErrorState message={error} /></PageContainer>;
  if (!analysis) return <PageContainer><LoadingState label="Loading regional AI analysis…" /></PageContainer>;

  return <PageContainer><div className="ai-analysis-page"><header className="ai-analysis-header"><div><p className="eyebrow">DLH · AI DECISION SUPPORT</p><h1>Regional AI Analysis</h1><p>Cross-industry prediction and evidence for human review across Pekalongan.</p></div><span className="ai-analysis-fresh"><CheckCircle2 size={16} aria-hidden="true" />Updated just now</span></header><section className="ai-risk-hero" aria-labelledby="regional-risk-title"><div className="ai-risk-icon"><Brain size={24} aria-hidden="true" /></div><div><p className="eyebrow">NEXT {analysis.horizonHours} HOURS FORECAST</p><h2 id="regional-risk-title">Medium-high regional risk</h2><p>{analysis.summary}</p></div><strong aria-label={`${analysis.riskScore}% predicted risk`}>{analysis.riskScore}%</strong></section><div className="ai-analysis-grid"><section className="web-card" aria-labelledby="factors-title"><div className="web-card-heading"><h2 id="factors-title">Anomaly factors</h2><span className="card-meta">Evidence signals</span></div><div className="ai-factor-list">{analysis.factors.map((factor) => <article className="ai-factor" key={factor.label}><AlertTriangle size={17} aria-hidden="true" /><div><strong>{factor.label}</strong><p>{factor.detail}</p></div><b>{factor.contribution}</b></article>)}</div></section><section className="web-card" aria-labelledby="affected-title"><div className="web-card-heading"><h2 id="affected-title">Affected locations</h2><span className="card-meta">Regional scope</span></div><ul className="ai-affected-list">{analysis.affected.map((item) => <li key={item}><MapPin size={16} aria-hidden="true" />{item}</li>)}</ul></section></div><section className="web-card" aria-labelledby="recommendation-title"><div className="web-card-heading"><h2 id="recommendation-title">Mitigation guidance</h2><span className="card-meta">Human review required</span></div><ol className="ai-recommendation-list">{analysis.recommendations.map((item) => <li key={item}>{item}</li>)}</ol><p className="ai-disclaimer">AI results support decisions and do not operate treatment equipment or enforce compliance.</p></section></div></PageContainer>;
}
