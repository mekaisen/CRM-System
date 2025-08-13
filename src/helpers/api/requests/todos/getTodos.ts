import { API_PATH } from '@/helpers/const/api';

type Status = 'all' | 'completed' | 'inWork';

export const getTodos = (
  status: Status,
  options?: FetchConfig
): Promise<MetaResponse<Todo, TodoInfo>> => {
  return fetch(`${API_PATH.TODO}?filter=${status}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    },
    ...options
  }).then((res) => res.json());
};
