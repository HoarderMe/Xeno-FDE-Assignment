import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function onboardTenant(payload) {
  const r = await axios.post(`${API_BASE}/tenants/onboard`, payload);
  return r.data;
}
export async function login(tenantId, email) {
  const r = await axios.post(`${API_BASE}/auth/login`, { tenantId, email });
  return r.data;
}
export async function triggerSync(tenantId) {
  const r = await axios.post(`${API_BASE}/sync/sync-full`, { tenantId });
  return r.data;
}
export async function getMetrics(tenantId) {
  const r = await axios.get(`${API_BASE}/sync/metrics/${tenantId}`);
  return r.data;
}
export async function listTenants() {
  const r = await axios.get(`${API_BASE}/tenants`);
  return r.data;
}