import type { MetaResponse, Todo, TodoInfo, TodoRequest } from '@/types/todos.ts';

import { baseUrl } from '@/helpers/const/api.ts';

export type TodoFilters = 'all' | 'completed' | 'inWork';

export const putTodo = (todoRequest: TodoRequest, todoId: number): Promise<Todo> => {
  return fetch(`${baseUrl}/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(todoRequest),
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(error);
    });
};

export const deleteTodo = (todoId: number): Promise<Response> => {
  return fetch(`${baseUrl}/todos/${todoId}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    }
  }).catch((error) => {
    throw new Error(error);
  });
};

export const getTodos = (filter: TodoFilters): Promise<MetaResponse<Todo, TodoInfo>> => {
  return fetch(`${baseUrl}/todos?filter=${filter}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(error);
    });
};

export const postTodo = (todoRequest: TodoRequest): Promise<Todo> => {
  return fetch(`${baseUrl}/todos`, {
    method: 'POST',
    body: JSON.stringify(todoRequest),
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((error) => {
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
