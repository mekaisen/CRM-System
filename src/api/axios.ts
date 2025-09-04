import axios from 'axios';

import { refresh } from '@/api/auth.ts';
import { refreshTokenService, tokenService, utilsTokens } from '@/helpers/tokenService.ts';
import { authActions } from '@/store/slices/authSlice.ts';
import { store } from '@/store/store.ts';

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

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    const url = error.config.url;

    if (url.includes('/auth/refresh')) {
      utilsTokens.removeTokens();
      store.dispatch(authActions.setIsAuth(false));
      return Promise.reject(error);
    }
    if (!isRefreshing) {
      isRefreshing = true;
      if (error.response.status === 401) {
        try {
          const refreshToken = refreshTokenService.getRefreshToken();

          if (!refreshToken) {
            store.dispatch(authActions.setIsAuth(false));
            utilsTokens.removeTokens();
            return Promise.reject(error);
          }

          const tokens = await refresh({ refreshToken });
          utilsTokens.setTokens(tokens);

          config.headers.Authorization = `Bearer ${tokens.accessToken}`;

          return api(config);
        } catch {
          utilsTokens.removeTokens();

          store.dispatch(authActions.setIsAuth(false));
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
