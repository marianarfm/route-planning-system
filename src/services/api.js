const API_BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  console.log('=== DEBUG API ===');
  console.log('Endpoint:', `${API_BASE_URL}${endpoint}`);
  console.log('Token existe?', token ? 'SIM' : 'NÃO');
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('Headers:', config.headers);
  console.log('Body:', options.body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  console.log('Resposta da API:', data);

  if (!response.ok) {
    console.error('Erro na API:', data);
    console.error('Status da resposta:', response.status);
    
    throw new Error(data.error || data.msg || 'Erro na requisição');
  }

  return data;
};

// ==================== AUTH ====================

export const authAPI = {
  register: async (userData) => {
    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.access_token) {
      setToken(data.access_token);
    }
    return data;
  },

  login: async (email, password) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    console.log('=== RESPOSTA DO LOGIN ===');
    console.log('Token recebido?', data.access_token ? 'SIM' : 'NÃO');
    console.log('Token:', data.access_token);
    
    if (data.access_token) {
      setToken(data.access_token);
      console.log('Token SALVO no localStorage');
      console.log('Verificando se salvou:', localStorage.getItem('token') ? 'SIM' : 'NÃO');
    } else {
      console.error('ERRO: Token não veio na resposta!');
    }
    
    return data;
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    return await fetchAPI('/auth/me');
  },
};

// ==================== ROUTES ====================

export const routesAPI = {
  getAll: async () => {
    return await fetchAPI('/routes');
  },

  getById: async (routeId) => {
    return await fetchAPI(`/routes/${routeId}`);
  },

  calculate: async (points) => {
    return await fetchAPI('/routes/calculate', {
      method: 'POST',
      body: JSON.stringify({ points }),
    });
  },

  create: async (routeData) => {
    return await fetchAPI('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },

  delete: async (routeId) => {
    return await fetchAPI(`/routes/${routeId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== STATS ====================

export const statsAPI = {
  get: async () => {
    return await fetchAPI('/stats');
  },
};

export { getToken, setToken, removeToken };