import type { Token } from '@/types/auth.ts';

class TokenService {
  private accessToken: string | null = null;

  getAccessToken() {
    return this.accessToken;
  }
  setAccessToken(token: string) {
    this.accessToken = token;
  }
  removeAccessToken() {
    this.accessToken = null;
  }
  getRefreshToken() {
    return localStorage.getItem('refreshtoken') ?? '';
  }
  setRefreshToken(refreshToken: string) {
    return localStorage.setItem('refreshtoken', refreshToken);
  }
  removeRefreshToken() {
    return localStorage.removeItem('refreshtoken');
  }
  setTokens({ refreshToken, accessToken }: Token) {
    this.setRefreshToken(refreshToken);
    this.setAccessToken(accessToken);
  }
  removeTokens() {
    this.removeRefreshToken();
    this.removeAccessToken();
  }
}

export const tokenService = new TokenService();
