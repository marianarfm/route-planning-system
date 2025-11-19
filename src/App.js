import React, { useState } from 'react';
import './App.css';
import Login from './pages/Login/Login';
import RouteOptimization from './pages/RouteOptimization/RouteOptimization';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? <RouteOptimization onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
