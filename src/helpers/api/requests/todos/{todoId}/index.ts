import { API_PATH } from '@/helpers/const/api';

export const getTodo = (todoId: number, options?: FetchConfig): Promise<Todo> => {
  return fetch(`${API_PATH.TODO}/${todoId}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    },
    ...options
  }).then((res) => res.json());
};

export const putTodo = (
  body: TodoRequest,
  todoId: number,
  options?: FetchConfig
): Promise<Todo> => {
  return fetch(`${API_PATH.TODO}/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json'
    },
    ...options
  }).then((res) => res.json());
};

export const deleteTodo = (todoId: number, options?: FetchConfig): Promise<string> => {
  return fetch(`${API_PATH.TODO}/${todoId}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    ...options
  }).then((res) => {
    return res.text();
  });
};
