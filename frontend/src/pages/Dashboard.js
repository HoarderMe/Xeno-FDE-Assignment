import React, { useEffect, useState } from 'react';
import { triggerSync, getMetrics } from '../api';
import Charts from '../components/Charts';

export default function Dashboard({ auth, onLogout }) {
  const tenantId = auth.tenant ? auth.tenant.id : auth.tenantId || null;
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadMetrics() {
    if (!tenantId) return;
    setLoading(true);
    try {
      const m = await getMetrics(tenantId);
      setMetrics(m);
    } catch (err) {
      alert('Failed to load metrics');
    }
    setLoading(false);
  }

  useEffect(() => { loadMetrics(); }, []);

  async function handleSync() {
    if (!tenantId) return alert('tenantId missing');
    setLoading(true);
    try {
      await triggerSync(tenantId);
      await loadMetrics();
    } catch (err) {
      alert('Sync failed: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Dashboard — Tenant {tenantId}</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleSync}>Trigger Sync (simulated)</button>
        <button onClick={onLogout} style={{ marginLeft: 8 }}>Logout</button>
      </div>

      {loading && <p>Loading...</p>}

      {metrics && (
        <div>
          <p><strong>Total customers:</strong> {metrics.totalCustomers}</p>
          <p><strong>Total orders:</strong> {metrics.totalOrders}</p>
          <p><strong>Total revenue:</strong> {metrics.totalRevenue}</p>

          <h3>Orders by date</h3>
          <Charts ordersByDate={metrics.ordersByDate} topCustomers={metrics.topCustomers} />
        </div>
      )}
    </div>
  );
}