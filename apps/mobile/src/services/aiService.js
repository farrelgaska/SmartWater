import { request } from './apiClient.js';
import { mockIndustry } from '../data/mock/industry.js';

export async function getAIAnalysis(analysisId) {
  try {
    const res = await request(`/industry/ai-analyses/${analysisId}`);
    if (!res?.data?.analysis) {
      return mockIndustry.analysis.id === analysisId ? mockIndustry.analysis : mockIndustry.analysis;
    }

    const a = res.data.analysis;
    return {
      id: a.id,
      industryId: a.industryId,
      stationId: a.stationId,
      generatedAt: a.generatedAt,
      horizonHours: a.horizonHours,
      riskLevel: a.riskLevel,
      riskLabel: a.riskLevel === 'critical' ? 'TINGGI' : a.riskLevel === 'warning' ? 'SEDANG' : 'NORMAL',
      riskScore: Math.round(a.riskScore || 20),
      summary: a.summary,
      relatedAlertId: a.relatedAlertId,
      anomalyFactors: (a.anomalyFactors && a.anomalyFactors.length > 0)
        ? a.anomalyFactors.map((f) => ({
            rank: f.rank,
            parameterKey: f.parameterKey,
            label: f.label,
            detail: f.explanation,
            observedValue: `${f.observedValue} ${f.unit}`,
            unit: f.unit,
            direction: f.direction,
            contribution: f.contribution || 20,
          }))
        : mockIndustry.analysis.anomalyFactors,
      recommendations: (a.recommendations && a.recommendations.length > 0)
        ? a.recommendations.map((r) => ({
            id: r.id,
            title: r.title,
            status: r.status,
            executionMode: 'human-checklist',
          }))
        : mockIndustry.analysis.recommendations,
      disclaimer: 'Analisis AI bersifat pendukung keputusan. Keputusan operasional akhir harus diverifikasi oleh petugas atau tenaga lingkungan yang berwenang.',
    };
  } catch (err) {
    console.warn('[SmartWater] Fallback to mock AI analysis:', err);
    return mockIndustry.analysis.id === analysisId ? mockIndustry.analysis : mockIndustry.analysis;
  }
}

export async function updateRecommendation(recommendationId, status) {
  try {
    const res = await request(`/industry/recommendations/${recommendationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res?.data?.recommendation;
  } catch (err) {
    console.warn(`[SmartWater] Error updating recommendation ${recommendationId}:`, err);
    return { id: recommendationId, status };
  }
}


