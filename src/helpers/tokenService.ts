import type { Token } from '@/types/auth.ts';

class TokenService {
  private accessToken: string | null = null;

  getToken() {
    return this.accessToken;
  }
  setToken(token: string) {
    this.accessToken = token;
  }
  removeToken() {
    this.accessToken = null;
  }
}

class RefreshToken {
  getRefreshToken() {
    return localStorage.getItem('refreshtoken') ?? '';
  }
  setRefreshToken(refreshToken: string) {
    return localStorage.setItem('refreshtoken', refreshToken);
  }
  removeRefreshToken() {
    return localStorage.removeItem('refreshtoken');
  }
}
class UtilityTokens {
  setTokens({ refreshToken, accessToken }: Token) {
    refreshTokenService.setRefreshToken(refreshToken);
    tokenService.setToken(accessToken);
  }
  removeTokens() {
    refreshTokenService.removeRefreshToken();
    tokenService.removeToken();
  }
}

export const utilsTokens = new UtilityTokens();
export const refreshTokenService = new RefreshToken();
export const tokenService = new TokenService();
