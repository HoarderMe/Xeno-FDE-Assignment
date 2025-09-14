import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Charts({ ordersByDate = [], topCustomers = [] }) {
  const labels = ordersByDate.map(r => r.date || r.date?.slice?.(0,10));
  const counts = ordersByDate.map(r => Number(r.count || 0));
  const revenue = ordersByDate.map(r => Number(r.revenue || 0));

  const lineData = { labels, datasets: [
    { label: 'Orders', data: counts, fill: false, tension: 0.2 },
    { label: 'Revenue', data: revenue, fill: false, tension: 0.2 }
  ]};

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 20 }}>
        <Line data={lineData} />
      </div>

      <div>
        <h4>Top 5 customers by spend</h4>
        <ol>
          {topCustomers.map(c => (
            <li key={c.id}>{c.firstName || 'N/A'} {c.lastName || ''} — {c.total_spend || 0}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}