interface TodoRequest {
  isDone?: boolean; // изменение статуса задачи происходит через этот флаг
  title?: string;
}
// или так type TodoRequest = Partial<Omit<Todo, "id" | "created">>;

interface Todo {
  created: string; // ISO date string
  id: number;
  isDone: boolean;
  title: string;
}

interface TodoInfo {
  all: number;
  completed: number;
  inWork: number;
}

interface MetaResponse<T, N> {
  data: T[];
  info?: N;
  meta: {
    totalAmount: number;
  };
}
type FetchConfig = Omit<RequestInit, 'headers' | 'method'>;
