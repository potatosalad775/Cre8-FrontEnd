import axios from 'axios';
import { getCurrentToken, requestLogout } from './authProvider';

const apiAddress = import.meta.env.VITE_API_SERVER;
axios.defaults.withCredentials = true;

const apiInstance = axios.create({
  baseURL: apiAddress,
  timeout: 1000,
  headers: {
    post: {
      "Content-Type": "application/json"
    }
  }
});

// Before Request
apiInstance.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// After response
apiInstance.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Access Token Deprecated
      // Logout
      console.log("requesting Logout");
      requestLogout();
    }
    return Promise.reject(error);
  }
);

export default apiInstance;