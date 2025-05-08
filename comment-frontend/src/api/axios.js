import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8005/api/',
  // withCredentials: true,
});


// CSRF token handling
let csrfToken = '';

const getCsrfToken = async () => {
  try {
    const response = await api.get('/csrf/');
    csrfToken = response.data.csrfToken;
    api.defaults.headers.common['X-CSRFToken'] = csrfToken;
  } catch (error) {
    console.error("Error getting CSRF token:", error);
  }
};

// Initialize CSRF token
getCsrfToken();

// Request interceptor
api.interceptors.request.use(config => {
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 403) {
      // CSRF token expired - refresh it
      await getCsrfToken();
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;