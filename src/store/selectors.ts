import { createSelector } from '@reduxjs/toolkit';

import type { IAuthStore } from '@/store/slices/authSlice.ts';
import type { IAdminStore } from '@/store/slices/usersSlice.ts';
import type { RootState } from '@/store/store.ts';

import { getAsyncRequestData } from '@/store/utils.ts';

export const selectAuthStore = (state: RootState): IAuthStore => state.auth;
export const selectAdminStore = (state: RootState): IAdminStore => state.admin;

export const selectAuthRegistration = createSelector(selectAuthStore, (state: IAuthStore) =>
  getAsyncRequestData(state.registration)
);

export const selectAuthLogin = createSelector(selectAuthStore, (state: IAuthStore) =>
  getAsyncRequestData(state.authTokens)
);

export const selectAuthProfile = createSelector(selectAuthStore, (state: IAuthStore) =>
  getAsyncRequestData(state.profile)
);
export const selectAuthIsAuth = createSelector(
  selectAuthStore,
  (state: IAuthStore) => state.isAuth
);
export const selectAuthIsSuccessRegistration = createSelector(
  selectAuthStore,
  (state: IAuthStore) => state.isSuccessRegistration
);

export const selectAdminUsers = createSelector(
  selectAdminStore,
  (state: IAdminStore) => state.users
);
