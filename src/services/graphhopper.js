const GRAPHHOPPER_API_KEY = 'api-key';

export const calculateRealRoute = async (points) => {
  if (points.length < 2) {
    return null;
  }

  try {
    const pointsParam = points
      .filter(p => p.latitude && p.longitude)
      .map(p => `point=${p.latitude},${p.longitude}`)
      .join('&');

    const url = `https://graphhopper.com/api/1/route?${pointsParam}&vehicle=car&locale=pt_BR&points_encoded=false&type=json&key=${GRAPHHOPPER_API_KEY}`;

    console.log('GraphHopper: Calculando rota real...');

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GraphHopper API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.paths || data.paths.length === 0) {
      throw new Error('Nenhuma rota encontrada');
    }

    const path = data.paths[0];

    const geometry = path.points.coordinates.map(coord => [coord[1], coord[0]]);
    const distance = (path.distance / 1000).toFixed(1);
    const duration = Math.round(path.time / 1000 / 60);

    console.log(`Rota calculada: ${distance} km, ${duration} min, ${geometry.length} pontos`);

    return {
      geometry,
      distance: parseFloat(distance),
      duration: duration,
      raw: path
    };

  } catch (error) {
    console.error('Erro ao calcular rota com GraphHopper:', error);
    return null;
  }
};

export const calculateRealDistance = async (point1, point2) => {
  try {
    const url = `https://graphhopper.com/api/1/route?point=${point1.latitude},${point1.longitude}&point=${point2.latitude},${point2.longitude}&vehicle=car&type=json&key=${GRAPHHOPPER_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.paths && data.paths.length > 0) {
      return (data.paths[0].distance / 1000).toFixed(1);
    }

    return null;
  } catch (error) {
    console.error('Erro ao calcular distância:', error);
    return null;
  }
};

export const isGraphHopperConfigured = () => {
  return GRAPHHOPPER_API_KEY && GRAPHHOPPER_API_KEY !== 'SUA_CHAVE_AQUI';
};