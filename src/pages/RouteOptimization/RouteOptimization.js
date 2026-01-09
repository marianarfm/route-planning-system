import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import edit from '../../assets/images/edit-svgrepo-com.svg';
import remove from '../../assets/images/remove-svgrepo-com.svg';
import map from '../../assets/images/map-location-pin-svgrepo-com.svg';
import distance from '../../assets/images/distance-svgrepo-com.svg';
import time from '../../assets/images/time-svgrepo-com.svg';
import carbonFootprint from '../../assets/images/plant-svgrepo-com.svg';
import clipboard from '../../assets/images/clipboard-text-svgrepo-com.svg';
import './RouteOptimization.css';

function DeliveryPointForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    onAdd(formData);
    setFormData({ name: '', address: '' });
  };

  return (
    <div className="delivery-form">
      <h3 className="section-title">Adicionar Ponto de Entrega</h3>
      <div className="form-container">
        <div className="form-group">
          <label className="label">Nome do Local:</label>
          <input 
            type="text"
            name="name"
            className="input"
            placeholder="Ex: Cliente A, Loja Centro"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label className="label">Endereço Completo:</label>
          <input 
            type="text"
            name="address"
            className="input"
            placeholder="Rua, número, bairro, cidade"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        <button className="btn-primary" onClick={handleSubmit}>
          Adicionar Ponto
        </button>
      </div>
    </div>
  );
}

function DeliveryPointList({ points, onRemove, onCalculate }) {
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
                <button 
                  className="btn-icon" 
                  title="Remover"
                  onClick={() => onRemove(point.id)}
                >
                  <img className="btn-icon-img" src={remove} alt="Remover" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {points.length >= 2 && (
        <button className="btn-primary btn-full" onClick={onCalculate}>
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

function RouteInfo({ info, hasPoints, onSave }) {
  const [routeName, setRouteName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleSave = () => {
    if (!routeName.trim()) {
      alert('Por favor, dê um nome para a rota!');
      return;
    }
    onSave(routeName);
    setRouteName('');
    setShowSaveDialog(false);
  };

  return (
    <div className="route-info">
      <h3 className="section-title">Resumo da Rota</h3>
      <div className="info-grid">
        <div className="info-card">
          <img className="info-icon" src={distance} alt="Distância" />
          <div>
            <p className="info-label">Distância Total</p>
            <p className="info-value">{info.distance}</p>
          </div>
        </div>
        
        <div className="info-card">
          <img className="info-icon" src={time} alt="Tempo" />
          <div>
            <p className="info-label">Tempo Estimado</p>
            <p className="info-value">{info.duration}</p>
          </div>
        </div>
        
        <div className="info-card">
          <img className="info-icon" src={carbonFootprint} alt="Pegada de Carbono" />
          <div>
            <p className="info-label">Pegada de Carbono</p>
            <p className="info-value">{info.carbon}</p>
          </div>
        </div>
      </div>
      
      {showSaveDialog ? (
        <div className="save-dialog">
          <input
            type="text"
            className="input"
            placeholder="Nome da rota"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
          <div className="save-dialog-buttons">
            <button className="btn-secondary" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="btn-secondary btn-full"
          onClick={() => setShowSaveDialog(true)}
          disabled={!hasPoints}
        >
          Salvar Rota no Histórico
        </button>
      )}
    </div>
  );
}

export default function RouteOptimization({ onNavigate }) {
  const { currentPoints, addPoint, removePoint, calculateRoute, saveRoute } = useApp();
  const [routeInfo, setRouteInfo] = useState({
    distance: '--',
    duration: '--',
    carbon: '--'
  });

  const handleAddPoint = (point) => {
    addPoint(point);
  };

  const handleRemovePoint = (pointId) => {
    if (window.confirm('Deseja remover este ponto?')) {
      removePoint(pointId);
      if (currentPoints.length > 2) {
        const newInfo = calculateRoute();
        if (newInfo) setRouteInfo(newInfo);
      } else {
        setRouteInfo({ distance: '--', duration: '--', carbon: '--' });
      }
    }
  };

  const handleCalculate = () => {
    const info = calculateRoute();
    if (info) {
      setRouteInfo(info);
      alert('Rota calculada com sucesso!');
    }
  };

  const handleSaveRoute = (routeName) => {
    const savedRoute = saveRoute({
      name: routeName,
      ...routeInfo
    });
    
    if (savedRoute) {
      alert('Rota salva com sucesso!');
      setRouteInfo({ distance: '--', duration: '--', carbon: '--' });
      onNavigate('history');
    }
  };

  return (
    <div className="route-optimization-page">
      <header className="page-header">
        <button 
          className="btn-back" 
          onClick={() => onNavigate('dashboard')}
        >
          ← Voltar
        </button>
        <div className="header-center">
          <h1 className="page-title">Otimização de Rotas</h1>
          <p className="page-subtitle">Adicione pontos de entrega e otimize sua rota</p>
        </div>
        <button 
          className="btn-history" 
          onClick={() => onNavigate('history')}
        >
          <img className="btn-history-icon" src={clipboard} alt="Histórico" />
          Histórico
        </button>
      </header>
      
      <div className="page-wrapper">
        <div className="page-content">
          <div className="left-panel">
            <DeliveryPointForm onAdd={handleAddPoint} />
            <DeliveryPointList 
              points={currentPoints}
              onRemove={handleRemovePoint}
              onCalculate={handleCalculate}
            />
          </div>
          
          <div className="right-panel">
            <MapView />
            <RouteInfo 
              info={routeInfo}
              hasPoints={currentPoints.length >= 2}
              onSave={handleSaveRoute}
            />
          </div>
        </div>
      </div>
    </div>
  );
}