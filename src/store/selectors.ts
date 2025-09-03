import { createSelector } from '@reduxjs/toolkit';

import type { IAuthStore } from '@/store/slices/authSlice.ts';
import type { RootState } from '@/store/store.ts';

import { getAsyncRequestData } from '@/store/utils.ts';

export const selectAuthStore = (state: RootState): IAuthStore => state.auth;

export const selectAuthRegistration = createSelector(selectAuthStore, (state: IAuthStore) =>
  getAsyncRequestData(state.registration)
);

export const selectAuthLogin = createSelector(selectAuthStore, (state: IAuthStore) =>
  getAsyncRequestData(state.login)
);

export const selectAuthProfile = createSelector(selectAuthStore, (state: IAuthStore) =>
  getAsyncRequestData(state.profile)
);
export const selectAuthIsAuth = createSelector(
  selectAuthStore,
  (state: IAuthStore) => state.isAuth
);
