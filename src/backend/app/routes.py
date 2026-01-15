from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Route, DeliveryPoint
from app.utils import optimize_route, validate_email, validate_password

api = Blueprint('api', __name__)

# ==================== AUTH ====================

@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Email, senha e nome são obrigatórios'}), 400
    
    if not validate_email(data['email']):
        return jsonify({'error': 'Email inválido'}), 400
    
    if not validate_password(data['password']):
        return jsonify({'error': 'Senha deve ter no mínimo 6 caracteres'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email já cadastrado'}), 400
    
    user = User(
        email=data['email'],
        name=data['name'],
        role=data.get('role', 'operator')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Usuário criado com sucesso',
        'user': user.to_dict()
    }), 201


@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Email ou senha incorretos'}), 401
    
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login realizado com sucesso',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@api.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404
    
    return jsonify(user.to_dict()), 200

@api.route('/routes', methods=['GET'])
@jwt_required()
def get_routes():
    user_id = int(get_jwt_identity())
    routes = Route.query.filter_by(user_id=user_id).order_by(Route.created_at.desc()).all()
    
    return jsonify([route.to_dict() for route in routes]), 200


@api.route('/routes/<int:route_id>', methods=['GET'])
@jwt_required()
def get_route(route_id):
    user_id = int(get_jwt_identity())
    route = Route.query.filter_by(id=route_id, user_id=user_id).first()
    
    if not route:
        return jsonify({'error': 'Rota não encontrada'}), 404
    
    return jsonify(route.to_dict()), 200


@api.route('/routes/calculate', methods=['POST'])
@jwt_required()
def calculate_route():
    data = request.get_json()
    
    if not data.get('points') or len(data['points']) < 2:
        return jsonify({'error': 'Mínimo de 2 pontos necessários'}), 400
    
    result = optimize_route(data['points'])
    
    return jsonify(result), 200


@api.route('/routes', methods=['POST'])
@jwt_required()
def create_route():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Nome da rota é obrigatório'}), 400
    
    if not data.get('points') or len(data['points']) < 2:
        return jsonify({'error': 'Mínimo de 2 pontos necessários'}), 400
    
    if (data.get('total_distance') is not None and 
        data.get('total_duration') is not None and 
        data.get('carbon_footprint') is not None):
        
        total_distance = data['total_distance']
        total_duration = data['total_duration']
        carbon_footprint = data['carbon_footprint']
        optimized_points = data['points']
        
        print(f"Usando estatísticas do frontend: {total_distance}km, {total_duration}min")
    else:
        optimization = optimize_route(data['points'])
        total_distance = optimization['total_distance']
        total_duration = optimization['total_duration']
        carbon_footprint = optimization['carbon_footprint']
        optimized_points = optimization['optimized_points']
        
        print(f"Calculando no backend: {total_distance}km, {total_duration}min")
    
    route = Route(
        user_id=user_id,
        name=data['name'],
        distance=total_distance,
        duration=total_duration,
        carbon_footprint=carbon_footprint,
        status='completed'
    )
    
    db.session.add(route)
    db.session.flush()
    
    for point_data in optimized_points:
        point = DeliveryPoint(
            route_id=route.id,
            name=point_data['name'],
            address=point_data['address'],
            order=point_data['order'],
            latitude=point_data.get('latitude'),
            longitude=point_data.get('longitude')
        )
        db.session.add(point)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Rota criada com sucesso',
        'route': route.to_dict()
    }), 201


@api.route('/routes/<int:route_id>', methods=['DELETE'])
@jwt_required()
def delete_route(route_id):
    user_id = int(get_jwt_identity())
    route = Route.query.filter_by(id=route_id, user_id=user_id).first()
    
    if not route:
        return jsonify({'error': 'Rota não encontrada'}), 404
    
    db.session.delete(route)
    db.session.commit()
    
    return jsonify({'message': 'Rota deletada com sucesso'}), 200


# ==================== STATS ====================

@api.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    routes = Route.query.filter_by(user_id=user_id).all()
    
    total_routes = len(routes)
    total_distance = sum(r.distance for r in routes)
    total_duration = sum(r.duration for r in routes)
    total_carbon = sum(r.carbon_footprint for r in routes)
    
    return jsonify({
        'total_routes': total_routes,
        'total_distance': round(total_distance, 1),
        'total_duration': total_duration,
        'total_carbon': round(total_carbon, 1)
    }), 200