import React from 'react';
import edit from '../../assets/images/edit-svgrepo-com.svg';
import remove from '../../assets/images/remove-svgrepo-com.svg';
import map from '../../assets/images/map-location-pin-svgrepo-com.svg';
import distance from '../../assets/images/distance-svgrepo-com.svg';
import time from '../../assets/images/time-svgrepo-com.svg';
import carbonFootprint from '../../assets/images/plant-svgrepo-com.svg';

const mockDeliveryPoints = [
  { id: 1, name: 'Cliente A', address: 'Rua das Flores, 123, Fortaleza - CE' },
  { id: 2, name: 'Cliente B', address: 'Av. Beira Mar, 456, Fortaleza - CE' },
  { id: 3, name: 'Cliente C', address: 'Rua José Vilar, 789, Fortaleza - CE' }
];

const mockRouteInfo = {
  totalDistance: '15.3 km',
  estimatedTime: '42 min',
  carbonFootprint: '3.2 kg CO₂'
};

function DeliveryPointForm() {
  return (
    <div className="delivery-form">
      <h3 className="section-title">Adicionar Ponto de Entrega</h3>
      <div className="form-container">
        <div className="form-group">
          <label className="label">Nome do Local:</label>
          <input 
            type="text" 
            className="input"
            placeholder="Ex: Cliente A, Loja Centro"
          />
        </div>
        
        <div className="form-group">
          <label className="label">Endereço Completo:</label>
          <input 
            type="text" 
            className="input"
            placeholder="Rua, número, bairro, cidade"
          />
        </div>
        
        <button className="btn-primary">Adicionar Ponto</button>
      </div>
    </div>
  );
}

function DeliveryPointList({ points }) {
  return (
    <div className="delivery-list">
      <h3 className="section-title">Pontos de Entrega ({points.length})</h3>
      {points.length === 0 ? (
        <p className="empty-message">Nenhum ponto adicionado ainda.</p>
      ) : (
        <div className="points-list">
          {points.map((point, index) => (
            <div key={point.id} className="point-item">
              <div className="point-order">{index + 1}</div>
              <div className="point-info">
                <strong>{point.name}</strong>
                <p className="point-address">{point.address}</p>
              </div>
              <div className="point-actions">
                <button className="btn-icon" title="Editar">
                  <img className="btn-icon-img" src={edit} alt="Editar" />
                </button>
                <button className="btn-icon" title="Remover">
                  <img className="btn-icon-img" src={remove} alt="Remover" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {points.length >= 2 && (
        <button className="btn-primary btn-full">
          Calcular Rota Otimizada
        </button>
      )}
    </div>
  );
}

function MapView() {
  return (
    <div className="map-container">
      <div className="map-placeholder">
        <img className="map-icon" src={map} alt="Mapa" />
        <p className="map-text">Mapa Interativo</p>
        <small className="map-subtext">A rota otimizada será exibida aqui</small>
      </div>
    </div>
  );
}

function RouteInfo({ info }) {
  return (
    <div className="route-info">
      <h3 className="section-title">Resumo da Rota</h3>
      <div className="info-grid">
        <div className="info-card">
          <img className="info-icon" src={distance} alt="Distância" />
          <div>
            <p className="info-label">Distância Total</p>
            <p className="info-value">{info.totalDistance}</p>
          </div>
        </div>
        
        <div className="info-card">
          <img className="info-icon" src={time} alt="Tempo" />
          <div>
            <p className="info-label">Tempo Estimado</p>
            <p className="info-value">{info.estimatedTime}</p>
          </div>
        </div>
        
        <div className="info-card">
          <img className="info-icon" src={carbonFootprint} alt="Pegada de Carbono" />
          <div>
            <p className="info-label">Pegada de Carbono</p>
            <p className="info-value">{info.carbonFootprint}</p>
          </div>
        </div>
      </div>
      
      <button className="btn-secondary btn-full">
        Salvar Rota no Histórico
      </button>
    </div>
  );
}

export default function RouteOptimization() {
  return (
    <div className="route-optimization-page">
      <header className="page-header">
        <h1 className="page-title">Otimização de Rotas</h1>
        <p className="page-subtitle">Adicione pontos de entrega e otimize sua rota</p>
      </header>
      
      <div className="page-wrapper">
        <div className="page-content">
          <div className="left-panel">
            <DeliveryPointForm />
            <DeliveryPointList points={mockDeliveryPoints} />
          </div>
          
          <div className="right-panel">
            <MapView />
            <RouteInfo info={mockRouteInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}