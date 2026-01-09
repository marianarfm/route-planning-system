import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: 'Rota Centro - Aldeota',
      date: '10/01/2025',
      time: '14:30',
      points: [
        { id: 1, name: 'Cliente A', address: 'Rua das Flores, 123' },
        { id: 2, name: 'Cliente B', address: 'Av. Beira Mar, 456' },
      ],
      distance: '15.3 km',
      duration: '42 min',
      carbon: '3.2 kg CO₂',
      status: 'Concluída'
    },
    {
      id: 2,
      name: 'Rota Messejana',
      date: '10/01/2025',
      time: '10:15',
      points: [
        { id: 1, name: 'Cliente C', address: 'Rua José Vilar, 789' },
      ],
      distance: '12.8 km',
      duration: '35 min',
      carbon: '2.5 kg CO₂',
      status: 'Concluída'
    }
  ]);

  const [currentPoints, setCurrentPoints] = useState([]);

  const login = (email, password) => {
    setUser({
      email: email,
      name: 'Usuário Teste',
      role: 'Operador'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentPoints([]);
  };

  const addPoint = (point) => {
    const newPoint = {
      id: Date.now(),
      name: point.name,
      address: point.address
    };
    setCurrentPoints([...currentPoints, newPoint]);
  };

  const removePoint = (pointId) => {
    setCurrentPoints(currentPoints.filter(p => p.id !== pointId));
  };

  const clearPoints = () => {
    setCurrentPoints([]);
  };

  const saveRoute = (routeData) => {
    const newRoute = {
      id: Date.now(),
      name: routeData.name || `Rota ${routes.length + 1}`,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      points: [...currentPoints],
      distance: routeData.distance,
      duration: routeData.duration,
      carbon: routeData.carbon,
      status: 'Concluída'
    };
    
    setRoutes([newRoute, ...routes]);
    setCurrentPoints([]);
    return newRoute;
  };

  const deleteRoute = (routeId) => {
    setRoutes(routes.filter(r => r.id !== routeId));
  };

  const calculateRoute = () => {
    if (currentPoints.length < 2) {
      return null;
    }

    const distance = (currentPoints.length * 5.1).toFixed(1);
    const duration = (currentPoints.length * 14);
    const carbon = (distance * 0.21).toFixed(1);

    return {
      distance: `${distance} km`,
      duration: `${duration} min`,
      carbon: `${carbon} kg CO₂`
    };
  };

  const value = {
    user,
    routes,
    currentPoints,
    login,
    logout,
    addPoint,
    removePoint,
    clearPoints,
    saveRoute,
    deleteRoute,
    calculateRoute
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};