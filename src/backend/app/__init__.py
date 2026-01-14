from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    jwt.init_app(app)
    
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    with app.app_context():
        db.create_all()
        
        from app.models import User
        if not User.query.filter_by(email='admin@admin.com').first():
            admin = User(
                email='admin@admin.com',
                name='Administrador',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print('Usuário admin criado: admin@admin.com / admin123')
        else:
            print('Usuário admin já existe')
    
    @app.route('/')
    def index():
        return {'message': 'API do Sistema de Rotas está rodando'}
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f'Token inválido: {error}')
        return {'error': 'Token inválido', 'msg': str(error)}, 401
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        print(f'Authorization header ausente: {error}')
        return {'error': 'Authorization header ausente', 'msg': str(error)}, 401
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f'Token expirado')
        return {'error': 'Token expirado'}, 401
    
    return app