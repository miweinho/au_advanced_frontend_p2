import axios from 'axios';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://assignment2.swafe.dk';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export default api;
