import { useEffect, useState } from 'react';
import AppLayout from './components/AppLayout.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import ReportsPage from './components/ReportsPage.jsx';
import SparePartsPage from './components/SparePartsPage.jsx';
import TransactionsPage from './components/TransactionsPage.jsx';
import { api, getToken, saveToken } from './services/api.js';

const pageComponents = {
  dashboard: (user) => <DashboardPage key="dashboard" user={user} />,
  parts: (user) => <SparePartsPage key="parts" isAdmin={user.role === 'admin'} />,
  transactions: (user) => <TransactionsPage key="transactions" isAdmin={user.role === 'admin'} />,
  reports: () => <ReportsPage key="reports" />
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [checkingSession, setCheckingSession] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me').then((result) => setUser(result.user)).catch(() => {
      saveToken(null);
      setUser(null);
    }).finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setPage('dashboard');
    }
    window.addEventListener('abadi:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('abadi:unauthorized', handleUnauthorized);
  }, []);

  function logout() {
    saveToken(null);
    setUser(null);
    setPage('dashboard');
  }

  if (checkingSession) return <main className="loading-screen">Memeriksa sesi...</main>;
  if (!user) return <LoginPage onLogin={(authenticatedUser) => { setUser(authenticatedUser); setPage('dashboard'); }} />;

  return (
    <AppLayout user={user} page={page} setPage={setPage} onLogout={logout}>
      {pageComponents[page](user)}
    </AppLayout>
  );
}
