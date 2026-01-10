import math
import hashlib
import requests
import time

def geocode_address(address):
    """
    Busca coordenadas reais usando Nominatim (OpenStreetMap)
    Retorna (latitude, longitude) ou None se não encontrar
    """
    try:
        # URL da API Nominatim
        url = "https://nominatim.openstreetmap.org/search"
        
        # Parâmetros da requisição
        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
            'addressdetails': 1
        }
        
        # Headers obrigatórios (Nominatim exige User-Agent)
        headers = {
            'User-Agent': 'RouteOptimizationSystem/1.0'
        }
        
        # Faz a requisição
        response = requests.get(url, params=params, headers=headers, timeout=5)
        
        # Pausa de 1 segundo entre requisições (política de uso justo do Nominatim)
        time.sleep(1)
        
        if response.status_code == 200:
            data = response.json()
            
            if data and len(data) > 0:
                lat = float(data[0]['lat'])
                lon = float(data[0]['lon'])
                return lat, lon
        
        # Se não encontrou, retorna coordenadas mockadas
        return generate_mock_coordinates(address)
    
    except Exception as e:
        print(f"Erro ao geocodificar '{address}': {e}")
        # Em caso de erro, usa coordenadas mockadas
        return generate_mock_coordinates(address)


def generate_mock_coordinates(address):
    """Gera coordenadas mockadas baseadas no hash do endereço (fallback)"""
    hash_value = int(hashlib.md5(address.encode()).hexdigest(), 16)
    
    # Fortaleza/CE como região base: lat -3.7, lng -38.5
    base_lat = -3.7
    base_lng = -38.5
    
    # Adiciona variação baseada no hash (±0.1 graus = ~11km)
    lat_offset = ((hash_value % 2000) - 1000) / 10000
    lng_offset = (((hash_value // 2000) % 2000) - 1000) / 10000
    
    latitude = base_lat + lat_offset
    longitude = base_lng + lng_offset
    
    return round(latitude, 6), round(longitude, 6)


def calculate_distance_coordinates(lat1, lon1, lat2, lon2):
    """Calcula distância real entre duas coordenadas usando a fórmula de Haversine"""
    R = 6371  # Raio da Terra em km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    distance = R * c
    return round(distance, 1)


def calculate_distance(point1, point2):
    """Calcula distância entre dois pontos"""
    # Se os pontos têm coordenadas, usa cálculo real
    if (point1.get('latitude') and point1.get('longitude') and 
        point2.get('latitude') and point2.get('longitude')):
        return calculate_distance_coordinates(
            point1['latitude'], point1['longitude'],
            point2['latitude'], point2['longitude']
        )
    
    # Caso contrário, usa método simplificado baseado no hash
    return round(5.0 + (abs(hash(point1['address']) - hash(point2['address'])) % 10), 1)


def optimize_route(points):
    """Otimiza a rota usando algoritmo nearest neighbor com geocoding real"""
    if len(points) < 2:
        return {
            'optimized_points': points,
            'total_distance': 0,
            'total_duration': 0,
            'carbon_footprint': 0
        }
    
    # Adiciona coordenadas a cada ponto (usando Nominatim ou fallback)
    print(f"Geocodificando {len(points)} pontos...")
    for i, point in enumerate(points):
        if not point.get('latitude') or not point.get('longitude'):
            print(f"  [{i+1}/{len(points)}] Buscando coordenadas para: {point['address']}")
            lat, lng = geocode_address(point['address'])
            point['latitude'] = lat
            point['longitude'] = lng
            print(f"      → Coordenadas: ({lat}, {lng})")
    
    # Copia os pontos para não modificar o original
    remaining = points.copy()
    optimized = []
    
    # Começa com o primeiro ponto
    current = remaining.pop(0)
    optimized.append(current)
    
    total_distance = 0
    
    # Algoritmo nearest neighbor: sempre vai para o ponto mais próximo
    print("Otimizando rota...")
    while remaining:
        nearest = min(remaining, key=lambda p: calculate_distance(current, p))
        distance = calculate_distance(current, nearest)
        total_distance += distance
        
        optimized.append(nearest)
        remaining.remove(nearest)
        current = nearest
    
    # Adiciona a ordem aos pontos
    for i, point in enumerate(optimized):
        point['order'] = i + 1
    
    # Calcula duração estimada (velocidade média 50 km/h + 5 min por parada)
    total_duration = int((total_distance / 50) * 60) + (len(points) * 5)
    
    # Calcula pegada de carbono (0.21 kg CO2 por km - veículo médio)
    carbon_footprint = round(total_distance * 0.21, 2)
    
    print(f"Rota otimizada: {total_distance} km, {total_duration} min, {carbon_footprint} kg CO2")
    
    return {
        'optimized_points': optimized,
        'total_distance': total_distance,
        'total_duration': total_duration,
        'carbon_footprint': carbon_footprint
    }


def validate_email(email):
    """Valida formato básico de email"""
    return '@' in email and '.' in email.split('@')[1]


def validate_password(password):
    """Valida senha mínima"""
    return len(password) >= 6