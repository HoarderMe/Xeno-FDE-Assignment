import React, { useState, useEffect } from 'react';
import { onboardTenant, login, listTenants } from '../api';

export default function Login({ onLogin }) {
  const [tenants, setTenants] = useState([]);
  const [useOnboard, setUseOnboard] = useState(false);

  const [name, setName] = useState('');
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [email, setEmail] = useState('');
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    listTenants().then(setTenants).catch(()=>{});
  }, []);

  async function handleOnboard(e) {
    e.preventDefault();
    try {
      const res = await onboardTenant({ name, shopDomain, accessToken, email });
      alert('Onboarded tenant id: ' + res.tenant.id);
      onLogin({ token: res.token, tenant: res.tenant });
    } catch (err) {
      alert('Onboard failed: ' + (err.response?.data?.error || err.message));
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await login(tenantId, email);
      onLogin({ token: res.token, tenant: res.tenant });
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div>
      <h2>Xeno FDE — Basic Demo</h2>

      <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <select value={tenantId} onChange={e => setTenantId(e.target.value)}>
            <option value="">-- Select tenant (or use ID) --</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.id} — {t.name || t.shopDomain}</option>)}
          </select><br/>
          <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
          <button type="submit">Login</button>
        </form>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 12 }}>
        <h3>Or Onboard (create tenant)</h3>
        <form onSubmit={handleOnboard}>
          <input placeholder="store name" value={name} onChange={e => setName(e.target.value)} /><br/>
          <input placeholder="shop domain (optional)" value={shopDomain} onChange={e => setShopDomain(e.target.value)} /><br/>
          <input placeholder="admin access token (optional)" value={accessToken} onChange={e => setAccessToken(e.target.value)} /><br/>
          <input placeholder="email (owner)" value={email} onChange={e => setEmail(e.target.value)} /><br/>
          <button type="submit">Onboard & Login</button>
        </form>
      </div>
    </div>
  );
}