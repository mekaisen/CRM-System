import type { TodoFilters } from '@/helpers/api/requests/todos';
import type { Todo, TodoInfo } from '@/types/todos.ts';

import { TodosFilters } from '@/components/TodosFilters.tsx';

import { TodoItem } from './TodoItem.tsx';

import styles from '@/pages/Todos/todo.module.css';

interface TodoListProps {
  allTodos: Todo[];
  className?: string;
  todosInfo: TodoInfo;
  getFilteredTodos: () => Promise<void>;
  onChangeFilter: (status: TodoFilters) => void;
}

export const TodoList = ({
  todosInfo,
  allTodos,
  className,
  onChangeFilter,
  getFilteredTodos
}: TodoListProps) => {
  return (
    <div className={className}>
      <TodosFilters onChangeFilter={onChangeFilter} todosInfo={todosInfo} />

      <ul className={styles.todos}>
        {allTodos.map((todo) => {
          return (
            <TodoItem
              key={todo.id}
              className={styles.todo}
              getFilteredTodos={getFilteredTodos}
              todo={todo}
            />
          );
        })}
      </ul>
    </div>
  );
};
