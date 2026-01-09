import React, { useState } from 'react';
import './App.css';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import RouteOptimization from './pages/RouteOptimization/RouteOptimization';
import RouteHistory from './pages/RouteHistory/RouteHistory';

function AppContent() {
  const { user, logout } = useApp();
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