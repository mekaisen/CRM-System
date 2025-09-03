import axios from 'axios';

import { tokenService } from '@/helpers/tokenService.ts';

export const baseUrl = 'https://easydev.club/api/v1';

export const api = axios.create({ baseURL: baseUrl, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();
  if (!token) {
    return config;
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
