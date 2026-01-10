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
    CORS(app)
    
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
    
    @app.route('/')
    def index():
        return {'message': 'API do Sistema de Rotas está rodando'}
    
    return app