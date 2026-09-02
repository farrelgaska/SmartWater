import { mockMonitoring } from '../data/mock/monitoring.js';

export function getMonitoring() {
  return Promise.resolve(mockMonitoring);
}
