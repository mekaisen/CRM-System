import { API_PATH } from '@/helpers/const/api';

export const postTodo = (body: TodoRequest): Promise<Todo> => {
  return fetch(`${API_PATH.TODO}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((reason) => {
      throw new Error(reason);
    });
};
// export const postTodo = (body: TodoRequest): Promise<Todo> => {
//   return timeError()
//     .then((res) => res)
//     .catch((reason) => {
//       throw new Error(reason);
//     });
// };
// const timeError = () => {
//   return new Promise<Todo>((resolve, reject) => {
//     setTimeout(() => {
//       reject(new Error('oshibka'));
//     }, 1500);
//   });
// };
