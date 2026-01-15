import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, routesAPI, statsAPI, getToken } from '../services/api';

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
  const [routes, setRoutes] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [stats, setStats] = useState({
    total_routes: 0,
    total_distance: 0,
    total_duration: 0,
    total_carbon: 0
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        await loadRoutes();
        await loadStats();
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        authAPI.logout();
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const loadRoutes = async () => {
    try {
      const routesData = await routesAPI.getAll();
      setRoutes(routesData);
    } catch (error) {
      console.error('Erro ao carregar rotas:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await statsAPI.get();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      setUser(data.user);
      await loadRoutes();
      await loadStats();
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setRoutes([]);
    setCurrentPoints([]);
    setStats({
      total_routes: 0,
      total_distance: 0,
      total_duration: 0,
      total_carbon: 0
    });
  };

  const addPoint = (point) => {
    const newPoint = {
      name: point.name,
      address: point.address,
      latitude: point.latitude || null,
      longitude: point.longitude || null
    };
    setCurrentPoints([...currentPoints, newPoint]);
  };

  const removePoint = (pointIndex) => {
    setCurrentPoints(currentPoints.filter((_, index) => index !== pointIndex));
  };

  const clearPoints = () => {
    setCurrentPoints([]);
  };

  const calculateRoute = async () => {
    if (currentPoints.length < 2) {
      return null;
    }

    try {
      const result = await routesAPI.calculate(currentPoints);
      return {
        optimized_points: result.optimized_points,
        distance: `${result.total_distance} km`,
        duration: `${result.total_duration} min`,
        carbon: `${result.carbon_footprint} kg CO₂`,
        total_distance: result.total_distance,
        total_duration: result.total_duration,
        carbon_footprint: result.carbon_footprint
      };
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      return null;
    }
  };

  const saveRoute = async (routeData, optimizedPoints = null, routeStats = null) => {
    try {
      const dataToSend = {
        name: routeData.name,
        points: optimizedPoints || currentPoints
      };

      if (routeStats) {
        dataToSend.total_distance = routeStats.total_distance;
        dataToSend.total_duration = routeStats.total_duration;
        dataToSend.carbon_footprint = routeStats.carbon_footprint;
      }

      const response = await routesAPI.create(dataToSend);
      
      await loadRoutes();
      await loadStats();
      setCurrentPoints([]);
      
      return response.route;
    } catch (error) {
      console.error('Erro ao salvar rota:', error);
      return null;
    }
  };

  const deleteRoute = async (routeId) => {
    try {
      await routesAPI.delete(routeId);
      await loadRoutes();
      await loadStats();
    } catch (error) {
      console.error('Erro ao deletar rota:', error);
    }
  };

  const value = {
    user,
    routes,
    currentPoints,
    stats,
    isLoadingUser,
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