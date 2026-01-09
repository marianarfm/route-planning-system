import React from 'react';
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
  const routes = [
    {
      id: 1,
      name: 'Rota Centro - Aldeota',
      date: '10/01/2025',
      time: '14:30',
      points: 8,
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
      points: 6,
      distance: '12.8 km',
      duration: '35 min',
      carbon: '2.5 kg CO₂',
      status: 'Concluída'
    },
    {
      id: 3,
      name: 'Rota Fortaleza Sul',
      date: '09/01/2025',
      time: '16:45',
      points: 12,
      distance: '23.1 km',
      duration: '58 min',
      carbon: '4.8 kg CO₂',
      status: 'Concluída'
    },
    {
      id: 4,
      name: 'Rota Praia - Centro',
      date: '09/01/2025',
      time: '09:20',
      points: 10,
      distance: '18.7 km',
      duration: '47 min',
      carbon: '3.9 kg CO₂',
      status: 'Concluída'
    },
    {
      id: 5,
      name: 'Rota Maracanaú',
      date: '08/01/2025',
      time: '15:00',
      points: 7,
      distance: '14.2 km',
      duration: '38 min',
      carbon: '2.9 kg CO₂',
      status: 'Concluída'
    }
  ];

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
              <p className="summary-value">84.1 km</p>
            </div>
          </div>

          <div className="summary-card">
            <img className="summary-icon" src={time} alt="Tempo" />
            <div>
              <p className="summary-label">Tempo Total</p>
              <p className="summary-value">3h 40min</p>
            </div>
          </div>

          <div className="summary-card">
            <img className="summary-icon" src={carbonFootprint} alt="Pegada de Carbono" />
            <div>
              <p className="summary-label">Carbono Economizado</p>
              <p className="summary-value">17.3 kg CO₂</p>
            </div>
          </div>
        </div>

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
                    <p className="detail-value">{route.points}</p>
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

              <div className="route-actions">
                <button className="btn-view">
                  <img className="btn-icon" src={eye} alt="Ver Detalhes" />
                  Ver Detalhes
                </button>
                <button className="btn-duplicate">
                  <img className="btn-icon" src={clipboard} alt="Duplicar" />
                  Duplicar
                </button>
                <button className="btn-delete">
                  <img className="btn-icon" src={remove} alt="Excluir" />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}