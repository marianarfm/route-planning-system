import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import graph from '../../assets/images/graph-svgrepo-com.svg';
import distance from '../../assets/images/distance-svgrepo-com.svg';
import time from '../../assets/images/time-svgrepo-com.svg';
import carbonFootprint from '../../assets/images/plant-svgrepo-com.svg';
import pinpoint from '../../assets/images/pinpoint-svgrepo-com.svg'
import eye from '../../assets/images/eye-svgrepo-com.svg'
import clipboard from '../../assets/images/clipboard-text-svgrepo-com.svg'
import remove from '../../assets/images/remove-svgrepo-com.svg'
import './RouteHistory.css';

export default function RouteHistory({ onNavigate }) {
  const { routes, deleteRoute } = useApp();
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleDelete = (routeId) => {
    if (window.confirm('Deseja realmente excluir esta rota?')) {
      deleteRoute(routeId);
      alert('Rota excluída com sucesso!');
    }
  };

  const handleViewDetails = (route) => {
    setSelectedRoute(selectedRoute?.id === route.id ? null : route);
  };

  const totals = routes.reduce((acc, route) => {
    const distance = parseFloat(route.distance) || 0;
    const duration = parseInt(route.duration) || 0;
    const carbon = parseFloat(route.carbon) || 0;
    
    return {
      distance: acc.distance + distance,
      duration: acc.duration + duration,
      carbon: acc.carbon + carbon
    };
  }, { distance: 0, duration: 0, carbon: 0 });

  return (
    <div className="history-page">
      <header className="history-header">
        <button className="btn-back" onClick={() => onNavigate('dashboard')}>
          ← Voltar
        </button>
        <h1 className="history-title">Histórico de Rotas</h1>
        <button className="btn-new-route" onClick={() => onNavigate('routes')}>
          + Nova Rota
        </button>
      </header>

      <div className="history-content">
        <div className="history-summary">
          <div className="summary-card">
            <img className="summary-icon" src={graph} alt="Gráfico" />
            <div>
              <p className="summary-label">Total de Rotas</p>
              <p className="summary-value">{routes.length}</p>
            </div>
          </div>

          <div className="summary-card">
            <img className="summary-icon" src={distance} alt="Distância" />
            <div>
              <p className="summary-label">Distância Total</p>
              <p className="summary-value">{totals.distance.toFixed(1)} km</p>
            </div>
          </div>

          <div className="summary-card">
            <img className="summary-icon" src={time} alt="Tempo" />
            <div>
              <p className="summary-label">Tempo Total</p>
              <p className="summary-value">{Math.floor(totals.duration / 60)}h {totals.duration % 60}min</p>
            </div>
          </div>

          <div className="summary-card">
            <img className="summary-icon" src={carbonFootprint} alt="Pegada de Carbono" />
            <div>
              <p className="summary-label">Carbono Economizado</p>
              <p className="summary-value">{totals.carbon.toFixed(1)} kg CO₂</p>
            </div>
          </div>
        </div>

        {routes.length === 0 ? (
          <div className="empty-state">
            <img className="empty-icon" src={clipboard} alt="Sem Rota" />
            <h3>Nenhuma rota salva ainda</h3>
            <p>Crie sua primeira rota otimizada!</p>
            <button className="btn-primary" onClick={() => onNavigate('routes')}>
              Criar Nova Rota
            </button>
          </div>
        ) : (
          <div className="routes-list">
            {routes.map(route => (
              <div key={route.id} className="route-card">
                <div className="route-header">
                  <div>
                    <h3 className="route-name">{route.name}</h3>
                    <p className="route-date">{route.date} às {route.time}</p>
                  </div>
                  <span className="route-status">{route.status}</span>
                </div>

                <div className="route-details">
                  <div className="route-detail">
                    <img className="detail-icon" src={pinpoint} alt="Ponto" />
                    <div>
                      <p className="detail-label">Pontos</p>
                      <p className="detail-value">{route.points.length}</p>
                    </div>
                  </div>

                  <div className="route-detail">
                    <img className="detail-icon" src={distance} alt="Distância" />
                    <div>
                      <p className="detail-label">Distância</p>
                      <p className="detail-value">{route.distance}</p>
                    </div>
                  </div>

                  <div className="route-detail">
                    <img className="detail-icon" src={time} alt="Duração" />
                    <div>
                      <p className="detail-label">Duração</p>
                      <p className="detail-value">{route.duration}</p>
                    </div>
                  </div>

                  <div className="route-detail">
                    <img className="detail-icon" src={carbonFootprint} alt="Pegada de Carbono" />
                    <div>
                      <p className="detail-label">Carbono</p>
                      <p className="detail-value">{route.carbon}</p>
                    </div>
                  </div>
                </div>

                {selectedRoute?.id === route.id && (
                  <div className="route-points">
                    <h4>Pontos de Parada:</h4>
                    <ol>
                      {route.points.map((point, index) => (
                        <li key={point.id}>
                          <strong>{point.name}</strong> - {point.address}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="route-actions">
                  <button 
                    className="btn-view"
                    onClick={() => handleViewDetails(route)}
                  >
                    <img className="btn-icon" src={eye} alt="Ver Detalhes" /> {selectedRoute?.id === route.id ? 'Ocultar' : 'Ver Detalhes'}
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(route.id)}
                  >
                    <img className="btn-icon" src={remove} alt="Excluir" /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}