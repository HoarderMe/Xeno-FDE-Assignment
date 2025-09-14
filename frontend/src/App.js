import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  });

  function handleLogin(tokenObj) {
    localStorage.setItem('auth', JSON.stringify(tokenObj));
    setAuth(tokenObj);
  }

  function handleLogout() {
    localStorage.removeItem('auth');
    setAuth(null);
  }

  return (
    <div className="container">
      {auth ? <Dashboard auth={auth} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;