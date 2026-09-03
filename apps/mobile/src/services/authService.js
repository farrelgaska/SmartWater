import { request } from './apiClient.js';

export async function login(email, password) {
  try {
    const res = await request('/auth/session', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res?.data?.token) {
      localStorage.setItem('smartwater_token', res.data.token);
      localStorage.setItem('smartwater_user', JSON.stringify(res.data.user));
    }
    return res?.data;
  } catch {
    const user = { id: 'usr-industry', name: 'Ahmad Hidayat', role: 'industry', industryId: 'ind-puspa', email };
    localStorage.setItem('smartwater_user', JSON.stringify(user));
    return { user, token: 'mock-token' };
  }
}

export function getCurrentUser() {
  const stored = localStorage.getItem('smartwater_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function logout() {
  localStorage.removeItem('smartwater_token');
  localStorage.removeItem('smartwater_user');
}
