import type { AuthData, Profile, RefreshToken, Token, UserRegistration } from '@/types/auth.ts';

import { api } from '@/api/axios.ts';

export const signup = (userRegistration: UserRegistration): Promise<Profile> => {
  return api
    .post<Profile>(`/auth/signup`, userRegistration)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка регистрации');
    });
};
export const signin = (authData: AuthData): Promise<Token> => {
  return api
    .post<Token>(`/auth/signin`, authData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка регистрации');
    });
};
export const refresh = (refreshToken: RefreshToken): Promise<Token> => {
  return api
    .post<Token>(`/auth/refresh`, refreshToken)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка регистрации');
    });
};

export const loguot = (): Promise<void> => {
  return api
    .post<void>(`/user/logout`)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка регистрации');
    });
};

export const fetchProfile = (): Promise<Profile> => {
  return api
    .get<Profile>(`/user/profile`)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка регистрации');
    });
};
