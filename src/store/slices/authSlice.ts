import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type { IAsyncParticle } from '@/store/utils.ts';
import type { AuthData, Profile, RefreshToken, Token, UserRegistration } from '@/types/auth';

import { fetchProfile, loguot, refresh, signin, signup } from '@/api/auth.ts';
import { addAsyncBuilderCases, initAsyncParticle } from '@/store/utils.ts';

export interface IAuthStore {
  isAuth: boolean;
  login: IAsyncParticle<Token>;
  profile: IAsyncParticle<Profile>;
  registration: IAsyncParticle<Profile>;
}

const initialState: IAuthStore = {
  isAuth: false,
  registration: initAsyncParticle(),
  profile: initAsyncParticle(),
  login: initAsyncParticle()
};

const errorsForSignin: Record<any, string> = {
  400: 'Ошибка десериализации запроса или неверный ввод',
  401: 'Неверные учетные данные',
  500: 'Внутренняя ошибка сервера'
};
const errorsForSignUp: Record<any, string> = {
  400: 'Ошибка десериализации запроса или неверный ввод',
  409: 'Пользователь уже существует',
  500: 'Внутренняя ошибка сервера'
};
const errorsForRefresh: Record<any, string> = {
  400: 'Ошибка десериализации запроса',
  401: 'Неверные учетные данные или токен истек',
  500: 'Внутренняя ошибка сервера'
};
const errorsForProfile: Record<any, string> = {
  400: 'Пользователь не найден',
  500: 'Внутренняя ошибка сервера'
};

const getErrorMessage = (error: unknown, messages: Record<any, string>) => {
  if (error instanceof AxiosError) {
    if (error.response?.status) {
      return messages[error.response?.status];
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ошибка авторизации';
};

export const login = createAsyncThunk<Token, AuthData, { rejectValue: string }>(
  'auth/login',
  async (arg, { rejectWithValue }) => {
    try {
      return await signin(arg);
    } catch (e) {
      console.log(e);
      const errorMessage = getErrorMessage(e, errorsForSignin);
      return rejectWithValue(errorMessage);
    }
  }
);

export const registration = createAsyncThunk<Profile, UserRegistration, { rejectValue: string }>(
  'auth/registration',
  async (arg, { rejectWithValue }) => {
    try {
      return await signup(arg);
    } catch (e) {
      console.log(e);
      const errorMessage = getErrorMessage(e, errorsForSignUp);
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshAccessToken = createAsyncThunk<Token, RefreshToken, { rejectValue: string }>(
  'auth/refresh',
  async (arg, { rejectWithValue }) => {
    try {
      return await refresh(arg);
    } catch (e) {
      const errorMessage = getErrorMessage(e, errorsForRefresh);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProfile = createAsyncThunk<Profile, undefined, { rejectValue: string }>(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProfile();
    } catch (e) {
      console.log(e);
      const errorMessage = getErrorMessage(e, errorsForProfile);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk<void, undefined, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await loguot();
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data || 'Не удалось выйти');
      }
      return rejectWithValue('Не удалось выйти');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncBuilderCases(builder, registration, 'registration');
    addAsyncBuilderCases(builder, getProfile, 'profile');
    builder
      .addCase(login.pending, (state) => {
        state.login.status = 'pending';
        state.login.error = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.status = 'fulfilled';
        state.login.error = '';
        state.isAuth = true;
        state.login.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.status = 'rejected';
        state.isAuth = false;
        state.login.error = action.payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.login.status = 'fulfilled';
        state.isAuth = true;
        state.login.data = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.login.status = 'rejected';
        state.isAuth = false;
        state.login.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
      });
  }
});
export const authReducer = authSlice.reducer;
