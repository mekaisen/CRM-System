import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type { IAsyncParticle } from '@/store/utils.ts';
import type { MetaResponseUsers, User, UserFilters } from '@/types/users.ts';

import { fetchUsers } from '@/api/users.ts';
import { addAsyncBuilderCases, initAsyncParticle } from '@/store/utils.ts';

export interface IAdminStore {
  users: IAsyncParticle<MetaResponseUsers<User>>;
}

const initialState: IAdminStore = {
  users: initAsyncParticle()
};

export const getUsers = createAsyncThunk<
  MetaResponseUsers<User>,
  UserFilters,
  { rejectValue: string }
>('admin/users', async (arg, thunkAPI) => {
  try {
    return await fetchUsers(arg);
  } catch (e) {
    if (e instanceof AxiosError) {
      return thunkAPI.rejectWithValue(e.response?.data);
    }
    return thunkAPI.rejectWithValue('Ошибка получения пользователей');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncBuilderCases(builder, getUsers, 'users');
  }
});
export const adminReducer = adminSlice.reducer;
