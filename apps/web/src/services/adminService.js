import { mockAdminSystem } from '../data/mock/admin.js';

export function getAdminSystem() {
  return Promise.resolve({ scope: 'admin', ...mockAdminSystem });
}

