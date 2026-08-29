import { mockIndustry } from '../data/mock/industry.js';

export function getIndustryDashboard() {
  return Promise.resolve(mockIndustry);
}

export function getMonitoring(stationId) {
  return Promise.resolve({ ...mockIndustry, station: { ...mockIndustry.station, id: stationId }, parameters: mockIndustry.monitoringParameters });
}
