## Instalação
### Linux (Bash)
1. Instale o Node.js
````
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 24
node -v
npm -v
````
2. Instale todas as dependências do frontend
````
npm install
````
3. Crie um ambiente virtual em src/backend/
````
python3 -m venv venv
source venv/bin/activate
````
4. Instale as dependências do backend
````
pip install -r requirements.txt
````
5. Crie um arquivo .env em backend/ e configure as variáveis de ambiente
````
SECRET_KEY=secret-key
JWT_SECRET_KEY=jwt-secret-key
DATABASE_URL=sqlite:///database.db
FLASK_ENV=development
````
6. Configure o GraphHopper
* Crie uma conta gratuita (https://graphhopper.com/dashboard/#/register)
* Confirme o e-mail
* Copie a chave de API criada pelo GraphHopper em src/services/graphhopper.js
````
const GRAPHHOPPER_API_KEY = 'API_KEY';
````
## Execução
### Linux (Bash)
1. Execute no primeiro terminal (em src/backend)
````
python run.py
````
2. Execute no segundo terminal (na raiz do projeto)
````
npm start
````
### Credenciais de acesso para teste
* E-mail: admin@admin.com
* Senha: admin123

## Tecnologias utilizadas
* React
* Leaflet
* React-Leaflet
* OpenStreetMap
* Flask
* Flask-JWT-Extended
* Flask-CORS
* SQLite
* Nominatim
* GraphHopper