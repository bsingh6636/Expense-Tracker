import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);


export const getExpense = async (id) => {
  try {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch expense');
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.details) {
      throw new Error(`Validation error: ${error.response.data.details.join(', ')}`);
    }
    throw new Error(error.response?.data?.error || 'Failed to create expense');
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.details) {
      throw new Error(`Validation error: ${error.response.data.details.join(', ')}`);
    }
    throw new Error(error.response?.data?.error || 'Failed to update expense');
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete expense');
  }
};

export const getCategorySummary = async () => {
  try {
    const response = await api.get('/expenses/summary/categories');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch category summary');
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API health check failed');
  }
};

export const getFriends = async () => {
  try {
    const response = await api.get('/friends');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch friends');
  }
};

export const getCategories = async () =>{
  try {
    const res = await api.get('/category');
    return res.data?.data;
  } catch (error) {
    throw new Error(error);
  }
}

export default api;