import axios from "axios"
import { ACCESS_TOKEN } from "./constants";
import { refreshToken } from "./utils/helpers";

export const API_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use( // middleware func
  (config) => {
    const authToken = localStorage.getItem(ACCESS_TOKEN);
    if(authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export let authResponseInterceptor: number | null = null;

export const setupAuthInterceptor = () => {
  authResponseInterceptor = api.interceptors.response.use( // another middleware func
    response => response,
    async (error) => {
      const status = error.response ? error.response.status : null;
      if(status === 401) { // Handling unauthorized access
        try {
          const newToken = await refreshToken(true);
          if(newToken) {
            localStorage.setItem(ACCESS_TOKEN, newToken);
            console.log("Successfully refreshed token...");
            error.config.headers['Authorization'] = `Bearer ${newToken}`; // adding new token to req headers
            return axios(error.config); // retry the original request after refreshing the token
          }
        } catch(error) {
          console.log("Error response from interceptor");
          return Promise.reject(error);    
        }
      }
      return Promise.reject(error);
    }
  );
}
setupAuthInterceptor();

export default api;