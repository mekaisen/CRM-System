import axios from 'axios';

import { refresh } from '@/api/auth.ts';
import { tokenService } from '@/helpers/tokenService.ts';
import { authActions } from '@/store/slices/authSlice.ts';
import { store } from '@/store/store.ts';

export const baseUrl = 'https://easydev.club/api/v1';

export const api = axios.create({ baseURL: baseUrl, withCredentials: true });
api.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (!token) {
    return config;
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    const url = error.config.url;

    if (url.includes('/auth/refresh')) {
      tokenService.removeTokens();
      store.dispatch(authActions.setIsAuth(false));
      return Promise.reject(error);
    }
    if (!isRefreshing) {
      isRefreshing = true;
      if (error.response.status === 401) {
        try {
          const refreshToken = tokenService.getRefreshToken();

          if (!refreshToken) {
            store.dispatch(authActions.setIsAuth(false));
            tokenService.removeTokens();
            return Promise.reject(error);
          }

          const tokens = await refresh({ refreshToken });
          tokenService.setTokens(tokens);

          config.headers.Authorization = `Bearer ${tokens.accessToken}`;

          return api(config);
        } catch (e) {
          tokenService.removeTokens();

          store.dispatch(authActions.setIsAuth(false));
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
