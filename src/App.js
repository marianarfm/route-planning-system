import React, { useState } from 'react';
import './App.css';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import RouteOptimization from './pages/RouteOptimization/RouteOptimization';
import RouteHistory from './pages/RouteHistory/RouteHistory';

function AppContent() {
  const { user, logout, isLoadingUser } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'routes':
        return <RouteOptimization onNavigate={handleNavigate} />;
      case 'history':
        return <RouteHistory onNavigate={handleNavigate} />;
      default:
        return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
  };

  if (isLoadingUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>Carregando...</h2>
          <p style={{ margin: 0, color: '#666' }}>Verificando autenticação</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? renderPage() : <Login />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;