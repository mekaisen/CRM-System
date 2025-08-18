export interface TodoRequest {
  isDone?: boolean; // изменение статуса задачи происходит через этот флаг
  title?: string;
}
// или так type TodoRequest = Partial<Omit<Todos, "id" | "created">>;

export interface Todo {
  created: string; // ISO date string
  id: number;
  isDone: boolean;
  title: string;
}

export interface TodoInfo {
  all: number;
  completed: number;
  inWork: number;
}

export interface MetaResponse<T, N> {
  data: T[];
  info?: N;
  meta: {
    totalAmount: number;
  };
}
