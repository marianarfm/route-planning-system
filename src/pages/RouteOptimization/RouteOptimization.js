import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { useApp } from '../../contexts/AppContext';
import { calculateRealRoute, isGraphHopperConfigured } from '../../services/graphhopper';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import remove from '../../assets/images/remove-svgrepo-com.svg';
import distance from '../../assets/images/distance-svgrepo-com.svg';
import time from '../../assets/images/time-svgrepo-com.svg';
import carbonFootprint from '../../assets/images/plant-svgrepo-com.svg';
import clipboard from '../../assets/images/clipboard-text-svgrepo-com.svg';
import './RouteOptimization.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const createNumberedIcon = (number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #2563eb; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

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

function DeliveryPointList({ points, onRemove, onCalculate, optimizedPoints, onClearAll }) {
  const displayPoints = optimizedPoints.length > 0 ? optimizedPoints : points;
  const isOptimized = optimizedPoints.length > 0;

  return (
    <div className="delivery-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 className="section-title" style={{ margin: 0 }}>
          {isOptimized ? 'Rota Otimizada' : `Pontos de Entrega (${points.length})`}
        </h3>
        {(points.length > 0 || isOptimized) && (
          <button 
            className="btn-clear"
            onClick={onClearAll}
            title="Limpar tudo e começar nova rota"
          >
            Limpar
          </button>
        )}
      </div>
      
      {displayPoints.length === 0 ? (
        <p className="empty-message">Nenhum ponto adicionado ainda.</p>
      ) : (
        <div className="points-list">
          {displayPoints.map((point, index) => (
            <div key={index} className="point-item">
              <div className="point-order">{isOptimized ? point.order : index + 1}</div>
              <div className="point-info">
                <strong>{point.name}</strong>
                <p className="point-address">{point.address}</p>
                {point.latitude && point.longitude && (
                  <small style={{color: '#666', fontSize: '11px'}}>
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </small>
                )}
              </div>
              {!isOptimized && (
                <div className="point-actions">
                  <button 
                    className="btn-icon" 
                    title="Remover"
                    onClick={() => onRemove(index)}
                  >
                    <img className="btn-icon-img" src={remove} alt="Remover" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {points.length >= 2 && !isOptimized && (
        <button className="btn-primary btn-full" onClick={onCalculate}>
          Calcular Rota Otimizada
        </button>
      )}
      
      {isOptimized && (
        <button 
          className="btn-secondary btn-full" 
          onClick={onClearAll}
          style={{ marginTop: '10px' }}
        >
          Criar Nova Rota
        </button>
      )}
    </div>
  );
}

function MapClickHandler({ onMapClick, enabled }) {
  useMapEvents({
    click: (e) => {
      if (enabled) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

function InteractiveMap({ points, optimizedPoints, onMapClick, routeGeometry, isLoadingRoute }) {
  const displayPoints = optimizedPoints.length > 0 ? optimizedPoints : points;
  const isOptimized = optimizedPoints.length > 0;
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [displayPoints.length]);

  const defaultCenter = [-15.7939, -47.8828];
  const defaultZoom = 4;

  const mapCenter = displayPoints.length > 0 && displayPoints[0].latitude
    ? [displayPoints[0].latitude, displayPoints[0].longitude]
    : defaultCenter;

  const mapZoom = displayPoints.length > 0 ? 13 : defaultZoom;

  const graphhopperConfigured = isGraphHopperConfigured();

  return (
    <div className="map-container-real">
      <MapContainer 
        key={key}
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} enabled={!isOptimized} />

        {displayPoints.map((point, index) => {
          if (!point.latitude || !point.longitude) return null;
          
          const markerIcon = isOptimized ? createNumberedIcon(point.order) : DefaultIcon;
          
          return (
            <Marker
              key={`${index}-${point.latitude}-${point.longitude}`}
              position={[point.latitude, point.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div style={{minWidth: '200px'}}>
                  <strong>{point.name}</strong>
                  <p style={{margin: '5px 0', fontSize: '12px'}}>{point.address}</p>
                  {isOptimized && (
                    <small style={{color: '#2563eb'}}>
                      Parada #{point.order}
                    </small>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {isOptimized && routeGeometry.length > 1 && (
          <Polyline
            positions={routeGeometry}
            color="#2563eb"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
      
      <div className="map-instructions">
        {!graphhopperConfigured ? (
          'Configure a chave GraphHopper em services/graphhopper.js'
        ) : isLoadingRoute ? (
          'Carregando rota real com GraphHopper...'
        ) : isOptimized ? (
          'Rota otimizada seguindo estradas reais (GraphHopper API)'
        ) : (
          'Clique no mapa para adicionar pontos rapidamente'
        )}
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
  const { currentPoints, addPoint, removePoint, clearPoints, calculateRoute, saveRoute } = useApp();
  const [routeInfo, setRouteInfo] = useState({
    distance: '--',
    duration: '--',
    carbon: '--'
  });
  const [optimizedPoints, setOptimizedPoints] = useState([]);
  const [routeGeometry, setRouteGeometry] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [calculatedStats, setCalculatedStats] = useState(null);

  const handleAddPoint = (point) => {
    addPoint(point);
    setOptimizedPoints([]);
    setRouteGeometry([]);
  };

  const handleRemovePoint = (pointIndex) => {
    if (window.confirm('Deseja remover este ponto?')) {
      removePoint(pointIndex);
      setOptimizedPoints([]);
      setRouteGeometry([]);
      setRouteInfo({ distance: '--', duration: '--', carbon: '--' });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Deseja limpar todos os pontos e começar uma nova rota?')) {
      clearPoints();
      setOptimizedPoints([]);
      setRouteGeometry([]);
      setRouteInfo({ distance: '--', duration: '--', carbon: '--' });
      setCalculatedStats(null);
    }
  };

  const handleMapClick = async (latlng) => {
    const pointName = prompt('Nome do local:', `Ponto ${currentPoints.length + 1}`);
    if (!pointName) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`,
        {
          headers: {
            'User-Agent': 'RouteOptimizationSystem/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;

        addPoint({
          name: pointName,
          address: address,
          latitude: latlng.lat,
          longitude: latlng.lng
        });
        
        setOptimizedPoints([]);
        setRouteGeometry([]);
      } else {
        throw new Error('Erro na API');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      
      const address = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
      addPoint({
        name: pointName,
        address: address,
        latitude: latlng.lat,
        longitude: latlng.lng
      });
      
      setOptimizedPoints([]);
      setRouteGeometry([]);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      const result = await calculateRoute();
      
      if (result && result.optimized_points) {
        setRouteInfo({
          distance: result.distance,
          duration: result.duration,
          carbon: result.carbon
        });
        setOptimizedPoints(result.optimized_points);
        
        setIsLoadingRoute(true);
        const routeData = await calculateRealRoute(result.optimized_points);
        
        if (routeData && routeData.geometry) {
          setRouteGeometry(routeData.geometry);
          
          const realStats = {
            total_distance: routeData.distance,
            total_duration: routeData.duration,
            carbon_footprint: parseFloat((routeData.distance * 0.21).toFixed(1))
          };
          
          setCalculatedStats(realStats);
          
          setRouteInfo({
            distance: `${routeData.distance} km`,
            duration: `${routeData.duration} min`,
            carbon: `${realStats.carbon_footprint} kg CO₂`
          });
          
          alert('Rota calculada com sucesso usando dados reais do GraphHopper!');
        } else {
          setRouteGeometry(result.optimized_points.map(p => [p.latitude, p.longitude]));
          
          setCalculatedStats({
            total_distance: result.total_distance,
            total_duration: result.total_duration,
            carbon_footprint: result.carbon_footprint
          });
          
          alert('Rota calculada! (Usando estimativa - configure GraphHopper para rotas reais)');
        }
        
        setIsLoadingRoute(false);
      } else {
        alert('Erro ao calcular rota! Verifique o console.');
      }
    } catch (error) {
      console.error('Erro ao calcular:', error);
      alert('Erro ao calcular rota! Detalhes: ' + error.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveRoute = async (routeName) => {
    const savedRoute = await saveRoute(
      { name: routeName }, 
      optimizedPoints,
      calculatedStats
    );
    
    if (savedRoute) {
      alert('Rota salva com sucesso!');
      setRouteInfo({ distance: '--', duration: '--', carbon: '--' });
      setOptimizedPoints([]);
      setRouteGeometry([]);
      setCalculatedStats(null);
      onNavigate('history');
    } else {
      alert('Erro ao salvar rota!');
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
          <p className="page-subtitle">Adicione pontos e otimize sua rota</p>
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
              optimizedPoints={optimizedPoints}
              onRemove={handleRemovePoint}
              onCalculate={handleCalculate}
              onClearAll={handleClearAll}
            />
          </div>
          
          <div className="right-panel">
            <InteractiveMap 
              points={currentPoints}
              optimizedPoints={optimizedPoints}
              onMapClick={handleMapClick}
              routeGeometry={routeGeometry}
              isLoadingRoute={isLoadingRoute}
            />
            <RouteInfo 
              info={routeInfo}
              hasPoints={optimizedPoints.length > 0}
              onSave={handleSaveRoute}
            />
          </div>
        </div>
      </div>

      {isCalculating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Calculando rota...</h3>
            <p>Geocodificando endereços e otimizando percurso</p>
          </div>
        </div>
      )}
    </div>
  );
}