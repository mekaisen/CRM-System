import type { Token } from '@/types/auth.ts';

const token = () => {
  let accessToken: string | null = null;

  return {
    getToken() {
      return accessToken;
    },
    setToken(token: string) {
      accessToken = token;
    },
    removeToken() {
      accessToken = null;
    }
  };
};

const refreshToken = () => {
  return {
    getRefreshToken() {
      return localStorage.getItem('refreshtoken') ?? '';
    },
    setRefreshToken(refreshToken: string) {
      return localStorage.setItem('refreshtoken', refreshToken);
    },
    removeRefreshToken() {
      return localStorage.removeItem('refreshtoken');
    }
  };
};

const utilityTokens = () => {
  return {
    setTokens({ refreshToken, accessToken }: Token) {
      refreshTokenService.setRefreshToken(refreshToken);
      tokenService.setToken(accessToken);
    },
    removeTokens() {
      refreshTokenService.removeRefreshToken();
      tokenService.removeToken();
    }
  };
};
export const utilsTokens = utilityTokens();
export const refreshTokenService = refreshToken();
export const tokenService = token();
