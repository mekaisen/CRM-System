import type {
  MetaResponseUsers,
  User,
  UserFilters,
  UserRequest,
  UserRolesRequest
} from '@/types/users.ts';

import { api } from '@/api/axios.ts';

export const fetchUsers = (searchParams: UserFilters) => {
  return api
    .get<MetaResponseUsers<User>>('/admin/users', { params: searchParams })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка получения пользователей');
    });
};
export const fetchUser = (userId: number) => {
  return api
    .get<User>(`/admin/users/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка получения пользователя');
    });
};

export const changeUserRoles = (userId: number, request: UserRolesRequest) => {
  return api
    .put<User>(`/admin/users/${userId}/rights`, request)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка обновления роли пользователя');
    });
};
export const changeUserData = (userId: number, request: UserRequest) => {
  return api
    .put<User>(`/admin/users/${userId}`, request)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка обновления данных пользователя');
    });
};
export const blockUser = (userId: number) => {
  return api
    .post<User>(`/admin/users/${userId}/block`)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка блокировки пользователя');
    });
};
export const unBlockUser = (userId: number) => {
  return api
    .post<User>(`/admin/users/${userId}/unblock`)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка разблокировки пользователя');
    });
};
export const deleteUser = (userId: number) => {
  return api
    .delete<void>(` /admin/users/${userId}`)
    .then((res) => res.data)
    .catch((error) => {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ошибка разблокировки пользователя');
    });
};
