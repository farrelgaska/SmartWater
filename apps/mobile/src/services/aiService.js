import { mockIndustry } from '../data/mock/industry.js';

export function getAIAnalysis(analysisId) {
  return Promise.resolve(mockIndustry.analysis.id === analysisId ? mockIndustry.analysis : null);
}
