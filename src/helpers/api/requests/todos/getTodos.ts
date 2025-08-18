import type { MetaResponse, Todo, TodoInfo } from '@/types/todos.ts';

import { baseUrl } from '@/helpers/const/api';

export type TodoFilters = 'all' | 'completed' | 'inWork';

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
