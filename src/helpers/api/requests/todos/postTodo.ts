import type { Todo, TodoRequest } from '@/types/todos.ts';

import { baseUrl } from '@/helpers/const/api';

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
