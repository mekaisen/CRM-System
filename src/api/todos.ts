import type { AxiosResponse } from 'axios';

import axios from 'axios';

import type { MetaResponse, Todo, TodoFilters, TodoInfo, TodoRequest } from '@/types/todos.ts';

import { api } from '@/api/axios.ts';

export const putTodo = (todoRequest: TodoRequest, todoId: number): Promise<Todo> => {
  return api
    .put<Todo>(`todos/${todoId}`, todoRequest)
    .then((res) => res.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error(error);
    });
};

export const deleteTodo = (todoId: number): Promise<AxiosResponse> => {
  return api.delete(`todos/${todoId}`).catch((error) => {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error(error);
  });
};

export const getTodos = (filter: TodoFilters): Promise<MetaResponse<Todo, TodoInfo>> => {
  return api
    .get<MetaResponse<Todo, TodoInfo>>(`todos`, { params: { filter } })
    .then((res) => res.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error(error);
    });
};

export const postTodo = (todoRequest: TodoRequest): Promise<Todo> => {
  return api
    .post<Todo>(`todos`, todoRequest)
    .then((res) => res.data)
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error(error);
    });
};
// export const postTodo = (body: TodoRequest): Promise<Todos> => {
//   return timeError()
//     .then((res) => res)
//     .catch((reason) => {
//       throw new Error(reason);
//     });
// };
// const timeError = () => {
//   return new Promise<Todos>((resolve, reject) => {
//     setTimeout(() => {
//       reject(new Error('oshibka'));
//     }, 1500);
//   });
// };
