import type { Todo, TodoRequest } from '@/types/todos.ts';

import { baseUrl } from '@/helpers/const/api.ts';

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
