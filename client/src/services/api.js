import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add auth token, loading states
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Posts API Methods
export const postsApi = {
  // Get all posts with pagination
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const response = await api.get('/posts', { 
      params: { page, limit, ...(search && { search }) } 
    });
    return response.data;
  },

  // Get single post
  getById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  create: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update post
  update: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete post
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Categories API Methods
export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create category
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
};

// Health Check
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Export default API instance
export default api;