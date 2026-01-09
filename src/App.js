import React, { useState } from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import RouteOptimization from './pages/RouteOptimization/RouteOptimization';
import RouteHistory from './pages/RouteHistory/RouteHistory';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
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
      {isLoggedIn ? renderPage() : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;