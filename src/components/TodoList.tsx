import type { Todo } from '@/types/todos.ts';

import { TodoItem } from './TodoItem.tsx';

import styles from '@/pages/Todos/todo.module.css';

interface TodoListProps {
  todos: Todo[];
  onUpdate: () => Promise<void>;
}

export const TodoList = ({ todos, onUpdate }: TodoListProps) => {
  return (
    <div>
      <ul className={styles.todos}>
        {todos.map((todo) => {
          return (
            <TodoItem key={todo.id} className={styles.todo} onUpdateTodo={onUpdate} todo={todo} />
          );
        })}
      </ul>
    </div>
  );
};
