const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('smartwater_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.detail?.message || `HTTP ${response.status}: Request failed`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (err) {
    console.warn(`[SmartWater API] Error calling ${endpoint}:`, err.message);
    throw err;
  }
}
