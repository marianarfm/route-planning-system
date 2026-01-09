import React from 'react';
import { useApp } from '../../contexts/AppContext';
import logo from '../../assets/images/logo.png';
import graph from '../../assets/images/graph-svgrepo-com.svg';
import rocket from '../../assets/images/rocket-svgrepo-com.svg';
import distance from '../../assets/images/distance-svgrepo-com.svg';
import carbonFootprint from '../../assets/images/plant-svgrepo-com.svg';
import map from '../../assets/images/map-location-pin-svgrepo-com.svg';
import clipboard from '../../assets/images/clipboard-text-svgrepo-com.svg';
import check from '../../assets/images/check-circle-svgrepo-com.svg';
import './Dashboard.css';

export default function Dashboard({ onLogout, onNavigate }) {
  const { routes } = useApp();

  const stats = {
    totalRoutes: routes.length,
    routesToday: routes.filter(r => r.date === new Date().toLocaleDateString('pt-BR')).length,
    totalDistance: routes.reduce((acc, r) => acc + (parseFloat(r.distance) || 0), 0).toFixed(1),
    carbonSaved: routes.reduce((acc, r) => acc + (parseFloat(r.carbon) || 0), 0).toFixed(1)
  };

  const recentRoutes = routes.slice(0, 3);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img className="dashboard-logo" src={logo} alt="Logo" />
            <h1 className="dashboard-title">Sistema de Rotas</h1>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Bem-vindo(a) ao Sistema de Otimização de Rotas</h2>
          <p>Gerencie suas entregas de forma eficiente</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <img className="stat-icon" src={graph} alt="Gráfico" />
            <div className="stat-info">
              <p className="stat-label">Total de Rotas</p>
              <p className="stat-value">{stats.totalRoutes}</p>
            </div>
          </div>

          <div className="stat-card">
            <img className="stat-icon" src={rocket} alt="Rotas" />
            <div className="stat-info">
              <p className="stat-label">Rotas Hoje</p>
              <p className="stat-value">{stats.routesToday}</p>
            </div>
          </div>

          <div className="stat-card">
            <img className="stat-icon" src={distance} alt="Distância" />
            <div className="stat-info">
              <p className="stat-label">Distância Total</p>
              <p className="stat-value">{stats.totalDistance} km</p>
            </div>
          </div>

          <div className="stat-card">
            <img className="stat-icon" src={carbonFootprint} alt="Pegada de Carbono" />
            <div className="stat-info">
              <p className="stat-label">Carbono Economizado</p>
              <p className="stat-value">{stats.carbonSaved} kg CO₂</p>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <h3>O que você deseja fazer?</h3>
          <div className="actions-grid">
            <button 
              className="action-card action-primary"
              onClick={() => onNavigate('routes')}
            >
              <img className="action-icon" src={map} alt="Mapa" />
              <h4>Criar Nova Rota</h4>
              <p>Otimize suas entregas</p>
            </button>

            <button 
              className="action-card action-secondary"
              onClick={() => onNavigate('history')}
            >
              <img className="action-icon" src={clipboard} alt="Histórico" />
              <h4>Ver Histórico</h4>
              <p>Consulte rotas anteriores</p>
            </button>
          </div>
        </div>

        <div className="recent-section">
          <h3>Últimas Rotas</h3>
          {recentRoutes.length === 0 ? (
            <p className="empty-message">Nenhuma rota criada ainda. Crie sua primeira rota!</p>
          ) : (
            <>
              <div className="recent-list">
                {recentRoutes.map(route => (
                  <div key={route.id} className="recent-item">
                    <img className="recent-icon" src={check} alt="Sinal de Visto" />
                    <div className="recent-info">
                      <p className="recent-name">{route.name}</p>
                      <p className="recent-date">{route.date}, {route.time}</p>
                    </div>
                    <span className="recent-distance">{route.distance}</span>
                  </div>
                ))}
              </div>

              <button 
                className="btn-view-all"
                onClick={() => onNavigate('history')}
              >
                Ver Todas as Rotas →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}