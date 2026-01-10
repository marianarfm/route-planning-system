const API_BASE_URL = 'http://localhost:5000/api';

// Helper para gerenciar o token
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Helper para fazer requisições
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

  console.log('Fazendo requisição para:', `${API_BASE_URL}${endpoint}`);
  console.log('Com dados:', options.body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  console.log('Resposta da API:', data);

  if (!response.ok) {
    console.error('Erro na API:', data);
    throw new Error(data.error || 'Erro na requisição');
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
    if (data.access_token) {
      setToken(data.access_token);
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